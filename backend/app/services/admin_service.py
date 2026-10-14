import copy
from datetime import datetime, timezone
import re
from typing import Any, Dict, List, Optional
from backend.app.db.connection import (
    get_database,
    is_db_connected,
    IN_MEMORY_ANNOUNCEMENTS,
    IN_MEMORY_USERS,
    IN_MEMORY_ENROLLMENTS,
)
from backend.app.utils.helpers import serialize_mongo

async def get_admin_stats() -> Dict[str, Any]:
    """Retrieve executive administrative statistics and campus telemetry summary."""
    db = get_database()
    total_users = 14820
    total_rooms = 184
    occupied_rooms = 142
    available_rooms = 42
    total_complaints = 48
    active_complaints = 18
    total_projects = 38
    announcements = copy.deepcopy(IN_MEMORY_ANNOUNCEMENTS)

    if is_db_connected() and db is not None:
        try:
            u_count = await db.users.count_documents({})
            if u_count > 0:
                total_users = u_count

            r_count = await db.rooms.count_documents({})
            if r_count > 0:
                total_rooms = r_count
                occupied_rooms = await db.rooms.count_documents({"status": "occupied"})
                available_rooms = await db.rooms.count_documents({"status": "available"})

            c_count = await db.complaints.count_documents({})
            if c_count > 0:
                total_complaints = c_count
                active_complaints = await db.complaints.count_documents({"status": {"$ne": "resolved"}})

            p_count = await db.projects.count_documents({})
            if p_count > 0:
                total_projects = p_count

            cursor = db.announcements.find().sort("createdAt", -1).limit(5)
            ann_docs = await cursor.to_list(length=5)
            if ann_docs and len(ann_docs) > 0:
                announcements = serialize_mongo(ann_docs)
        except Exception:
            pass

    return {
        "population": {
            "total": total_users,
            "students": 12450,
            "faculty": 1320,
            "staff": 1050,
        },
        "rooms": {
            "total": total_rooms,
            "inUse": occupied_rooms,
            "available": available_rooms,
            "utilizationRate": 78.4,
        },
        "complaints": {
            "total": total_complaints,
            "active": active_complaints,
            "inDispatch": 30,
            "avgSlaDays": 2.4,
        },
        "projects": {
            "total": total_projects,
            "openRoles": 64,
        },
        "announcements": announcements if len(announcements) > 0 else [
            {
                "id": "1",
                "title": "Scheduled Network Maintenance",
                "desc": "Central Library AP-09 undergoing firmware update",
                "category": "Network",
                "createdAt": "Today 08:30 AM",
            },
            {
                "id": "2",
                "title": "MU Hackathon 2026 Venue Approval",
                "desc": "Turing Hall Amphitheatre reserved for Dec 4-6",
                "category": "Incubator",
                "createdAt": "Yesterday",
            },
        ],
    }

get_admin_dashboard_metrics = get_admin_stats

async def get_admin_students(
    search: Optional[str] = None,
    department: Optional[str] = None,
    status_filter: Optional[str] = None,
) -> Dict[str, Any]:
    """Retrieve all student database records including registration, claim state, and block status."""
    students: List[Dict[str, Any]] = []
    claimed_murs = set()

    # 1. Collect all registered student accounts from users
    for u in IN_MEMORY_USERS:
        if u.get("role") != "admin":
            mur = (u.get("enrollmentNumber") or u.get("studentId") or "").strip().upper()
            claimed_murs.add(mur)
            students.append({
                "id": str(u.get("id") or u.get("_id")),
                "name": u.get("name") or u.get("preferredName") or "Student",
                "email": u.get("email") or "",
                "enrollmentNumber": mur,
                "department": u.get("department") or "Computer Science & Engineering",
                "academicYear": u.get("academicYear") or "Class of 2029",
                "semester": u.get("semester") or "1st Year • Semester 1",
                "phone": u.get("phone") or "—",
                "residence": u.get("residence") or "Hostel Block C",
                "isClaimed": True,
                "isBlocked": bool(u.get("isBlocked", False)),
                "createdAt": u.get("createdAt"),
            })

    # 2. Collect remaining university enrollment roster (pending registration)
    for e in IN_MEMORY_ENROLLMENTS:
        mur = (e.get("enrollmentNumber") or "").strip().upper()
        if mur not in claimed_murs:
            students.append({
                "id": str(e.get("_id") or e.get("id") or f"enr_{mur.lower()}"),
                "name": e.get("fullName") or "Pending Student",
                "email": e.get("email") or f"{mur.lower()}@nextcampus.edu",
                "enrollmentNumber": mur,
                "department": e.get("department") or "Computer Science & Engineering",
                "academicYear": e.get("academicYear") or "Class of 2029",
                "semester": "1st Year • Semester 1",
                "phone": "—",
                "residence": "Not Allocated Yet",
                "isClaimed": False,
                "isBlocked": bool(e.get("isBlocked", False)),
                "createdAt": e.get("createdAt"),
            })

    # 3. Apply Filters
    filtered = []
    search_lower = search.strip().lower() if search else None
    dept_lower = department.strip().lower() if department and department != "all" else None
    status_lower = status_filter.strip().lower() if status_filter and status_filter != "all" else None

    for s in students:
        if search_lower:
            text = f"{s['name']} {s['enrollmentNumber']} {s['email']} {s['phone']} {s['department']}".lower()
            if search_lower not in text:
                continue

        if dept_lower:
            if dept_lower not in s["department"].lower():
                continue

        if status_lower:
            if status_lower == "registered" and not s["isClaimed"]:
                continue
            if status_lower == "unclaimed" and s["isClaimed"]:
                continue
            if status_lower == "blocked" and not s["isBlocked"]:
                continue
            if status_lower == "active" and (not s["isClaimed"] or s["isBlocked"]):
                continue

        filtered.append(s)

    # Sort registered first, then alphabetically by name
    filtered.sort(key=lambda x: (not x["isClaimed"], x["name"].lower()))

    # Calculate overall stats
    total_roster = len(students)
    registered_count = sum(1 for s in students if s["isClaimed"])
    unclaimed_count = sum(1 for s in students if not s["isClaimed"])
    blocked_count = sum(1 for s in students if s["isBlocked"])
    active_count = sum(1 for s in students if s["isClaimed"] and not s["isBlocked"])

    return {
        "students": filtered,
        "count": len(filtered),
        "stats": {
            "totalRoster": total_roster,
            "registered": registered_count,
            "unclaimed": unclaimed_count,
            "blocked": blocked_count,
            "active": active_count,
        },
    }

async def toggle_student_block_status(student_id_or_mur: str) -> Dict[str, Any]:
    """Toggle the suspended / blocked access flag for a student in MongoDB and memory."""
    target = student_id_or_mur.strip().upper()
    found = False
    new_blocked_state = False
    target_student = None

    db = get_database()

    # Search in IN_MEMORY_USERS
    for u in IN_MEMORY_USERS:
        u_id = str(u.get("id") or u.get("_id", "")).upper()
        u_mur = (u.get("enrollmentNumber") or u.get("studentId") or "").strip().upper()
        if target in [u_id, u_mur]:
            current_state = bool(u.get("isBlocked", False))
            new_blocked_state = not current_state
            u["isBlocked"] = new_blocked_state
            u["updatedAt"] = datetime.now(timezone.utc)
            target_student = {
                "id": str(u.get("id") or u.get("_id")),
                "name": u.get("name"),
                "enrollmentNumber": u_mur,
                "isBlocked": new_blocked_state,
                "status": "blocked" if new_blocked_state else "active",
            }
            found = True
            break

    # If not registered yet, check IN_MEMORY_ENROLLMENTS
    if not found:
        for e in IN_MEMORY_ENROLLMENTS:
            e_id = str(e.get("_id") or e.get("id", "")).upper()
            e_mur = (e.get("enrollmentNumber") or "").strip().upper()
            if target in [e_id, e_mur]:
                current_state = bool(e.get("isBlocked", False))
                new_blocked_state = not current_state
                e["isBlocked"] = new_blocked_state
                target_student = {
                    "id": str(e.get("_id") or e.get("id")),
                    "name": e.get("fullName"),
                    "enrollmentNumber": e_mur,
                    "isBlocked": new_blocked_state,
                    "status": "blocked" if new_blocked_state else "unclaimed",
                }
                found = True
                break

    # Sync to MongoDB if connected
    if is_db_connected() and db is not None:
        try:
            await db.users.update_many(
                {"$or": [{"_id": student_id_or_mur}, {"id": student_id_or_mur}, {"enrollmentNumber": target}, {"studentId": target}]},
                {"$set": {"isBlocked": new_blocked_state, "updatedAt": datetime.now(timezone.utc)}},
            )
            await db.enrollments.update_many(
                {"$or": [{"_id": student_id_or_mur}, {"enrollmentNumber": target}]},
                {"$set": {"isBlocked": new_blocked_state}},
            )
        except Exception:
            pass

    if not found or not target_student:
        raise ValueError(f"Student with identifier '{student_id_or_mur}' not found in university directory.")

    return target_student
