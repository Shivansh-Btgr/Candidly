import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDetail from './pages/CandidateDetail';
import RecruitmentConfig from './pages/RecruitmentConfig';
import ApplicantInterviewCode from './pages/ApplicantInterviewCode';
import ApplicantDetailsForm from './pages/ApplicantDetailsForm';
import ApplicantProfile from './pages/ApplicantProfile';
import ApplicantInterview from './pages/ApplicantInterview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/config" element={<RecruitmentConfig />} />
        <Route path="/candidate/:recruitmentId/:candidateId" element={<CandidateDetail />} />
        
        {/* Applicant Flow */}
        <Route path="/applicant/code" element={<ApplicantInterviewCode />} />
        <Route path="/applicant/details" element={<ApplicantDetailsForm />} />
        <Route path="/applicant/profile" element={<ApplicantProfile />} />
        <Route path="/applicant/interview" element={<ApplicantInterview />} />
      </Routes>
    </Router>
  );
}

export default App;
