import PyPDF2
import docx
import io
import re
from typing import Dict, Any, List

def parse_resume(file_content: bytes, filename: str) -> Dict[str, Any]:
    """
    Parse resume and extract candidate information
    Supports PDF and DOCX formats
    """
    text = ""
    
    # Extract text based on file type
    if filename.endswith('.pdf'):
        text = extract_text_from_pdf(file_content)
    elif filename.endswith(('.docx', '.doc')):
        text = extract_text_from_docx(file_content)
    else:
        raise ValueError("Unsupported file format")
    
    # Parse structured data from text
    parsed_data = {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "location": extract_location(text),
        "current_company": extract_current_company(text),
        "experience": extract_experience_years(text),
        "education": extract_education(text),
        "skills": extract_skills(text)
    }
    
    return parsed_data

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise ValueError(f"Error reading PDF: {str(e)}")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(io.BytesIO(file_content))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        raise ValueError(f"Error reading DOCX: {str(e)}")

def extract_name(text: str) -> str:
    """Extract candidate name (usually at the top of resume)"""
    lines = text.strip().split('\n')
    # Assume name is in first few non-empty lines
    for line in lines[:5]:
        line = line.strip()
        if line and len(line.split()) <= 4 and len(line) > 5:
            # Basic validation: not email, not phone, reasonable length
            if '@' not in line and not re.search(r'\d{3,}', line):
                return line
    return "Unknown"

def extract_email(text: str) -> str:
    """Extract email address"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    matches = re.findall(email_pattern, text)
    return matches[0] if matches else ""

def extract_phone(text: str) -> str:
    """Extract phone number"""
    # Pattern for various phone formats
    phone_pattern = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
    matches = re.findall(phone_pattern, text)
    return matches[0].strip() if matches else None

def extract_location(text: str) -> str:
    """Extract location/city"""
    # Look for common location indicators
    location_keywords = ['location:', 'address:', 'city:', 'based in']
    for keyword in location_keywords:
        pattern = rf'{keyword}\s*([A-Za-z\s,]+)'
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    # Fallback: look for city patterns
    lines = text.split('\n')
    for line in lines[:10]:
        if any(city in line.lower() for city in ['bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai']):
            return line.strip()
    
    return None

def extract_current_company(text: str) -> str:
    """Extract current company name"""
    # Look for patterns like "Currently at", "Working at", etc.
    company_patterns = [
        r'(?:currently|presently)\s+(?:at|with)\s+([A-Z][A-Za-z\s&]+)',
        r'(?:working|employed)\s+at\s+([A-Z][A-Za-z\s&]+)'
    ]
    
    for pattern in company_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    return None

def extract_experience_years(text: str) -> int:
    """Extract years of experience"""
    # Look for patterns like "5 years", "5+ years", "5-7 years"
    exp_patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        r'experience[:\s]+(\d+)\+?\s*years?'
    ]
    
    for pattern in exp_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return int(match.group(1))
    
    # Fallback: count date ranges in experience section
    # This is a simplified approach
    date_pattern = r'20\d{2}\s*[-–]\s*(?:20\d{2}|present|current)'
    matches = re.findall(date_pattern, text, re.IGNORECASE)
    if matches:
        return len(matches)  # Rough estimate
    
    return None

def extract_education(text: str) -> str:
    """Extract highest education"""
    education_keywords = ['bachelor', 'master', 'phd', 'mba', 'b.tech', 'm.tech', 'b.e', 'm.e', 'bsc', 'msc']
    
    lines = text.lower().split('\n')
    for line in lines:
        for keyword in education_keywords:
            if keyword in line:
                return line.strip()
    
    return None

def extract_skills(text: str) -> List[str]:
    """Extract skills from resume"""
    # Common technical skills to look for
    common_skills = [
        'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node.js', 'django', 'flask',
        'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
        'machine learning', 'deep learning', 'ai', 'data science', 'tensorflow', 'pytorch',
        'html', 'css', 'typescript', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
        'git', 'agile', 'scrum', 'rest api', 'graphql', 'microservices'
    ]
    
    text_lower = text.lower()
    found_skills = []
    
    for skill in common_skills:
        if skill in text_lower:
            found_skills.append(skill.title())
    
    # Remove duplicates and return
    return list(set(found_skills))[:15]  # Limit to 15 skills
