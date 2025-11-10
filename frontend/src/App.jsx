import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruitmentDetail from './pages/RecruitmentDetail';
import CandidateDetail from './pages/CandidateDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruitment/:id" element={<RecruitmentDetail />} />
        <Route path="/candidate/:recruitmentId/:candidateId" element={<CandidateDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
