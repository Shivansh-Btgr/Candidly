import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Search, ChevronDown, MapPin, Mail, Phone, Briefcase, Award } from 'lucide-react';
import { mockRecruitments, mockCandidates } from '../data/mockData';

function RecruitmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recruitment = mockRecruitments.find(r => r.id === parseInt(id));
  const candidates = mockCandidates[parseInt(id)] || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('atsScore');

  if (!recruitment) {
    return <div className="min-h-screen flex items-center justify-center">Recruitment not found</div>;
  }

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(candidate =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'atsScore':
          return b.atsScore - a.atsScore;
        case 'interviewScore':
          return (b.interviewScore || 0) - (a.interviewScore || 0);
        case 'date':
          return new Date(b.appliedDate) - new Date(a.appliedDate);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

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
                onClick={() => navigate('/recruiter')}
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

      {/* Recruitment Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{recruitment.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {recruitment.department}
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {recruitment.location}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
              <p className="text-sm text-gray-600 mb-1">Total Applicants</p>
              <p className="text-3xl font-bold text-primary-600">{recruitment.totalApplicants}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Shortlisted</p>
              <p className="text-3xl font-bold text-blue-600">{recruitment.shortlisted}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-gray-600 mb-1">Interviewed</p>
              <p className="text-3xl font-bold text-green-600">{recruitment.interviewed}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <p className="text-sm text-gray-600 mb-1">Offers Made</p>
              <p className="text-3xl font-bold text-purple-600">{recruitment.offered}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name, email, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="atsScore">Sort by ATS Score</option>
                <option value="interviewScore">Sort by Interview Score</option>
                <option value="date">Sort by Application Date</option>
                <option value="name">Sort by Name</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Candidates List */}
        <div className="space-y-4">
          {filteredCandidates.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No candidates found</p>
            </div>
          ) : (
            filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => navigate(`/candidate/${id}/${candidate.id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer hover:border-primary-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-lg">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.currentCompany} • {candidate.experience}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {candidate.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {candidate.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {candidate.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col items-end space-y-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4 text-primary-600" />
                          <p className="text-2xl font-bold text-primary-600">{candidate.atsScore}</p>
                        </div>
                        <p className="text-xs text-gray-500">ATS Score</p>
                      </div>
                      {candidate.interviewScore && (
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4 text-green-600" />
                            <p className="text-2xl font-bold text-green-600">{candidate.interviewScore}</p>
                          </div>
                          <p className="text-xs text-gray-500">Interview</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default RecruitmentDetail;
