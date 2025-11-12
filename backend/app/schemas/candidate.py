from pydantic import BaseModel, EmailStr, computed_field
from datetime import datetime
from typing import Optional, List, Dict, Any

class CandidateBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    experience: Optional[str] = None  # Company + years as string
    skills: Optional[str] = None  # List of skills as string
    education: Optional[str] = None

class CandidateCreate(CandidateBase):
    recruitment_id: int
    ats_score: Optional[int] = None
    resume_url: Optional[str] = None

class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    experience: Optional[str] = None
    skills: Optional[str] = None
    education: Optional[str] = None
    status: Optional[str] = None
    ats_score: Optional[int] = None
    interview_score: Optional[int] = None
    summary: Optional[str] = None
    flags: Optional[List[Dict]] = None
    transcript_url: Optional[str] = None

class CandidateStatusUpdate(BaseModel):
    status: str  # New, Shortlisted, Interviewed, Offered, Rejected

class CandidateResponse(CandidateBase):
    id: int
    recruitment_id: int
    status: str
    ats_score: Optional[int] = None
    interview_score: Optional[int] = None
    summary: Optional[str] = None
    flags: Optional[List[Dict]] = []
    transcript_url: Optional[str] = None
    resume_url: Optional[str] = None
    applied_date: datetime
    interview_date: Optional[datetime] = None
    recruitment_title: Optional[str] = None
    
    class Config:
        from_attributes = True

class CandidateList(BaseModel):
    candidates: List[CandidateResponse]
    total: int
