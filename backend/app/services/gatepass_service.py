import copy
from datetime import datetime, timezone
import random
import string
from typing import Any, Dict, List, Optional
from bson import ObjectId

from backend.app.db.connection import get_database, is_db_connected, IN_MEMORY_GATE_PASSES
from backend.app.schemas.gatepass import GatePassApply, GatePassReview
from backend.app.utils.helpers import serialize_mongo

def _generate_pass_id() -> str:
    rand = "".join(random.choices(string.digits, k=4))
    return f"GP-2026-{rand}"

async def apply_gate_pass(current_user: Dict[str, Any], pass_data: GatePassApply) -> Dict[str, Any]:
    """Student applies for an out-campus gate pass with auto-filled profile credentials."""
    user_id = str(current_user.get("id") or current_user.get("_id") or "")
    user_email = current_user.get("email", "").lower()

    full_user = None
    from backend.app.db.connection import IN_MEMORY_USERS
    for u in IN_MEMORY_USERS:
        if str(u.get("id") or u.get("_id")) == user_id or u.get("email", "").lower() == user_email:
            full_user = u
            break

    db = get_database()
    if not full_user and is_db_connected() and db is not None:
        try:
            full_user = await db.users.find_one({"$or": [{"_id": user_id}, {"id": user_id}, {"email": user_email}]})
        except Exception:
            pass

    user_profile = full_user or current_user

    student_id = str(user_profile.get("id") or user_profile.get("_id") or user_id or "usr_unknown")
    student_name = user_profile.get("name") or user_profile.get("preferredName") or "Student"
    enrollment = (user_profile.get("enrollmentNumber") or user_profile.get("studentId") or "MUR2500000").strip().upper()
    department = user_profile.get("department") or "Department of Computer Science & Engineering"
    course = user_profile.get("course") or department
    phone = user_profile.get("phone") or "+91 98000 00000"
    emergency = pass_data.emergencyContact or user_profile.get("emergencyContact") or ""


    pass_code = _generate_pass_id()
    now_utc = datetime.now(timezone.utc)
    record_id = f"gp_{int(now_utc.timestamp() * 1000)}"

    new_pass = {
        "_id": record_id,
        "id": record_id,
        "passCode": pass_code,
        "studentId": student_id,
        "studentName": student_name,
        "enrollmentNumber": enrollment,
        "department": department,
        "course": course,
        "phone": phone,
        "destination": pass_data.destination.strip(),
        "reason": pass_data.reason.strip(),
        "outTime": pass_data.outTime,
        "expectedInTime": pass_data.expectedInTime,
        "emergencyContact": emergency,
        "status": "PENDING",
        "approvedBy": None,
        "adminRemarks": None,
        "reviewedAt": None,
        "qrCodeData": f"NEXTCAMPUS:GATEPASS:{pass_code}:{enrollment}:PENDING",
        "createdAt": now_utc,
        "updatedAt": now_utc,
    }

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            await db.gate_passes.insert_one(copy.deepcopy(new_pass))
        except Exception:
            pass

    IN_MEMORY_GATE_PASSES.insert(0, copy.deepcopy(new_pass))
    return serialize_mongo(new_pass)

async def get_student_gate_passes(student_id: str, enrollment_number: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all gate pass records for a specific student."""
    db = get_database()
    if is_db_connected() and db is not None:
        try:
            or_conditions = [{"studentId": student_id}]
            if enrollment_number:
                or_conditions.append({"enrollmentNumber": enrollment_number.upper()})
            cursor = db.gate_passes.find({"$or": or_conditions}).sort("createdAt", -1)
            docs = await cursor.to_list(length=100)
            if docs:
                return serialize_mongo(docs)
        except Exception:
            pass

    results = []
    for gp in IN_MEMORY_GATE_PASSES:
        if gp.get("studentId") == student_id or (enrollment_number and gp.get("enrollmentNumber", "").upper() == enrollment_number.upper()):
            results.append(copy.deepcopy(gp))

    # Sort descending by createdAt
    results.sort(key=lambda x: str(x.get("createdAt", "")), reverse=True)
    return serialize_mongo(results)

async def get_all_gate_passes(status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all gate passes across campus for administration."""
    db = get_database()
    if is_db_connected() and db is not None:
        try:
            query = {}
            if status_filter and status_filter.upper() != "ALL":
                query["status"] = status_filter.upper()
            cursor = db.gate_passes.find(query).sort("createdAt", -1)
            docs = await cursor.to_list(length=200)
            if docs:
                return serialize_mongo(docs)
        except Exception:
            pass

    results = []
    for gp in IN_MEMORY_GATE_PASSES:
        if status_filter and status_filter.upper() != "ALL":
            if gp.get("status", "").upper() != status_filter.upper():
                continue
        results.append(copy.deepcopy(gp))

    results.sort(key=lambda x: str(x.get("createdAt", "")), reverse=True)
    return serialize_mongo(results)

async def get_pending_gate_passes() -> List[Dict[str, Any]]:
    """Retrieve only pending gate pass appeals awaiting administrative action."""
    return await get_all_gate_passes(status_filter="PENDING")

async def review_gate_pass(pass_id: str, admin_user: Dict[str, Any], review_data: GatePassReview) -> Dict[str, Any]:
    """Admin or warden reviews, approves, or rejects an out-pass appeal."""
    action = review_data.action.upper()
    if action not in ["APPROVE", "REJECT"]:
        raise ValueError("Action must be APPROVE or REJECT.")

    new_status = "APPROVED" if action == "APPROVE" else "REJECTED"
    now_utc = datetime.now(timezone.utc)
    admin_name = admin_user.get("name") or admin_user.get("preferredName") or "Campus Administrator"

    updated_record = None

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            pass_doc = await db.gate_passes.find_one({"$or": [{"_id": pass_id}, {"id": pass_id}, {"passCode": pass_id}]})
            if pass_doc:
                pass_code = pass_doc.get("passCode", pass_id)
                enrollment = pass_doc.get("enrollmentNumber", "")
                qr_status = "APPROVED" if new_status == "APPROVED" else "REJECTED"
                qr_code = f"NEXTCAMPUS:GATEPASS:{pass_code}:{enrollment}:{qr_status}"

                update_fields = {
                    "status": new_status,
                    "approvedBy": admin_name,
                    "adminRemarks": review_data.remarks or ("Approved by administration." if new_status == "APPROVED" else "Request rejected."),
                    "reviewedAt": now_utc,
                    "updatedAt": now_utc,
                    "qrCodeData": qr_code,
                }
                await db.gate_passes.update_one({"_id": pass_doc["_id"]}, {"$set": update_fields})
                pass_doc.update(update_fields)
                updated_record = pass_doc
        except Exception:
            pass

    # Update in-memory store
    for gp in IN_MEMORY_GATE_PASSES:
        if gp.get("id") == pass_id or gp.get("_id") == pass_id or gp.get("passCode") == pass_id:
            pass_code = gp.get("passCode", pass_id)
            enrollment = gp.get("enrollmentNumber", "")
            qr_status = "APPROVED" if new_status == "APPROVED" else "REJECTED"
            gp["status"] = new_status
            gp["approvedBy"] = admin_name
            gp["adminRemarks"] = review_data.remarks or ("Approved by administration." if new_status == "APPROVED" else "Request rejected.")
            gp["reviewedAt"] = now_utc
            gp["updatedAt"] = now_utc
            gp["qrCodeData"] = f"NEXTCAMPUS:GATEPASS:{pass_code}:{enrollment}:{qr_status}"
            if not updated_record:
                updated_record = copy.deepcopy(gp)
            break

    if not updated_record:
        raise ValueError(f"Gate pass with identifier '{pass_id}' was not found.")

    return serialize_mongo(updated_record)
