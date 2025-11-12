import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Save, Copy, Check, Settings } from 'lucide-react';
import { recruitmentApi } from '../services/api';

function RecruitmentConfig() {
  const navigate = useNavigate();
  
  const [recruitment, setRecruitment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [requirements, setRequirements] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchRecruitment = async () => {
      try {
        setLoading(true);
        const data = await recruitmentApi.getActive();
        setRecruitment(data);
        setTitle(data.title);
        setRequirements(data.requirements || '');
        setError(null);
      } catch (err) {
        console.error('Error fetching recruitment:', err);
        // If 404, redirect to dashboard to create recruitment
        if (err.message.includes('404') || err.message.includes('not found')) {
          navigate('/recruiter');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecruitment();
  }, [navigate]);
  
  const copyToClipboard = () => {
    if (recruitment?.interview_code) {
      navigator.clipboard.writeText(recruitment.interview_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    if (!recruitment) return;
    
    try {
      setSaving(true);
      await recruitmentApi.update(recruitment.id, { 
        title,
        requirements: requirements || null
      });
      
      // Show success indicator
      setSaved(true);
      
      // Navigate back after brief delay to show success state
      setTimeout(() => {
        navigate('/recruiter');
      }, 800);
    } catch (err) {
      alert(`Error saving: ${err.message}`);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !recruitment) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'No recruitment found'}</p>
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
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                R
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="w-8 h-8 text-primary-400" />
            <h2 className="text-3xl font-bold text-white">Recruitment Configuration</h2>
          </div>
          <p className="text-gray-400">Configure your recruitment drive settings</p>
        </div>

        <div className="space-y-6">
          {/* Title Configuration */}
          <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recruitment Drive Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter recruitment drive title"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This title will be displayed to candidates during the interview
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Requirements & AI Instructions
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows="8"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500 resize-none"
                  placeholder="Describe role requirements, key skills, experience level, and evaluation criteria for AI..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  These instructions will guide the AI during resume screening (ATS) and interviews. Be specific about required skills, experience level, technical competencies, and evaluation criteria.
                </p>
              </div>
            </div>
          </div>

          {/* Interview Code */}
          <div className="bg-dark-800 rounded-lg shadow-sm border border-primary-800 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Interview Access Code</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Share this code with candidates
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-dark-900 rounded-lg px-4 py-4 border border-dark-700">
                    <code className="text-2xl font-mono font-bold text-white tracking-wider">
                      {recruitment.interview_code}
                    </code>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 px-6 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-primary-900/50"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Candidates will use this code to access the AI interview portal
                </p>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Additional Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">Department</p>
                  <p className="text-sm text-gray-400">{recruitment.department}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">Location</p>
                  <p className="text-sm text-gray-400">{recruitment.location}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">Status</p>
                  <p className="text-sm text-gray-400">{recruitment.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold transition-all shadow-lg disabled:cursor-not-allowed ${
                saved 
                  ? 'bg-green-600 text-white shadow-green-900/50' 
                  : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-900/50 disabled:opacity-50'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/recruiter')}
              disabled={saving || saved}
              className="px-6 py-4 border border-dark-600 text-gray-300 rounded-lg font-semibold hover:bg-dark-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RecruitmentConfig;
