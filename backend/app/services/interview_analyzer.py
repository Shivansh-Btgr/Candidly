# Interview Analysis Service
# Server-side analysis for AI response detection and summary generation
# Note: Face/audio monitoring happens client-side in real-time (monitoringService.js)

from typing import Dict, List, Any, Optional
import re

class InterviewAnalyzer:
    """
    Server-side interview analysis
    - AI response detection (analyzes transcript text patterns)
    - Summary generation using AI service
    - Flag validation and severity assessment
    
    Client-side monitoring (already implemented):
    - Face detection (multiple_faces_flag)
    - Audio monitoring (noise_flag)
    """
    
    def __init__(self):
        # Common AI assistant phrases that indicate AI-generated responses
        self.ai_patterns = [
            r"as an ai|as a language model",
            r"i don'?t have personal|i cannot have",
            r"my programming|my training data",
            r"i was trained|i have been trained",
            r"as of my last update|my knowledge cutoff",
            r"i'?m an artificial|i'?m a digital",
            r"certainty\.|specifically\.|particularly\.",  # Over-formal punctuation
            r"it'?s worth noting that|it'?s important to note",
            r"in summary,|to summarize,|in conclusion,",  # AI summary markers
        ]
        self.ai_pattern_compiled = re.compile('|'.join(self.ai_patterns), re.IGNORECASE)
    
    def detect_ai_responses(self, transcript: str, responses: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Analyze transcript or responses for AI-generated content
        
        Returns:
            {
                "is_ai_detected": bool,
                "confidence": float (0-1),
                "suspicious_patterns": List[str],
                "reason": str
            }
        """
        text_to_analyze = transcript if transcript else ' '.join(responses or [])
        
        if not text_to_analyze:
            return {
                "is_ai_detected": False,
                "confidence": 0.0,
                "suspicious_patterns": [],
                "reason": "No text to analyze"
            }
        
        # Check for AI patterns
        matches = self.ai_pattern_compiled.findall(text_to_analyze.lower())
        pattern_count = len(matches)
        
        # Additional heuristics
        word_count = len(text_to_analyze.split())
        sentence_count = len(re.split(r'[.!?]+', text_to_analyze))
        avg_sentence_length = word_count / max(sentence_count, 1)
        
        # AI responses tend to be very structured and lengthy
        is_overly_formal = avg_sentence_length > 25  # Very long sentences
        has_ai_phrases = pattern_count > 0
        
        # Calculate confidence score
        confidence = 0.0
        reasons = []
        
        if has_ai_phrases:
            confidence += min(pattern_count * 0.3, 0.6)  # Max 0.6 from patterns
            reasons.append(f"Contains {pattern_count} AI-specific phrase(s)")
        
        if is_overly_formal and word_count > 200:
            confidence += 0.2
            reasons.append("Overly formal and lengthy responses")
        
        # Perfect grammar could be a sign (but not definitive)
        if not re.search(r'\b(um|uh|like|you know|hmm)\b', text_to_analyze.lower()):
            if word_count > 100:
                confidence += 0.2
                reasons.append("Lacks natural speech patterns (um, uh, like)")
        
        confidence = min(confidence, 1.0)
        is_detected = confidence >= 0.5
        
        return {
            "is_ai_detected": is_detected,
            "confidence": confidence,
            "suspicious_patterns": list(set(matches)),
            "reason": "; ".join(reasons) if reasons else "No AI patterns detected"
        }
    
    def generate_summary(
        self, 
        candidate_data: Dict, 
        transcript: str = "", 
        responses: List[Dict] = None
    ) -> str:
        """
        Generate AI-powered candidate summary
        Uses the AI service to create comprehensive analysis
        """
        # TODO: Integrate with ai_service.py for AI-generated summaries
        # For now, generate structured summary from available data
        
        name = candidate_data.get("name", "Candidate")
        experience = candidate_data.get("experience", 0)
        skills = candidate_data.get("skills", [])
        education = candidate_data.get("education", "")
        
        summary_parts = []
        
        # Introduction
        summary_parts.append(f"{name} demonstrated strong technical capabilities")
        
        # Experience assessment
        if experience > 5:
            summary_parts.append("with extensive industry experience")
        elif experience > 2:
            summary_parts.append("with solid professional background")
        else:
            summary_parts.append("as an emerging professional")
        
        # Skills highlight
        if skills:
            skills_list = skills if isinstance(skills, list) else skills.split(',')
            top_skills = [s.strip() for s in skills_list[:3]]
            summary_parts.append(f". Proficient in {', '.join(top_skills)}")
        
        # Education
        if education:
            summary_parts.append(f". Educational background: {education}")
        
        # Interview performance (based on transcript length and structure)
        if transcript and len(transcript) > 500:
            summary_parts.append(". Provided detailed and thoughtful responses during the interview")
        
        summary_parts.append(". Shows good communication skills and problem-solving ability.")
        
        return ''.join(summary_parts)
    
    def validate_flags(
        self,
        multiple_faces_flag: int,
        noise_flag: int,
        ai_flag: int
    ) -> Dict[str, Any]:
        """
        Validate and assess severity of client-reported flags
        
        Returns risk assessment for recruiter review
        """
        risk_level = "low"
        concerns = []
        
        if multiple_faces_flag:
            concerns.append("Multiple faces detected during interview")
            risk_level = "high"
        
        if noise_flag:
            concerns.append("Suspicious background noise or voices detected")
            if risk_level != "high":
                risk_level = "medium"
        
        if ai_flag:
            concerns.append("AI-generated responses suspected")
            risk_level = "high"
        
        return {
            "risk_level": risk_level,
            "concerns": concerns,
            "requires_review": risk_level in ["medium", "high"],
            "recommendation": self._get_recommendation(risk_level, concerns)
        }
    
    def _get_recommendation(self, risk_level: str, concerns: List[str]) -> str:
        """Generate recommendation based on risk assessment"""
        if risk_level == "high":
            return "Recommend manual review of interview recording before proceeding. Multiple integrity concerns detected."
        elif risk_level == "medium":
            return "Review flagged sections of interview. Consider follow-up interview if concerns persist."
        else:
            return "No significant integrity concerns detected. Candidate may proceed to next stage."
    
    def analyze_full_interview(
        self,
        candidate_data: Dict,
        transcript: str = "",
        responses: List[Dict] = None,
        multiple_faces_flag: int = 0,
        noise_flag: int = 0,
        ai_flag_from_client: int = 0
    ) -> Dict[str, Any]:
        """
        Complete server-side interview analysis
        
        Note: Face and audio monitoring happen client-side in real-time.
        This method performs post-interview analysis:
        - AI response detection from transcript
        - Flag validation and risk assessment
        - Summary generation
        
        Args:
            candidate_data: Candidate information dict
            transcript: Full interview transcript text
            responses: List of question-answer pairs
            multiple_faces_flag: Client-reported flag (0 or 1)
            noise_flag: Client-reported flag (0 or 1)
            ai_flag_from_client: Client-reported flag (0 or 1)
        
        Returns:
            {
                "ai_analysis": dict with AI detection results,
                "flag_validation": dict with risk assessment,
                "summary": str with candidate summary,
                "should_set_ai_flag": bool
            }
        """
        # Server-side AI detection from transcript
        ai_analysis = self.detect_ai_responses(transcript, responses)
        
        # Validate client-reported flags
        flag_validation = self.validate_flags(
            multiple_faces_flag,
            noise_flag,
            ai_flag_from_client or (1 if ai_analysis["is_ai_detected"] else 0)
        )
        
        # Generate comprehensive summary
        summary = self.generate_summary(candidate_data, transcript, responses)
        
        return {
            "ai_analysis": ai_analysis,
            "flag_validation": flag_validation,
            "summary": summary,
            "should_set_ai_flag": ai_analysis["is_ai_detected"] or ai_flag_from_client == 1
        }


# Singleton instance
interview_analyzer = InterviewAnalyzer()


def get_interview_analyzer() -> InterviewAnalyzer:
    """Get the singleton interview analyzer instance"""
    return interview_analyzer
