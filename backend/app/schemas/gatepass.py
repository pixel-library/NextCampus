from typing import Optional
from pydantic import BaseModel, Field

class GatePassApply(BaseModel):
    destination: str = Field(..., min_length=2, description="Target destination outside campus")
    reason: str = Field(..., min_length=3, description="Specific reason or purpose for out-pass")
    outTime: str = Field(..., min_length=3, description="Departure date and time (ISO or formatted)")
    expectedInTime: str = Field(..., min_length=3, description="Expected return date and time")
    emergencyContact: Optional[str] = Field(None, description="Emergency phone number or contact person")

class GatePassReview(BaseModel):
    action: str = Field(..., pattern="^(APPROVE|REJECT)$", description="Administrative decision: APPROVE or REJECT")
    remarks: Optional[str] = Field(None, description="Optional warden or administrative remarks")
