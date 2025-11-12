const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    const errorMessage = error.detail || 'API request failed';
    // Include status code in error message for better handling
    const fullError = new Error(errorMessage);
    fullError.status = response.status;
    throw fullError;
  }

  return response.json();
};

// Recruitment API
export const recruitmentApi = {
  getActive: () => apiCall('/recruitment'),
  
  getById: (id) => apiCall(`/recruitment/${id}`),
  
  create: (data) => apiCall('/recruitment', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/recruitment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/recruitment/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: (id) => apiCall(`/recruitment/${id}/stats`),
  
  regenerateCode: (id) => apiCall(`/recruitment/regenerate-code/${id}`, {
    method: 'POST',
  }),
};

// Candidates API
export const candidatesApi = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/candidates${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiCall(`/candidates/${id}`),
  
  create: (data) => apiCall('/candidates', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/candidates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  updateStatus: (id, status) => apiCall(`/candidates/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  delete: (id) => apiCall(`/candidates/${id}`, {
    method: 'DELETE',
  }),
  
  getTranscript: (id) => apiCall(`/candidates/${id}/transcript`),
};

// Interview API
export const interviewApi = {
  validateCode: (interviewCode) => apiCall('/interview/validate-code', {
    method: 'POST',
    body: JSON.stringify({ interview_code: interviewCode }),
  }),
  
  uploadResume: async (interviewCode, resumeFile) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    const response = await fetch(
      `${API_BASE_URL}/interview/upload-resume?interview_code=${interviewCode}`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'Resume upload failed');
    }
    
    return response.json();
  },
  
  start: (sessionToken) => apiCall('/interview/start', {
    method: 'POST',
    body: JSON.stringify({ session_token: sessionToken }),
  }),
  
  submit: (sessionToken, responses, recordingUrl = null) => apiCall('/interview/submit', {
    method: 'POST',
    body: JSON.stringify({
      session_token: sessionToken,
      responses,
      recording_url: recordingUrl,
    }),
  }),
  
  getStatus: (sessionToken) => apiCall(`/interview/status/${sessionToken}`),
};

export default {
  recruitment: recruitmentApi,
  candidates: candidatesApi,
  interview: interviewApi,
};
