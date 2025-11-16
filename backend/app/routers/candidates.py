from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
import re

from app.database import get_db
from app.models import Candidate, Recruitment
from app.schemas import (
    CandidateCreate, CandidateUpdate, CandidateResponse,
    CandidateList, CandidateStatusUpdate
)

router = APIRouter(prefix="/api/candidates", tags=["candidates"])


def _extract_email(raw: Optional[str]) -> Optional[str]:
    if not raw:
        return None
    if isinstance(raw, str) and '@' in raw and ' ' not in raw and '|' not in raw and '/' not in raw:
        return raw
    m = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", str(raw))
    if m:
        return m.group(0)
    return None


def _to_candidate_response(obj):
    """Convert a Candidate ORM object or dict to CandidateResponse safely.
    Attempts Pydantic validation and falls back to sanitizing the email field.
    """
    try:
        return CandidateResponse.model_validate(obj)
    except Exception:
        # Build a dict of attributes if it's an ORM object
        if not isinstance(obj, dict):
            data = {k: getattr(obj, k) for k in obj.__dict__ if not k.startswith('_')}
        else:
            data = dict(obj)

        cleaned = _extract_email(data.get('email'))
        # Use a valid placeholder to satisfy EmailStr when no valid email is extractable
        data['email'] = cleaned or 'unknown@example.com'
        try:
            return CandidateResponse.model_validate(data)
        except Exception:
            # Last-resort minimal response
            fallback = {
                'id': data.get('id') or 0,
                'recruitment_id': data.get('recruitment_id') or 0,
                'name': data.get('name') or '',
                'email': data.get('email') or 'unknown@example.com',
                'status': data.get('status') or 'New',
                'applied_date': data.get('applied_date')
            }
            return CandidateResponse.model_validate(fallback)

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

    def _extract_email(raw: Optional[str]) -> Optional[str]:
        if not raw:
            return None
        # If it's already a clean email, return it
        if '@' in raw and ' ' not in raw and '|' not in raw and '/' not in raw:
            return raw
        # Try to extract an email using regex
        m = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", raw)
        if m:
            return m.group(0)
        return None

    candidate_responses = []
    for c in candidates:
        candidate_responses.append(_to_candidate_response(c))

    return CandidateList(
        candidates=candidate_responses,
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
    
    # Manually populate recruitment_title
    response_data = _to_candidate_response(candidate)
    if candidate.recruitment:
        response_data.recruitment_title = candidate.recruitment.title

    return response_data

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
    
    # Manually populate recruitment_title
    response_data = _to_candidate_response(db_candidate)
    if db_candidate.recruitment:
        response_data.recruitment_title = db_candidate.recruitment.title

    return response_data

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
    
    return _to_candidate_response(db_candidate)

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
    
    return _to_candidate_response(db_candidate)

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
    from fastapi.responses import FileResponse
    import os
    
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
    
    # Check if transcript file exists
    transcript_path = candidate.transcript_url
    if not os.path.exists(transcript_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transcript file not found on server"
        )
    
    # Generate a clean filename for download
    safe_name = candidate.name.replace(' ', '_').replace('/', '_')
    download_filename = f"{safe_name}_interview_transcript.txt"
    
    # Return file as download
    return FileResponse(
        path=transcript_path,
        filename=download_filename,
        media_type='text/plain'
    )
