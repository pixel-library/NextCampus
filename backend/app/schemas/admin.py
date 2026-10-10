from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class PopulationStats(BaseModel):
    total: int
    students: int
    faculty: int
    staff: int

class RoomStats(BaseModel):
    total: int
    inUse: int
    available: int
    utilizationRate: float

class ComplaintStats(BaseModel):
    total: int
    active: int
    inDispatch: int
    avgSlaDays: float

class ProjectStats(BaseModel):
    total: int
    openRoles: int

class AdminStatsResponse(BaseModel):
    population: PopulationStats
    rooms: RoomStats
    complaints: ComplaintStats
    projects: ProjectStats
    announcements: List[Dict[str, Any]]
