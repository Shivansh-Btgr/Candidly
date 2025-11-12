from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import secrets
from datetime import datetime

from app.database import get_db
from app.models import Candidate, Recruitment
from app.schemas import (
    InterviewCodeValidation, ResumeUploadResponse,
    InterviewStartRequest, InterviewSubmitRequest
)
from app.services.ai_service import get_ai_service

router = APIRouter(prefix="/api/interview", tags=["interview"])

def generate_session_token() -> str:
    """Generate a secure session token"""
    return secrets.token_urlsafe(32)

@router.post("/validate-code")
def validate_interview_code(
    code_data: InterviewCodeValidation,
    db: Session = Depends(get_db)
):
    """Validate interview access code"""
    recruitment = db.query(Recruitment).filter(
        Recruitment.interview_code == code_data.interview_code,
        Recruitment.status == "Active"
    ).first()
    
    if not recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid or expired interview code"
        )
    
    return {
        "valid": True,
        "recruitment_id": recruitment.id,
        "recruitment_title": recruitment.title
    }

@router.post("/upload-resume", response_model=ResumeUploadResponse)
async def upload_resume(
    interview_code: str,
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload resume and create candidate profile"""
    # Validate interview code
    recruitment = db.query(Recruitment).filter(
        Recruitment.interview_code == interview_code,
        Recruitment.status == "Active"
    ).first()
    
    if not recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid or expired interview code"
        )
    
    # Validate file type
    if not resume.filename.endswith(('.pdf', '.docx', '.doc')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are supported"
        )
    
    try:
        # Read file content
        content = await resume.read()
        
        # Get AI service
        ai_service = get_ai_service()
        
        # Parse resume with AI
        parsed_data, parsing_method = ai_service.parse_resume(content, resume.filename)
        print(f"Resume parsed with: {parsing_method}")
        
        # Calculate ATS score with AI
        job_requirements = f"""Position: {recruitment.title}
Department: {recruitment.department}
Location: {recruitment.location}
Requirements: {recruitment.requirements or 'Not specified'}"""
        
        ats_evaluation = ai_service.calculate_ats_score(parsed_data, job_requirements)
        
        # Generate session token
        session_token = generate_session_token()
        
        # Create candidate record
        candidate = Candidate(
            recruitment_id=recruitment.id,
            name=parsed_data.get("name", "Unknown"),
            email=parsed_data.get("email", ""),
            phone=parsed_data.get("phone"),
            location=parsed_data.get("location"),
            experience=parsed_data.get("experience"),
            education=parsed_data.get("education"),
            skills=parsed_data.get("skills"),
            ats_score=ats_evaluation["ats_score"],
            ats_strengths=ats_evaluation.get("strengths"),
            ats_gaps=ats_evaluation.get("gaps"),
            ats_reasoning=ats_evaluation.get("reasoning"),
            session_token=session_token,
            status="New",
            resume_url=f"uploads/{resume.filename}"  # TODO: Save to actual storage
        )
        
        db.add(candidate)
        db.commit()
        db.refresh(candidate)
        
        return ResumeUploadResponse(
            candidate_id=candidate.id,
            session_token=session_token,
            ats_score=ats_evaluation["ats_score"],
            message=f"Resume processed successfully with {parsing_method}"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing resume: {str(e)}"
        )

@router.post("/upload-resume-ai", response_model=ResumeUploadResponse)
async def upload_resume_ai(
    interview_code: str,
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload resume and create candidate profile using AI parsing"""
    # Validate interview code
    recruitment = db.query(Recruitment).filter(
        Recruitment.interview_code == interview_code,
        Recruitment.status == "Active"
    ).first()
    
    if not recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid or expired interview code"
        )
    
    # Validate file type
    if not resume.filename.lower().endswith(('.pdf', '.docx', '.doc')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are supported"
        )
    
    try:
        # Read file content
        content = await resume.read()
        
        # Get AI service
        ai_service = get_ai_service()
        
        # Parse resume with AI
        parsed_data, parsing_method = ai_service.parse_resume(content, resume.filename)
        print(f"✓ Resume parsed with: {parsing_method}")
        
        # Calculate ATS score with AI
        job_requirements = f"""Position: {recruitment.title}
Department: {recruitment.department}
Location: {recruitment.location}
Requirements: {recruitment.requirements or 'Not specified'}"""
        
        ats_evaluation = ai_service.calculate_ats_score(parsed_data, job_requirements)
        
        # Generate session token
        session_token = generate_session_token()
        
        # Create candidate record with AI evaluation
        candidate = Candidate(
            recruitment_id=recruitment.id,
            name=parsed_data.get("name", "Unknown"),
            email=parsed_data.get("email", "noemail@provided.com"),
            phone=parsed_data.get("phone"),
            location=parsed_data.get("location"),
            experience=parsed_data.get("experience"),
            education=parsed_data.get("education"),
            skills=parsed_data.get("skills"),
            ats_score=ats_evaluation["ats_score"],
            ats_strengths=ats_evaluation.get("strengths"),
            ats_gaps=ats_evaluation.get("gaps"),
            ats_reasoning=ats_evaluation.get("reasoning"),
            session_token=session_token,
            status="New",
            resume_url=f"uploads/{resume.filename}"  # TODO: Save to actual storage
        )
        
        db.add(candidate)
        db.commit()
        db.refresh(candidate)
        
        return ResumeUploadResponse(
            candidate_id=candidate.id,
            session_token=session_token,
            ats_score=ats_evaluation["ats_score"],
            message=f"Resume processed successfully with {parsing_method}"
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing resume: {str(e)}"
        )

@router.post("/start")
def start_interview(
    request: InterviewStartRequest,
    db: Session = Depends(get_db)
):
    """Start the AI interview session"""
    candidate = db.query(Candidate).filter(
        Candidate.session_token == request.session_token
    ).first()
    
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid session token"
        )
    
    # Update interview date
    candidate.interview_date = datetime.utcnow()
    db.commit()
    
    return {
        "candidate_id": candidate.id,
        "message": "Interview session started",
        "candidate_name": candidate.name
    }

@router.post("/submit")
async def submit_interview(
    request: InterviewSubmitRequest,
    db: Session = Depends(get_db)
):
    """Submit interview responses and process"""
    candidate = db.query(Candidate).filter(
        Candidate.session_token == request.session_token
    ).first()
    
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid session token"
        )
    
    # TODO: Process interview responses
    # - Generate transcript
    # - Calculate interview score
    # - Detect flags (sound, face, AI)
    # - Generate summary
    
    # For now, just update status
    candidate.status = "Interviewed"
    
    # Mock data until AI services are implemented
    candidate.interview_score = 85  # TODO: Calculate from AI
    candidate.summary = "Strong technical background with good communication skills."  # TODO: Generate from AI
    candidate.flags = []  # TODO: Detect from interview analysis
    candidate.transcript_url = f"transcripts/candidate_{candidate.id}_transcript.txt"  # TODO: Generate actual transcript
    
    # Invalidate session token
    candidate.session_token = None
    
    db.commit()
    db.refresh(candidate)
    
    return {
        "message": "Interview submitted successfully",
        "candidate_id": candidate.id,
        "interview_score": candidate.interview_score
    }

@router.get("/status/{session_token}")
def get_interview_status(session_token: str, db: Session = Depends(get_db)):
    """Get interview status for a session"""
    candidate = db.query(Candidate).filter(
        Candidate.session_token == session_token
    ).first()
    
    if not candidate:
        # If no active session, check if interview is complete
        candidate = db.query(Candidate).filter(
            Candidate.session_token.is_(None)
        ).order_by(Candidate.created_at.desc()).first()
        
        if candidate and candidate.status == "Interviewed":
            return {
                "status": "completed",
                "candidate_id": candidate.id,
                "interview_score": candidate.interview_score
            }
        
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    return {
        "status": "in_progress" if candidate.interview_date else "pending",
        "candidate_id": candidate.id,
        "candidate_name": candidate.name
    }
