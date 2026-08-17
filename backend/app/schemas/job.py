from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company: str
    location: str
    description: str
    requirements: str
    employment_type: str # Full-time, Part-time, Contract, Hybrid
    experience_level: str # Entry-level, Mid-level, Senior, Lead
    salary: str

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    employment_type: Optional[str] = None
    experience_level: Optional[str] = None
    salary: Optional[str] = None

class JobResponse(JobBase):
    id: int
    recruiter_id: int
    created_at: datetime

    class Config:
        from_attributes = True
