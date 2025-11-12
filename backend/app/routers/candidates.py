from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import Candidate, Recruitment
from app.schemas import (
    CandidateCreate, CandidateUpdate, CandidateResponse,
    CandidateList, CandidateStatusUpdate
)

router = APIRouter(prefix="/api/candidates", tags=["candidates"])

@router.get("", response_model=CandidateList)
def get_candidates(
    search: Optional[str] = Query(None, description="Search by name or email"),
    status: Optional[str] = Query(None, description="Filter by status"),
    sort_by: Optional[str] = Query("atsScore", description="Sort by field"),
    recruitment_id: Optional[int] = Query(None, description="Filter by recruitment"),
    db: Session = Depends(get_db)
):
    """Get all candidates with optional search, filter, and sort"""
    query = db.query(Candidate)
    
    # Filter by recruitment
    if recruitment_id:
        query = query.filter(Candidate.recruitment_id == recruitment_id)
    
    # Search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Candidate.name.ilike(search_term)) |
            (Candidate.email.ilike(search_term))
        )
    
    # Status filter
    if status:
        query = query.filter(Candidate.status == status)
    
    # Sorting
    if sort_by == "atsScore":
        query = query.order_by(Candidate.ats_score.desc())
    elif sort_by == "interviewScore":
        query = query.order_by(Candidate.interview_score.desc())
    elif sort_by == "date":
        query = query.order_by(Candidate.applied_date.desc())
    elif sort_by == "name":
        query = query.order_by(Candidate.name.asc())
    
    candidates = query.all()
    total = len(candidates)
    
    return CandidateList(
        candidates=[CandidateResponse.model_validate(c) for c in candidates],
        total=total
    )

@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """Get single candidate details"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    return CandidateResponse.model_validate(candidate)

@router.post("", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    """Create a new candidate"""
    # Verify recruitment exists
    recruitment = db.query(Recruitment).filter(
        Recruitment.id == candidate.recruitment_id
    ).first()
    
    if not recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recruitment not found"
        )
    
    db_candidate = Candidate(**candidate.model_dump())
    
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    
    return CandidateResponse.model_validate(db_candidate)

@router.put("/{candidate_id}", response_model=CandidateResponse)
def update_candidate(
    candidate_id: int,
    candidate_update: CandidateUpdate,
    db: Session = Depends(get_db)
):
    """Update candidate details"""
    db_candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    # Update only provided fields
    update_data = candidate_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_candidate, field, value)
    
    db.commit()
    db.refresh(db_candidate)
    
    return CandidateResponse.model_validate(db_candidate)

@router.patch("/{candidate_id}/status", response_model=CandidateResponse)
def update_candidate_status(
    candidate_id: int,
    status_update: CandidateStatusUpdate,
    db: Session = Depends(get_db)
):
    """Update candidate status"""
    db_candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    db_candidate.status = status_update.status
    db.commit()
    db.refresh(db_candidate)
    
    return CandidateResponse.model_validate(db_candidate)

@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """Delete a candidate"""
    db_candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    db.delete(db_candidate)
    db.commit()
    
    return None

@router.get("/{candidate_id}/transcript")
def get_candidate_transcript(candidate_id: int, db: Session = Depends(get_db)):
    """Download candidate interview transcript"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    if not candidate.transcript_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transcript not available"
        )
    
    # TODO: Return actual file download
    # For now, return the URL
    return {"transcript_url": candidate.transcript_url, "candidate_name": candidate.name}
