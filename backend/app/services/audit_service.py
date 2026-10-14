from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import uuid
from backend.app.db.connection import get_database, IN_MEMORY_AUDIT_LOGS
from backend.app.core.logging import logger

async def record_audit_log(
    action: str,
    target_scope: str,
    user: Dict[str, Any],
    status: str = "success",
    previous_version: Optional[int] = None,
    new_version: Optional[int] = None,
    details: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Record an immutable administrative change in audit log."""
    db = get_database()
    log_entry = {
        "_id": f"audit_{uuid.uuid4().hex[:12]}",
        "id": f"audit_{uuid.uuid4().hex[:12]}",
        "action": action,
        "targetScope": target_scope,
        "previousVersion": previous_version,
        "newVersion": new_version,
        "userEmail": user.get("email") or "system@nextcampus.edu",
        "userName": user.get("name") or "Administrator",
        "userRole": user.get("role") or "admin",
        "status": status,
        "details": details or {},
        "timestamp": datetime.now(timezone.utc),
    }

    # Store in memory
    IN_MEMORY_AUDIT_LOGS.insert(0, log_entry)

    if db is not None:
        try:
            await db.audit_logs.insert_one(dict(log_entry))
        except Exception as e:
            logger.warning(f"[Audit Log Warning] Could not persist to DB: {e}")

    logger.info(f"[Audit Log] Action: {action} on {target_scope} by {log_entry['userEmail']} ({status})")
    return log_entry

async def get_audit_logs(limit: int = 50, action_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve recent administrative audit logs."""
    db = get_database()
    if db is not None:
        try:
            query = {}
            if action_filter:
                query["action"] = action_filter
            cursor = db.audit_logs.find(query).sort("timestamp", -1).limit(limit)
            results = []
            async for doc in cursor:
                doc["id"] = str(doc.get("_id", doc.get("id", "")))
                results.append(doc)
            if results:
                return results
        except Exception as e:
            logger.warning(f"[Audit Log Query Fallback]: {e}")

    # Fallback to in-memory
    filtered = IN_MEMORY_AUDIT_LOGS
    if action_filter:
        filtered = [l for l in filtered if l.get("action") == action_filter]
    return filtered[:limit]
