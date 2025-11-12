import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Search, ChevronDown, MapPin, Mail, Phone, Briefcase, Award, Settings } from 'lucide-react';
import { mockRecruitments, mockCandidates } from '../data/mockData';

function RecruiterDashboard() {
  const navigate = useNavigate();
  
  // Single recruitment drive - using ID 1 as default
  const recruitment = mockRecruitments.find(r => r.id === 1);
  const candidates = mockCandidates[1] || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('atsScore');

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
                onClick={() => navigate('/')}
                className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-white">Candidly</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/recruiter/config')}
                className="flex items-center space-x-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-lg font-semibold transition-colors border border-dark-700"
              >
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-300">Recruiter Dashboard</p>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                R
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Recruitment Header */}
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-white mb-2">{recruitment.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
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
            <div className="bg-primary-900/20 rounded-lg p-4 border border-primary-800">
              <p className="text-sm text-gray-400 mb-1">Total Applicants</p>
              <p className="text-3xl font-bold text-primary-400">{recruitment.totalApplicants}</p>
            </div>
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800">
              <p className="text-sm text-gray-400 mb-1">Shortlisted</p>
              <p className="text-3xl font-bold text-blue-400">{recruitment.shortlisted}</p>
            </div>
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-800">
              <p className="text-sm text-gray-400 mb-1">Interviewed</p>
              <p className="text-3xl font-bold text-green-400">{recruitment.interviewed}</p>
            </div>
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-800">
              <p className="text-sm text-gray-400 mb-1">Offers Made</p>
              <p className="text-3xl font-bold text-purple-400">{recruitment.offered}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search candidates by name, email, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-dark-600 bg-dark-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500"
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-dark-900 text-white cursor-pointer"
              >
                <option value="atsScore">Sort by ATS Score</option>
                <option value="interviewScore">Sort by Interview Score</option>
                <option value="date">Sort by Application Date</option>
                <option value="name">Sort by Name</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Candidates List */}
        <div className="space-y-4">
          {filteredCandidates.length === 0 ? (
            <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-12 text-center">
              <p className="text-gray-500">No candidates found</p>
            </div>
          ) : (
            filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => navigate(`/candidate/1/${candidate.id}`)}
                className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-6 hover:shadow-lg transition-all cursor-pointer hover:border-primary-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-primary-900/30 border border-primary-800 rounded-full flex items-center justify-center text-primary-400 font-semibold text-lg">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                        <p className="text-sm text-gray-400">{candidate.currentCompany} • {candidate.experience}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Mail className="w-4 h-4 mr-2" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Phone className="w-4 h-4 mr-2" />
                        {candidate.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {candidate.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {candidate.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-xs font-medium border border-dark-600"
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
                          <Award className="w-4 h-4 text-primary-400" />
                          <p className="text-2xl font-bold text-primary-400">{candidate.atsScore}</p>
                        </div>
                        <p className="text-xs text-gray-500">ATS Score</p>
                      </div>
                      {candidate.interviewScore && (
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4 text-green-400" />
                            <p className="text-2xl font-bold text-green-400">{candidate.interviewScore}</p>
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

export default RecruiterDashboard;
