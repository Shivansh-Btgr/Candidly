import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Save, Copy, Check, Settings } from 'lucide-react';
import { mockRecruitments } from '../data/mockData';

function RecruitmentConfig() {
  const navigate = useNavigate();
  const recruitment = mockRecruitments.find(r => r.id === 1);
  
  const [title, setTitle] = useState(recruitment.title);
  const [copied, setCopied] = useState(false);
  
  // Generate interview code based on recruitment ID
  const interviewCode = `CNDLY-001-SEN4a2b`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(interviewCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    // TODO: Save title to backend
    alert('Configuration saved successfully!');
    navigate('/recruiter');
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
            <h3 className="text-xl font-bold text-white mb-4">Drive Title</h3>
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
                      {interviewCode}
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
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-primary-900/50"
            >
              <Save className="w-5 h-5" />
              <span>Save Configuration</span>
            </button>
            <button
              onClick={() => navigate('/recruiter')}
              className="px-6 py-4 border border-dark-600 text-gray-300 rounded-lg font-semibold hover:bg-dark-700 transition-colors"
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
