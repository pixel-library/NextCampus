from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field

class ComplaintCreate(BaseModel):
    title: str = Field(..., min_length=1)
    category: str = "other"
    description: str = Field(..., min_length=1)
    location: Optional[str] = None
    building: Optional[str] = None
    buildingName: Optional[str] = None
    roomNumber: Optional[str] = None
    priority: Optional[str] = "medium"
    authorName: Optional[str] = None
    studentId: Optional[str] = None
    attachments: Optional[Union[List[str], str]] = None

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    message: Optional[str] = None
    priority: Optional[str] = None

class AssignStaffRequest(BaseModel):
    assignedTo: Optional[str] = None
    assignedToName: str = Field(..., min_length=1)

class PublicUpdateRequest(BaseModel):
    message: str = Field(..., min_length=1)

class InternalNoteRequest(BaseModel):
    note: str = Field(..., min_length=1)

class ComplaintReviewRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = ""
    tags: Optional[List[str]] = []

