from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class AiMessageContext(BaseModel):
    role: str = Field(..., description="'user' or 'ai' / 'assistant'")
    content: str = Field(..., description="Message text")

class AiQueryRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    conversationHistory: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Recent conversation turns")
    contextFilters: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Active context filters e.g. dept, semester, meal")
    languagePreference: Optional[str] = Field(default=None, description="Preferred language e.g. en, hi, hinglish")

class AiImageDiagnosisRequest(BaseModel):
    imageBase64: Optional[str] = None
    imageName: Optional[str] = None
    prompt: Optional[str] = None
    mimeType: Optional[str] = None

class AdminAuditLogEntry(BaseModel):
    id: Optional[str] = None
    action: str
    targetScope: str
    previousVersion: Optional[int] = None
    newVersion: Optional[int] = None
    userEmail: str
    userName: str
    userRole: str
    status: str
    details: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None
