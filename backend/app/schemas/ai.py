from pydantic import BaseModel, Field

class AiQueryRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
