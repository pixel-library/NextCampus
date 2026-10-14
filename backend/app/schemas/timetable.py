from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class TimetableEntry(BaseModel):
    id: Optional[str] = None
    department: str = Field(default="Computer Science & Engineering", description="Department e.g. Computer Science & Engineering")
    course: str = Field(default="B.Tech CSE", description="Course e.g. B.Tech CSE")
    semester: int = Field(default=3, ge=1, le=8, description="Semester 1 to 8")
    section: str = Field(default="A", description="Section e.g. A, B")

    dayOfWeek: str = Field(..., description="Day e.g. Monday, Tuesday")
    subject: str = Field(..., description="Subject name")
    subjectCode: str = Field(..., description="Subject code e.g. CS301")
    startTime: str = Field(..., description="Start time HH:MM (24h) e.g. 09:30")
    endTime: str = Field(..., description="End time HH:MM (24h) e.g. 10:30")
    faculty: str = Field(..., description="Instructor name")
    room: str = Field(..., description="Classroom / Lab e.g. Room B-204")
    building: str = Field(default="Faculty of Engineering & Technology (ENG-02)", description="Building")
    effectiveFrom: Optional[str] = Field(default="2026-08-01", description="Effective start date YYYY-MM-DD")
    effectiveUntil: Optional[str] = Field(default="2026-12-31", description="Effective end date YYYY-MM-DD")
    version: int = Field(default=1, description="Version number")
    status: str = Field(default="published", description="published | archived | draft")
    publishedBy: Optional[str] = None
    publishedAt: Optional[datetime] = None

class TimetableScope(BaseModel):
    department: str
    semester: int
    section: Optional[str] = "A"
    effectiveFrom: Optional[str] = None

class TimetableUploadPreviewRequest(BaseModel):
    department: str
    semester: int
    section: Optional[str] = "A"
    effectiveFrom: Optional[str] = None
    fileBase64: Optional[str] = None
    fileName: Optional[str] = None
    csvText: Optional[str] = None
    naturalLanguageInstruction: Optional[str] = None

class TimetablePublishRequest(BaseModel):
    department: str
    semester: int
    section: Optional[str] = "A"
    effectiveFrom: Optional[str] = None
    entries: List[TimetableEntry]
    confirm: bool = Field(..., description="Explicit administrator confirmation")
    changeNotes: Optional[str] = None

class TimetableRollbackRequest(BaseModel):
    department: str
    semester: int
    section: Optional[str] = "A"
    targetVersion: int
    confirm: bool = True
