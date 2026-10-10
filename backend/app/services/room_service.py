import copy
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId

from backend.app.db.connection import get_database, is_db_connected, IN_MEMORY_ROOMS
from backend.app.utils.helpers import serialize_mongo

async def get_rooms(filter_params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """Retrieve all SmartRooms with optional filtering by building, floor, and status."""
    filter_params = filter_params or {}
    db = get_database()

    if is_db_connected() and db is not None:
        try:
            mongo_filter: Dict[str, Any] = {}
            if filter_params.get("building") and filter_params["building"] != "all":
                q = filter_params["building"]
                mongo_filter["$or"] = [
                    {"building": {"$regex": q, "$options": "i"}},
                    {"buildingCode": {"$regex": q, "$options": "i"}},
                ]
            if filter_params.get("floor") and filter_params["floor"] != "all":
                mongo_filter["floor"] = {"$regex": f"^{re.escape(filter_params['floor'])}$", "$options": "i"}
            if filter_params.get("status") and filter_params["status"] != "all":
                mongo_filter["status"] = filter_params["status"]

            cursor = db.rooms.find(mongo_filter).sort("roomNumber", 1)
            rooms = await cursor.to_list(length=500)
            if rooms and len(rooms) > 0:
                return serialize_mongo(rooms)
        except Exception:
            pass

    # In-memory fallback
    results = copy.deepcopy(IN_MEMORY_ROOMS)
    if filter_params.get("building") and filter_params["building"] != "all":
        q = filter_params["building"].lower()
        results = [
            r for r in results
            if q in r.get("building", "").lower() or (r.get("buildingCode") and q in r.get("buildingCode", "").lower())
        ]
    if filter_params.get("floor") and filter_params["floor"] != "all":
        fl = filter_params["floor"].lower()
        results = [r for r in results if r.get("floor", "").lower() == fl]
    if filter_params.get("status") and filter_params["status"] != "all":
        results = [r for r in results if r.get("status") == filter_params["status"]]

    return serialize_mongo(results)

async def get_room_by_id(room_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve room by ID or room number."""
    db = get_database()
    room = None

    if is_db_connected() and db is not None:
        try:
            queries = [{"_id": room_id}, {"id": room_id}, {"roomNumber": room_id}]
            try:
                queries.append({"_id": ObjectId(room_id)})
            except Exception:
                pass
            room = await db.rooms.find_one({"$or": queries})
            if room:
                return serialize_mongo(room)
        except Exception:
            pass

    for r in IN_MEMORY_ROOMS:
        if str(r.get("_id")) == str(room_id) or str(r.get("id")) == str(room_id) or r.get("roomNumber") == room_id:
            return serialize_mongo(copy.deepcopy(r))

    return None

async def create_room(room_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new SmartRoom record."""
    room_number = (room_data.get("roomNumber") or "").strip().upper()
    building = (room_data.get("building") or "").strip()
    capacity = room_data.get("capacity")

    if not room_number:
        raise ValueError("Room Number is required")
    if not building:
        raise ValueError("Building is required")
    if capacity is None or int(capacity) <= 0:
        raise ValueError("Valid seating capacity is required")

    features = room_data.get("features") or room_data.get("equipment") or []
    if isinstance(features, str):
        features = [f.strip() for f in features.split(",") if f.strip()]

    new_id = f"rm_{room_number.lower().replace('-', '').replace(' ', '_')}_{int(datetime.now().timestamp() * 1000)}"
    formatted = {
        **room_data,
        "_id": new_id,
        "id": new_id,
        "roomNumber": room_number,
        "building": building,
        "capacity": int(capacity),
        "features": features,
        "status": room_data.get("status") or "available",
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
    }

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            await db.rooms.insert_one(copy.deepcopy(formatted))
        except Exception:
            pass

    IN_MEMORY_ROOMS.append(copy.deepcopy(formatted))
    return serialize_mongo(formatted)

async def update_room_status(room_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update room status, capacity, or equipment details."""
    db = get_database()
    updates = copy.deepcopy(update_data)
    updates["updatedAt"] = datetime.now(timezone.utc)
    updated_doc = None

    if is_db_connected() and db is not None:
        try:
            queries = [{"_id": room_id}, {"id": room_id}, {"roomNumber": room_id}]
            try:
                queries.append({"_id": ObjectId(room_id)})
            except Exception:
                pass
            await db.rooms.update_one({"$or": queries}, {"$set": updates})
            updated_doc = await db.rooms.find_one({"$or": queries})
            if updated_doc:
                return serialize_mongo(updated_doc)
        except Exception:
            pass

    for idx, r in enumerate(IN_MEMORY_ROOMS):
        if str(r.get("_id")) == str(room_id) or str(r.get("id")) == str(room_id) or r.get("roomNumber") == room_id:
            IN_MEMORY_ROOMS[idx].update(updates)
            return serialize_mongo(copy.deepcopy(IN_MEMORY_ROOMS[idx]))

    return None

async def delete_room(room_id: str) -> Dict[str, Any]:
    """Delete room by ID or room number."""
    db = get_database()
    target_num = room_id

    if is_db_connected() and db is not None:
        try:
            queries = [{"_id": room_id}, {"id": room_id}, {"roomNumber": room_id}]
            try:
                queries.append({"_id": ObjectId(room_id)})
            except Exception:
                pass
            found = await db.rooms.find_one({"$or": queries})
            if found:
                target_num = found.get("roomNumber", room_id)
            await db.rooms.delete_one({"$or": queries})
        except Exception:
            pass

    global IN_MEMORY_ROOMS
    target = None
    for r in IN_MEMORY_ROOMS:
        if str(r.get("_id")) == str(room_id) or str(r.get("id")) == str(room_id) or r.get("roomNumber") == room_id:
            target = r
            target_num = r.get("roomNumber", room_id)
            break

    IN_MEMORY_ROOMS[:] = [
        r for r in IN_MEMORY_ROOMS
        if str(r.get("_id")) != str(room_id) and str(r.get("id")) != str(room_id) and r.get("roomNumber") != room_id
    ]

    return {
        "success": True,
        "message": f"Room {target_num} deleted successfully.",
    }
