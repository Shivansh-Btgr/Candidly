from pydantic import BaseModel
from typing import Optional

class InterviewCodeValidation(BaseModel):
    interview_code: str

class ResumeUploadResponse(BaseModel):
    candidate_id: int
    session_token: str
    candidate_name: str
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

class ChatMessage(BaseModel):
    session_token: str
    message: str
    conversation_history: Optional[list] = []

class ChatResponse(BaseModel):
    reply: str
    
class FlagUpdate(BaseModel):
    session_token: Optional[str] = None
    candidate_id: Optional[int] = None
    multiple_faces_flag: Optional[int] = None
    noise_flag: Optional[int] = None
    ai_flag: Optional[int] = None
