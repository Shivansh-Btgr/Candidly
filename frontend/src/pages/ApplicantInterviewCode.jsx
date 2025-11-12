import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, KeyRound } from 'lucide-react';
import { interviewApi } from '../services/api';

function ApplicantInterviewCode() {
  const navigate = useNavigate();
  const [interviewCode, setInterviewCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!interviewCode.trim()) {
      setError('Please enter an interview code');
      return;
    }

    try {
      setValidating(true);
      setError('');
      
      const response = await interviewApi.validateCode(interviewCode.trim());
      
      // Store the interview code and recruitment info in sessionStorage
      sessionStorage.setItem('interview_code', interviewCode.trim());
      sessionStorage.setItem('recruitment_id', response.recruitment_id);
      sessionStorage.setItem('recruitment_title', response.recruitment_title);
      
      // Navigate to resume upload page
      navigate('/applicant/upload');
    } catch (err) {
      setError(err.message || 'Invalid interview code');
    } finally {
      setValidating(false);
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary-800">
            <KeyRound className="w-10 h-10 text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Enter Interview Code</h2>
          <p className="text-gray-400 text-lg">
            Enter the interview code provided by the recruiter to begin your application
          </p>
        </div>

        <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interview Access Code
              </label>
              <input
                type="text"
                value={interviewCode}
                onChange={(e) => {
                  setInterviewCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="CNDLY-XXX-XXXXXX"
                className="w-full px-4 py-4 bg-dark-900 border border-dark-700 rounded-lg text-white text-center text-xl font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600"
                maxLength={20}
                required
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={validating}
              className="w-full px-6 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {validating ? 'Validating...' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-dark-900 rounded-lg border border-dark-700">
            <p className="text-xs text-gray-400 text-center">
              Don't have an interview code? Contact the recruiter or check your email for the access code.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApplicantInterviewCode;
