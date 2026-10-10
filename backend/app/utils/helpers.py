from datetime import datetime, timezone
from typing import Any, Dict, Optional
from bson import ObjectId
from fastapi.responses import JSONResponse

def serialize_mongo(obj: Any) -> Any:
    """Recursively convert BSON ObjectIds and datetimes into JSON-serializable primitives."""
    if obj is None:
        return None
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, list):
        return [serialize_mongo(item) for item in obj]
    if isinstance(obj, dict):
        result = {}
        for k, v in obj.items():
            if k == "_id":
                result["_id"] = str(v)
                if "id" not in obj:
                    result["id"] = str(v)
            else:
                result[k] = serialize_mongo(v)
        # Ensure id is present if _id was present
        if "_id" in result and "id" not in result:
            result["id"] = result["_id"]
        return result
    return obj

def sanitize_user(user_doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Sanitize user document: remove password, internal fields, and ensure id field exists."""
    if not user_doc:
        return None
    doc = serialize_mongo(user_doc)
    doc.pop("password", None)
    doc.pop("__v", None)
    if "_id" in doc and "id" not in doc:
        doc["id"] = str(doc["_id"])
    return doc

def sanitize_complaint_for_student(complaint_doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Sanitize complaint: strictly omit internalNotes for non-admin/non-staff students."""
    if not complaint_doc:
        return None
    doc = serialize_mongo(complaint_doc)
    doc.pop("internalNotes", None)
    return doc

def send_response(
    status_code: int = 200,
    success: bool = True,
    message: str = "",
    data: Any = None,
    meta: Any = None,
) -> JSONResponse:
    """Standardized REST API response envelope matching Express sendResponse helper."""
    payload = {
        "success": success,
        "message": message,
        "data": serialize_mongo(data),
        "meta": serialize_mongo(meta),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    return JSONResponse(status_code=status_code, content=payload)
