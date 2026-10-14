from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class MealItems(BaseModel):
    items: List[str] = Field(default_factory=list)
    timings: Optional[str] = None

class MessDayMenu(BaseModel):
    id: Optional[str] = None
    facility: str = Field(default="Central Mess / Aravalli & Meera Bai Dining Hall")
    date: str = Field(..., description="Date YYYY-MM-DD")
    dayOfWeek: str = Field(..., description="Day e.g. Monday")
    breakfast: MealItems
    lunch: MealItems
    snacks: MealItems
    dinner: MealItems
    specialNote: Optional[str] = None
    version: int = Field(default=1)
    status: str = Field(default="published", description="published | archived | draft")
    publishedBy: Optional[str] = None
    publishedAt: Optional[datetime] = None

class MessUploadPreviewRequest(BaseModel):
    facility: Optional[str] = "Central Mess / Aravalli & Meera Bai Dining Hall"
    effectiveFrom: Optional[str] = None
    fileBase64: Optional[str] = None
    fileName: Optional[str] = None
    csvText: Optional[str] = None
    naturalLanguageInstruction: Optional[str] = None

class MessPublishRequest(BaseModel):
    facility: Optional[str] = "Central Mess / Aravalli & Meera Bai Dining Hall"
    menus: List[MessDayMenu]
    confirm: bool = Field(..., description="Explicit administrator confirmation")
    changeNotes: Optional[str] = None

class MessRollbackRequest(BaseModel):
    facility: Optional[str] = "Central Mess / Aravalli & Meera Bai Dining Hall"
    targetVersion: int
    confirm: bool = True
