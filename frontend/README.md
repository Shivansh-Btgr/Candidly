# Candidly - AI Interview Platform

A beautiful and modern frontend for an AI-powered interview platform built with React, Vite, and Tailwind CSS.

## Features

### 🏠 Landing Page
- Clean and modern design with role selection
- Choose between Recruiter and Applicant dashboards
- Attractive hero section with feature highlights

### 👔 Recruiter Dashboard
- View all active recruitment campaigns
- Expandable cards showing recruitment details
- Real-time statistics (Total Applicants, Shortlisted, Interviewed, Offers)
- Progress tracking for each recruitment

### 📋 Recruitment Detail Page
- Comprehensive statistics overview
- Advanced search functionality
- Sort candidates by:
  - ATS Score
  - Interview Score
  - Application Date
  - Name
- Beautiful candidate cards with key information
- Quick access to candidate profiles

### 👤 Candidate Detail Page
- Detailed candidate dashboard
- **ATS Score** - Resume match with job requirements
- **Interview Score** - AI assessment results
- Comprehensive candidate summary
- Skills and expertise visualization
- Education and experience details
- Action buttons (Schedule Interview, Move to Shortlist, Download Resume)
- Overall combined score calculation

## Tech Stack

- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 16+ installed on your machine
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

## Project Structure

```
frontend/
├── src/
│   ├── data/
│   │   └── mockData.js          # Mock data for recruitments and candidates
│   ├── pages/
│   │   ├── LandingPage.jsx      # Landing page with role selection
│   │   ├── RecruiterDashboard.jsx   # Dashboard showing all recruitments
│   │   ├── RecruitmentDetail.jsx    # Candidate list with search/filter
│   │   └── CandidateDetail.jsx      # Detailed candidate profile
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Mock Data

The application includes comprehensive mock data for demonstration:

- **4 Recruitment campaigns** with different statuses
- **Multiple candidates** per recruitment with:
  - Personal information
  - ATS scores (78-96)
  - Interview scores (where applicable)
  - Skills and experience
  - Education details
  - Application status

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Design Features

### Color Scheme
- **Primary**: Blue gradient (from sky to ocean blue)
- **Accent colors**: Green (success), Purple (offers), Yellow (pending)
- Clean white backgrounds with subtle shadows

### UI Components
- Responsive grid layouts
- Smooth hover transitions
- Score visualization with progress bars
- Status badges with color coding
- Interactive cards with depth
- Beautiful gradients for premium feel

### User Experience
- Intuitive navigation with breadcrumbs
- Back buttons for easy navigation
- Search and filter functionality
- Sortable candidate lists
- Click-to-expand details
- Visual score indicators

## Customization

### Adding New Recruitments
Edit `src/data/mockData.js` and add new entries to the `mockRecruitments` array.

### Adding New Candidates
Add candidates to the `mockCandidates` object using the recruitment ID as the key.

### Styling
Modify `tailwind.config.js` to customize colors, fonts, and other theme settings.

## Future Enhancements

- Backend API integration
- User authentication
- Real-time notifications
- Video interview integration
- Resume parsing
- Email templates
- Analytics dashboard
- Applicant portal

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for demonstration purposes.

---

Built with ❤️ using React and Tailwind CSS
