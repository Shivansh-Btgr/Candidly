import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Briefcase, MapPin, Calendar, Users, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { mockRecruitments } from '../data/mockData';

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">Candidly</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Recruiter Dashboard</p>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                R
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Recruitments</h2>
          <p className="text-gray-600">Manage your ongoing recruitment campaigns</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Positions</p>
                <p className="text-3xl font-bold text-gray-900">{mockRecruitments.length}</p>
              </div>
              <Briefcase className="w-10 h-10 text-primary-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Applicants</p>
                <p className="text-3xl font-bold text-gray-900">
                  {mockRecruitments.reduce((sum, r) => sum + r.totalApplicants, 0)}
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Interviewed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {mockRecruitments.reduce((sum, r) => sum + r.interviewed, 0)}
                </p>
              </div>
              <Users className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Offers Made</p>
                <p className="text-3xl font-bold text-gray-900">
                  {mockRecruitments.reduce((sum, r) => sum + r.offered, 0)}
                </p>
              </div>
              <Users className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Recruitment Cards */}
        <div className="space-y-4">
          {mockRecruitments.map((recruitment) => (
            <div
              key={recruitment.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {recruitment.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(recruitment.status)}`}>
                        {recruitment.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {recruitment.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {recruitment.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Posted: {new Date(recruitment.datePosted).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{recruitment.description}</p>
                  </div>
                  <button
                    onClick={() => toggleExpand(recruitment.id)}
                    className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedId === recruitment.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">{recruitment.totalApplicants}</p>
                    <p className="text-xs text-gray-600">Applicants</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{recruitment.shortlisted}</p>
                    <p className="text-xs text-gray-600">Shortlisted</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{recruitment.interviewed}</p>
                    <p className="text-xs text-gray-600">Interviewed</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{recruitment.offered}</p>
                    <p className="text-xs text-gray-600">Offered</p>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === recruitment.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Recruitment Progress</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-primary-600 h-full rounded-full transition-all"
                          style={{
                            width: `${(recruitment.interviewed / recruitment.totalApplicants) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {Math.round((recruitment.interviewed / recruitment.totalApplicants) * 100)}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/recruitment/${recruitment.id}`)}
                    className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    View All Candidates
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default RecruiterDashboard;
