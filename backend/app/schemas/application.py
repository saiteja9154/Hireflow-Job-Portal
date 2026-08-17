from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.user import UserResponse
from app.schemas.job import JobResponse

class ApplicationBase(BaseModel):
    job_id: int
    candidate_id: int
    resume_path: str
    status: str

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    resume_path: str
    status: str
    applied_at: datetime
    job: Optional[JobResponse] = None
    candidate: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class StatusUpdate(BaseModel):
    status: str
