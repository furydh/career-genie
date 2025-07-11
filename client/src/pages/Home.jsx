import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations on component mount
    setIsVisible(true);
    setTimeout(() => setIsUploadVisible(true), 800);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resume) return;
    setLoading(true);
    setAnalysis("");
    const formData = new FormData();
    formData.append("resume", resume);
    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setAnalysis(data.feedback || "No analysis returned.");
    } catch {
      setAnalysis("Failed to analyze resume.");
    }
    setLoading(false);
  };

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
          <div className="shape shape-7"></div>
          <div className="shape shape-8"></div>
        </div>
      </div>

      {/* Header with Sign In */}
      <header className="home-header">
        <div className="logo">
          <span className="logo-text">CareerGenie</span>
        </div>
        <div className="auth-buttons">
          <button 
            className="signin-btn"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button 
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
          <h1 className="hero-title">
            <span className="title-line">Analyze your resume with</span>
            <span className="title-highlight">AI-Powered Insights</span>
          </h1>
          <p className="hero-subtitle">
            Get professional feedback, scoring, and actionable suggestions to make your resume stand out
          </p>
          
          {/* Stats Section */}
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10k+</div>
              <div className="stat-label">Resumes Analyzed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9★</div>
              <div className="stat-label">User Rating</div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className={`upload-section ${isUploadVisible ? 'slide-up' : ''}`}>
          <div className="upload-card">
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h2 className="upload-title">Upload Your Resume</h2>
            <p className="upload-subtitle">Get instant AI-powered analysis and scoring</p>
            
            <form onSubmit={handleUpload} className="upload-form">
              <div className="file-upload-area">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={e => setResume(e.target.files[0])}
                  className="file-input"
                  required
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="file-label">
                  <div className="upload-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Choose PDF file or drag here</span>
                  </div>
                </label>
                {resume && (
                  <div className="selected-file">
                    <span className="file-name">{resume.name}</span>
                    <button 
                      type="button" 
                      className="remove-file"
                      onClick={() => setResume(null)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className={`analyze-btn ${loading ? 'loading' : ''}`}
                disabled={loading || !resume}
              >
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Analyze Resume
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Analysis Results */}
        {analysis && (
          <section className="analysis-section">
            <div className="analysis-card">
              <h3 className="analysis-title">Analysis Results</h3>
              <div className="analysis-content">
                <pre className="analysis-text">{analysis}</pre>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Scoring</h3>
            <p>Get a detailed score out of 10 with specific feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>AI Insights</h3>
            <p>Professional suggestions to improve your resume</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Analysis</h3>
            <p>Get results in seconds with our advanced AI</p>
          </div>
        </div>
      </section>
    </div>
  );
}
