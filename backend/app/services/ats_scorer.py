from typing import Dict, Any

def calculate_ats_score(parsed_data: Dict[str, Any], recruitment: Any) -> int:
    """
    Calculate ATS (Applicant Tracking System) score
    Score is based on resume completeness and relevance
    Returns a score between 0-100
    """
    score = 0
    
    # 1. Profile Completeness (40 points)
    if parsed_data.get("name") and parsed_data["name"] != "Unknown":
        score += 5
    if parsed_data.get("email"):
        score += 5
    if parsed_data.get("phone"):
        score += 5
    if parsed_data.get("location"):
        score += 5
    if parsed_data.get("current_company"):
        score += 5
    if parsed_data.get("experience"):
        score += 10
    if parsed_data.get("education"):
        score += 5
    
    # 2. Skills Match (40 points)
    skills = parsed_data.get("skills", [])
    if skills:
        # More skills generally indicate better match
        skill_score = min(len(skills) * 3, 40)  # Cap at 40
        score += skill_score
    
    # 3. Experience Level (20 points)
    experience = parsed_data.get("experience", 0)
    if experience:
        if experience >= 5:
            score += 20
        elif experience >= 3:
            score += 15
        elif experience >= 1:
            score += 10
        else:
            score += 5
    
    # TODO: In production, implement more sophisticated scoring:
    # - Match skills with job requirements
    # - Match experience level with position requirements
    # - Use NLP to analyze resume content quality
    # - Consider education level and institution
    # - Analyze career progression
    
    # Ensure score is within bounds
    return min(max(score, 0), 100)

def get_score_breakdown(parsed_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Get detailed breakdown of ATS score components
    """
    breakdown = {
        "profile_completeness": 0,
        "skills_match": 0,
        "experience_level": 0,
        "total": 0
    }
    
    # Calculate component scores
    completeness = 0
    if parsed_data.get("name"): completeness += 5
    if parsed_data.get("email"): completeness += 5
    if parsed_data.get("phone"): completeness += 5
    if parsed_data.get("location"): completeness += 5
    if parsed_data.get("current_company"): completeness += 5
    if parsed_data.get("experience"): completeness += 10
    if parsed_data.get("education"): completeness += 5
    
    skills = parsed_data.get("skills", [])
    skills_score = min(len(skills) * 3, 40)
    
    experience = parsed_data.get("experience", 0)
    exp_score = 0
    if experience >= 5: exp_score = 20
    elif experience >= 3: exp_score = 15
    elif experience >= 1: exp_score = 10
    elif experience > 0: exp_score = 5
    
    breakdown["profile_completeness"] = completeness
    breakdown["skills_match"] = skills_score
    breakdown["experience_level"] = exp_score
    breakdown["total"] = completeness + skills_score + exp_score
    
    return breakdown
