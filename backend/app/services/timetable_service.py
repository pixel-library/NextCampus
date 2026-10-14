import base64
import copy
import csv
import io
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
import uuid

from backend.app.db.connection import get_database, IN_MEMORY_TIMETABLES
from backend.app.core.logging import logger
from backend.app.services.audit_service import record_audit_log

DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

async def get_timetables(
    department: Optional[str] = None,
    semester: Optional[int] = None,
    section: Optional[str] = None,
    day_of_week: Optional[str] = None,
    status: str = "published",
) -> List[Dict[str, Any]]:
    """Retrieve published timetable entries matching given scope."""
    db = get_database()
    query: Dict[str, Any] = {"status": status}

    if department:
        # Flexible match (e.g. "CSE" or "Computer Science")
        query["department"] = {"$regex": re.escape(department), "$options": "i"}
    if semester:
        query["semester"] = semester
    if section and section.upper() != "ALL":
        query["section"] = section.upper()
    if day_of_week:
        query["dayOfWeek"] = {"$regex": f"^{re.escape(day_of_week)}$", "$options": "i"}

    if db is not None:
        try:
            cursor = db.timetables.find(query).sort([("dayOfWeek", 1), ("startTime", 1)])
            results = []
            async for doc in cursor:
                doc["id"] = str(doc.get("_id", doc.get("id", "")))
                results.append(doc)
            if results:
                return _sort_entries_by_day_and_time(results)
        except Exception as e:
            logger.warning(f"[Timetable DB Fallback]: {e}")

    # Fallback to in-memory store
    dept_regex = re.compile(re.escape(department), re.IGNORECASE) if department else None
    day_regex = re.compile(f"^{re.escape(day_of_week)}$", re.IGNORECASE) if day_of_week else None

    matches = []
    for item in IN_MEMORY_TIMETABLES:
        if item.get("status") != status:
            continue
        if dept_regex and not dept_regex.search(item.get("department", "")):
            # Also check course if department didn't match directly
            if not dept_regex.search(item.get("course", "")):
                continue
        if semester and item.get("semester") != semester:
            continue
        if section and section.upper() != "ALL" and item.get("section", "").upper() != section.upper():
            continue
        if day_regex and not day_regex.search(item.get("dayOfWeek", "")):
            continue
        matches.append(item)

    return _sort_entries_by_day_and_time(matches)

def _sort_entries_by_day_and_time(entries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    def sort_key(entry: Dict[str, Any]):
        day = entry.get("dayOfWeek", "Monday")
        day_idx = DAYS_ORDER.index(day) if day in DAYS_ORDER else 99
        return (day_idx, entry.get("startTime", "00:00"))
    return sorted(entries, key=sort_key)

async def get_next_class_for_user(
    user_context: Optional[Dict[str, Any]],
    current_time_str: str = "10:00",
    current_day: str = "Monday",
) -> Optional[Dict[str, Any]]:
    """Determine the next scheduled lecture for a student on current day."""
    dept = "Computer Science & Engineering"
    semester = 3
    section = "A"

    if user_context:
        user_dept = user_context.get("department") or ""
        if "computer" in user_dept.lower() or "cse" in user_dept.lower():
            dept = "Computer Science & Engineering"
        user_sem = user_context.get("semester")
        if isinstance(user_sem, int):
            semester = user_sem
        elif isinstance(user_sem, str):
            match = re.search(r"(\d+)", user_sem)
            if match:
                semester = int(match.group(1))

    entries = await get_timetables(
        department=dept,
        semester=semester,
        section=section,
        day_of_week=current_day,
    )

    for entry in entries:
        # Next class is one that ends after the current time
        if entry.get("endTime", "00:00") >= current_time_str:
            return entry

    return None

def parse_timetable_file(
    content_bytes: bytes,
    filename: str = "timetable.csv",
    format_hint: Optional[str] = None,
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """Parse timetable records from CSV, XLSX, or PDF bytes."""
    entries: List[Dict[str, Any]] = []
    errors: List[str] = []
    lower_name = filename.lower()

    # Format 1: Excel (.xlsx)
    if lower_name.endswith(".xlsx") or format_hint == "xlsx":
        try:
            import openpyxl
            wb = openpyxl.load_workbook(io.BytesIO(content_bytes), data_only=True)
            sheet = wb.active
            rows = list(sheet.iter_rows(values_only=True))
            if not rows:
                errors.append("Excel file contains no rows.")
                return entries, errors

            # Find header row
            header_row_idx = 0
            for idx, row in enumerate(rows[:5]):
                row_str = " ".join(str(cell or "").lower() for cell in row)
                if "day" in row_str or "subject" in row_str or "time" in row_str:
                    header_row_idx = idx
                    break

            headers = [str(cell or "").strip().lower() for cell in rows[header_row_idx]]
            data_rows = rows[header_row_idx + 1:]

            for r_idx, row in enumerate(data_rows, start=header_row_idx + 2):
                if not any(row):
                    continue
                row_dict = {headers[i]: str(row[i] or "").strip() for i in range(min(len(headers), len(row)))}
                entry = _normalize_row_to_entry(row_dict, r_idx, errors)
                if entry:
                    entries.append(entry)
        except Exception as e:
            errors.append(f"Failed to parse Excel file: {str(e)}")
            return entries, errors

    # Format 2: PDF (.pdf)
    elif lower_name.endswith(".pdf") or format_hint == "pdf":
        try:
            import pypdf
            pdf_reader = pypdf.PdfReader(io.BytesIO(content_bytes))
            full_text = ""
            for page in pdf_reader.pages:
                full_text += page.extract_text() + "\n"

            # Parse lines from PDF text
            lines = full_text.splitlines()
            for l_idx, line in enumerate(lines, start=1):
                clean_line = line.strip()
                if not clean_line or len(clean_line) < 10:
                    continue
                entry = _parse_text_line_to_entry(clean_line, l_idx)
                if entry:
                    entries.append(entry)
            if not entries:
                errors.append("Could not extract structured timetable entries from PDF. Ensure text is tabular.")
        except Exception as e:
            errors.append(f"Failed to parse PDF file: {str(e)}")

    # Format 3: CSV (default)
    else:
        try:
            text_data = content_bytes.decode("utf-8-sig", errors="replace")
            reader = csv.reader(io.StringIO(text_data))
            rows = [r for r in reader if any(field.strip() for field in r)]
            if not rows:
                errors.append("CSV file is empty.")
                return entries, errors

            headers = [h.strip().lower() for h in rows[0]]
            for r_idx, row in enumerate(rows[1:], start=2):
                row_dict = {headers[i]: row[i].strip() for i in range(min(len(headers), len(row)))}
                entry = _normalize_row_to_entry(row_dict, r_idx, errors)
                if entry:
                    entries.append(entry)
        except Exception as e:
            errors.append(f"Failed to parse CSV file: {str(e)}")

    return entries, errors

def _normalize_row_to_entry(row_dict: Dict[str, str], row_num: int, errors: List[str]) -> Optional[Dict[str, Any]]:
    # Map synonyms
    day = ""
    for k in ["day", "dayofweek", "day_of_week", "weekday"]:
        if k in row_dict and row_dict[k]:
            day = row_dict[k].capitalize()
            break
    if not day:
        # Default or skip
        day = "Monday"

    subject = ""
    for k in ["subject", "course_name", "title", "subject_name"]:
        if k in row_dict and row_dict[k]:
            subject = row_dict[k]
            break

    if not subject:
        return None

    subject_code = row_dict.get("code") or row_dict.get("subjectcode") or row_dict.get("subject_code") or "CS"
    start_time = row_dict.get("start") or row_dict.get("starttime") or row_dict.get("start_time") or "09:30"
    end_time = row_dict.get("end") or row_dict.get("endtime") or row_dict.get("end_time") or "10:30"
    faculty = row_dict.get("faculty") or row_dict.get("instructor") or row_dict.get("professor") or "Assigned Faculty"
    room = row_dict.get("room") or row_dict.get("classroom") or row_dict.get("location") or "Room B-204"
    building = row_dict.get("building") or "Faculty of Engineering & Technology (ENG-02)"

    # Format time cleanups
    start_time = _clean_time_string(start_time)
    end_time = _clean_time_string(end_time)

    return {
        "dayOfWeek": day,
        "subject": subject,
        "subjectCode": subject_code,
        "startTime": start_time,
        "endTime": end_time,
        "faculty": faculty,
        "room": room,
        "building": building,
    }

def _parse_text_line_to_entry(line: str, line_num: int) -> Optional[Dict[str, Any]]:
    # Regular expression for patterns like: Monday | CS301 | Data Structures | 09:30 | 10:30 | Prof. Roy | Room B-204
    parts = [p.strip() for p in re.split(r"[,|\t;]", line) if p.strip()]
    if len(parts) >= 4:
        day = parts[0].capitalize()
        if day in DAYS_ORDER:
            return {
                "dayOfWeek": day,
                "subjectCode": parts[1] if len(parts) > 1 else "CS301",
                "subject": parts[2] if len(parts) > 2 else "Core Academic Course",
                "startTime": _clean_time_string(parts[3]) if len(parts) > 3 else "09:30",
                "endTime": _clean_time_string(parts[4]) if len(parts) > 4 else "10:30",
                "faculty": parts[5] if len(parts) > 5 else "Assigned Faculty",
                "room": parts[6] if len(parts) > 6 else "Room B-204",
                "building": "Faculty of Engineering & Technology (ENG-02)",
            }
    return None

def _clean_time_string(t_str: str) -> str:
    t_clean = re.sub(r"[^\d:]", "", t_str)
    if ":" in t_clean:
        parts = t_clean.split(":")
        h = parts[0].zfill(2)
        m = parts[1].zfill(2)
        return f"{h}:{m}"
    return t_str.strip() or "09:30"

def validate_timetable_entries(
    entries: List[Dict[str, Any]],
    scope: Dict[str, Any],
) -> Dict[str, Any]:
    """Validate extracted timetable records and check for internal conflicts."""
    errors: List[str] = []
    warnings: List[str] = []
    validated_entries: List[Dict[str, Any]] = []

    if not entries:
        errors.append("No valid timetable rows extracted from submission.")
        return {"isValid": False, "errors": errors, "warnings": warnings, "entries": []}

    slots_seen: Dict[Tuple[str, str, str], str] = {} # (day, startTime, room) -> subject

    for idx, e in enumerate(entries, start=1):
        day = e.get("dayOfWeek", "").capitalize()
        if day not in DAYS_ORDER:
            errors.append(f"Row {idx}: Invalid day '{day}'. Must be Monday through Sunday.")

        sub = e.get("subject", "").strip()
        if not sub:
            errors.append(f"Row {idx}: Subject name cannot be empty.")

        start = e.get("startTime", "").strip()
        end = e.get("endTime", "").strip()

        if not re.match(r"^\d{2}:\d{2}$", start) or not re.match(r"^\d{2}:\d{2}$", end):
            errors.append(f"Row {idx} ({sub}): Invalid 24h time format '{start}'–'{end}'. Use HH:MM.")
        elif start >= end:
            errors.append(f"Row {idx} ({sub}): End time '{end}' must be strictly after start time '{start}'.")

        room = e.get("room", "Room B-204").strip()
        slot_key = (day, start, room)
        if slot_key in slots_seen:
            warnings.append(
                f"Classroom Conflict: Room '{room}' on {day} at {start} has overlapping classes: "
                f"'{slots_seen[slot_key]}' and '{sub}'."
            )
        else:
            slots_seen[slot_key] = sub

        entry_copy = dict(e)
        entry_copy["department"] = scope.get("department", "Computer Science & Engineering")
        entry_copy["course"] = scope.get("course", "B.Tech CSE")
        entry_copy["semester"] = int(scope.get("semester", 3))
        entry_copy["section"] = scope.get("section", "A").upper()

        entry_copy["effectiveFrom"] = scope.get("effectiveFrom") or "2026-08-01"
        entry_copy["effectiveUntil"] = scope.get("effectiveUntil") or "2026-12-31"
        validated_entries.append(entry_copy)

    is_valid = len(errors) == 0
    return {
        "isValid": is_valid,
        "errors": errors,
        "warnings": warnings,
        "entriesCount": len(validated_entries),
        "entries": validated_entries,
    }

async def preview_timetable_upload(
    scope: Dict[str, Any],
    file_bytes: Optional[bytes] = None,
    filename: Optional[str] = None,
    csv_text: Optional[str] = None,
) -> Dict[str, Any]:
    """Parse, validate, and compare proposed timetable changes against published data."""
    if csv_text:
        content_bytes = csv_text.encode("utf-8")
        name = "submission.csv"
    elif file_bytes:
        content_bytes = file_bytes
        name = filename or "submission.csv"
    else:
        return {"isValid": False, "errors": ["No file or CSV data submitted for timetable update."], "warnings": []}

    raw_entries, parse_errors = parse_timetable_file(content_bytes, name)
    if parse_errors and not raw_entries:
        return {"isValid": False, "errors": parse_errors, "warnings": [], "entries": []}

    validation = validate_timetable_entries(raw_entries, scope)
    if parse_errors:
        validation["warnings"].extend(parse_errors)

    # Compare with existing active entries to compute diff
    current_entries = await get_timetables(
        department=scope.get("department"),
        semester=int(scope.get("semester", 3)),
        section=scope.get("section", "A"),
    )

    validation["diffSummary"] = {
        "newEntriesCount": len(validation["entries"]),
        "currentPublishedCount": len(current_entries),
        "targetScope": f"{scope.get('department')} - Semester {scope.get('semester')} - Section {scope.get('section', 'A')}",
        "effectiveFrom": scope.get("effectiveFrom") or "2026-08-01",
    }
    return validation

async def publish_timetable(
    scope: Dict[str, Any],
    entries: List[Dict[str, Any]],
    admin_user: Dict[str, Any],
    notes: Optional[str] = None,
) -> Dict[str, Any]:
    """Atomically archive existing version and publish new validated timetable entries."""
    db = get_database()
    dept = scope.get("department", "Computer Science & Engineering")
    semester = int(scope.get("semester", 3))
    section = scope.get("section", "A").upper()

    # Determine current max version
    existing_entries = await get_timetables(department=dept, semester=semester, section=section)
    prev_version = max([e.get("version", 1) for e in existing_entries], default=0)
    new_version = prev_version + 1

    now = datetime.now(timezone.utc)
    new_records = []

    for e in entries:
        rec = dict(e)
        rec["_id"] = f"tt_{dept[:3].lower()}_s{semester}_{uuid.uuid4().hex[:8]}"
        rec["id"] = rec["_id"]
        rec["department"] = dept
        rec["semester"] = semester
        rec["section"] = section
        rec["version"] = new_version
        rec["status"] = "published"
        rec["publishedBy"] = admin_user.get("email", "admin@nextcampus.edu")
        rec["publishedAt"] = now
        rec["updatedAt"] = now
        new_records.append(rec)

    # 1. Update in-memory store
    # Archive current matching entries in in-memory store
    for item in IN_MEMORY_TIMETABLES:
        if (
            dept.lower() in item.get("department", "").lower()
            and item.get("semester") == semester
            and item.get("section", "A").upper() == section
            and item.get("status") == "published"
        ):
            item["status"] = "archived"

    IN_MEMORY_TIMETABLES.extend(new_records)

    # 2. Persist to MongoDB
    if db is not None:
        try:
            # Mark previous records as archived
            await db.timetables.update_many(
                {
                    "department": {"$regex": re.escape(dept), "$options": "i"},
                    "semester": semester,
                    "section": section,
                    "status": "published",
                },
                {"$set": {"status": "archived", "archivedAt": now}},
            )
            # Insert new published records
            if new_records:
                await db.timetables.insert_many([dict(r) for r in new_records])
        except Exception as e:
            logger.error(f"[Timetable DB Publication Error]: {e}")
            raise RuntimeError(f"Database write failed during timetable publication: {str(e)}")

    # 3. Record Audit Log
    target_scope_str = f"{dept} - Semester {semester} - Section {section}"
    await record_audit_log(
        action="timetable_publish",
        target_scope=target_scope_str,
        user=admin_user,
        status="success",
        previous_version=prev_version if prev_version > 0 else None,
        new_version=new_version,
        details={
            "entriesCount": len(new_records),
            "effectiveFrom": scope.get("effectiveFrom") or "2026-08-01",
            "notes": notes or "Administrator publication via NextCampus Assistant",
        },
    )

    return {
        "success": True,
        "message": f"Successfully published version {new_version} for {target_scope_str} ({len(new_records)} classes).",
        "version": new_version,
        "entriesCount": len(new_records),
        "targetScope": target_scope_str,
    }

async def rollback_timetable(
    scope: Dict[str, Any],
    target_version: int,
    admin_user: Dict[str, Any],
) -> Dict[str, Any]:
    """Roll back timetable to a previously published version."""
    db = get_database()
    dept = scope.get("department", "Computer Science & Engineering")
    semester = int(scope.get("semester", 3))
    section = scope.get("section", "A").upper()

    now = datetime.now(timezone.utc)

    # Find candidate records for rollback
    archived_candidates = [
        item for item in IN_MEMORY_TIMETABLES
        if dept.lower() in item.get("department", "").lower()
        and item.get("semester") == semester
        and item.get("section", "A").upper() == section
        and item.get("version") == target_version
    ]

    if db is not None:
        try:
            cursor = db.timetables.find({
                "department": {"$regex": re.escape(dept), "$options": "i"},
                "semester": semester,
                "section": section,
                "version": target_version,
            })
            db_candidates = []
            async for doc in cursor:
                db_candidates.append(doc)
            if db_candidates:
                archived_candidates = db_candidates
        except Exception as e:
            logger.warning(f"[Timetable Rollback DB Lookup Fallback]: {e}")

    if not archived_candidates:
        raise ValueError(f"Version {target_version} does not exist in timetable history for this scope.")

    # Archive current published version
    for item in IN_MEMORY_TIMETABLES:
        if (
            dept.lower() in item.get("department", "").lower()
            and item.get("semester") == semester
            and item.get("section", "A").upper() == section
            and item.get("status") == "published"
        ):
            item["status"] = "archived"

    # Restore target version
    for item in IN_MEMORY_TIMETABLES:
        if (
            dept.lower() in item.get("department", "").lower()
            and item.get("semester") == semester
            and item.get("section", "A").upper() == section
            and item.get("version") == target_version
        ):
            item["status"] = "published"

    if db is not None:
        try:
            await db.timetables.update_many(
                {
                    "department": {"$regex": re.escape(dept), "$options": "i"},
                    "semester": semester,
                    "section": section,
                    "status": "published",
                },
                {"$set": {"status": "archived", "archivedAt": now}},
            )
            await db.timetables.update_many(
                {
                    "department": {"$regex": re.escape(dept), "$options": "i"},
                    "semester": semester,
                    "section": section,
                    "version": target_version,
                },
                {"$set": {"status": "published", "restoredAt": now}},
            )
        except Exception as e:
            logger.error(f"[Timetable Rollback DB Write Error]: {e}")

    target_scope_str = f"{dept} - Semester {semester} - Section {section}"
    await record_audit_log(
        action="timetable_rollback",
        target_scope=target_scope_str,
        user=admin_user,
        status="success",
        new_version=target_version,
        details={"restoredRecords": len(archived_candidates)},
    )

    return {
        "success": True,
        "message": f"Successfully rolled back {target_scope_str} to version {target_version}.",
        "version": target_version,
        "entriesCount": len(archived_candidates),
    }

async def get_timetable_versions(scope: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Retrieve version history for a timetable scope."""
    dept = scope.get("department", "Computer Science & Engineering")
    semester = int(scope.get("semester", 3))
    section = scope.get("section", "A").upper()

    all_entries = [
        item for item in IN_MEMORY_TIMETABLES
        if dept.lower() in item.get("department", "").lower()
        and item.get("semester") == semester
        and item.get("section", "A").upper() == section
    ]

    version_map: Dict[int, Dict[str, Any]] = {}
    for e in all_entries:
        v = e.get("version", 1)
        if v not in version_map:
            version_map[v] = {
                "version": v,
                "status": e.get("status", "archived"),
                "entriesCount": 0,
                "publishedBy": e.get("publishedBy", "admin@nextcampus.edu"),
                "publishedAt": e.get("publishedAt", datetime.now(timezone.utc)),
            }
        version_map[v]["entriesCount"] += 1
        if e.get("status") == "published":
            version_map[v]["status"] = "published"

    return sorted(list(version_map.values()), key=lambda x: x["version"], reverse=True)

async def get_timetable_hierarchy_tree() -> Dict[str, Any]:
    """Retrieve full organizational hierarchy for timetable scoping."""
    return {
        "departments": [
            "Computer Science & Engineering",
            "Electronics & Communication Engineering",
            "Mechanical & Automation Engineering",
            "Electrical & Electronics Engineering",
            "Civil Engineering",
            "Department of Management Studies",
        ],
        "courses": {
            "Computer Science & Engineering": ["B.Tech CSE", "B.Tech CSE - AI & ML", "B.Tech Cyber Security", "BCA", "MCA"],
            "Electronics & Communication Engineering": ["B.Tech ECE", "B.Tech VLSI & Embedded Systems"],
            "Mechanical & Automation Engineering": ["B.Tech Mechanical", "B.Tech Robotics & Mechatronics"],
            "Electrical & Electronics Engineering": ["B.Tech EEE", "B.Tech Renewable Energy"],
            "Civil Engineering": ["B.Tech Civil", "B.Tech Structural Engineering"],
            "Department of Management Studies": ["BBA", "MBA"],
        },
        "years": [
            {"year": 1, "label": "1st Year", "semesters": [1, 2]},
            {"year": 2, "label": "2nd Year", "semesters": [3, 4]},
            {"year": 3, "label": "3rd Year", "semesters": [5, 6]},
            {"year": 4, "label": "4th Year", "semesters": [7, 8]},
        ],
        "sections": ["A", "B", "C"],
        "days": DAYS_ORDER[:6], # Monday to Saturday
    }

async def save_timetable_slot(slot_data: Dict[str, Any], admin_user: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Admin adds or updates an individual class slot in the academic schedule."""
    slot_id = slot_data.get("id") or slot_data.get("_id") or f"tt_slot_{int(datetime.now(timezone.utc).timestamp() * 1000)}"
    semester = int(slot_data.get("semester", 3))
    calculated_year = (semester + 1) // 2

    new_slot = {
        "_id": slot_id,
        "id": slot_id,
        "department": slot_data.get("department", "Computer Science & Engineering"),
        "course": slot_data.get("course", "B.Tech CSE"),
        "year": int(slot_data.get("year", calculated_year)),
        "semester": semester,
        "section": str(slot_data.get("section", "A")).upper(),
        "dayOfWeek": slot_data.get("dayOfWeek", "Monday"),
        "subject": slot_data.get("subject", "Advanced Programming"),
        "subjectCode": slot_data.get("subjectCode", "CS301"),
        "startTime": slot_data.get("startTime", "09:30"),
        "endTime": slot_data.get("endTime", "10:30"),
        "faculty": slot_data.get("faculty", "Prof. Assigned"),
        "room": slot_data.get("room", "Room B-204"),
        "building": slot_data.get("building", "Faculty of Engineering & Technology (ENG-02)"),
        "status": "published",
        "version": 1,
        "updatedAt": datetime.now(timezone.utc),
    }

    db = get_database()
    if db is not None:
        try:
            await db.timetables.update_one(
                {"$or": [{"_id": slot_id}, {"id": slot_id}]},
                {"$set": new_slot},
                upsert=True,
            )
        except Exception as e:
            logger.warning(f"[Timetable DB Slot Save]: {e}")

    # Update in memory
    found = False
    for i, item in enumerate(IN_MEMORY_TIMETABLES):
        if item.get("id") == slot_id or item.get("_id") == slot_id:
            IN_MEMORY_TIMETABLES[i] = copy.deepcopy(new_slot)
            found = True
            break
    if not found:
        IN_MEMORY_TIMETABLES.append(copy.deepcopy(new_slot))

    return new_slot

async def delete_timetable_slot(slot_id: str) -> bool:
    """Admin removes a class slot from the schedule."""
    global IN_MEMORY_TIMETABLES
    IN_MEMORY_TIMETABLES = [item for item in IN_MEMORY_TIMETABLES if item.get("id") != slot_id and item.get("_id") != slot_id]
    db = get_database()
    if db is not None:
        try:
            await db.timetables.delete_many({"$or": [{"_id": slot_id}, {"id": slot_id}]})
        except Exception:
            pass
    return True

