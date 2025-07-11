import React, { useEffect, useState } from "react";
import axios from "axios";
import Notifications from "../components/Notifications";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);
  const [form, setForm] = useState({ title: "", company: "", description: "" });
  const [message, setMessage] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [postingJob, setPostingJob] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch jobs posted by this recruiter
  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const res = await axios.get("/api/jobs/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data);
      } catch {
        setMessage("Failed to load jobs.");
      }
      setLoadingJobs(false);
    };
    fetchJobs();
    setIsVisible(true);
  }, [token]);

  // Fetch applicants for a job
  const fetchApplicants = async (jobId) => {
    setLoadingApplicants((prev) => ({ ...prev, [jobId]: true }));
    try {
      const res = await axios.get(`/api/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicants((prev) => ({ ...prev, [jobId]: res.data }));
    } catch {
      setMessage("Failed to load applicants.");
    }
    setLoadingApplicants((prev) => ({ ...prev, [jobId]: false }));
  };

  // Handle job post form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPostingJob(true);
    setMessage("");
    try {
      await axios.post("/api/jobs", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Job posted successfully!");
      setForm({ title: "", company: "", description: "" });
      // Refresh jobs
      const res = await axios.get("/api/jobs/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch {
      setMessage("❌ Failed to post job.");
    }
    setPostingJob(false);
  };

  const toggleApplicants = (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
    } else {
      setExpandedJob(jobId);
      if (!applicants[jobId]) fetchApplicants(jobId);
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
          <span className="welcome-text">Welcome, Recruiter!</span>
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
          {/* Post Job Section */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Post a New Job</h2>
              <p className="section-subtitle">Create job opportunities for talented candidates</p>
            </div>
            
            <div className="post-job-card">
              <form onSubmit={handlePostJob} className="job-form">
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input
                    name="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    name="company"
                    placeholder="e.g., Tech Corp"
                    value={form.company}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Job Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe the role, requirements, and benefits..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="form-textarea"
                    rows="4"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={postingJob}
                  className={`post-job-btn ${postingJob ? 'loading' : ''}`}
                >
                  {postingJob ? "Posting..." : "Post Job"}
                </button>
              </form>
              
              {message && (
                <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
            </div>
          </section>

          {/* Posted Jobs Section */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Your Posted Jobs</h2>
              <p className="section-subtitle">Manage your job postings and review applications</p>
            </div>
            
            {loadingJobs ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Loading jobs...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No jobs posted yet</h3>
                <p>Start by posting your first job opportunity above</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {jobs.map((job) => (
                  <div key={job._id} className="recruiter-job-card">
                    <div className="job-header">
                      <h3 className="job-title">{job.title}</h3>
                      <span className="job-company">@ {job.company}</span>
                    </div>
                    
                    <p className="job-description">{job.description}</p>
                    
                    <button
                      onClick={() => toggleApplicants(job._id)}
                      className="view-applicants-btn"
                    >
                      {expandedJob === job._id ? "Hide Applicants" : "View Applicants"}
                    </button>
                    
                    {expandedJob === job._id && (
                      <div className="applicants-section">
                        <h4 className="applicants-title">Applicants</h4>
                        {loadingApplicants[job._id] ? (
                          <div className="loading-state">
                            <div className="spinner"></div>
                            <span>Loading applicants...</span>
                          </div>
                        ) : applicants[job._id] && applicants[job._id].length > 0 ? (
                          <div className="applicants-list">
                            {applicants[job._id].map((app) => (
                              <div key={app._id} className="applicant-card">
                                <div className="applicant-info">
                                  <span className="applicant-email">
                                    {app.student?.email || "No email"}
                                  </span>
                                  <span className={`status-badge ${app.status}`}>
                                    {app.status}
                                  </span>
                                </div>
                                
                                <div className="applicant-actions">
                                  {app.resumeUrl && (
                                    <a 
                                      href={app.resumeUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="resume-link"
                                    >
                                      📄 View Resume
                                    </a>
                                  )}
                                  
                                  {app.status !== "accepted" && (
                                    <button
                                      className="accept-btn"
                                      onClick={async () => {
                                        try {
                                          await axios.patch(`/api/applications/${app._id}/accept`,
                                            {},
                                            { headers: { Authorization: `Bearer ${token}` } }
                                          );
                                          setMessage("Application accepted!");
                                          // Refresh applicants
                                          fetchApplicants(job._id);
                                        } catch {
                                          setMessage("Failed to accept application.");
                                        }
                                      }}
                                    >
                                      Accept
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="empty-applicants">
                            <p>No applicants yet for this position</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;