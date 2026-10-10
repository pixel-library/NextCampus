from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field

class LocationCreate(BaseModel):
    name: str = Field(..., min_length=1)
    code: str = Field(..., min_length=1)
    category: str = "academic"
    precinct: Optional[str] = "North Quadrangle"
    totalFloors: Optional[int] = 4
    departments: Optional[Union[List[str], str]] = None
    grossFloorArea: Optional[int] = 14200
    cadSchema: Optional[str] = "Auto-Import from Revit Cloud (IFC4)"
    commissionedYear: Optional[int] = 2021
    powerSubstation: Optional[str] = "West 11kV"
    loadPercentage: Optional[int] = 75
    description: Optional[str] = ""
    coordinates: Optional[Dict[str, Any]] = None
    openingHours: Optional[str] = "07:30 AM - 10:00 PM"
    contactEmail: Optional[str] = ""
    contactPhone: Optional[str] = ""
    status: Optional[str] = "open"
    image: Optional[str] = ""
    floors: Optional[List[Dict[str, Any]]] = None

class LocationUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    category: Optional[str] = None
    precinct: Optional[str] = None
    totalFloors: Optional[int] = None
    departments: Optional[Union[List[str], str]] = None
    grossFloorArea: Optional[int] = None
    cadSchema: Optional[str] = None
    commissionedYear: Optional[int] = None
    powerSubstation: Optional[str] = None
    loadPercentage: Optional[int] = None
    description: Optional[str] = None
    coordinates: Optional[Dict[str, Any]] = None
    openingHours: Optional[str] = None
    contactEmail: Optional[str] = None
    contactPhone: Optional[str] = None
    status: Optional[str] = None
    image: Optional[str] = None
    floors: Optional[List[Dict[str, Any]]] = None

class LocationDeleteRequest(BaseModel):
    cascade: Optional[bool] = False
