import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDetail from './pages/CandidateDetail';
import RecruitmentConfig from './pages/RecruitmentConfig';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/config" element={<RecruitmentConfig />} />
        <Route path="/candidate/:recruitmentId/:candidateId" element={<CandidateDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
