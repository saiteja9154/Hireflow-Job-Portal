import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # 'candidate' or 'recruiter'
    company_name = Column(String(255), nullable=True) # For recruiters
    
    # Profile information
    phone = Column(String(100), nullable=True)
    skills = Column(Text, nullable=True)             # Candidate skills
    location = Column(String(255), nullable=True)
    experience = Column(String(100), nullable=True)
    summary = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    jobs = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")
