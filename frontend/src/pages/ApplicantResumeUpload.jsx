import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Upload, FileText, CheckCircle, Loader } from 'lucide-react';
import { interviewApi } from '../services/api';

function ApplicantResumeUpload() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if interview code exists
    const interviewCode = sessionStorage.getItem('interview_code');
    if (!interviewCode) {
      navigate('/applicant/code');
    }
  }, [navigate]);

  const recruitmentTitle = sessionStorage.getItem('recruitment_title') || 'Position';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const validExtensions = ['.pdf', '.docx', '.doc'];
    
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setError('');
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const interviewCode = sessionStorage.getItem('interview_code');
      
      // Upload resume with AI parsing
      const response = await interviewApi.uploadResumeAI(interviewCode, selectedFile);
      
      // Store candidate ID and session token
      sessionStorage.setItem('candidate_id', response.candidate_id);
      sessionStorage.setItem('session_token', response.session_token);
      
      // Navigate to profile view
      navigate('/applicant/profile');
    } catch (err) {
      setError(err.message || 'Error uploading resume');
      setUploading(false);
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
      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Upload Your Resume</h2>
          <p className="text-gray-400">
            Applying for: <span className="text-primary-400 font-semibold">{recruitmentTitle}</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Our AI will analyze your resume and create your profile automatically
          </p>
        </div>

        <div className="bg-dark-800 rounded-lg shadow-sm border border-dark-700 p-8">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              dragActive 
                ? 'border-primary-500 bg-primary-900/20' 
                : 'border-dark-600 hover:border-dark-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto border border-green-800">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-primary-400 text-sm hover:text-primary-300 transition-colors"
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary-900/20 rounded-full flex items-center justify-center mx-auto border border-primary-800">
                  <Upload className="w-8 h-8 text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg mb-2">
                    Drop your resume here or click to browse
                  </p>
                  <p className="text-gray-400 text-sm">
                    Supports PDF and DOCX files up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors cursor-pointer shadow-lg shadow-primary-900/50"
                >
                  <FileText className="w-5 h-5" />
                  <span>Select File</span>
                </label>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
            <p className="text-blue-400 text-sm font-semibold mb-2">How it works:</p>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Upload your resume in PDF or DOCX format</li>
              <li>Our AI extracts your information automatically</li>
              <li>Review your profile before starting the interview</li>
              <li>All data is securely processed and encrypted</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-8">
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || uploading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Processing Resume with AI...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload & Continue</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/applicant/code')}
              disabled={uploading}
              className="px-6 py-4 border border-dark-600 text-gray-300 rounded-lg font-semibold hover:bg-dark-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApplicantResumeUpload;
