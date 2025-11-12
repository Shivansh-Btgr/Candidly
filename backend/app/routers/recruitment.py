from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
import secrets
import string

from app.database import get_db
from app.models import Recruitment
from app.schemas import RecruitmentCreate, RecruitmentUpdate, RecruitmentResponse, RecruitmentStats

router = APIRouter(prefix="/api/recruitment", tags=["recruitment"])

def generate_interview_code() -> str:
    """Generate unique interview code in format CNDLY-XXX-XXXXXX"""
    random_part = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
    code_number = ''.join(secrets.choice(string.digits) for _ in range(3))
    return f"CNDLY-{code_number}-{random_part}"

@router.get("", response_model=RecruitmentResponse)
def get_active_recruitment(db: Session = Depends(get_db)):
    """Get the active recruitment (since single recruitment per recruiter)"""
    recruitment = db.query(Recruitment).filter(Recruitment.status == "Active").first()
    
    if not recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active recruitment found"
        )
    
    # Add stats
    stats = recruitment.get_stats()
    response = RecruitmentResponse.model_validate(recruitment)
    response.stats = RecruitmentStats(**stats)
    
    return response

@router.get("/{recruitment_id}", response_model=RecruitmentResponse)
def get_recruitment(recruitment_id: int, db: Session = Depends(get_db)):
    """Get specific recruitment by ID"""
    recruitment = db.query(Recruitment).filter(Recruitment.id == recruitment_id).first()
    
    if not recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recruitment not found"
        )
    
    # Add stats
    stats = recruitment.get_stats()
    response = RecruitmentResponse.model_validate(recruitment)
    response.stats = RecruitmentStats(**stats)
    
    return response

@router.post("", response_model=RecruitmentResponse, status_code=status.HTTP_201_CREATED)
def create_recruitment(recruitment: RecruitmentCreate, db: Session = Depends(get_db)):
    """Create a new recruitment"""
    # Generate unique interview code
    interview_code = generate_interview_code()
    
    # Check if code exists (very unlikely but good practice)
    while db.query(Recruitment).filter(Recruitment.interview_code == interview_code).first():
        interview_code = generate_interview_code()
    
    db_recruitment = Recruitment(
        **recruitment.model_dump(),
        interview_code=interview_code
    )
    
    db.add(db_recruitment)
    db.commit()
    db.refresh(db_recruitment)
    
    # Add stats
    stats = db_recruitment.get_stats()
    response = RecruitmentResponse.model_validate(db_recruitment)
    response.stats = RecruitmentStats(**stats)
    
    return response

@router.put("/{recruitment_id}", response_model=RecruitmentResponse)
def update_recruitment(
    recruitment_id: int,
    recruitment_update: RecruitmentUpdate,
    db: Session = Depends(get_db)
):
    """Update recruitment details"""
    db_recruitment = db.query(Recruitment).filter(Recruitment.id == recruitment_id).first()
    
    if not db_recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recruitment not found"
        )
    
    # Update only provided fields
    update_data = recruitment_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_recruitment, field, value)
    
    db.commit()
    db.refresh(db_recruitment)
    
    # Add stats
    stats = db_recruitment.get_stats()
    response = RecruitmentResponse.model_validate(db_recruitment)
    response.stats = RecruitmentStats(**stats)
    
    return response

@router.delete("/{recruitment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recruitment(recruitment_id: int, db: Session = Depends(get_db)):
    """Delete a recruitment"""
    db_recruitment = db.query(Recruitment).filter(Recruitment.id == recruitment_id).first()
    
    if not db_recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recruitment not found"
        )
    
    db.delete(db_recruitment)
    db.commit()
    
    return None

@router.get("/{recruitment_id}/stats", response_model=RecruitmentStats)
def get_recruitment_stats(recruitment_id: int, db: Session = Depends(get_db)):
    """Get recruitment statistics"""
    recruitment = db.query(Recruitment).filter(Recruitment.id == recruitment_id).first()
    
    if not recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recruitment not found"
        )
    
    stats = recruitment.get_stats()
    return RecruitmentStats(**stats)

@router.post("/regenerate-code/{recruitment_id}", response_model=dict)
def regenerate_interview_code(recruitment_id: int, db: Session = Depends(get_db)):
    """Regenerate interview access code"""
    db_recruitment = db.query(Recruitment).filter(Recruitment.id == recruitment_id).first()
    
    if not db_recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recruitment not found"
        )
    
    # Generate new unique code
    new_code = generate_interview_code()
    while db.query(Recruitment).filter(Recruitment.interview_code == new_code).first():
        new_code = generate_interview_code()
    
    db_recruitment.interview_code = new_code
    db.commit()
    
    return {"interview_code": new_code, "message": "Interview code regenerated successfully"}
