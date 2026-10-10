from typing import List, Optional
from pydantic import BaseModel, Field

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1)
    category: Optional[str] = "Robotics"
    description: str = Field(..., min_length=1)
    tags: Optional[List[str]] = None
    membersNeeded: Optional[int] = 3
    teamSize: Optional[int] = None
    githubRepo: Optional[str] = ""
    leadStudent: Optional[str] = None
    authorId: Optional[str] = None
    authorName: Optional[str] = None
