from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RecruitmentBase(BaseModel):
    title: str
    department: str
    location: str
    status: Optional[str] = "Active"
    requirements: Optional[str] = None

class RecruitmentCreate(RecruitmentBase):
    pass

class RecruitmentUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    requirements: Optional[str] = None

class RecruitmentStats(BaseModel):
    total_applicants: int
    shortlisted: int
    interviewed: int
    offered: int

class RecruitmentResponse(RecruitmentBase):
    id: int
    requirements: Optional[str] = None
    interview_code: str
    created_at: datetime
    updated_at: datetime
    stats: Optional[RecruitmentStats] = None
    
    class Config:
        from_attributes = True
