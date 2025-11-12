import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Code } from 'lucide-react';
import { candidatesApi } from '../services/api';

function ApplicantDetailsForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    skills: '',
    education: ''
  });

  useEffect(() => {
    // Check if interview code exists
    const interviewCode = sessionStorage.getItem('interview_code');
    if (!interviewCode) {
      navigate('/applicant/code');
    }
  }, [navigate]);

  const recruitmentTitle = sessionStorage.getItem('recruitment_title') || 'Position';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const interviewCode = sessionStorage.getItem('interview_code');
      const recruitmentId = sessionStorage.getItem('recruitment_id');
      
      // Create candidate with mock ATS score
      const candidateData = {
        recruitment_id: parseInt(recruitmentId),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        location: formData.location || null,
        experience: formData.experience || null,
        skills: formData.skills || null,
        education: formData.education || null,
        ats_score: Math.floor(Math.random() * 20) + 75, // Mock ATS score 75-95
        status: 'New'
      };
      
      const response = await candidatesApi.create(candidateData);
      
      // Store candidate ID
      sessionStorage.setItem('candidate_id', response.id);
      
      // Navigate to profile view
      navigate('/applicant/profile');
    } catch (err) {
      alert(`Error: ${err.message}`);
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="bg-dark-900 shadow-sm border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/applicant/code')}
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
      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Details</h2>
          <p className="text-gray-400">
            Applying for: <span className="text-primary-400 font-semibold">{recruitmentTitle}</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Please fill in your information. This will be used for profile evaluation.
          </p>
        </div>

        <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-dark-700 pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Bangalore, India"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4 pt-6">
              <h3 className="text-lg font-semibold text-white border-b border-dark-700 pb-2">Professional Information (Optional)</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Work Experience
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  placeholder="Software Engineer at Tech Corp (2020-Present, 3 years)&#10;Junior Developer at StartupXYZ (2018-2020, 2 years)"
                  rows="4"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  List your work experience with company names and duration
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Code className="w-4 h-4 inline mr-1" />
                  Skills
                </label>
                <textarea
                  value={formData.skills}
                  onChange={(e) => handleChange('skills', e.target.value)}
                  placeholder="Python, React, Node.js, AWS, Docker, MongoDB, REST APIs"
                  rows="3"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  List your technical and professional skills
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <GraduationCap className="w-4 h-4 inline mr-1" />
                  Education
                </label>
                <textarea
                  value={formData.education}
                  onChange={(e) => handleChange('education', e.target.value)}
                  placeholder="B.Tech in Computer Science, XYZ University (2014-2018)"
                  rows="2"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your educational qualifications
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center space-x-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Continue to Profile'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/applicant/code')}
                disabled={submitting}
                className="px-6 py-4 border border-dark-600 text-gray-300 rounded-lg font-semibold hover:bg-dark-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ApplicantDetailsForm;
