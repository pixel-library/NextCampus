from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class MetricItem(BaseModel):
    metricName: str
    category: str
    value: float
    unit: str
    trendPercentage: Optional[float] = 0.0
    status: Optional[str] = "optimal"
