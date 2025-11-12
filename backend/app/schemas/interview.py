from pydantic import BaseModel
from typing import Optional

class InterviewCodeValidation(BaseModel):
    interview_code: str

class ResumeUploadResponse(BaseModel):
    candidate_id: int
    session_token: str
    ats_score: Optional[int] = None
    message: str

class SessionToken(BaseModel):
    token: str
    candidate_id: int

class InterviewStartRequest(BaseModel):
    session_token: str

class InterviewSubmitRequest(BaseModel):
    session_token: str
    responses: list  # List of question-answer pairs
    recording_url: Optional[str] = None
