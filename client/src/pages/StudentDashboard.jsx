import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  // Resume Analyzer state
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  // Job Board state
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch jobs and applications
  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      const token = localStorage.getItem("token");
      // Fetch all jobs
      const jobsRes = await axios.get("/api/jobs");
      setJobs(jobsRes.data);

      // Fetch my applications
      const appsRes = await axios.get("/api/applications/mine", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(appsRes.data);
      setAppliedJobIds(appsRes.data.map(app => app.job._id));
    };
    fetchJobsAndApplications();
  }, []);

  // Resume Analyzer handler
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
      setAnalysis(res.data.analysis);
    } catch {
      setAnalysis("Failed to analyze resume.");
    }
    setAnalyzing(false);
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
    <div style={{
      display: "flex",
      minHeight: "80vh",
      gap: 32,
      padding: 32,
      background: "#f9fbff"
    }}>
      {/* Left: Resume Analyzer */}
      <div style={{
        flex: 1,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(74,144,226,0.06)",
        padding: 24,
        display: "flex",
        flexDirection: "column"
      }}>
        <h2 style={{ color: "#4a90e2" }}>Resume Analyzer</h2>
        <form onSubmit={handleResumeUpload} style={{ marginBottom: 16 }}>
          <input
            type="file"
            accept=".pdf"
            onChange={e => setResume(e.target.files[0])}
            required
            style={{ marginBottom: 8 }}
          />
          {resume && (
            <div style={{ marginBottom: 8, color: "#357ac7" }}>
              Selected file: {resume.name}
            </div>
          )}
          <button
            type="submit"
            disabled={analyzing || !resume}
            style={{
              background: analyzing ? "#bcd0ee" : "#4a90e2",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "8px 16px",
              fontWeight: "bold",
              cursor: analyzing || !resume ? "not-allowed" : "pointer"
            }}
          >
            {analyzing ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </form>
        {analysis && (
          <div style={{
            background: "#f4f8ff",
            padding: 16,
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            fontFamily: "inherit"
          }}>
            {analysis}
          </div>
        )}
      </div>

      {/* Right: Job Board */}
      <div style={{
        flex: 1,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(74,144,226,0.06)",
        padding: 24,
        display: "flex",
        flexDirection: "column"
      }}>
        <h2 style={{ color: "#4a90e2" }}>Job Board</h2>
        {message && <div style={{ color: "#e67e22", marginBottom: 8 }}>{message}</div>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {jobs.map(job => (
            <li key={job._id} style={{
              marginBottom: 18,
              padding: 12,
              borderRadius: 8,
              background: "#f4f8ff"
            }}>
              <strong>{job.title}</strong> at {job.company}
              <div>{job.description}</div>
              {appliedJobIds.includes(job._id) ? (
                <button disabled style={{
                  marginTop: 6,
                  background: "#bcd0ee",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 12px"
                }}>Applied</button>
              ) : (
                <button onClick={() => handleApply(job._id)} style={{
                  marginTop: 6,
                  background: "#4a90e2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 12px",
                  cursor: "pointer"
                }}>Apply</button>
              )}
            </li>
          ))}
        </ul>
        <h3 style={{ marginTop: 24 }}>My Applications</h3>
        <ul>
          {applications.map(app => (
            <li key={app._id} style={{ marginBottom: 24 }}>
              {app.job.title} at {app.job.company} — Status: {app.status}
              <div style={{
                background: "#e0e0e0",
                borderRadius: 8,
                height: 12,
                width: 200,
                marginTop: 6,
                overflow: "hidden"
              }}>
                <div
                  style={{
                    height: "100%",
                    width: app.status === "accepted" ? "100%" : "50%",
                    background: "#4caf50",
                    transition: "width 0.5s"
                  }}
                />
              </div>
              <div style={{ fontSize: 12, color: "#4caf50", marginTop: 2 }}>
                {app.status === "accepted" ? "Accepted" : "Applied"}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
