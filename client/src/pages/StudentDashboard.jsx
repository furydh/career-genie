import React, { useEffect, useState } from "react";
import axios from "axios";
import Notifications from "../components/Notifications";

const StudentDashboard = () => {
  
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

 
  const [scoringResume, setScoringResume] = useState(null);
  const [scoringAnalysis, setScoringAnalysis] = useState("");
  const [scoringAnalyzing, setScoringAnalyzing] = useState(false);

  
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [message, setMessage] = useState("");

 
  const [isVisible, setIsVisible] = useState(false);

 
  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      const token = localStorage.getItem("token");
      // Fetch all jobs
      const jobsRes = await axios.get("/api/jobs");
      setJobs(jobsRes.data);

  
      const appsRes = await axios.get("/api/applications/mine", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(appsRes.data);
      setAppliedJobIds(appsRes.data.map(app => app.job._id));
    };
    fetchJobsAndApplications();
    setIsVisible(true);
  }, []);


  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resume) return;
    const formData = new FormData();
    formData.append("resume", resume);
    setAnalyzing(true);
    setAnalysis("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/resume/upload", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysis(res.data.feedback);
    } catch {
      setAnalysis("Failed to analyze resume.");
    }
    setAnalyzing(false);
  };

  // Resume Scoring handler
  const handleResumeScoring = async (e) => {
    e.preventDefault();
    if (!scoringResume) return;
    const formData = new FormData();
    formData.append("resume", scoringResume);
    setScoringAnalyzing(true);
    setScoringAnalysis("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/resume/score", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScoringAnalysis(res.data.analysis);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setScoringAnalysis(`Error: ${err.response.data.error}`);
      } else {
        setScoringAnalysis("Failed to score resume.");
      }
    }
    setScoringAnalyzing(false);
  };

  // Apply to a job
  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/applications", { jobId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Applied successfully!");
      setAppliedJobIds([...appliedJobIds, jobId]);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Failed to apply.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Notifications */}
      <Notifications />
      
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="logo">
          <span className="logo-text">CareerGenie</span>
        </div>
        <div className="user-info">
          <span className="welcome-text">Welcome, Student!</span>
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className={`dashboard-content ${isVisible ? 'fade-in' : ''}`}>
          {/* Resume Tools Section */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Resume Tools</h2>
              <p className="section-subtitle">Analyze and improve your resume with AI</p>
            </div>
            
            <div className="tools-grid">
              {/* Resume Analyzer */}
              <div className="tool-card">
                <div className="tool-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <h3 className="tool-title">Resume Analyzer</h3>
                <p className="tool-description">Get instant feedback on your resume</p>
                
                <form onSubmit={handleResumeUpload} className="tool-form">
                  <div className="file-upload-area">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={e => setResume(e.target.files[0])}
                      required
                      className="file-input"
                      id="resume-upload-analyzer"
                    />
                    <label htmlFor="resume-upload-analyzer" className="file-label">
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
                    disabled={analyzing || !resume}
                    className={`tool-btn ${analyzing ? 'loading' : ''}`}
                  >
                    {analyzing ? "Analyzing..." : "Upload & Analyze"}
                  </button>
                </form>
                
                {analysis && (
                  <div className="analysis-result">
                    <h4>Analysis Result</h4>
                    <pre className="analysis-text">{analysis}</pre>
                  </div>
                )}
              </div>

              {/* Resume Scoring */}
              <div className="tool-card">
                <div className="tool-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <h3 className="tool-title">Resume Scoring</h3>
                <p className="tool-description">Get a score out of 10 for your resume</p>
                
                <form onSubmit={handleResumeScoring} className="tool-form">
                  <div className="file-upload-area">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={e => setScoringResume(e.target.files[0])}
                      required
                      className="file-input"
                      id="resume-upload-scoring"
                    />
                    <label htmlFor="resume-upload-scoring" className="file-label">
                      <div className="upload-placeholder">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Choose PDF file or drag here</span>
                      </div>
                    </label>
                    {scoringResume && (
                      <div className="selected-file">
                        <span className="file-name">{scoringResume.name}</span>
                        <button 
                          type="button" 
                          className="remove-file"
                          onClick={() => setScoringResume(null)}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={scoringAnalyzing || !scoringResume}
                    className={`tool-btn scoring ${scoringAnalyzing ? 'loading' : ''}`}
                  >
                    {scoringAnalyzing ? "Scoring..." : "Score Resume"}
                  </button>
                </form>
                
                {scoringAnalysis && (
                  <div className="analysis-result scoring">
                    <h4>Resume Score</h4>
                    <pre className="analysis-text">{scoringAnalysis}</pre>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Job Board Section */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Job Board</h2>
              <p className="section-subtitle">Find and apply to exciting opportunities</p>
            </div>
            
            {message && (
              <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
            
            <div className="jobs-grid">
              {jobs.map(job => (
                <div key={job._id} className="job-card">
                  <div className="job-header">
                    <h3 className="job-title">{job.title}</h3>
                    <span className="job-company">{job.company}</span>
                  </div>
                  <p className="job-description">{job.description}</p>
                  {appliedJobIds.includes(job._id) ? (
                    <button disabled className="job-btn applied">
                      ✓ Applied
                    </button>
                  ) : (
                    <button onClick={() => handleApply(job._id)} className="job-btn apply">
                      Apply Now
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Applications Section */}
            <div className="applications-section">
              <h3 className="applications-title">My Applications</h3>
              <div className="applications-grid">
                {applications.map(app => (
                  <div key={app._id} className="application-card">
                    <div className="application-info">
                      <h4 className="application-job">{app.job.title}</h4>
                      <span className="application-company">{app.job.company}</span>
                    </div>
                    <div className="application-status">
                      <span className={`status-badge ${app.status}`}>
                        {app.status}
                      </span>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${app.status}`}
                          style={{ 
                            width: app.status === "accepted" ? "100%" : 
                                   app.status === "applied" ? "50%" : 
                                   app.status === "rejected" ? "100%" : "50%" 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
