import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertTriangle, Video, VideoOff, Users, Volume2, Camera, Mic, MicOff } from 'lucide-react';
import monitoringService from '../services/monitoringService';

function ApplicantInterview() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  
  // Monitoring state
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [multipleFacesFlag, setMultipleFacesFlag] = useState(false);
  const [noiseFlag, setNoiseFlag] = useState(false);
  
  // Speech conversation state
  const [messages, setMessages] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interviewEnded, setInterviewEnded] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const sessionTokenRef = useRef(sessionToken);

  useEffect(() => {
    // Get session from storage
    const token = sessionStorage.getItem('session_token');
    const id = sessionStorage.getItem('candidate_id');
    const name = sessionStorage.getItem('candidate_name');
    
    // Session check
    
    if (!token || !id) {
      // Missing session data, redirecting to code entry
      navigate('/applicant/code');
      return;
    }
    
    setSessionToken(token);
    sessionTokenRef.current = token; // Keep ref in sync
    setCandidateId(id);
    setCandidateName(name || 'Candidate');
    setIsLoading(false);
    
    // Cleanup on unmount
    return () => {
      monitoringService.stopMonitoring();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [navigate]);

  // Initialize Speech Recognition and Synthesis
  useEffect(() => {
    // Initialize Speech Synthesis
    synthRef.current = window.speechSynthesis;

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        
        // Ignore if this was captured while AI was speaking (echo/leak)
        if (window.__aiIsSpeaking) {
          // Ignoring speech captured during AI speaking (likely echo)
          return;
        }
        
        setTranscript(speechResult);
        
        // Use the ref to ensure we have the latest sessionToken
        if (!sessionTokenRef.current) {
          console.error('No session token in ref!');
          alert('Session token missing. Please refresh and restart.');
          return;
        }
        
        handleSpeechInput(speechResult);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        
        // Handle specific errors
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          alert('Microphone permission denied. Please allow microphone access and refresh the page.');
        } else if (event.error === 'network') {
          // Network error - this usually means microphone is blocked or browser speech service unavailable
          // Auto-retry on network error with longer delay
          setTimeout(() => {
            if (!isAISpeaking) {
              startListening();
            }
          }, 2000);
        } else if (event.error === 'no-speech') {
          // No speech detected, ready to try again
          // Auto-restart listening after no-speech
          setTimeout(() => {
            if (!isAISpeaking && interviewStarted) {
              startListening();
            }
          }, 500);
        } else if (event.error === 'audio-capture') {
          alert('No microphone found or microphone is in use by another application. Please check your microphone.');
        } else if (event.error === 'aborted') {
          // Speech recognition aborted
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      
      // Log browser compatibility
      // Speech Recognition initialized
    } else {
      console.error('Speech Recognition not supported in this browser');
      alert('⚠️ Speech recognition is not supported in your browser.\n\nPlease use:\n• Google Chrome (recommended)\n• Microsoft Edge\n• Safari (iOS/macOS)\n\nFirefox does not support Web Speech API.');
    }
  }, []);

  const requestPermissionsAndStart = async () => {
    try {
      // Requesting permissions and starting monitoring
      
      if (permissionsGranted) {
        return;
      }
      // Request camera and microphone FIRST
      const { stream, video, audio } = await monitoringService.requestPermissions();
      // Permissions granted, stream received
      streamRef.current = stream;
      
      // Set permissions granted to trigger video element render
      setPermissionsGranted(true);
      
      // Wait for React to render the video element
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now video element should exist - set up the video feed
      // Video setup start
      
      if (!videoRef.current) {
        // videoRef.current is null after render; retrying
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (!videoRef.current) {
        alert('Failed to initialize video element. Please refresh the page.');
        return;
      }
      
      // Set properties for autoplay
      videoRef.current.muted = true;
      videoRef.current.autoplay = true;
      videoRef.current.playsInline = true;
      
      // Assign full stream directly
      videoRef.current.srcObject = stream;
      
      // Play video
      try {
        await videoRef.current.play();
      } catch (playError) {
        console.error('Error playing video:', playError);
      }
      
      // Start face monitoring
      if (videoRef.current) {
        // Starting face monitoring
        await monitoringService.startFaceMonitoring(videoRef.current, async (faceCount) => {
          console.warn(`Multiple faces detected: ${faceCount}`);
          setMultipleFacesFlag(true);
          
          // Update flag in database immediately
          await updateFlags({ multiple_faces_flag: 1 });
        });
      }
      
      // SKIP audio monitoring - conflicts with speech recognition microphone access
      // Speech recognition will handle microphone, audio monitoring disabled for speech-based interviews
      // Audio monitoring disabled - using speech recognition instead
      
      // Start interview and get AI greeting
      await startInterview();
      
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      alert('Failed to access camera/microphone. Please grant permissions to continue.');
    }
  };

  const startInterview = async () => {
    try {
      // Starting interview
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: sessionToken })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Start interview error:', errorData);
        throw new Error(errorData.detail || 'Failed to start interview');
      }
      
      const data = await response.json();
      // Interview started successfully
      
      // Add AI greeting to conversation
      setMessages([{
        role: 'assistant',
        content: data.greeting,
        timestamp: new Date()
      }]);
      
      setInterviewStarted(true);
      
      // Speak the greeting and start listening after
      speakText(data.greeting);
      
    } catch (error) {
      console.error('Error starting interview:', error);
      alert(`Failed to start interview: ${error.message}`);
    }
  };

  const updateFlags = async (flags) => {
    try {
      await fetch('/api/interview/update-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: sessionToken,
          candidate_id: candidateId,
          ...flags
        })
      });
    } catch (error) {
      console.error('Error updating flags:', error);
    }
  };

  // Handle speech input from user
  const handleSpeechInput = async (spokenText) => {
    if (!spokenText.trim()) return;
    
    // Validate session token (use ref as fallback)
    const token = sessionToken || sessionTokenRef.current;
    if (!token) {
      console.error('No session token available!');
      console.error('sessionToken state:', sessionToken);
      console.error('sessionTokenRef:', sessionTokenRef.current);
      alert('Session expired. Please refresh the page and restart the interview.');
      return;
    }
    
    // Using session token
    
    // Add user message to conversation
    setMessages(prev => [...prev, {
      role: 'user',
      content: spokenText,
      timestamp: new Date()
    }]);
    
    try {
      const requestBody = {
        session_token: token,
        message: spokenText,
        conversation_history: messages  // Send full conversation history for context
      };
      
      // Sending speech message to /api/interview/chat
      
      const response = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error('Chat API error response:', response.status, errorData);
        console.error('Full error:', errorData);
        
        if (response.status === 422) {
          console.error('Validation error - request body was:', requestBody);
        }
        
        throw new Error(errorData.detail || `HTTP ${response.status}: Failed to get response`);
      }
      
      const data = await response.json();
      // AI response received
      
      // Add AI response to conversation
      const aiMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the AI response using TTS
      speakText(data.reply);

      // Auto-submit once AI ends the interview
      if (!interviewEnded && data.reply?.toLowerCase().includes('concludes our interview')) {
        // AI concluded interview, auto-submitting
        await endInterview(true);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Failed to get response: ${error.message}`);
    }
  };

  // Text-to-Speech for AI responses
  const speakText = (text) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    setIsAISpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';
    
    utterance.onstart = () => {
      // AI started speaking - stopping any active listening
      window.__aiIsSpeaking = true; // Global flag to prevent echo capture
      
      // Stop listening immediately when AI starts speaking
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Recognition already stopped
        }
      }
    };
    
    utterance.onend = () => {
      // AI finished speaking
      // Add delay before clearing flag to ensure echo doesn't get captured
      setTimeout(() => {
        window.__aiIsSpeaking = false;
        setIsAISpeaking(false);
        // AI speech complete - user can now speak
      }, 1500); // 1.5 second delay to avoid echo
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsAISpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Start listening to user speech
  const startListening = () => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized');
      alert('Speech recognition not available. Please refresh and try again.');
      return;
    }
    
    if (isListening) {
      // Already listening, ignoring duplicate request
      return;
    }
    
    if (isAISpeaking) {
      // AI is speaking, cannot start listening yet
      alert('Please wait for the AI to finish speaking');
      return;
    }
    
    // Starting speech recognition
    try {
      // Add delay to ensure AI audio is completely finished and mic is ready
      setTimeout(() => {
        try {
          recognitionRef.current.start();
          // Speech recognition started successfully
        } catch (err) {
          console.error('Error starting recognition:', err);
          // If already started, just log it
          if (err.message && err.message.includes('already started')) {
            // Recognition already started, ignoring
          } else {
            alert('Failed to start speech recognition. Please try again.');
          }
        }
      }, 500); // Increased delay to avoid echo
    } catch (error) {
      console.error('Error in startListening:', error);
      alert('Failed to start speech recognition: ' + error.message);
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraEnabled(videoTrack.enabled);
      }
    }
  };

  const endInterview = async (skipConfirm = false) => {
    if (interviewEnded) return;

    if (!skipConfirm && !confirm('Are you sure you want to end the interview?')) return;

    const token = sessionToken || sessionTokenRef.current;
    if (!token) {
      alert('Session expired. Please restart the interview.');
      return;
    }
    
    try {
      // Ending interview, updating final flags
      
      // Update final flags before submission
      await updateFlags({
        multiple_faces_flag: multipleFacesFlag ? 1 : 0,
        noise_flag: noiseFlag ? 1 : 0,
        ai_flag: 0 // AI flag will be detected by backend
      });
      
      // Stop monitoring
      monitoringService.stopMonitoring();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Submitting interview with transcript
      
      // Submit interview with full conversation
      const response = await fetch('/api/interview/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: token,
          responses: messages
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit interview');
      }
      
      const data = await response.json();
      // Interview submitted successfully
      
      // Navigate to profile
      setInterviewEnded(true);
      navigate('/applicant/profile');
    } catch (error) {
      console.error('Error ending interview:', error);
      alert('Error submitting interview. Please try again.');
    }
  };

  // Show loading while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!permissionsGranted) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-dark-800 rounded-lg shadow-xl border border-dark-700 p-8">
          <div className="text-center mb-8">
            <Camera className="w-16 h-16 text-primary-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">AI Interview Ready</h2>
            <p className="text-gray-400 mb-2">
              Hello {candidateName}! You're about to start your AI-powered interview.
            </p>
            <p className="text-gray-400">
              We need access to your camera and microphone to ensure interview integrity.
            </p>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Interview Monitoring</h4>
                <p className="text-gray-300 text-sm mb-2">
                  For fairness and security, this interview includes:
                </p>
                <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                  <li>Continuous face detection (must show only you)</li>
                  <li>Audio monitoring for background voices</li>
                  <li>Post-interview AI response analysis</li>
                </ul>
              </div>
            </div>
          </div>
          
          <button
            type="button"
            id="start-interview-btn"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              requestPermissionsAndStart().catch(err => {
                console.error('requestPermissionsAndStart failed:', err);
                alert('Failed to start: ' + err.message);
              });
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'auto', cursor: 'pointer', zIndex: 1000 }}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/50"
          >
            <Camera className="w-5 h-5" />
            <Mic className="w-5 h-5" />
            <span>Start Interview</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-dark-950 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-dark-900 border-b border-dark-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">AI Interview</h1>
          <p className="text-sm text-gray-400">Interviewing: {candidateName}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Camera Toggle */}
          <button
            onClick={toggleCamera}
            className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
            title={cameraEnabled ? 'Disable Camera' : 'Enable Camera'}
          >
            {cameraEnabled ? (
              <Video className="w-5 h-5 text-gray-400" />
            ) : (
              <VideoOff className="w-5 h-5 text-red-400" />
            )}
          </button>
          
          {/* End Interview Button */}
          <button
            onClick={endInterview}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition-colors"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Main Content - Full Screen Video with Speech Indicators */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Video Feed - Full Screen */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
            onLoadedMetadata={() => {}}
            onCanPlay={() => {}}
          />
          
          {/* Speech Status Indicator - Centered at bottom */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            {/* AI Speaking Indicator */}
            {isAISpeaking && (
              <div className="flex items-center gap-3 px-6 py-4 bg-blue-600 bg-opacity-90 backdrop-blur-sm rounded-full shadow-lg animate-pulse">
                <Volume2 className="w-6 h-6 text-white" />
                <span className="text-white font-medium">AI Speaking...</span>
              </div>
            )}
            
            {/* User Listening Indicator */}
            {isListening && !isAISpeaking && (
              <div className="flex items-center gap-3 px-6 py-4 bg-green-600 bg-opacity-90 backdrop-blur-sm rounded-full shadow-lg">
                <Mic className="w-6 h-6 text-white animate-pulse" />
                <span className="text-white font-medium">Listening...</span>
              </div>
            )}
            
            {/* Waiting State */}
            {!isAISpeaking && !isListening && interviewStarted && (
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-600 bg-opacity-90 backdrop-blur-sm rounded-full shadow-lg">
                <MicOff className="w-6 h-6 text-white" />
                <span className="text-white font-medium">Ready to Answer</span>
                <button
                  onClick={startListening}
                  className="ml-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-500 transition-colors"
                >
                  🎤 Click to Speak
                </button>
              </div>
            )}
          </div>
          
          {/* Transcript Display - Top right */}
          {transcript && (
            <div className="absolute top-4 right-4 max-w-md px-4 py-3 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Last recognized:</p>
              <p className="text-sm text-white">{transcript}</p>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Flag Indicators for Testing */}
      <div className="bg-dark-900 border-t border-dark-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 font-medium">Monitoring Status:</span>
            
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
              multipleFacesFlag 
                ? 'bg-orange-900/30 border-orange-600' 
                : 'bg-dark-800 border-dark-700'
            }`}>
              <Users className={`w-4 h-4 ${multipleFacesFlag ? 'text-orange-400' : 'text-gray-600'}`} />
              <span className={`text-xs font-medium ${multipleFacesFlag ? 'text-orange-400' : 'text-gray-500'}`}>
                Multiple Faces: {multipleFacesFlag ? 'DETECTED' : 'Clean'}
              </span>
            </div>
            
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
              noiseFlag 
                ? 'bg-yellow-900/30 border-yellow-600' 
                : 'bg-dark-800 border-dark-700'
            }`}>
              <Volume2 className={`w-4 h-4 ${noiseFlag ? 'text-yellow-400' : 'text-gray-600'}`} />
              <span className={`text-xs font-medium ${noiseFlag ? 'text-yellow-400' : 'text-gray-500'}`}>
                Noise: {noiseFlag ? 'DETECTED' : 'Clean'}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Monitoring active • Flags update in real-time
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantInterview;
