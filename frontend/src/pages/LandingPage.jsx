import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Sparkles } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="pt-8 pb-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Candidly</h1>
          </div>
          <p className="text-sm text-gray-600">AI-Powered Interview Platform</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to Candidly
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your hiring process with AI-powered interviews and intelligent candidate assessment
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Recruiter Card */}
          <div
            onClick={() => navigate('/recruiter')}
            className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-2 border-transparent hover:border-primary-400"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Briefcase className="w-12 h-12 text-primary-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  I'm a Recruiter
                </h3>
                <p className="text-gray-600">
                  Manage your recruitment campaigns, review candidates, and make data-driven hiring decisions
                </p>
              </div>
              <button className="mt-4 px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors w-full">
                Access Dashboard
              </button>
            </div>
          </div>

          {/* Applicant Card */}
          <div
            className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-2 border-transparent hover:border-primary-400 opacity-75"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Users className="w-12 h-12 text-gray-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  I'm an Applicant
                </h3>
                <p className="text-gray-600">
                  Take AI-powered interviews and showcase your skills to potential employers
                </p>
              </div>
              <button 
                disabled
                className="mt-4 px-8 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed w-full"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary-600" />
            </div>
            <h4 className="font-semibold text-lg mb-2">AI-Powered Assessment</h4>
            <p className="text-gray-600 text-sm">
              Advanced algorithms evaluate candidates based on skills, experience, and cultural fit
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-primary-600" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Streamlined Workflow</h4>
            <p className="text-gray-600 text-sm">
              Manage all your recruitments in one place with intuitive dashboards and analytics
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Better Decisions</h4>
            <p className="text-gray-600 text-sm">
              Make informed hiring choices with comprehensive candidate profiles and scoring
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-gray-500 text-sm">
        <p>&copy; 2025 Candidly. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
