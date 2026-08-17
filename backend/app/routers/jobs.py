from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.database import get_db
from app.models.job import Job
from app.models.user import User
from app.schemas.job import JobCreate, JobResponse, JobUpdate
from app.auth.security import get_current_user

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("", response_model=List[JobResponse])
def get_jobs(
    query: Optional[str] = Query(None, description="Search by title, company, or description"),
    location: Optional[str] = Query(None, description="Filter by location"),
    employment_type: Optional[str] = Query(None, description="Filter by employment type"),
    experience_level: Optional[str] = Query(None, description="Filter by experience level"),
    db: Session = Depends(get_db)
):
    db_query = db.query(Job)
    
    if query:
        search_filter = or_(
            Job.title.ilike(f"%{query}%"),
            Job.company.ilike(f"%{query}%"),
            Job.description.ilike(f"%{query}%")
        )
        db_query = db_query.filter(search_filter)
        
    if location:
        db_query = db_query.filter(Job.location.ilike(f"%{location}%"))
        
    if employment_type:
        db_query = db_query.filter(Job.employment_type == employment_type)
        
    if experience_level:
        db_query = db_query.filter(Job.experience_level == experience_level)
        
    return db_query.order_by(Job.created_at.desc()).all()

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job post not found."
        )
    return job

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_in: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters are authorized to post jobs."
        )
        
    new_job = Job(
        recruiter_id=current_user.id,
        title=job_in.title,
        company=job_in.company,
        location=job_in.location,
        description=job_in.description,
        requirements=job_in.requirements,
        employment_type=job_in.employment_type,
        experience_level=job_in.experience_level,
        salary=job_in.salary
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_in: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job post not found."
        )
        
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized. You can only modify your own posted jobs."
        )
        
    update_data = job_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
        
    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job post not found."
        )
        
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized. You can only delete your own posted jobs."
        )
        
    db.delete(job)
    db.commit()
    return
