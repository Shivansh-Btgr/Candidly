import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Search, ChevronDown, MapPin, Mail, Phone, Briefcase, Award, Settings, Plus } from 'lucide-react';
import { recruitmentApi, candidatesApi } from '../services/api';

function RecruiterDashboard() {
  const navigate = useNavigate();
  
  const [recruitment, setRecruitment] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('atsScore');
  
  // Create recruitment form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    requirements: ''
  });

  // Fetch recruitment and candidates data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch active recruitment
        const recruitmentData = await recruitmentApi.getActive();
        setRecruitment(recruitmentData);
        
        // Fetch candidates for this recruitment
        const candidatesData = await candidatesApi.getAll({
          recruitment_id: recruitmentData.id,
          sort_by: sortBy
        });
        setCandidates(candidatesData.candidates || []);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        // If 404, it means no recruitment exists - not an error, just empty state
        if (err.status === 404) {
          setRecruitment(null);
          setError(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [sortBy]);

  const handleCreateRecruitment = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.department || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setCreating(true);
      const newRecruitment = await recruitmentApi.create({
        title: formData.title,
        department: formData.department,
        location: formData.location,
        requirements: formData.requirements || null,
        status: 'Active'
      });
      
      setRecruitment(newRecruitment);
      setShowCreateForm(false);
      setFormData({ title: '', department: '', location: '', requirements: '' });
      
      // Refresh the page to load candidates
      window.location.reload();
    } catch (err) {
      alert(`Error creating recruitment: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!recruitment) {
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
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  R
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State / Create Form */}
        <main className="max-w-4xl mx-auto px-8 py-16">
          {!showCreateForm ? (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-12 h-12 text-primary-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">No Active Recruitment</h2>
                <p className="text-gray-400 text-lg mb-8">
                  Create your first recruitment drive to start interviewing candidates
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/50"
              >
                <Plus className="w-5 h-5" />
                <span>Create Recruitment Drive</span>
              </button>
            </div>
          ) : (
            <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Recruitment Drive</h2>
              <form onSubmit={handleCreateRecruitment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Engineering"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Bangalore"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Requirements & Instructions
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Describe the role requirements, key skills, experience level, and any specific instructions for AI evaluation..."
                    rows="6"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This will guide the AI during resume screening and interviews. Include skills, experience level, and evaluation criteria.
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating...' : 'Create Recruitment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    disabled={creating}
                    className="px-6 py-3 border border-dark-600 text-gray-300 rounded-lg font-semibold hover:bg-dark-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    );
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
              <p className="text-3xl font-bold text-primary-400">{recruitment.stats?.total_applicants || 0}</p>
            </div>
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800">
              <p className="text-sm text-gray-400 mb-1">Shortlisted</p>
              <p className="text-3xl font-bold text-blue-400">{recruitment.stats?.shortlisted || 0}</p>
            </div>
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-800">
              <p className="text-sm text-gray-400 mb-1">Interviewed</p>
              <p className="text-3xl font-bold text-green-400">{recruitment.stats?.interviewed || 0}</p>
            </div>
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-800">
              <p className="text-sm text-gray-400 mb-1">Offers Made</p>
              <p className="text-3xl font-bold text-purple-400">{recruitment.stats?.offered || 0}</p>
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
