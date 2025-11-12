from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    recruitment_id = Column(Integer, ForeignKey("recruitments.id"), nullable=False)
    
    # Personal Information
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String)
    location = Column(String)
    
    # Professional Information
    current_company = Column(String)
    experience = Column(Integer)  # Years of experience
    education = Column(String)
    skills = Column(JSON)  # List of skills as JSON array
    
    # Status and Scores
    status = Column(String, default="New")  # New, Shortlisted, Interviewed, Offered, Rejected
    ats_score = Column(Integer)  # 0-100
    interview_score = Column(Integer, nullable=True)  # 0-100, null if not interviewed
    
    # Interview Data
    summary = Column(Text)  # AI-generated summary
    flags = Column(JSON, default=list)  # List of flag objects: [{"type": "sound", "severity": "high"}]
    transcript_url = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    
    # Session Management
    session_token = Column(String, nullable=True, index=True)
    
    # Timestamps
    applied_date = Column(DateTime, default=datetime.utcnow)
    interview_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    recruitment = relationship("Recruitment", back_populates="candidates")
