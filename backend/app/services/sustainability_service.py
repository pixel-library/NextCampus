import copy
from typing import Any, Dict, List
from backend.app.db.connection import get_database, is_db_connected, IN_MEMORY_METRICS
from backend.app.utils.helpers import serialize_mongo

async def get_metrics() -> List[Dict[str, Any]]:
    """Retrieve campus environmental and microgrid sustainability metrics."""
    db = get_database()
    if is_db_connected() and db is not None:
        try:
            cursor = db.sustainabilities.find().sort("metricName", 1)
            records = await cursor.to_list(length=50)
            if records and len(records) > 0:
                return serialize_mongo(records)
        except Exception:
            pass

    return serialize_mongo(copy.deepcopy(IN_MEMORY_METRICS))

async def get_sustainability_metrics() -> Dict[str, Any]:
    """Retrieve aggregated sustainability KPI summary dashboard."""
    metrics = await get_metrics()
    return {
        "overallScore": 78,
        "energyUsage": 12450,
        "waterSaved": 8230,
        "wasteDiverted": 480,
        "carbonOffset": 88.8,
        "metrics": metrics,
    }
