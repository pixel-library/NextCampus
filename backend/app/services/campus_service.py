import copy
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId

from backend.app.db.connection import get_database, is_db_connected, IN_MEMORY_LOCATIONS, IN_MEMORY_ROOMS
from backend.app.services import room_service
from backend.app.utils.helpers import serialize_mongo

async def get_all_locations(filter_params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """Retrieve all campus facilities with category and status filters."""
    filter_params = filter_params or {}
    db = get_database()

    if is_db_connected() and db is not None:
        try:
            mongo_filter: Dict[str, Any] = {}
            if filter_params.get("category") and filter_params["category"] != "all":
                mongo_filter["category"] = filter_params["category"]
            if filter_params.get("status") and filter_params["status"] != "all":
                mongo_filter["status"] = filter_params["status"]

            cursor = db.locations.find(mongo_filter).sort("name", 1)
            locs = await cursor.to_list(length=500)
            if locs and len(locs) > 0:
                return serialize_mongo(locs)
        except Exception:
            pass

    results = copy.deepcopy(IN_MEMORY_LOCATIONS)
    if filter_params.get("category") and filter_params["category"] != "all":
        results = [l for l in results if l.get("category") == filter_params["category"]]
    if filter_params.get("status") and filter_params["status"] != "all":
        results = [l for l in results if l.get("status") == filter_params["status"]]

    return serialize_mongo(results)

async def get_location_by_code(code_or_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve building by code or ID."""
    db = get_database()
    loc = None

    if is_db_connected() and db is not None:
        try:
            queries = [{"code": code_or_id}, {"_id": code_or_id}, {"id": code_or_id}]
            try:
                queries.append({"_id": ObjectId(code_or_id)})
            except Exception:
                pass
            loc = await db.locations.find_one({"$or": queries})
            if loc:
                return serialize_mongo(loc)
        except Exception:
            pass

    for l in IN_MEMORY_LOCATIONS:
        if l.get("code") == code_or_id or str(l.get("_id")) == str(code_or_id) or str(l.get("id")) == str(code_or_id):
            return serialize_mongo(copy.deepcopy(l))

    # Fallback to first if available
    if len(IN_MEMORY_LOCATIONS) > 0:
        return serialize_mongo(copy.deepcopy(IN_MEMORY_LOCATIONS[0]))

    return None

async def create_location(location_data: Dict[str, Any]) -> Dict[str, Any]:
    """Register a new building facility in the GIS spatial repository."""
    code = (location_data.get("code") or "").strip().upper()
    name = (location_data.get("name") or "").strip()

    if not code:
        raise ValueError("Building code is required")
    if not name:
        raise ValueError("Building name is required")

    depts = location_data.get("departments") or []
    if isinstance(depts, str):
        depts = [d.strip() for d in depts.split(",") if d.strip()]

    new_id = f"loc_{code.lower().replace('-', '').replace(' ', '_')}_{int(datetime.now().timestamp() * 1000)}"
    formatted = {
        **location_data,
        "_id": new_id,
        "id": new_id,
        "code": code,
        "name": name,
        "totalFloors": int(location_data.get("totalFloors") or 4),
        "grossFloorArea": int(location_data.get("grossFloorArea") or 14200),
        "departments": depts,
        "floors": location_data.get("floors") or [
            {"floorNumber": "Level 2", "name": "Academic Labs", "cadVersion": "CAD v2.0", "roomsCount": 12},
            {"floorNumber": "Level 1", "name": "Lecture Halls", "cadVersion": "CAD v2.0", "roomsCount": 10},
            {"floorNumber": "Ground Floor", "name": "Atrium & Offices", "cadVersion": "CAD v2.0", "roomsCount": 8},
        ],
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
    }

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            await db.locations.insert_one(copy.deepcopy(formatted))
        except Exception:
            pass

    IN_MEMORY_LOCATIONS.append(copy.deepcopy(formatted))
    return serialize_mongo(formatted)

async def update_location(id_or_code: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update building details or GIS coordinates."""
    db = get_database()
    updates = copy.deepcopy(update_data)
    updates["updatedAt"] = datetime.now(timezone.utc)
    updated_doc = None

    if is_db_connected() and db is not None:
        try:
            queries = [{"code": id_or_code}, {"_id": id_or_code}, {"id": id_or_code}]
            try:
                queries.append({"_id": ObjectId(id_or_code)})
            except Exception:
                pass
            await db.locations.update_one({"$or": queries}, {"$set": updates})
            updated_doc = await db.locations.find_one({"$or": queries})
            if updated_doc:
                return serialize_mongo(updated_doc)
        except Exception:
            pass

    for idx, l in enumerate(IN_MEMORY_LOCATIONS):
        if l.get("code") == id_or_code or str(l.get("_id")) == str(id_or_code) or str(l.get("id")) == str(id_or_code):
            IN_MEMORY_LOCATIONS[idx].update(updates)
            return serialize_mongo(copy.deepcopy(IN_MEMORY_LOCATIONS[idx]))

    return None

async def delete_location(id_or_code: str, cascade: bool = False) -> Dict[str, Any]:
    """Delete a building facility safely with dependent-room validation and cascading."""
    building = await get_location_by_code(id_or_code)
    if not building:
        raise ValueError("Building not found")

    b_name = building.get("name")
    b_code = building.get("code")
    b_id = building.get("_id") or building.get("id")

    # Count dependent rooms referencing this building
    dependent_count = 0
    db = get_database()

    if is_db_connected() and db is not None:
        try:
            dependent_count = await db.rooms.count_documents({
                "$or": [{"building": b_name}, {"buildingCode": b_code}]
            })
        except Exception:
            pass

    if dependent_count == 0:
        # Check in memory rooms
        all_rooms = await room_service.get_rooms()
        dependent_count = len([
            r for r in all_rooms
            if r.get("buildingCode") == b_code or r.get("building") == b_name
        ])

    if dependent_count > 0 and not cascade:
        return {
            "success": False,
            "conflict": True,
            "dependentCount": dependent_count,
            "buildingName": b_name,
            "message": f'Cannot delete building "{b_name}": {dependent_count} dependent room(s) are registered in this facility. Please reassign rooms or confirm cascade deletion.',
        }

    # Cascade deletion of rooms if requested
    if dependent_count > 0 and cascade:
        if is_db_connected() and db is not None:
            try:
                await db.rooms.delete_many({
                    "$or": [{"building": b_name}, {"buildingCode": b_code}]
                })
            except Exception:
                pass
        # Clean in-memory rooms
        IN_MEMORY_ROOMS[:] = [
            r for r in IN_MEMORY_ROOMS
            if r.get("buildingCode") != b_code and r.get("building") != b_name
        ]

    # Delete building
    if is_db_connected() and db is not None:
        try:
            queries = [{"code": b_code}, {"_id": b_id}, {"id": b_id}]
            try:
                queries.append({"_id": ObjectId(b_id)})
            except Exception:
                pass
            await db.locations.delete_one({"$or": queries})
        except Exception:
            pass

    IN_MEMORY_LOCATIONS[:] = [
        l for l in IN_MEMORY_LOCATIONS
        if l.get("code") != b_code and str(l.get("_id")) != str(b_id) and str(l.get("id")) != str(b_id)
    ]

    return {
        "success": True,
        "deleted": True,
        "message": f'Building "{b_name}" and {dependent_count if cascade else 0} dependent records successfully removed.',
        "deletedRooms": dependent_count if cascade else 0,
    }
