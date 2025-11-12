"""
Unified AI Service Manager
Handles resume parsing and ATS scoring with multiple AI providers
"""

from typing import Dict, Any, Optional, Literal
from enum import Enum
import json

# AI Provider configurations
class AIProvider(Enum):
    GEMINI = "gemini"
    OLLAMA = "ollama"
    OPENAI = "openai"
    REGEX = "regex"  # Fallback


class AIService:
    """
    Unified AI service that handles both resume parsing and ATS scoring
    Automatically tries providers in priority order
    """
    
    def __init__(self):
        self._gemini_model = None
        self._openai_client = None
    
    # ==================== RESUME PARSING ====================
    
    def parse_resume(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Parse resume using available AI providers in priority order:
        1. Gemini (fast, free, cloud)
        2. Ollama (free, local, no limits)
        3. OpenAI (paid, cloud)
        4. Regex (basic fallback)
        """
        from app.services.resume_parser import extract_text_from_pdf, extract_text_from_docx
        
        # Extract text
        text = ""
        if filename.lower().endswith('.pdf'):
            text = extract_text_from_pdf(file_content)
        elif filename.lower().endswith(('.docx', '.doc')):
            text = extract_text_from_docx(file_content)
        else:
            raise ValueError("Unsupported file format")
        
        if not text.strip():
            raise ValueError("Could not extract text from resume")
        
        # Try providers in order
        providers = [
            (AIProvider.GEMINI, self._parse_with_gemini),
            (AIProvider.OLLAMA, self._parse_with_ollama),
            (AIProvider.OPENAI, self._parse_with_openai),
        ]
        
        for provider, parse_func in providers:
            try:
                result = parse_func(text)
                print(f"✓ Resume parsed with {provider.value}")
                return result, provider.value
            except Exception as e:
                print(f"✗ {provider.value} parsing failed: {e}")
                continue
        
        # Final fallback: regex
        print("✓ Using regex fallback for parsing")
        return self._parse_with_regex(file_content, filename), AIProvider.REGEX.value
    
    def _parse_with_gemini(self, resume_text: str) -> Dict[str, Any]:
        """Parse resume using Gemini"""
        from app.database import get_settings
        import google.generativeai as genai
        from google.generativeai.types import HarmCategory, HarmBlockThreshold
        
        if self._gemini_model is None:
            settings = get_settings()
            if not settings.gemini_api_key:
                raise ValueError("Gemini API key not configured")
            genai.configure(api_key=settings.gemini_api_key)
            self._gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        prompt = f"""Extract candidate information from this resume text and return as JSON.

Resume Text:
{resume_text}

Return JSON with these fields:
- name: full name
- email: email address
- phone: phone number or null
- location: city/state or null
- experience: work history as paragraph or null
- skills: comma-separated skills or null
- education: education details as paragraph or null

Return ONLY the JSON object."""

        safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }
        
        response = self._gemini_model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.1, max_output_tokens=2048),
            safety_settings=safety_settings
        )
        
        if not response.candidates or not response.candidates[0].content.parts:
            raise ValueError("Response blocked by safety filters")
        
        response_text = response.text.strip()
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        parsed = json.loads(response_text)
        return self._normalize_parsed_data(parsed, resume_text)
    
    def _parse_with_ollama(self, resume_text: str) -> Dict[str, Any]:
        """Parse resume using Ollama"""
        import requests
        
        if not self._check_ollama():
            raise ValueError("Ollama not available")
        
        prompt = f"""Extract candidate information from this resume and return ONLY a JSON object.

Resume:
{resume_text}

Return JSON: {{"name": "...", "email": "...", "phone": "...", "location": "...", "experience": "...", "skills": "...", "education": "..."}}"""

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "mistral", "prompt": prompt, "stream": False, "format": "json"},
            timeout=60
        )
        
        if response.status_code != 200:
            raise ValueError(f"Ollama error: {response.status_code}")
        
        response_text = response.json().get("response", "")
        if "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            if response_text.startswith("json"):
                response_text = response_text[4:].strip()
        
        parsed = json.loads(response_text)
        return self._normalize_parsed_data(parsed, resume_text)
    
    def _parse_with_openai(self, resume_text: str) -> Dict[str, Any]:
        """Parse resume using OpenAI"""
        from app.database import get_settings
        from openai import OpenAI
        
        if self._openai_client is None:
            settings = get_settings()
            if not settings.openai_api_key:
                raise ValueError("OpenAI API key not configured")
            self._openai_client = OpenAI(api_key=settings.openai_api_key)
        
        prompt = f"""Extract candidate information and return as JSON:

{resume_text}

Return: {{"name": "...", "email": "...", "phone": "...", "location": "...", "experience": "...", "skills": "...", "education": "..."}}"""

        response = self._openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        parsed = json.loads(response.choices[0].message.content)
        return self._normalize_parsed_data(parsed, resume_text)
    
    def _parse_with_regex(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """Parse resume using regex patterns"""
        from app.services.resume_parser import parse_resume
        
        raw_parsed = parse_resume(file_content, filename)
        
        # Normalize to expected format
        return {
            "name": raw_parsed.get("name"),
            "email": raw_parsed.get("email"),
            "phone": raw_parsed.get("phone"),
            "location": raw_parsed.get("location"),
            "experience": f"{raw_parsed.get('experience', 0)} years of experience" if raw_parsed.get('experience') else raw_parsed.get("current_company"),
            "skills": ", ".join(raw_parsed.get("skills", [])) if isinstance(raw_parsed.get("skills"), list) else raw_parsed.get("skills"),
            "education": raw_parsed.get("education")
        }
    
    def _normalize_parsed_data(self, parsed: Dict, resume_text: str) -> Dict[str, Any]:
        """Normalize and validate parsed data"""
        import re
        
        # Ensure required fields
        if not parsed.get("name"):
            parsed["name"] = "Unknown Candidate"
        if not parsed.get("email"):
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            matches = re.findall(email_pattern, resume_text)
            parsed["email"] = matches[0] if matches else "noemail@provided.com"
        
        # Ensure optional fields exist
        for field in ["phone", "location", "experience", "skills", "education"]:
            if field not in parsed:
                parsed[field] = None
        
        return parsed
    
    # ==================== ATS SCORING ====================
    
    def calculate_ats_score(self, candidate_data: Dict[str, Any], job_requirements: str) -> Dict[str, Any]:
        """
        Calculate ATS score using available AI providers:
        1. Ollama (best for scoring, no safety filters)
        2. Gemini (if Ollama not available)
        3. Simple algorithm (fallback)
        """
        providers = [
            (AIProvider.OLLAMA, self._score_with_ollama),
            (AIProvider.GEMINI, self._score_with_gemini),
        ]
        
        for provider, score_func in providers:
            try:
                result = score_func(candidate_data, job_requirements)
                print(f"✓ ATS scored with {provider.value}: {result['ats_score']}")
                return result
            except Exception as e:
                print(f"✗ {provider.value} scoring failed: {e}")
                continue
        
        # Fallback to simple scoring
        print("✓ Using simple scoring algorithm")
        return self._score_simple(candidate_data)
    
    def _score_with_ollama(self, candidate_data: Dict[str, Any], job_requirements: str) -> Dict[str, Any]:
        """Score with Ollama"""
        import requests
        
        if not self._check_ollama():
            raise ValueError("Ollama not available")
        
        prompt = f"""Evaluate candidate match to job requirements.

Job: {job_requirements}

Candidate:
- Skills: {candidate_data.get('skills', 'N/A')}
- Experience: {candidate_data.get('experience', 'N/A')}
- Education: {candidate_data.get('education', 'N/A')}

Return JSON: {{"score": 0-100, "strengths": ["item1", "item2"], "gaps": ["item1"], "reasoning": "brief explanation"}}"""

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "mistral", "prompt": prompt, "stream": False, "format": "json", "options": {"temperature": 0.3}},
            timeout=60
        )
        
        if response.status_code != 200:
            raise ValueError(f"Ollama error: {response.status_code}")
        
        response_text = response.json().get("response", "")
        parsed = json.loads(response_text)
        
        return {
            "ats_score": int(parsed.get("score", 75)),
            "strengths": parsed.get("strengths", []),
            "gaps": parsed.get("gaps", []),
            "reasoning": parsed.get("reasoning", "")
        }
    
    def _score_with_gemini(self, candidate_data: Dict[str, Any], job_requirements: str) -> Dict[str, Any]:
        """Score with Gemini"""
        from app.database import get_settings
        import google.generativeai as genai
        from google.generativeai.types import HarmCategory, HarmBlockThreshold
        
        if self._gemini_model is None:
            settings = get_settings()
            if not settings.gemini_api_key:
                raise ValueError("Gemini API key not configured")
            genai.configure(api_key=settings.gemini_api_key)
            self._gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        prompt = f"""Rate candidate match (0-100).

Job: {job_requirements}
Candidate: Skills={candidate_data.get('skills')}, Experience={candidate_data.get('experience')}, Education={candidate_data.get('education')}

JSON: {{"score": 85, "strengths": [], "gaps": [], "reasoning": ""}}"""

        safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }
        
        response = self._gemini_model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.2, max_output_tokens=1024),
            safety_settings=safety_settings
        )
        
        if not response.candidates or not response.candidates[0].content.parts:
            raise ValueError("Response blocked")
        
        response_text = response.text.strip()
        if "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            if response_text.startswith("json"):
                response_text = response_text[4:].strip()
        
        parsed = json.loads(response_text)
        return {
            "ats_score": int(parsed.get("score", 75)),
            "strengths": parsed.get("strengths", []),
            "gaps": parsed.get("gaps", []),
            "reasoning": parsed.get("reasoning", "")
        }
    
    def _score_simple(self, candidate_data: Dict[str, Any]) -> Dict[str, Any]:
        """Simple scoring based on profile completeness"""
        score = 60
        strengths = []
        gaps = []
        
        skills = str(candidate_data.get("skills", "")).strip()
        if len(skills) > 100:
            score += 20
            strengths.append("Comprehensive skill set")
        elif len(skills) > 30:
            score += 15
            strengths.append("Good skill coverage")
        else:
            gaps.append("Limited skills information")
        
        experience = str(candidate_data.get("experience", "")).strip()
        if len(experience) > 150:
            score += 15
            strengths.append("Detailed work history")
        elif len(experience) > 50:
            score += 10
        else:
            gaps.append("Limited experience details")
        
        education = str(candidate_data.get("education", "")).strip()
        if education:
            score += 5
            strengths.append("Education documented")
        
        return {
            "ats_score": min(score, 100),
            "strengths": strengths or ["Profile submitted"],
            "gaps": gaps or ["None identified"],
            "reasoning": f"Profile completeness score based on information depth and quality"
        }
    
    def _check_ollama(self) -> bool:
        """Check if Ollama is running"""
        import requests
        try:
            response = requests.get("http://localhost:11434/api/tags", timeout=2)
            return response.status_code == 200
        except:
            return False


# Singleton instance
_ai_service = None

def get_ai_service() -> AIService:
    """Get or create singleton AIService instance"""
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service
