import copy
import random
import string
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from bson import ObjectId

from backend.app.core.security import hash_password, verify_password, generate_token
from backend.app.db.connection import get_database, is_db_connected, IN_MEMORY_USERS
from backend.app.utils.helpers import sanitize_user, serialize_mongo

def _generate_user_id() -> str:
    rand = "".join(random.choices(string.ascii_lowercase + string.digits, k=4))
    return f"usr_{int(datetime.now().timestamp() * 1000)}_{rand}"

async def register_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Register a new student account with secure password hashing and strict role isolation."""
    name = (user_data.get("name") or "").strip()
    email = (user_data.get("email") or "").strip().lower()
    password = user_data.get("password") or ""
    student_id = (user_data.get("studentId") or "").strip()
    department = (user_data.get("department") or "").strip()
    academic_year = user_data.get("academicYear") or "Class of 2028"
    preferred_name = (user_data.get("preferredName") or "").strip()

    if not name or not email or not password:
        raise ValueError("Name, email, and password are required fields.")

    if len(password) < 6:
        raise ValueError("Password must be at least 6 characters long.")

    db = get_database()
    # Check email uniqueness in DB
    if is_db_connected() and db is not None:
        try:
            existing = await db.users.find_one({"email": email})
            if existing:
                raise ValueError("User with this email already exists.")
        except ValueError:
            raise
        except Exception:
            pass

    # Check email uniqueness in memory store
    for u in IN_MEMORY_USERS:
        if u.get("email", "").lower() == email:
            raise ValueError("User with this email already exists.")

    hashed_pw = hash_password(password)

    # CRITICAL SECURITY: Force role to 'student'. Never allow self-promotion to admin
    assigned_role = "student"
    new_id = _generate_user_id()

    new_user_record = {
        "_id": new_id,
        "id": new_id,
        "name": name,
        "preferredName": preferred_name if preferred_name else name.split(" ")[0],
        "email": email,
        "password": hashed_pw,
        "role": assigned_role,
        "studentId": student_id if student_id else f"STU-{datetime.now().year}-{random.randint(1000, 9999)}",
        "department": department if department else "Computer Science & Engineering",
        "academicYear": academic_year,
        "semester": "1st Year • Semester 1",
        "bio": "",
        "phone": "",
        "residence": "",
        "emergencyContact": "",
        "skills": [],
        "societies": [],
        "preferences": {
            "notifications": {
                "scheduleAlerts": True,
                "careUpdates": True,
                "ecoDigests": False,
                "skillInvites": True,
                "emergencyBroadcasts": True,
            },
            "accessibility": {
                "highContrast": False,
                "reduceMotion": False,
                "screenReader": False,
                "textScale": "Default (100%)",
                "themePreset": "Dark Licorice",
            },
            "privacy": {
                "skillCampusVisible": True,
                "directoryVisible": False,
            },
            "twoFactorEnabled": False,
            "notificationsEnabled": True,
            "darkTheme": True,
            "emailAlerts": True,
        },
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
    }

    saved_user = new_user_record

    if is_db_connected() and db is not None:
        try:
            await db.users.insert_one(copy.deepcopy(new_user_record))
            saved_user = new_user_record
        except Exception:
            pass

    # Save to in-memory store
    IN_MEMORY_USERS.insert(0, copy.deepcopy(new_user_record))

    sanitized = sanitize_user(saved_user)
    token = generate_token({
        "id": sanitized["id"],
        "role": sanitized["role"],
        "email": sanitized["email"],
    })

    return {
        "user": sanitized,
        "token": token,
    }

async def login_user(email_or_id: str, password: str) -> Dict[str, Any]:
    """Authenticate existing user by email or student ID."""
    if not email_or_id or not password:
        raise ValueError("Email and password credentials are required.")

    query = email_or_id.strip().lower()
    user = None

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            user = await db.users.find_one({
                "$or": [{"email": query}, {"studentId": email_or_id.strip()}]
            })
        except Exception:
            pass

    if not user:
        for u in IN_MEMORY_USERS:
            if u.get("email", "").lower() == query or (u.get("studentId") and u.get("studentId", "").lower() == query):
                user = copy.deepcopy(u)
                break

    if not user:
        raise ValueError("Invalid credentials provided.")

    if not verify_password(password, user.get("password", "")):
        raise ValueError("Invalid credentials provided.")

    sanitized = sanitize_user(user)
    token = generate_token({
        "id": sanitized["id"],
        "role": sanitized["role"],
        "email": sanitized["email"],
    })

    return {
        "user": sanitized,
        "token": token,
    }

async def get_current_user(user_id: str) -> Dict[str, Any]:
    """Retrieve current user profile details."""
    user = None
    db = get_database()

    if is_db_connected() and db is not None:
        try:
            # Query by string or ObjectId
            try:
                oid = ObjectId(user_id)
                user = await db.users.find_one({"$or": [{"_id": user_id}, {"_id": oid}, {"id": user_id}]})
            except Exception:
                user = await db.users.find_one({"$or": [{"_id": user_id}, {"id": user_id}]})
        except Exception:
            pass

    if not user:
        for u in IN_MEMORY_USERS:
            if str(u.get("_id")) == str(user_id) or str(u.get("id")) == str(user_id):
                user = copy.deepcopy(u)
                break

    if not user:
        raise ValueError("User account not found.")

    return {
        "user": sanitize_user(user)
    }

async def update_profile(target_user_id: str, update_data: Dict[str, Any], requester_role: str) -> Dict[str, Any]:
    """Update student profile and preference configuration safely."""
    user = None
    db = get_database()
    mem_index = -1

    if is_db_connected() and db is not None:
        try:
            try:
                oid = ObjectId(target_user_id)
                user = await db.users.find_one({"$or": [{"_id": target_user_id}, {"_id": oid}, {"id": target_user_id}]})
            except Exception:
                user = await db.users.find_one({"$or": [{"_id": target_user_id}, {"id": target_user_id}]})
        except Exception:
            pass

    for idx, u in enumerate(IN_MEMORY_USERS):
        if str(u.get("_id")) == str(target_user_id) or str(u.get("id")) == str(target_user_id):
            mem_index = idx
            if not user:
                user = copy.deepcopy(u)
            break

    if not user:
        raise ValueError("User profile record not found.")

    # Disallow unauthorized role changes
    if update_data.get("role") and update_data["role"] != user.get("role") and requester_role != "admin":
        raise ValueError("Unauthorized: Only system administrators may alter account roles.")

    allowed_fields = [
        "name",
        "preferredName",
        "phone",
        "residence",
        "emergencyContact",
        "bio",
        "department",
        "academicYear",
        "semester",
        "skills",
        "societies",
        "preferences",
    ]

    updates: Dict[str, Any] = {}
    for key in allowed_fields:
        if key in update_data and update_data[key] is not None:
            if key == "preferences" and isinstance(update_data[key], dict):
                current_prefs = user.get("preferences", {})
                new_prefs = copy.deepcopy(current_prefs)
                new_prefs.update(update_data["preferences"])

                # Deep merge notifications, accessibility, privacy
                if "notifications" in update_data["preferences"]:
                    notifs = copy.deepcopy(current_prefs.get("notifications", {}))
                    notifs.update(update_data["preferences"]["notifications"])
                    # Emergency broadcasts are mandatory and cannot be disabled
                    notifs["emergencyBroadcasts"] = True
                    new_prefs["notifications"] = notifs

                if "accessibility" in update_data["preferences"]:
                    access = copy.deepcopy(current_prefs.get("accessibility", {}))
                    access.update(update_data["preferences"]["accessibility"])
                    new_prefs["accessibility"] = access

                if "privacy" in update_data["preferences"]:
                    priv = copy.deepcopy(current_prefs.get("privacy", {}))
                    priv.update(update_data["preferences"]["privacy"])
                    new_prefs["privacy"] = priv

                updates["preferences"] = new_prefs
            else:
                updates[key] = update_data[key]

    updates["updatedAt"] = datetime.now(timezone.utc)

    updated_doc = None
    if is_db_connected() and db is not None:
        try:
            try:
                oid = ObjectId(target_user_id)
                query = {"$or": [{"_id": target_user_id}, {"_id": oid}, {"id": target_user_id}]}
            except Exception:
                query = {"$or": [{"_id": target_user_id}, {"id": target_user_id}]}
            await db.users.update_one(query, {"$set": updates})
            updated_doc = await db.users.find_one(query)
        except Exception:
            pass

    if mem_index != -1:
        IN_MEMORY_USERS[mem_index].update(updates)
        if not updated_doc:
            updated_doc = IN_MEMORY_USERS[mem_index]
    elif not updated_doc:
        updated_doc = {**user, **updates}

    return {
        "user": sanitize_user(updated_doc)
    }

async def change_password(user_id: str, current_password: str, new_password: str) -> Dict[str, Any]:
    """Change master password with current password verification."""
    if not current_password or not new_password:
        raise ValueError("Both current and new passwords are required.")

    if len(new_password) < 6:
        raise ValueError("New password must be at least 6 characters long.")

    user = None
    db = get_database()
    mem_index = -1

    if is_db_connected() and db is not None:
        try:
            try:
                oid = ObjectId(user_id)
                user = await db.users.find_one({"$or": [{"_id": user_id}, {"_id": oid}, {"id": user_id}]})
            except Exception:
                user = await db.users.find_one({"$or": [{"_id": user_id}, {"id": user_id}]})
        except Exception:
            pass

    for idx, u in enumerate(IN_MEMORY_USERS):
        if str(u.get("_id")) == str(user_id) or str(u.get("id")) == str(user_id):
            mem_index = idx
            if not user:
                user = copy.deepcopy(u)
            break

    if not user:
        raise ValueError("User account not found.")

    if not verify_password(current_password, user.get("password", "")):
        raise ValueError("Current password does not match records.")

    new_hashed = hash_password(new_password)
    now = datetime.now(timezone.utc)

    if is_db_connected() and db is not None:
        try:
            try:
                oid = ObjectId(user_id)
                query = {"$or": [{"_id": user_id}, {"_id": oid}, {"id": user_id}]}
            except Exception:
                query = {"$or": [{"_id": user_id}, {"id": user_id}]}
            await db.users.update_one(query, {"$set": {"password": new_hashed, "updatedAt": now}})
        except Exception:
            pass

    if mem_index != -1:
        IN_MEMORY_USERS[mem_index]["password"] = new_hashed
        IN_MEMORY_USERS[mem_index]["updatedAt"] = now

    return {
        "success": True,
        "message": "Master password updated securely.",
    }
