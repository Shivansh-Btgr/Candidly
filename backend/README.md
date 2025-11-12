# Candidly Backend

FastAPI backend for the Candidly AI interview platform.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
- `DATABASE_URL`: Your PostgreSQL connection string (or use SQLite for development)
- `OPENAI_API_KEY`: Your OpenAI API key (for AI features)
- `SECRET_KEY`: A secure random string
- `CORS_ORIGINS`: Frontend URL (http://localhost:5173)

## Run the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## Project Structure

```
app/
├── models/              # Database models
│   ├── recruitment.py   # Recruitment model
│   └── candidate.py     # Candidate model
├── schemas/             # Pydantic schemas
│   ├── recruitment.py   # Recruitment schemas
│   ├── candidate.py     # Candidate schemas
│   └── interview.py     # Interview schemas
├── routers/             # API endpoints
│   ├── recruitment.py   # Recruitment endpoints
│   ├── candidates.py    # Candidate endpoints
│   └── interview.py     # Interview endpoints
├── services/            # Business logic
│   ├── resume_parser.py    # Resume parsing
│   ├── ats_scorer.py       # ATS scoring
│   ├── ai_interviewer.py   # AI interview (TODO)
│   └── interview_analyzer.py  # Interview analysis (TODO)
├── database.py          # Database configuration
└── main.py             # FastAPI app
```

## API Endpoints

### Recruitment
- `GET /api/recruitment` - Get active recruitment
- `GET /api/recruitment/{id}` - Get recruitment by ID
- `POST /api/recruitment` - Create new recruitment
- `PUT /api/recruitment/{id}` - Update recruitment
- `DELETE /api/recruitment/{id}` - Delete recruitment
- `GET /api/recruitment/{id}/stats` - Get recruitment statistics
- `POST /api/recruitment/regenerate-code/{id}` - Regenerate interview code

### Candidates
- `GET /api/candidates` - List candidates (with search, filter, sort)
- `GET /api/candidates/{id}` - Get candidate details
- `POST /api/candidates` - Create candidate
- `PUT /api/candidates/{id}` - Update candidate
- `PATCH /api/candidates/{id}/status` - Update candidate status
- `DELETE /api/candidates/{id}` - Delete candidate
- `GET /api/candidates/{id}/transcript` - Download transcript

### Interview
- `POST /api/interview/validate-code` - Validate interview code
- `POST /api/interview/upload-resume` - Upload resume and create profile
- `POST /api/interview/start` - Start interview session
- `POST /api/interview/submit` - Submit interview responses
- `GET /api/interview/status/{token}` - Get interview status

## Database

The application uses SQLAlchemy ORM with support for:
- **PostgreSQL** (recommended for production)
- **SQLite** (default for development)

Database tables are automatically created on first run.

## Development Status

✅ **Completed:**
- Database models (Recruitment, Candidate)
- All API endpoints
- Resume parsing (PDF, DOCX)
- Basic ATS scoring
- Session token management

🚧 **In Progress:**
- AI interviewer integration
- Interview analysis (audio/video)
- File storage system

⏳ **Planned:**
- OpenAI integration for AI interviews
- Speech-to-text for candidate responses
- Video/audio analysis for flags
- AI-generated summaries and scores
- Email notifications

## Testing

Test the API using the interactive docs at `/docs` or with curl:

```bash
# Create a recruitment
curl -X POST http://localhost:8000/api/recruitment \
  -H "Content-Type: application/json" \
  -d '{"title":"Senior Developer","department":"Engineering","location":"Bangalore"}'

# Get active recruitment
curl http://localhost:8000/api/recruitment

# List candidates
curl http://localhost:8000/api/candidates?sort_by=atsScore
```

## Environment Variables

- `DATABASE_URL`: Database connection string
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `SECRET_KEY`: Secret key for session tokens
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
