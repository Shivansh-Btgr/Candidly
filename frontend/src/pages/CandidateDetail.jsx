import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowLeft, Mail, Phone, MapPin, Briefcase, 
  GraduationCap, Calendar, Award, TrendingUp, FileText,
  CheckCircle, Clock, Target, AlertTriangle, Shield, Download
} from 'lucide-react';
import { candidatesApi } from '../services/api';

function CandidateDetail() {
  const { recruitmentId, candidateId } = useParams();
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const data = await candidatesApi.getById(candidateId);
        console.log('Candidate data:', data); // Debug log
        setCandidate(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching candidate:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidate();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Candidate not found'}</p>
          <button
            onClick={() => navigate('/recruiter')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadTranscript = async () => {
    try {
      const data = await candidatesApi.getTranscript(candidateId);
      // For now, show alert with transcript URL
      alert(`Transcript URL: ${data.transcript_url}`);
      // TODO: Implement actual file download
    } catch (err) {
      alert('Transcript not available');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return 'bg-green-900/20 border-green-800';
    if (score >= 80) return 'bg-blue-900/20 border-blue-800';
    if (score >= 70) return 'bg-yellow-900/20 border-yellow-800';
    return 'bg-orange-900/20 border-orange-800';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Offered':
        return 'bg-purple-900/30 text-purple-400 border-purple-800';
      case 'Interviewed':
        return 'bg-green-900/30 text-green-400 border-green-800';
      case 'Shortlisted':
        return 'bg-blue-900/30 text-blue-400 border-blue-800';
      case 'New':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="bg-dark-900 shadow-sm border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/recruiter')}
                className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-white">Candidly</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Candidate Header */}
        <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold text-3xl border-2 border-primary-500">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{candidate.name}</h2>
                {candidate.experience && (
                  <p className="text-lg text-gray-300 mb-3 line-clamp-1">{candidate.experience}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {candidate.email}
                  </span>
                  {candidate.phone && (
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {candidate.phone}
                    </span>
                  )}
                  {candidate.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {candidate.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border inline-block ${getStatusColor(candidate.status)}`}>
                {candidate.status}
              </span>
              <p className="text-sm text-gray-500 mt-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Applied: {new Date(candidate.applied_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {candidate.recruitment_title && (
            <div className="border-t border-dark-700 pt-6">
              <p className="text-sm text-gray-400 mb-2">Applying for:</p>
              <p className="text-lg font-semibold text-white">{candidate.recruitment_title}</p>
            </div>
          )}
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* ATS Score */}
          <div className={`bg-dark-800 rounded-lg shadow-sm border-2 p-8 ${getScoreBackground(candidate.ats_score)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-dark-900 rounded-full flex items-center justify-center border border-dark-700">
                  <Target className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">ATS Score</h3>
                  <p className="text-sm text-gray-400">Resume Match</p>
                </div>
              </div>
              <div className="text-right">
                {candidate.ats_score !== null && candidate.ats_score !== undefined ? (
                  <>
                    <p className={`text-5xl font-bold ${getScoreColor(candidate.ats_score)}`}>
                      {candidate.ats_score}
                    </p>
                    <p className="text-sm text-gray-400">out of 100</p>
                  </>
                ) : (
                  <p className="text-3xl font-semibold text-gray-500">N/A</p>
                )}
              </div>
            </div>
            {candidate.ats_score !== null && candidate.ats_score !== undefined ? (
              <>
                <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      candidate.ats_score >= 90 ? 'bg-green-500' :
                      candidate.ats_score >= 80 ? 'bg-blue-500' :
                      candidate.ats_score >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${candidate.ats_score}%` }}
                  />
                </div>
                <div className="mt-4 flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Strong match with job requirements. Skills and experience align well with the position.
                  </p>
                </div>
              </>
            ) : (
              <div className="mt-4 p-4 bg-dark-900 rounded-lg border border-dark-700">
                <p className="text-sm text-gray-400 text-center">
                  Resume analysis pending
                </p>
              </div>
            )}
          </div>

          {/* Interview Score */}
          <div className={`bg-dark-800 rounded-lg shadow-sm border-2 p-8 ${
            candidate.interview_score 
              ? getScoreBackground(candidate.interview_score)
              : 'bg-dark-800 border-dark-700'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-dark-900 rounded-full flex items-center justify-center border border-dark-700">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Interview Score</h3>
                  <p className="text-sm text-gray-400">AI Assessment</p>
                </div>
              </div>
              <div className="text-right">
                {candidate.interview_score ? (
                  <>
                    <p className={`text-5xl font-bold ${getScoreColor(candidate.interview_score)}`}>
                      {candidate.interview_score}
                    </p>
                    <p className="text-sm text-gray-400">out of 100</p>
                  </>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-8 h-8" />
                    <p className="text-sm">Not yet<br/>interviewed</p>
                  </div>
                )}
              </div>
            </div>
            {candidate.interview_score ? (
              <>
                <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      candidate.interview_score >= 90 ? 'bg-green-500' :
                      candidate.interview_score >= 80 ? 'bg-blue-500' :
                      candidate.interview_score >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${candidate.interview_score}%` }}
                  />
                </div>
                <div className="mt-4 flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Excellent communication skills and technical knowledge demonstrated during interview.
                  </p>
                </div>
              </>
            ) : (
              <div className="mt-4 p-4 bg-dark-900 rounded-lg border border-dark-700">
                <p className="text-sm text-gray-400 text-center">
                  Interview pending. Schedule an AI interview to get detailed assessment.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Summary Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Summary Card */}
            <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-primary-400" />
                <h3 className="text-xl font-bold text-white">Candidate Summary</h3>
              </div>
              {candidate.summary ? (
                <p className="text-gray-300 leading-relaxed">{candidate.summary}</p>
              ) : (
                <p className="text-gray-500 italic">N/A - Interview pending</p>
              )}
            </div>

            {/* Skills Card */}
            <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                <h3 className="text-xl font-bold text-white">Skills & Expertise</h3>
              </div>
              {candidate.skills ? (
                <p className="text-gray-300 whitespace-pre-line">{candidate.skills}</p>
              ) : (
                <p className="text-gray-500 italic">N/A</p>
              )}
            </div>

            {/* Combined Score */}
            {candidate.interview_score && (
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg shadow-lg p-6 text-white border border-primary-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-200 mb-1">Overall Score</p>
                    <h3 className="text-4xl font-bold">
                      {Math.round((candidate.ats_score + candidate.interview_score) / 2)}
                    </h3>
                    <p className="text-sm text-primary-200 mt-1">
                      Combined ATS & Interview Assessment
                    </p>
                  </div>
                  <Award className="w-16 h-16 text-primary-300 opacity-50" />
                </div>
              </div>
            )}
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            {/* Education Card */}
            <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-bold text-white">Education</h3>
              </div>
              {candidate.education ? (
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{candidate.education}</p>
              ) : (
                <p className="text-gray-500 text-sm italic">N/A</p>
              )}
            </div>

            {/* Flags Card */}
            <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-bold text-white">Interview Flags</h3>
              </div>
              <div className="space-y-3">
                {!candidate.flags ? (
                  <p className="text-gray-500 text-sm italic">N/A - Interview pending</p>
                ) : candidate.flags.length === 0 ? (
                  <div className="flex items-center space-x-2 p-3 bg-green-900/20 border border-green-800 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-400">No Flags</p>
                      <p className="text-xs text-gray-400">All good - clean interview</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {candidate.flags?.some(f => f.type === 'sound') && (
                      <div className="flex items-center space-x-2 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-400">Sound Flag</p>
                          <p className="text-xs text-gray-400">Suspicious sounds detected</p>
                        </div>
                      </div>
                    )}
                    {candidate.flags?.some(f => f.type === 'face') && (
                      <div className="flex items-center space-x-2 p-3 bg-orange-900/20 border border-orange-800 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-orange-400">Face Flag</p>
                          <p className="text-xs text-gray-400">Multiple faces detected</p>
                        </div>
                      </div>
                    )}
                    {candidate.flags?.some(f => f.type === 'ai') && (
                      <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-400">AI Flag</p>
                          <p className="text-xs text-gray-400">Potential AI cheating</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/50">
                  Schedule Interview
                </button>
                <button 
                  onClick={handleDownloadTranscript}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors flex items-center justify-center space-x-2"
                  disabled={!candidate.transcript_url}
                >
                  <Download className="w-4 h-4" />
                  <span>Download Interview Transcript</span>
                </button>
                <button className="w-full px-4 py-3 border border-dark-600 text-gray-300 rounded-lg font-semibold hover:bg-dark-700 transition-colors">
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CandidateDetail;
