from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, model_validator

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    studentId: Optional[str] = None
    department: Optional[str] = None
    academicYear: Optional[str] = None
    preferredName: Optional[str] = None
    role: Optional[str] = None  # Will be forcefully overridden to student for security

class LoginRequest(BaseModel):
    email: Optional[str] = None
    identifier: Optional[str] = None
    password: str = Field(..., min_length=1)

    @model_validator(mode="after")
    def check_identifier(self):
        if not self.email and not self.identifier:
            raise ValueError("Validation failed. Email/Identifier and password are required.")
        return self

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    preferredName: Optional[str] = None
    phone: Optional[str] = None
    residence: Optional[str] = None
    emergencyContact: Optional[str] = None
    bio: Optional[str] = None
    department: Optional[str] = None
    academicYear: Optional[str] = None
    semester: Optional[str] = None
    skills: Optional[List[str]] = None
    societies: Optional[List[Dict[str, Any]]] = None
    preferences: Optional[Dict[str, Any]] = None
    role: Optional[str] = None
    userId: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    currentPassword: str = Field(..., min_length=1)
    newPassword: str = Field(..., min_length=6)
