from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str # 'candidate' or 'recruiter'
    company_name: Optional[str] = None
    phone: Optional[str] = None
    skills: Optional[str] = None
    location: Optional[str] = None
    experience: Optional[str] = None
    summary: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    company_name: Optional[str] = None
    phone: Optional[str] = None
    skills: Optional[str] = None
    location: Optional[str] = None
    experience: Optional[str] = None
    summary: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
