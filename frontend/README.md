# Frontend — Candidly (React + Vite)

This folder contains the React frontend for Candidly. It is built with Vite and Tailwind CSS and connects to the FastAPI backend at `http://localhost:8000` by default.

## Quickstart

Prerequisites: Node.js 16+ and npm

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Configuration
- The frontend expects the backend API to be available at `http://localhost:8000/api`.
- If you host the backend elsewhere, update the base URL in `src/services/api.js`.

## Key Pages
- Landing page (role selection)
- Recruiter dashboard (list of recruitment drives)
- Candidate detail page (scores, flags, transcripts)
- Applicant interview page (video + speech-based interview)

## Preparing for Git
- Ensure `node_modules/` and local build artifacts are ignored in `.gitignore`.
- Remove any temporary debug helpers before committing.

## Troubleshooting
- If microphone or camera access fails, ensure your browser has permissions and no other app is locking the device.
- The speech-based interview uses the Web Speech API (Chrome/Edge recommended).
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
