from typing import Optional
from pydantic import BaseModel, Field

class AiQueryRequest(BaseModel):
    prompt: str = Field(..., min_length=1)

class AiImageDiagnosisRequest(BaseModel):
    imageBase64: Optional[str] = None
    imageName: Optional[str] = None
    prompt: Optional[str] = None
    mimeType: Optional[str] = None
