# Database Schema Reference

## Candidate Model

### Table: `candidates`

#### Personal Information (Required/Optional as noted)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes (PK) | Primary key, auto-increment |
| `name` | String | Yes | Candidate's full name |
| `email` | String | Yes | Email address (indexed) |
| `phone` | String | No | Phone number |
| `location` | String | No | Location/City |

#### Professional Information (All Optional)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `experience` | Text | No | Company + years as string. Can include multiple experiences. Will be fed to AI. |
| `skills` | Text | No | List of skills as string |
| `education` | String | No | Education details |

#### Status and Scores
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | String | Yes | Default: "New". Values: New, Shortlisted, Interviewed, Offered, Rejected |
| `ats_score` | Integer | No | ATS score (0-100) |
| `interview_score` | Integer | No | Interview score (0-100), null until interviewed |

#### Interview Data
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `summary` | Text | No | AI-generated candidate summary |
| `flags` | JSON | No | Array of flag objects: `[{"type": "sound", "severity": "high"}]` |
| `transcript_url` | String | No | URL to interview transcript |
| `resume_url` | String | No | URL to uploaded resume |

#### Session Management
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `session_token` | String | No | Session token for candidate interview (indexed) |

#### Relationships
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `recruitment_id` | Integer (FK) | Yes | Foreign key to `recruitments.id` |

#### Timestamps
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `applied_date` | DateTime | Yes | Auto-set on creation |
| `interview_date` | DateTime | No | Set when interview starts |
| `created_at` | DateTime | Yes | Auto-set on creation |
| `updated_at` | DateTime | Yes | Auto-updates on modification |

---

## Recruitment Model

### Table: `recruitments`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes (PK) | Primary key, auto-increment |
| `title` | String | Yes | Job title/position |
| `department` | String | No | Department name |
| `location` | String | No | Job location |
| `status` | String | Yes | Default: "Active". Values: Active, Paused, Closed |
| `requirements` | Text | No | AI instructions for ATS and interview evaluation |
| `interview_code` | String | Yes | Unique code for candidates (CNDLY-XXX-XXXXXX), indexed |
| `created_at` | DateTime | Yes | Auto-set on creation |
| `updated_at` | DateTime | Yes | Auto-updates on modification |

#### Relationships
- One-to-Many with `candidates` (cascade delete)

---

## Pydantic Schemas

### CandidateCreate
```python
{
    "name": "string",
    "email": "string (email format)",
    "phone": "string (optional)",
    "location": "string (optional)",
    "experience": "string (optional)",
    "skills": "string (optional)",
    "education": "string (optional)",
    "recruitment_id": "integer",
    "ats_score": "integer (optional)",
    "resume_url": "string (optional)"
}
```

### CandidateResponse
```python
{
    "id": "integer",
    "name": "string",
    "email": "string",
    "phone": "string (optional)",
    "location": "string (optional)",
    "experience": "string (optional)",
    "skills": "string (optional)",
    "education": "string (optional)",
    "recruitment_id": "integer",
    "recruitment_title": "string (optional)",
    "status": "string",
    "ats_score": "integer (optional)",
    "interview_score": "integer (optional)",
    "summary": "string (optional)",
    "flags": "array of objects (optional)",
    "transcript_url": "string (optional)",
    "resume_url": "string (optional)",
    "applied_date": "datetime",
    "interview_date": "datetime (optional)"
}
```

### CandidateUpdate
All fields optional except those you want to update:
```python
{
    "name": "string (optional)",
    "email": "string (optional)",
    "phone": "string (optional)",
    "location": "string (optional)",
    "experience": "string (optional)",
    "skills": "string (optional)",
    "education": "string (optional)",
    "status": "string (optional)",
    "ats_score": "integer (optional)",
    "interview_score": "integer (optional)",
    "summary": "string (optional)",
    "flags": "array (optional)",
    "transcript_url": "string (optional)"
}
```

### RecruitmentCreate
```python
{
    "title": "string",
    "department": "string (optional)",
    "location": "string (optional)",
    "requirements": "string (optional)"
}
```

---

## Notes

- **Database**: SQLite (development), file: `candidly.db`
- **Migration**: Delete `candidly.db` to recreate schema after model changes
- **Professional Info**: Simplified to strings for easier AI processing
- **Skills & Experience**: Now plain text fields instead of structured data
- **Status Values**: New → Shortlisted → Interviewed → Offered/Rejected
