# Candidly - AI Interview Platform

An intelligent interview platform that uses AI to conduct interviews, analyze resumes, and provide comprehensive candidate assessments for recruiters.

## 🎯 Project Overview

Candidly streamlines the recruitment process by automating candidate screening and interviews using AI technology. The platform supports both recruiters managing hiring drives and candidates taking AI-powered interviews.

## ✨ Current Features

### Recruiter Dashboard (Completed)
- **Landing Page**: Role selection between Recruiter and Applicant
- **Recruiter Dashboard**: 
  - View all candidates for the active recruitment drive
  - Search candidates by name, email, or status
  - Sort by ATS Score, Interview Score, Date, or Name
  - Real-time statistics (Total Applicants, Shortlisted, Interviewed, Offers Made)
  - Status badges (New, Shortlisted, Interviewed, Offered)
- **Candidate Detail Page**:
  - Comprehensive candidate profile with scores and summary
  - ATS Score and Interview Score with visual indicators
  - Skills, Education, and Contact information
  - Interview integrity flags (Sound, Face, AI detection)
  - Download interview transcript functionality
- **Configuration Page**:
  - Edit recruitment drive title
  - View and copy interview access code
  - Manage recruitment settings (department, location, status)

### Design & UI
- Dark purple theme with modern, professional aesthetics
- Fully responsive layout
- Smooth transitions and interactions
- Icon-based navigation using Lucide React

## 🚀 Tech Stack

### Frontend
- **React 18.2.0** - Component-based UI
- **Vite 4.4.0** - Fast development build tool
- **Tailwind CSS 3.3.6** - Utility-first styling with custom dark theme
- **React Router 6.20.0** - Client-side routing
- **Lucide React 0.292.0** - Beautiful icon library

### Backend (To Be Implemented)
- **FastAPI** - High-performance Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation and settings management

## 📋 Workflow

### Candidate Journey
1. **Landing**: Candidate selects "Applicant" role
2. **Interview Code Entry**: Enter code provided by recruiter
3. **Resume Upload**: Upload resume (PDF/DOCX)
4. **Automatic Processing**:
   - Resume parsed and candidate details extracted
   - Candidate entry created in database
   - ATS score calculated using AI
5. **AI Interview**: Conduct interview with AI interviewer
6. **Post-Interview**: System generates transcript, flags, and summary

### Recruiter Journey
1. **Dashboard**: View all candidates with search/filter/sort
2. **Candidate Review**: Click candidate to see detailed profile
3. **Configuration**: Access settings to manage recruitment drive and interview code
4. **Actions**: Download transcripts, update candidate status

## 🔧 Features To Do

### High Priority - Candidate Frontend
- [ ] Build Applicant landing page (interview code entry)
- [ ] Create resume upload interface
- [ ] Design AI interview interface (video/audio capture)
- [ ] Build interview progress tracking UI
- [ ] Add interview completion confirmation page

### High Priority - Backend API
- [ ] **Database Models**:
  - Recruitment model (id, title, department, location, status, interview_code)
  - Candidate model (personal info, scores, status, flags, timestamps)
  - Interview model (transcript, recording metadata)
  
- [ ] **Recruitment Endpoints**:
  - `GET /api/recruitment` - Get active recruitment
  - `POST /api/recruitment` - Create new recruitment
  - `PUT /api/recruitment/{id}` - Update recruitment details
  - `GET /api/recruitment/{id}/stats` - Get statistics

- [ ] **Candidate Endpoints**:
  - `GET /api/candidates` - List with search/filter/sort
  - `GET /api/candidates/{id}` - Get candidate details
  - `POST /api/candidates` - Create candidate from resume
  - `PUT /api/candidates/{id}` - Update candidate
  - `PATCH /api/candidates/{id}/status` - Update status
  - `GET /api/candidates/{id}/transcript` - Download transcript

- [ ] **Interview Endpoints**:
  - `POST /api/interview/validate-code` - Verify interview code
  - `POST /api/interview/upload-resume` - Upload and process resume
  - `POST /api/interview/start` - Start interview session
  - `POST /api/interview/submit` - Submit interview responses
  - `GET /api/interview/{id}/status` - Get interview status

### High Priority - AI Integration
- [ ] **Resume Parser**:
  - Extract name, email, phone, location, experience
  - Parse education, skills, work history
  - Handle PDF and DOCX formats
  
- [ ] **ATS Scoring Service**:
  - Analyze resume against job requirements
  - Generate 0-100 score
  - Provide scoring breakdown

- [ ] **AI Interviewer**:
  - Generate contextual interview questions
  - Process candidate responses (speech-to-text)
  - Conduct natural conversation flow
  - Generate interview score (0-100)
  
- [ ] **Interview Analysis**:
  - Detect sound anomalies (flag: "sound")
  - Detect face/identity issues (flag: "face")
  - Detect AI-generated responses (flag: "ai")
  - Generate candidate summary
  - Create detailed transcript

### Medium Priority
- [ ] Session management for candidates (cookie/token-based, no login)
- [ ] File storage system (S3/local) for resumes and transcripts
- [ ] Email notifications (interview code delivery, status updates)
- [ ] Bulk candidate operations (export CSV, bulk status update)
- [ ] Interview recording storage and playback
- [ ] Candidate self-service portal (check status with code)

### Low Priority / Future Enhancements
- [ ] Multi-recruiter support with authentication
- [ ] Advanced analytics dashboard
- [ ] Custom interview question templates
- [ ] Video interview recording review
- [ ] Automated shortlisting based on thresholds
- [ ] Integration with external ATS systems
- [ ] Mobile responsive candidate interview interface
- [ ] Real-time interview monitoring for recruiters
- [ ] Customizable scoring weights

## 🗂️ Project Structure

```
Candidly/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx           # Role selection
│   │   │   ├── RecruiterDashboard.jsx    # Main recruiter view
│   │   │   ├── CandidateDetail.jsx       # Candidate profile
│   │   │   └── RecruitmentConfig.jsx     # Settings page
│   │   ├── data/
│   │   │   └── mockData.js               # Mock data (to be replaced)
│   │   ├── App.jsx                        # Router configuration
│   │   └── index.css                      # Global styles
│   └── package.json
│
├── backend/                  # FastAPI backend (To Be Created)
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic
│   │   │   ├── resume_parser.py
│   │   │   ├── ats_scorer.py
│   │   │   ├── ai_interviewer.py
│   │   │   └── interview_analyzer.py
│   │   ├── database.py      # Database configuration
│   │   └── main.py          # FastAPI app
│   └── requirements.txt
│
└── README.md
```

## 🚦 Getting Started

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The app will run on `http://localhost:5173`

### Backend Setup (Coming Soon)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🔐 Authentication & Session Management

Since there's no login system, we use a simplified approach:

### For Candidates
- **Session Token**: Generated after entering valid interview code
- **Storage**: Browser localStorage/sessionStorage
- **Validation**: Token includes candidate_id and expires after interview completion
- **Flow**: 
  1. Enter interview code → Validate against database
  2. Generate unique session token (JWT or UUID)
  3. Store token in browser
  4. All subsequent API calls include token
  5. Token invalidated after interview submission

### For Recruiters
- Currently no authentication (single user)
- Future: Simple JWT-based auth for multi-recruiter support

## 🎨 Design System

### Color Palette
- **Primary Purple**: `#a855f7` to `#7c3aed` (primary-400 to primary-600)
- **Dark Backgrounds**: `#0a0a0f` to `#1a1a24` (dark-950 to dark-800)
- **Status Colors**:
  - Green: Interviewed
  - Blue: Shortlisted
  - Yellow: New
  - Purple: Offered
  - Red: Rejected

## 📝 API Response Examples

### Get Candidates
```json
GET /api/candidates?search=john&sort_by=atsScore

{
  "candidates": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "status": "Interviewed",
      "ats_score": 92,
      "interview_score": 88,
      "summary": "Strong technical background...",
      "flags": [{"type": "sound", "severity": "low"}]
    }
  ],
  "total": 1
}
```

### Create Candidate (from Resume)
```json
POST /api/candidates

Request:
{
  "interview_code": "CNDLY-001-SEN4a2b",
  "resume_file": "<file upload>"
}

Response:
{
  "candidate_id": 1,
  "session_token": "eyJhbGc...",
  "ats_score": 85,
  "message": "Resume processed successfully"
}
```

## 🤝 Contributing

This is a project in active development. Contributions and suggestions are welcome!

## 📄 License

MIT License - Feel free to use this project for your own purposes.

---

**Current Status**: ✅ Frontend Complete | 🚧 Backend In Progress | ⏳ AI Integration Pending
