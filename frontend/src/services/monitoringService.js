/**
 * Monitoring Service for Interview Security
 * Handles face detection and audio analysis to detect suspicious activity
 */

import * as faceapi from 'face-api.js';

class MonitoringService {
  constructor() {
    this.faceDetectionInterval = null;
    this.audioAnalyzer = null;
    this.audioContext = null;
    this.micStream = null;
    this.modelsLoaded = false;
    
    // Callbacks
    this.onMultipleFacesDetected = null;
    this.onSuspiciousNoiseDetected = null;
    
    // Detection thresholds
    this.multipleFaceThreshold = 1; // Flag if more than 1 face detected
    this.noiseThreshold = 0.15; // Normalized amplitude threshold for suspicious noise
    this.backgroundNoiseThreshold = 0.05; // Threshold for continuous background noise
  }

  /**
   * Initialize face detection models
   */
  async initializeFaceDetection() {
    if (this.modelsLoaded) return true;
    
    try {
      // Load models from CDN
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);
      
      this.modelsLoaded = true;
          // Face detection models loaded
      return true;
    } catch (error) {
      console.error('Error loading face detection models:', error);
      return false;
    }
  }

  /**
   * Start monitoring camera for multiple faces
   * @param {HTMLVideoElement} videoElement - Video element showing camera feed
   * @param {Function} callback - Called when multiple faces detected
   */
  async startFaceMonitoring(videoElement, callback) {
    if (!this.modelsLoaded) {
      const loaded = await this.initializeFaceDetection();
      if (!loaded) {
        console.error('Failed to load face detection models');
        return false;
      }
    }

    this.onMultipleFacesDetected = callback;

    // Check for faces every 2 seconds
    this.faceDetectionInterval = setInterval(async () => {
      try {
        const detections = await faceapi.detectAllFaces(
          videoElement,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
        );

        const faceCount = detections.length;
        
        if (faceCount > this.multipleFaceThreshold) {
          console.warn(`Multiple faces detected: ${faceCount} faces`);
          if (this.onMultipleFacesDetected) {
            this.onMultipleFacesDetected(faceCount);
          }
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    }, 2000);

    return true;
  }

  /**
   * Start monitoring microphone for suspicious noises
   * @param {MediaStream} stream - Microphone audio stream
   * @param {Function} callback - Called when suspicious noise detected
   */
  async startAudioMonitoring(stream, callback) {
    this.onSuspiciousNoiseDetected = callback;
    this.micStream = stream;

    try {
      // Create audio context and analyzer
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioAnalyzer = this.audioContext.createAnalyser();
      
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.audioAnalyzer);
      
      this.audioAnalyzer.fftSize = 2048;
      const bufferLength = this.audioAnalyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Monitor audio levels
      const checkAudio = () => {
        if (!this.audioAnalyzer) return;

        this.audioAnalyzer.getByteTimeDomainData(dataArray);
        
        // Calculate average amplitude
        let sum = 0;
        let max = 0;
        for (let i = 0; i < bufferLength; i++) {
          const normalized = Math.abs((dataArray[i] - 128) / 128);
          sum += normalized;
          max = Math.max(max, normalized);
        }
        const average = sum / bufferLength;

        // Detect sudden loud noises (spikes)
        if (max > this.noiseThreshold) {
          console.warn(`Suspicious noise spike detected: ${(max * 100).toFixed(1)}%`);
          if (this.onSuspiciousNoiseDetected) {
            this.onSuspiciousNoiseDetected('spike', max);
          }
        }
        
        // Detect continuous background noise/voices
        if (average > this.backgroundNoiseThreshold) {
          console.warn(`Continuous background noise detected: ${(average * 100).toFixed(1)}%`);
          if (this.onSuspiciousNoiseDetected) {
            this.onSuspiciousNoiseDetected('background', average);
          }
        }

        requestAnimationFrame(checkAudio);
      };

      checkAudio();
      return true;
    } catch (error) {
      console.error('Audio monitoring setup error:', error);
      return false;
    }
  }

  /**
   * Stop all monitoring
   */
  stopMonitoring() {
    // Stop face detection
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
      this.faceDetectionInterval = null;
    }

    // Stop audio monitoring
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audioAnalyzer = null;

    // Stop mic stream
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }

        // Monitoring stopped
  }

  /**
   * Request camera and microphone permissions
   * @returns {Promise<{video: MediaStream, audio: MediaStream}>}
   */
  async requestPermissions() {
    try {
          // Requesting user media for monitoring
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // We want to detect background noise
          autoGainControl: false
        }
      });

      const video = new MediaStream(stream.getVideoTracks());
      const audio = new MediaStream(stream.getAudioTracks());
          // Acquired media stream for monitoring
      // Expose to window for quick manual debugging
      if (typeof window !== 'undefined') {
        window.__candidlyStream = stream;
        window.__candidlyVideo = video;
      }

      return { stream, video, audio };
    } catch (error) {
      console.error('Permission denied or error accessing media devices:', error);
      throw error;
    }
  }
}

// Export singleton instance
const monitoringService = new MonitoringService();
export default monitoringService;
