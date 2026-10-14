import base64
import copy
import csv
import io
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
import uuid

from backend.app.db.connection import get_database, IN_MEMORY_MESS_MENUS
from backend.app.core.logging import logger
from backend.app.services.audit_service import record_audit_log

DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

async def get_mess_menu(
    facility: Optional[str] = None,
    target_date: Optional[str] = None,
    day_of_week: Optional[str] = None,
    meal_type: Optional[str] = None,
    status: str = "published",
) -> Optional[Dict[str, Any]]:
    """Retrieve published mess menu for a date or day of the week."""
    db = get_database()
    facility_name = facility or "Central Mess / Aravalli & Meera Bai Dining Hall"

    # Query criteria
    query: Dict[str, Any] = {"status": status}
    if target_date:
        query["date"] = target_date
    elif day_of_week:
        query["dayOfWeek"] = {"$regex": f"^{re.escape(day_of_week)}$", "$options": "i"}

    menu_record = None

    if db is not None:
        try:
            menu_record = await db.mess_menus.find_one(query)
            if menu_record:
                menu_record["id"] = str(menu_record.get("_id", menu_record.get("id", "")))
        except Exception as e:
            logger.warning(f"[Mess DB Fallback]: {e}")

    if not menu_record:
        # Fallback to in-memory store
        day_lower = (day_of_week or "").lower()
        for item in IN_MEMORY_MESS_MENUS:
            if item.get("status") != status:
                continue
            if target_date and item.get("date") == target_date:
                menu_record = item
                break
            if day_lower and item.get("dayOfWeek", "").lower() == day_lower:
                menu_record = item
                break

    # If still not found by exact date, fall back to matching day of week from date if possible
    if not menu_record and target_date:
        try:
            dt = datetime.strptime(target_date, "%Y-%m-%d")
            computed_day = dt.strftime("%A")
            for item in IN_MEMORY_MESS_MENUS:
                if item.get("status") == status and item.get("dayOfWeek", "").lower() == computed_day.lower():
                    menu_record = dict(item)
                    menu_record["date"] = target_date
                    break
        except Exception:
            pass

    if not menu_record:
        return None

    # Filter to specific meal if requested (breakfast, lunch, snacks, dinner)
    clean_meal = (meal_type or "").lower().strip()
    if clean_meal in ["breakfast", "lunch", "snacks", "dinner"]:
        meal_info = menu_record.get(clean_meal)
        if meal_info:
            return {
                "facility": menu_record.get("facility", facility_name),
                "date": menu_record.get("date", target_date or ""),
                "dayOfWeek": menu_record.get("dayOfWeek", ""),
                "meal": clean_meal.capitalize(),
                "items": meal_info.get("items", []),
                "timings": meal_info.get("timings", ""),
                "version": menu_record.get("version", 1),
                "publishedAt": menu_record.get("publishedAt"),
            }

    return menu_record

async def get_weekly_mess_menu(facility: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve full 7-day dining schedule."""
    db = get_database()
    facility_name = facility or "Central Mess / Aravalli & Meera Bai Dining Hall"

    if db is not None:
        try:
            cursor = db.mess_menus.find({"status": "published"}).sort("date", 1)
            results = []
            async for doc in cursor:
                doc["id"] = str(doc.get("_id", doc.get("id", "")))
                results.append(doc)
            if results:
                return _sort_menus_by_day(results)
        except Exception as e:
            logger.warning(f"[Weekly Mess DB Fallback]: {e}")

    published = [m for m in IN_MEMORY_MESS_MENUS if m.get("status") == "published"]
    return _sort_menus_by_day(published)

def _sort_menus_by_day(menus: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    def sort_key(m: Dict[str, Any]):
        day = m.get("dayOfWeek", "Monday")
        return DAYS_ORDER.index(day) if day in DAYS_ORDER else 99
    return sorted(menus, key=sort_key)

def parse_mess_file(
    content_bytes: bytes,
    filename: str = "menu.csv",
    format_hint: Optional[str] = None,
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """Parse mess menu rows from CSV, XLSX, or PDF."""
    menus: List[Dict[str, Any]] = []
    errors: List[str] = []
    lower_name = filename.lower()

    if lower_name.endswith(".xlsx") or format_hint == "xlsx":
        try:
            import openpyxl
            wb = openpyxl.load_workbook(io.BytesIO(content_bytes), data_only=True)
            sheet = wb.active
            rows = list(sheet.iter_rows(values_only=True))
            if not rows:
                errors.append("Excel file contains no rows.")
                return menus, errors

            # Find header
            header_idx = 0
            for idx, r in enumerate(rows[:5]):
                r_text = " ".join(str(c or "").lower() for c in r)
                if "day" in r_text or "meal" in r_text or "breakfast" in r_text:
                    header_idx = idx
                    break

            headers = [str(c or "").strip().lower() for c in rows[header_idx]]
            data_rows = rows[header_idx + 1:]

            for r_idx, r in enumerate(data_rows, start=header_idx + 2):
                if not any(r):
                    continue
                row_dict = {headers[i]: str(r[i] or "").strip() for i in range(min(len(headers), len(r)))}
                menu = _normalize_mess_row(row_dict, r_idx)
                if menu:
                    menus.append(menu)
        except Exception as e:
            errors.append(f"Failed to parse Excel mess menu: {str(e)}")

    elif lower_name.endswith(".pdf") or format_hint == "pdf":
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content_bytes))
            full_text = ""
            for page in reader.pages:
                full_text += page.extract_text() + "\n"

            for line in full_text.splitlines():
                clean_line = line.strip()
                if not clean_line or len(clean_line) < 15:
                    continue
                parts = [p.strip() for p in re.split(r"[,|\t;]", clean_line) if p.strip()]
                if len(parts) >= 3 and parts[0].capitalize() in DAYS_ORDER:
                    menus.append({
                        "dayOfWeek": parts[0].capitalize(),
                        "date": parts[1] if re.match(r"^\d{4}-\d{2}-\d{2}$", parts[1]) else "",
                        "breakfast": {"items": [item.strip() for item in parts[2].split("/") if item.strip()], "timings": "07:30 AM – 09:15 AM"},
                        "lunch": {"items": [item.strip() for item in (parts[3] if len(parts) > 3 else "Dal Rice Roti").split("/") if item.strip()], "timings": "12:30 PM – 02:30 PM"},
                        "snacks": {"items": [item.strip() for item in (parts[4] if len(parts) > 4 else "Tea Snacks").split("/") if item.strip()], "timings": "05:00 PM – 06:15 PM"},
                        "dinner": {"items": [item.strip() for item in (parts[5] if len(parts) > 5 else "Paneer Rice Roti Sweet").split("/") if item.strip()], "timings": "07:45 PM – 09:45 PM"},
                    })
            if not menus:
                errors.append("Could not extract structured mess days from PDF.")
        except Exception as e:
            errors.append(f"Failed to parse PDF mess menu: {str(e)}")

    else:
        try:
            text_data = content_bytes.decode("utf-8-sig", errors="replace")
            reader = csv.reader(io.StringIO(text_data))
            rows = [r for r in reader if any(f.strip() for f in r)]
            if not rows:
                errors.append("CSV file is empty.")
                return menus, errors

            headers = [h.strip().lower() for h in rows[0]]
            for r_idx, r in enumerate(rows[1:], start=2):
                row_dict = {headers[i]: r[i].strip() for i in range(min(len(headers), len(r)))}
                menu = _normalize_mess_row(row_dict, r_idx)
                if menu:
                    menus.append(menu)
        except Exception as e:
            errors.append(f"Failed to parse CSV mess menu: {str(e)}")

    return menus, errors

def _normalize_mess_row(row_dict: Dict[str, str], row_num: int) -> Optional[Dict[str, Any]]:
    day = ""
    for k in ["day", "dayofweek", "weekday"]:
        if k in row_dict and row_dict[k]:
            day = row_dict[k].capitalize()
            break
    if not day or day not in DAYS_ORDER:
        return None

    date_val = row_dict.get("date", "").strip()

    def parse_items(key: str, default_timing: str):
        val = row_dict.get(key, "").strip()
        items = [i.strip() for i in re.split(r"[,;/]", val) if i.strip()]
        timing = row_dict.get(f"{key}_timings") or row_dict.get(f"{key}timing") or default_timing
        return {"items": items or ["Chef's Daily Special"], "timings": timing}

    return {
        "dayOfWeek": day,
        "date": date_val,
        "breakfast": parse_items("breakfast", "07:30 AM – 09:15 AM"),
        "lunch": parse_items("lunch", "12:30 PM – 02:30 PM"),
        "snacks": parse_items("snacks", "05:00 PM – 06:15 PM"),
        "dinner": parse_items("dinner", "07:45 PM – 09:45 PM"),
    }

def validate_mess_entries(entries: List[Dict[str, Any]], facility: str) -> Dict[str, Any]:
    """Validate extracted menu records."""
    errors: List[str] = []
    warnings: List[str] = []
    validated: List[Dict[str, Any]] = []

    if not entries:
        errors.append("No valid dining rows found.")
        return {"isValid": False, "errors": errors, "warnings": warnings, "menus": []}

    for idx, e in enumerate(entries, start=1):
        day = e.get("dayOfWeek", "").capitalize()
        if day not in DAYS_ORDER:
            errors.append(f"Row {idx}: Invalid day '{day}'.")

        entry_copy = dict(e)
        entry_copy["facility"] = facility
        entry_copy["dayOfWeek"] = day
        validated.append(entry_copy)

    return {
        "isValid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "daysCount": len(validated),
        "menus": validated,
    }

async def preview_mess_upload(
    facility: str,
    file_bytes: Optional[bytes] = None,
    filename: Optional[str] = None,
    csv_text: Optional[str] = None,
) -> Dict[str, Any]:
    """Preview proposed mess changes."""
    if csv_text:
        content_bytes = csv_text.encode("utf-8")
        name = "menu.csv"
    elif file_bytes:
        content_bytes = file_bytes
        name = filename or "menu.csv"
    else:
        return {"isValid": False, "errors": ["No menu file or CSV text submitted."], "warnings": []}

    raw_menus, parse_errors = parse_mess_file(content_bytes, name)
    if parse_errors and not raw_menus:
        return {"isValid": False, "errors": parse_errors, "warnings": [], "menus": []}

    validation = validate_mess_entries(raw_menus, facility)
    if parse_errors:
        validation["warnings"].extend(parse_errors)

    current_menus = await get_weekly_mess_menu(facility)
    validation["diffSummary"] = {
        "submittedDaysCount": len(validation["menus"]),
        "currentPublishedDays": len(current_menus),
        "facility": facility,
    }
    return validation

async def publish_mess_menu(
    facility: str,
    menus: List[Dict[str, Any]],
    admin_user: Dict[str, Any],
    notes: Optional[str] = None,
) -> Dict[str, Any]:
    """Atomically publish new mess menu and archive previous version."""
    db = get_database()
    facility_name = facility or "Central Mess / Aravalli & Meera Bai Dining Hall"

    existing_menus = await get_weekly_mess_menu(facility_name)
    prev_version = max([m.get("version", 1) for m in existing_menus], default=0)
    new_version = prev_version + 1

    now = datetime.now(timezone.utc)
    new_records = []

    for m in menus:
        rec = dict(m)
        day_tag = rec.get("dayOfWeek", "day").lower()
        rec["_id"] = f"menu_{day_tag}_{uuid.uuid4().hex[:6]}"
        rec["id"] = rec["_id"]
        rec["facility"] = facility_name
        rec["version"] = new_version
        rec["status"] = "published"
        rec["publishedBy"] = admin_user.get("email", "admin@nextcampus.edu")
        rec["publishedAt"] = now
        rec["updatedAt"] = now
        new_records.append(rec)

    # 1. Archive in-memory records
    for item in IN_MEMORY_MESS_MENUS:
        if item.get("facility") == facility_name and item.get("status") == "published":
            item["status"] = "archived"

    IN_MEMORY_MESS_MENUS.extend(new_records)

    # 2. Persist to MongoDB
    if db is not None:
        try:
            await db.mess_menus.update_many(
                {"facility": facility_name, "status": "published"},
                {"$set": {"status": "archived", "archivedAt": now}},
            )
            if new_records:
                await db.mess_menus.insert_many([dict(r) for r in new_records])
        except Exception as e:
            logger.error(f"[Mess DB Publication Error]: {e}")
            raise RuntimeError(f"Database write failed during mess menu publication: {str(e)}")

    # 3. Record Audit Log
    await record_audit_log(
        action="mess_publish",
        target_scope=facility_name,
        user=admin_user,
        status="success",
        previous_version=prev_version if prev_version > 0 else None,
        new_version=new_version,
        details={"daysUpdated": len(new_records), "notes": notes or "Published via Assistant"},
    )

    return {
        "success": True,
        "message": f"Successfully published mess menu version {new_version} for {facility_name} ({len(new_records)} days).",
        "version": new_version,
        "daysCount": len(new_records),
    }

async def rollback_mess_menu(
    facility: str,
    target_version: int,
    admin_user: Dict[str, Any],
) -> Dict[str, Any]:
    """Roll back mess menu to a previous version."""
    db = get_database()
    facility_name = facility or "Central Mess / Aravalli & Meera Bai Dining Hall"
    now = datetime.now(timezone.utc)

    # Check candidates
    archived_candidates = [
        item for item in IN_MEMORY_MESS_MENUS
        if item.get("facility") == facility_name and item.get("version") == target_version
    ]

    if not archived_candidates and db is not None:
        try:
            cursor = db.mess_menus.find({"facility": facility_name, "version": target_version})
            db_candidates = []
            async for doc in cursor:
                db_candidates.append(doc)
            if db_candidates:
                archived_candidates = db_candidates
        except Exception as e:
            logger.warning(f"[Mess Rollback DB Lookup Fallback]: {e}")

    if not archived_candidates:
        raise ValueError(f"Version {target_version} does not exist in dining history for this facility.")

    # Archive current published
    for item in IN_MEMORY_MESS_MENUS:
        if item.get("facility") == facility_name and item.get("status") == "published":
            item["status"] = "archived"

    # Restore target version
    for item in IN_MEMORY_MESS_MENUS:
        if item.get("facility") == facility_name and item.get("version") == target_version:
            item["status"] = "published"

    if db is not None:
        try:
            await db.mess_menus.update_many(
                {"facility": facility_name, "status": "published"},
                {"$set": {"status": "archived", "archivedAt": now}},
            )
            await db.mess_menus.update_many(
                {"facility": facility_name, "version": target_version},
                {"$set": {"status": "published", "restoredAt": now}},
            )
        except Exception as e:
            logger.error(f"[Mess Rollback DB Write Error]: {e}")

    await record_audit_log(
        action="mess_rollback",
        target_scope=facility_name,
        user=admin_user,
        status="success",
        new_version=target_version,
        details={"restoredDays": len(archived_candidates)},
    )

    return {
        "success": True,
        "message": f"Successfully rolled back {facility_name} to menu version {target_version}.",
        "version": target_version,
        "daysCount": len(archived_candidates),
    }

async def get_mess_versions(facility: str) -> List[Dict[str, Any]]:
    """Retrieve version history for a dining facility."""
    facility_name = facility or "Central Mess / Aravalli & Meera Bai Dining Hall"
    all_menus = [m for m in IN_MEMORY_MESS_MENUS if m.get("facility") == facility_name]

    version_map: Dict[int, Dict[str, Any]] = {}
    for m in all_menus:
        v = m.get("version", 1)
        if v not in version_map:
            version_map[v] = {
                "version": v,
                "status": m.get("status", "archived"),
                "daysCount": 0,
                "publishedBy": m.get("publishedBy", "admin@nextcampus.edu"),
                "publishedAt": m.get("publishedAt", datetime.now(timezone.utc)),
            }
        version_map[v]["daysCount"] += 1
        if m.get("status") == "published":
            version_map[v]["status"] = "published"

    return sorted(list(version_map.values()), key=lambda x: x["version"], reverse=True)

async def update_day_menu(
    day_of_week: str,
    meals: Dict[str, Any],
    facility: Optional[str] = None,
    admin_user: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Admin updates the menu items for a specific day of the week."""
    facility_name = facility or "Central Mess / Aravalli & Meera Bai Dining Hall"
    day_clean = day_of_week.capitalize()

    target_menu = None
    for m in IN_MEMORY_MESS_MENUS:
        if m.get("dayOfWeek", "").lower() == day_clean.lower() and m.get("status") == "published":
            m["meals"] = meals
            m["updatedAt"] = datetime.now(timezone.utc)
            target_menu = copy.deepcopy(m)
            break

    db = get_database()
    if db is not None:
        try:
            await db.mess_menus.update_one(
                {"dayOfWeek": {"$regex": f"^{re.escape(day_clean)}$", "$options": "i"}, "status": "published"},
                {"$set": {"meals": meals, "updatedAt": datetime.now(timezone.utc)}},
            )
        except Exception as e:
            logger.warning(f"[Mess Update DB error]: {e}")

    return target_menu or {"dayOfWeek": day_clean, "meals": meals}

