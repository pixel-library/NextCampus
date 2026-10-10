from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field

class RoomCreate(BaseModel):
    roomNumber: str = Field(..., min_length=1)
    building: str = Field(..., min_length=1)
    capacity: int = Field(..., gt=0)
    name: Optional[str] = ""
    buildingCode: Optional[str] = ""
    floor: Optional[str] = "Level 2"
    type: Optional[str] = "Multi-Media Theatre"
    currentOccupancy: Optional[int] = 0
    temperature: Optional[float] = 22.0
    lightingStatus: Optional[str] = "on"
    status: Optional[str] = "available"
    features: Optional[Union[List[str], str]] = None
    equipment: Optional[Union[List[str], str]] = None
    timetableRule: Optional[str] = "Automated live lock sync via University Timetable Core API"
    schedule: Optional[List[Dict[str, Any]]] = None

class RoomUpdate(BaseModel):
    roomNumber: Optional[str] = None
    building: Optional[str] = None
    capacity: Optional[int] = None
    name: Optional[str] = None
    buildingCode: Optional[str] = None
    floor: Optional[str] = None
    type: Optional[str] = None
    currentOccupancy: Optional[int] = None
    temperature: Optional[float] = None
    lightingStatus: Optional[str] = None
    status: Optional[str] = None
    features: Optional[Union[List[str], str]] = None
    equipment: Optional[Union[List[str], str]] = None
    timetableRule: Optional[str] = None
    schedule: Optional[List[Dict[str, Any]]] = None
