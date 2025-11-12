import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Award, PlayCircle } from 'lucide-react';
import { candidatesApi } from '../services/api';

function ApplicantProfile() {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const candidateId = sessionStorage.getItem('candidate_id');
        if (!candidateId) {
          navigate('/applicant/code');
          return;
        }

        const data = await candidatesApi.getById(candidateId);
        setCandidate(data);
      } catch (err) {
        alert(`Error loading profile: ${err.message}`);
        navigate('/applicant/code');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleStartInterview = () => {
    navigate('/applicant/interview');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-900/20 border-green-800';
    if (score >= 60) return 'bg-yellow-900/20 border-yellow-800';
    return 'bg-red-900/20 border-red-800';
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="bg-dark-900 shadow-sm border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary-400" />
            <h1 className="text-2xl font-bold text-white">Candidly</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-12">
        {/* Success Message */}
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Profile Created Successfully!</h3>
              <p className="text-gray-300">
                Your application has been submitted. Review your profile below and start the interview when you're ready.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700">
          {/* Header Section */}
          <div className="p-8 border-b border-dark-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-primary-900/20 rounded-full flex items-center justify-center border-2 border-primary-800">
                  <User className="w-10 h-10 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{candidate.name}</h2>
                  <p className="text-gray-400 mb-3">{candidate.recruitment_title || 'Candidate'}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    {candidate.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{candidate.email}</span>
                      </div>
                    )}
                    {candidate.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{candidate.phone}</span>
                      </div>
                    )}
                    {candidate.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{candidate.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {candidate.ats_score !== null && (
                <div className={`px-6 py-4 rounded-lg border ${getScoreBgColor(candidate.ats_score)}`}>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">ATS Score</p>
                    <p className={`text-3xl font-bold ${getScoreColor(candidate.ats_score)}`}>
                      {candidate.ats_score}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Work Experience */}
              {candidate.experience && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">Work Experience</span>
                  </div>
                  <p className="text-white ml-6 whitespace-pre-line">{candidate.experience}</p>
                </div>
              )}

              {/* Skills */}
              {candidate.skills && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">Skills</span>
                  </div>
                  <p className="text-white ml-6">{candidate.skills}</p>
                </div>
              )}

              {/* Education */}
              {candidate.education && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Education</span>
                  </div>
                  <p className="text-white ml-6 whitespace-pre-line">{candidate.education}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-dark-700 bg-dark-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Ready to Begin?</h3>
                <p className="text-gray-400 text-sm">
                  Start your AI-powered interview. Make sure you're in a quiet environment.
                </p>
              </div>
              <button
                onClick={handleStartInterview}
                className="flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/50"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start Interview</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApplicantProfile;
