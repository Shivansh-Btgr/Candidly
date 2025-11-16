# Candidly — Backend (FastAPI)

This folder contains the FastAPI backend for Candidly. It provides APIs for recruitment management, candidate lifecycle, and the AI interview flow.

## Quick setup

1. Create and activate a Python virtual environment (Windows):

```cmd
cd backend
python -m venv .venv
.venv\Scripts\activate
```

2. Install Python dependencies:

```cmd
pip install -r requirements.txt
```

3. Copy and edit environment variables:

```cmd
copy .env.example .env
# Edit .env to configure DATABASE_URL, OPENAI_API_KEY (optional), SECRET_KEY, CORS_ORIGINS
```

4. Start the development server:

```cmd
uvicorn app.main:app --reload
```

API docs: `http://localhost:8000/docs`

## Notes
- The project uses SQLite by default for development. For production, set `DATABASE_URL` to a PostgreSQL instance.
- Do NOT commit `.env` or any secrets to source control.

## Important endpoints
- `POST /api/interview/start` — start interview (session_token)
- `POST /api/interview/chat` — single-turn chat with AI (message + conversation_history)
- `POST /api/interview/submit` — submit interview responses for scoring
- `POST /api/interview/update-flags` — update monitoring flags (candidate_id or session_token)
- `GET /api/candidates/{id}/transcript` — download transcript file

## Preparing for Git
- Ensure `.gitignore` includes `.venv/`, `__pycache__/`, and uploaded transcript files.
- Remove local secrets from `.env` before pushing.
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
