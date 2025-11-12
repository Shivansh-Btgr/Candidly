from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Recruitment(Base):
    __tablename__ = "recruitments"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    department = Column(String, nullable=False)
    location = Column(String, nullable=False)
    status = Column(String, default="Active")  # Active, Closed, Draft
    requirements = Column(Text, nullable=True)  # AI instructions for ATS and interview
    interview_code = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    candidates = relationship("Candidate", back_populates="recruitment", cascade="all, delete-orphan")
    
    def get_stats(self):
        """Calculate recruitment statistics"""
        total_applicants = len(self.candidates)
        shortlisted = sum(1 for c in self.candidates if c.status == "Shortlisted")
        interviewed = sum(1 for c in self.candidates if c.status == "Interviewed")
        offered = sum(1 for c in self.candidates if c.status == "Offered")
        
        return {
            "total_applicants": total_applicants,
            "shortlisted": shortlisted,
            "interviewed": interviewed,
            "offered": offered
        }
