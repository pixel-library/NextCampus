import copy
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId

from backend.app.db.connection import get_database, is_db_connected, IN_MEMORY_COMPLAINTS
from backend.app.db.seed_data import DEMO_STAFF
from backend.app.utils.helpers import sanitize_complaint_for_student, serialize_mongo

async def get_complaints(filter_params: Optional[Dict[str, Any]] = None, is_admin: bool = False) -> List[Dict[str, Any]]:
    """Retrieve complaint tickets with role-sensitive data isolation."""
    filter_params = filter_params or {}
    db = get_database()

    if is_db_connected() and db is not None:
        try:
            mongo_filter: Dict[str, Any] = {}
            if filter_params.get("studentId"):
                s_id = str(filter_params["studentId"])
                try:
                    oid = ObjectId(s_id)
                    mongo_filter["$or"] = [{"studentId": s_id}, {"studentId": oid}, {"student._id": s_id}]
                except Exception:
                    mongo_filter["$or"] = [{"studentId": s_id}, {"student._id": s_id}]

            if filter_params.get("category") and filter_params["category"] != "all":
                mongo_filter["category"] = filter_params["category"]
            if filter_params.get("status") and filter_params["status"] != "all":
                mongo_filter["status"] = filter_params["status"]
            if filter_params.get("priority") and filter_params["priority"] != "all":
                mongo_filter["priority"] = filter_params["priority"]

            projection = None if is_admin else {"internalNotes": 0}
            cursor = db.complaints.find(mongo_filter, projection).sort("createdAt", -1)
            records = await cursor.to_list(length=500)
            if records and len(records) > 0:
                results = serialize_mongo(records)
                if not is_admin:
                    return [sanitize_complaint_for_student(c) for c in results]
                return results
        except Exception:
            pass

    # In-memory fallback
    results = copy.deepcopy(IN_MEMORY_COMPLAINTS)
    if filter_params.get("studentId"):
        s_id = str(filter_params["studentId"])
        def matches_student(c):
            st_id = c.get("studentId")
            if isinstance(st_id, dict):
                if str(st_id.get("_id") or st_id.get("id")) == s_id:
                    return True
            elif str(st_id) == s_id:
                return True
            st_obj = c.get("student")
            if isinstance(st_obj, dict):
                if str(st_obj.get("_id") or st_obj.get("id")) == s_id:
                    return True
            return False
        results = [c for c in results if matches_student(c)]

    if filter_params.get("category") and filter_params["category"] != "all":
        results = [c for c in results if c.get("category") == filter_params["category"]]
    if filter_params.get("status") and filter_params["status"] != "all":
        results = [c for c in results if c.get("status") == filter_params["status"]]
    if filter_params.get("priority") and filter_params["priority"] != "all":
        results = [c for c in results if c.get("priority") == filter_params["priority"]]

    serialized = serialize_mongo(results)
    if not is_admin:
        return [sanitize_complaint_for_student(c) for c in serialized]
    return serialized

async def get_complaint_by_id(complaint_id: str, is_admin: bool = False) -> Optional[Dict[str, Any]]:
    """Retrieve complaint ticket by ID or ticketId."""
    db = get_database()
    complaint = None

    if is_db_connected() and db is not None:
        try:
            queries = [{"ticketId": complaint_id}, {"_id": complaint_id}, {"id": complaint_id}]
            try:
                queries.append({"_id": ObjectId(complaint_id)})
            except Exception:
                pass
            complaint = await db.complaints.find_one({"$or": queries})
            if complaint:
                serialized = serialize_mongo(complaint)
                return serialized if is_admin else sanitize_complaint_for_student(serialized)
        except Exception:
            pass

    for c in IN_MEMORY_COMPLAINTS:
        if c.get("ticketId") == complaint_id or str(c.get("_id")) == str(complaint_id) or str(c.get("id")) == str(complaint_id):
            serialized = serialize_mongo(copy.deepcopy(c))
            return serialized if is_admin else sanitize_complaint_for_student(serialized)

    return None

async def create_complaint(complaint_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create and lodge a new maintenance complaint in NextCampus Care."""
    count = len(IN_MEMORY_COMPLAINTS) + 1045
    ticket_id = f"CMP-{count}"
    now = datetime.now(timezone.utc)
    new_id = f"cmp_{count}_{int(now.timestamp())}"

    attachments = complaint_data.get("attachments") or []
    if isinstance(attachments, str):
        attachments = [attachments]

    student_raw_id = complaint_data.get("studentId") or "usr_student_01"
    author_name = complaint_data.get("authorName") or "Student"
    student_obj = {
        "_id": str(student_raw_id),
        "id": str(student_raw_id),
        "name": author_name,
        "email": complaint_data.get("email") or "student@nextcampus.edu",
        "department": complaint_data.get("department") or "Department of Computer Science & Engineering",
        "rollNumber": complaint_data.get("rollNumber") or "MUR2502101",
        "phone": complaint_data.get("phone") or "+91 98765 43210",
    }

    new_ticket = {
        **complaint_data,
        "_id": new_id,
        "id": new_id,
        "ticketId": ticket_id,
        "status": "open",
        "priority": complaint_data.get("priority") or "medium",
        "attachments": attachments,
        "studentId": student_obj,
        "student": student_obj,
        "authorName": author_name,
        "review": None,
        "updates": [
            {
                "message": "Ticket lodged by student in NextCampus Care system.",
                "updatedBy": author_name,
                "createdAt": now.isoformat(),
            }
        ],
        "internalNotes": [],
        "createdAt": now,
        "updatedAt": now,
    }

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            await db.complaints.insert_one(copy.deepcopy(new_ticket))
        except Exception:
            pass

    IN_MEMORY_COMPLAINTS.insert(0, copy.deepcopy(new_ticket))
    return serialize_mongo(new_ticket)

async def add_complaint_review(
    complaint_id: str,
    rating: int,
    comment: str = "",
    tags: Optional[List[str]] = None,
    reviewed_by: str = "Student",
    student_id: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Record student resolution review and rating for completed complaint."""
    now = datetime.now(timezone.utc)
    review_entry = {
        "rating": rating,
        "comment": comment or "",
        "tags": tags or [],
        "reviewedBy": reviewed_by or "Student",
        "studentId": str(student_id) if student_id else None,
        "createdAt": now.isoformat(),
    }
    update_msg = {
        "message": f"Student verified resolution with {rating}-star rating: \"{comment[:80] + '...' if len(comment) > 80 else (comment or 'Satisfaction confirmed')}\"",
        "updatedBy": reviewed_by or "Student Requester",
        "createdAt": now.isoformat(),
    }

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            queries = [{"ticketId": complaint_id}, {"_id": complaint_id}, {"id": complaint_id}]
            try:
                queries.append({"_id": ObjectId(complaint_id)})
            except Exception:
                pass
            await db.complaints.update_one(
                {"$or": queries},
                {
                    "$set": {"review": review_entry, "updatedAt": now},
                    "$push": {"updates": update_msg},
                },
            )
            found = await db.complaints.find_one({"$or": queries})
            if found:
                return serialize_mongo(found)
        except Exception:
            pass

    for idx, c in enumerate(IN_MEMORY_COMPLAINTS):
        if c.get("ticketId") == complaint_id or str(c.get("_id")) == str(complaint_id) or str(c.get("id")) == str(complaint_id):
            IN_MEMORY_COMPLAINTS[idx]["review"] = review_entry
            if "updates" not in IN_MEMORY_COMPLAINTS[idx]:
                IN_MEMORY_COMPLAINTS[idx]["updates"] = []
            IN_MEMORY_COMPLAINTS[idx]["updates"].append(update_msg)
            IN_MEMORY_COMPLAINTS[idx]["updatedAt"] = now
            return serialize_mongo(copy.deepcopy(IN_MEMORY_COMPLAINTS[idx]))

    return None

async def update_complaint_status(
    complaint_id: str,
    status: Optional[str] = None,
    update_message: Optional[str] = None,
    updated_by: Optional[str] = "System",
    priority: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Update complaint status or priority, recording an audit timeline entry."""
    now = datetime.now(timezone.utc)
    update_obj: Dict[str, Any] = {"updatedAt": now}
    if status:
        update_obj["status"] = status
    if priority:
        update_obj["priority"] = priority

    push_entry = None
    if update_message:
        push_entry = {
            "message": update_message,
            "updatedBy": updated_by or "System",
            "createdAt": now.isoformat(),
        }

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            queries = [{"ticketId": complaint_id}, {"_id": complaint_id}, {"id": complaint_id}]
            try:
                queries.append({"_id": ObjectId(complaint_id)})
            except Exception:
                pass

            mongo_op: Dict[str, Any] = {"$set": update_obj}
            if push_entry:
                mongo_op["$push"] = {"updates": push_entry}

            await db.complaints.update_one({"$or": queries}, mongo_op)
            found = await db.complaints.find_one({"$or": queries})
            if found:
                return serialize_mongo(found)
        except Exception:
            pass

    for idx, c in enumerate(IN_MEMORY_COMPLAINTS):
        if c.get("ticketId") == complaint_id or str(c.get("_id")) == str(complaint_id) or str(c.get("id")) == str(complaint_id):
            IN_MEMORY_COMPLAINTS[idx].update(update_obj)
            if push_entry:
                if "updates" not in IN_MEMORY_COMPLAINTS[idx]:
                    IN_MEMORY_COMPLAINTS[idx]["updates"] = []
                IN_MEMORY_COMPLAINTS[idx]["updates"].append(push_entry)
            return serialize_mongo(copy.deepcopy(IN_MEMORY_COMPLAINTS[idx]))

    return None

async def assign_staff(
    complaint_id: str,
    assigned_to_id: Optional[str],
    assigned_to_name: str,
    updated_by: Optional[str] = "Admin",
) -> Optional[Dict[str, Any]]:
    """Assign maintenance staff technician and dispatch ticket."""
    now = datetime.now(timezone.utc)
    message = f"Technician {assigned_to_name} assigned to ticket and dispatched."
    update_obj = {
        "assignedTo": assigned_to_id,
        "assignedToName": assigned_to_name,
        "status": "in_progress",
        "updatedAt": now,
    }
    push_entry = {
        "message": message,
        "updatedBy": updated_by or "Admin",
        "createdAt": now.isoformat(),
    }

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            queries = [{"ticketId": complaint_id}, {"_id": complaint_id}, {"id": complaint_id}]
            try:
                queries.append({"_id": ObjectId(complaint_id)})
            except Exception:
                pass
            await db.complaints.update_one(
                {"$or": queries},
                {"$set": update_obj, "$push": {"updates": push_entry}}
            )
            found = await db.complaints.find_one({"$or": queries})
            if found:
                return serialize_mongo(found)
        except Exception:
            pass

    for idx, c in enumerate(IN_MEMORY_COMPLAINTS):
        if c.get("ticketId") == complaint_id or str(c.get("_id")) == str(complaint_id) or str(c.get("id")) == str(complaint_id):
            IN_MEMORY_COMPLAINTS[idx].update(update_obj)
            if "updates" not in IN_MEMORY_COMPLAINTS[idx]:
                IN_MEMORY_COMPLAINTS[idx]["updates"] = []
            IN_MEMORY_COMPLAINTS[idx]["updates"].append(push_entry)
            return serialize_mongo(copy.deepcopy(IN_MEMORY_COMPLAINTS[idx]))

    return None

async def add_public_update(complaint_id: str, message: str, updated_by: Optional[str] = "Operations Admin") -> Optional[Dict[str, Any]]:
    """Add a student-visible update to the ticket audit trail."""
    now = datetime.now(timezone.utc)
    entry = {
        "message": message,
        "updatedBy": updated_by or "Operations Admin",
        "createdAt": now.isoformat(),
    }

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            queries = [{"ticketId": complaint_id}, {"_id": complaint_id}, {"id": complaint_id}]
            try:
                queries.append({"_id": ObjectId(complaint_id)})
            except Exception:
                pass
            await db.complaints.update_one(
                {"$or": queries},
                {"$push": {"updates": entry}, "$set": {"updatedAt": now}}
            )
            found = await db.complaints.find_one({"$or": queries})
            if found:
                return serialize_mongo(found)
        except Exception:
            pass

    for idx, c in enumerate(IN_MEMORY_COMPLAINTS):
        if c.get("ticketId") == complaint_id or str(c.get("_id")) == str(complaint_id) or str(c.get("id")) == str(complaint_id):
            if "updates" not in IN_MEMORY_COMPLAINTS[idx]:
                IN_MEMORY_COMPLAINTS[idx]["updates"] = []
            IN_MEMORY_COMPLAINTS[idx]["updates"].append(entry)
            IN_MEMORY_COMPLAINTS[idx]["updatedAt"] = now
            return serialize_mongo(copy.deepcopy(IN_MEMORY_COMPLAINTS[idx]))

    return None

async def add_internal_note(
    complaint_id: str,
    note: str,
    author_id: Optional[str] = None,
    author_name: Optional[str] = "Admin Operator",
) -> Optional[Dict[str, Any]]:
    """Record an internal administrative note (strictly hidden from students)."""
    now = datetime.now(timezone.utc)
    entry = {
        "note": note,
        "author": author_id,
        "authorName": author_name or "Admin Operator",
        "createdAt": now.isoformat(),
    }

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            queries = [{"ticketId": complaint_id}, {"_id": complaint_id}, {"id": complaint_id}]
            try:
                queries.append({"_id": ObjectId(complaint_id)})
            except Exception:
                pass
            await db.complaints.update_one(
                {"$or": queries},
                {"$push": {"internalNotes": entry}, "$set": {"updatedAt": now}}
            )
            found = await db.complaints.find_one({"$or": queries})
            if found:
                return serialize_mongo(found)
        except Exception:
            pass

    for idx, c in enumerate(IN_MEMORY_COMPLAINTS):
        if c.get("ticketId") == complaint_id or str(c.get("_id")) == str(complaint_id) or str(c.get("id")) == str(complaint_id):
            if "internalNotes" not in IN_MEMORY_COMPLAINTS[idx]:
                IN_MEMORY_COMPLAINTS[idx]["internalNotes"] = []
            IN_MEMORY_COMPLAINTS[idx]["internalNotes"].append(entry)
            IN_MEMORY_COMPLAINTS[idx]["updatedAt"] = now
            return serialize_mongo(copy.deepcopy(IN_MEMORY_COMPLAINTS[idx]))

    return None

async def get_available_staff() -> List[Dict[str, Any]]:
    """Retrieve list of available facilities technicians and administrators."""
    db = get_database()
    if is_db_connected() and db is not None:
        try:
            cursor = db.users.find({"role": {"$in": ["staff", "admin"]}})
            staff_users = await cursor.to_list(length=50)
            if staff_users and len(staff_users) > 0:
                return [
                    {
                        "id": str(s.get("_id")),
                        "name": s.get("name"),
                        "role": s.get("role"),
                        "specialty": s.get("department") or "Operations Specialist",
                        "email": s.get("email"),
                    }
                    for s in staff_users
                ]
        except Exception:
            pass

    return copy.deepcopy(DEMO_STAFF)
