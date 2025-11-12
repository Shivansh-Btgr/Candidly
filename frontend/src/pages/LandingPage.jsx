import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Sparkles } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950">
      {/* Header */}
      <header className="pt-8 pb-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary-400" />
            <h1 className="text-3xl font-bold text-white">Candidly</h1>
          </div>
          <p className="text-sm text-gray-400">AI-Powered Interview Platform</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            Welcome to Candidly
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your hiring process with AI-powered interviews and intelligent candidate assessment
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Recruiter Card */}
          <div
            onClick={() => navigate('/recruiter')}
            className="group cursor-pointer bg-dark-800 rounded-2xl shadow-lg hover:shadow-primary-500/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-2 border-dark-700 hover:border-primary-500"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-primary-900/30 rounded-full flex items-center justify-center group-hover:bg-primary-800/40 transition-colors border border-primary-700">
                <Briefcase className="w-12 h-12 text-primary-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  I'm a Recruiter
                </h3>
                <p className="text-gray-400">
                  Manage your recruitment campaigns, review candidates, and make data-driven hiring decisions
                </p>
              </div>
              <button className="mt-4 px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors w-full shadow-lg shadow-primary-900/50">
                Access Dashboard
              </button>
            </div>
          </div>

          {/* Applicant Card */}
          <div
            className="group cursor-pointer bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-2 border-dark-700 hover:border-dark-600 opacity-75"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center group-hover:bg-dark-600 transition-colors border border-dark-600">
                <Users className="w-12 h-12 text-gray-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  I'm an Applicant
                </h3>
                <p className="text-gray-400">
                  Take AI-powered interviews and showcase your skills to potential employers
                </p>
              </div>
              <button 
                disabled
                className="mt-4 px-8 py-3 bg-dark-700 text-gray-500 rounded-lg font-semibold cursor-not-allowed w-full"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-900/30 rounded-lg mx-auto mb-4 flex items-center justify-center border border-primary-800">
              <Sparkles className="w-8 h-8 text-primary-400" />
            </div>
            <h4 className="font-semibold text-lg mb-2 text-white">AI-Powered Assessment</h4>
            <p className="text-gray-400 text-sm">
              Advanced algorithms evaluate candidates based on skills, experience, and cultural fit
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-900/30 rounded-lg mx-auto mb-4 flex items-center justify-center border border-primary-800">
              <Briefcase className="w-8 h-8 text-primary-400" />
            </div>
            <h4 className="font-semibold text-lg mb-2 text-white">Streamlined Workflow</h4>
            <p className="text-gray-400 text-sm">
              Manage all your recruitments in one place with intuitive dashboards and analytics
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-900/30 rounded-lg mx-auto mb-4 flex items-center justify-center border border-primary-800">
              <Users className="w-8 h-8 text-primary-400" />
            </div>
            <h4 className="font-semibold text-lg mb-2 text-white">Better Decisions</h4>
            <p className="text-gray-400 text-sm">
              Make informed hiring choices with comprehensive candidate profiles and scoring
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-gray-600 text-sm border-t border-dark-800">
        <p>&copy; 2025 Candidly. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
