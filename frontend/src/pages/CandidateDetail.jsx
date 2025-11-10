import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowLeft, Mail, Phone, MapPin, Briefcase, 
  GraduationCap, Calendar, Award, TrendingUp, FileText,
  CheckCircle, Clock, Target
} from 'lucide-react';
import { mockRecruitments, mockCandidates } from '../data/mockData';

function CandidateDetail() {
  const { recruitmentId, candidateId } = useParams();
  const navigate = useNavigate();
  
  const recruitment = mockRecruitments.find(r => r.id === parseInt(recruitmentId));
  const candidates = mockCandidates[parseInt(recruitmentId)] || [];
  const candidate = candidates.find(c => c.id === parseInt(candidateId));

  if (!candidate || !recruitment) {
    return <div className="min-h-screen flex items-center justify-center">Candidate not found</div>;
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 80) return 'bg-blue-100 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 border-yellow-200';
    return 'bg-orange-100 border-orange-200';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Offered':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Interviewed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'New':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/recruitment/${recruitmentId}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">Candidly</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Candidate Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{candidate.name}</h2>
                <p className="text-lg text-gray-600 mb-3">{candidate.currentCompany} • {candidate.experience}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {candidate.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {candidate.phone}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {candidate.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border inline-block ${getStatusColor(candidate.status)}`}>
                {candidate.status}
              </span>
              <p className="text-sm text-gray-500 mt-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-2">Applying for:</p>
            <p className="text-lg font-semibold text-gray-900">{recruitment.title}</p>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* ATS Score */}
          <div className={`bg-white rounded-lg shadow-sm border-2 p-8 ${getScoreBackground(candidate.atsScore)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ATS Score</h3>
                  <p className="text-sm text-gray-600">Resume Match</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-5xl font-bold ${getScoreColor(candidate.atsScore)}`}>
                  {candidate.atsScore}
                </p>
                <p className="text-sm text-gray-600">out of 100</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  candidate.atsScore >= 90 ? 'bg-green-600' :
                  candidate.atsScore >= 80 ? 'bg-blue-600' :
                  candidate.atsScore >= 70 ? 'bg-yellow-600' : 'bg-orange-600'
                }`}
                style={{ width: `${candidate.atsScore}%` }}
              />
            </div>
            <div className="mt-4 flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <p className="text-sm text-gray-700">
                Strong match with job requirements. Skills and experience align well with the position.
              </p>
            </div>
          </div>

          {/* Interview Score */}
          <div className={`bg-white rounded-lg shadow-sm border-2 p-8 ${
            candidate.interviewScore 
              ? getScoreBackground(candidate.interviewScore)
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Interview Score</h3>
                  <p className="text-sm text-gray-600">AI Assessment</p>
                </div>
              </div>
              <div className="text-right">
                {candidate.interviewScore ? (
                  <>
                    <p className={`text-5xl font-bold ${getScoreColor(candidate.interviewScore)}`}>
                      {candidate.interviewScore}
                    </p>
                    <p className="text-sm text-gray-600">out of 100</p>
                  </>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="w-8 h-8" />
                    <p className="text-sm">Not yet<br/>interviewed</p>
                  </div>
                )}
              </div>
            </div>
            {candidate.interviewScore ? (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      candidate.interviewScore >= 90 ? 'bg-green-600' :
                      candidate.interviewScore >= 80 ? 'bg-blue-600' :
                      candidate.interviewScore >= 70 ? 'bg-yellow-600' : 'bg-orange-600'
                    }`}
                    style={{ width: `${candidate.interviewScore}%` }}
                  />
                </div>
                <div className="mt-4 flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Excellent communication skills and technical knowledge demonstrated during interview.
                  </p>
                </div>
              </>
            ) : (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Candidate Summary</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
            </div>

            {/* Skills Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Skills & Expertise</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium border border-primary-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Combined Score */}
            {candidate.interviewScore && (
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-100 mb-1">Overall Score</p>
                    <h3 className="text-4xl font-bold">
                      {Math.round((candidate.atsScore + candidate.interviewScore) / 2)}
                    </h3>
                    <p className="text-sm text-primary-100 mt-1">
                      Combined ATS & Interview Assessment
                    </p>
                  </div>
                  <Award className="w-16 h-16 text-primary-200" />
                </div>
              </div>
            )}
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            {/* Education Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-gray-900">Education</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{candidate.education}</p>
            </div>

            {/* Experience Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-gray-900">Experience</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total Experience</p>
                  <p className="text-lg font-semibold text-gray-900">{candidate.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Company</p>
                  <p className="text-lg font-semibold text-gray-900">{candidate.currentCompany}</p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Schedule Interview
                </button>
                <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Move to Shortlist
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
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
