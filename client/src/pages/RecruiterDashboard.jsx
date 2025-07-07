import React, { useEffect, useState } from "react";
import axios from "axios";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);
  const [form, setForm] = useState({ title: "", company: "", description: "" });
  const [message, setMessage] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [postingJob, setPostingJob] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState({});

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
    <div className="recruiter-dashboard" style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2 style={{ color: "#4a90e2", marginBottom: 24 }}>Recruiter Dashboard</h2>
      <section style={{ marginBottom: 32, background: "#f4f8ff", padding: 20, borderRadius: 8 }}>
        <h3 style={{ marginBottom: 12 }}>Post a New Job</h3>
        <form onSubmit={handlePostJob} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #bcd0ee" }}
          />
          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #bcd0ee" }}
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #bcd0ee", minHeight: 60 }}
          />
          <button
            type="submit"
            disabled={postingJob}
            style={{
              background: postingJob ? "#bcd0ee" : "#4a90e2",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "10px 0",
              fontWeight: "bold",
              cursor: postingJob ? "not-allowed" : "pointer"
            }}
          >
            {postingJob ? "Posting..." : "Post Job"}
          </button>
        </form>
        {message && <div style={{ marginTop: 10, color: "#357ac7" }}>{message}</div>}
      </section>

      <section>
        <h3 style={{ marginBottom: 16 }}>Your Posted Jobs</h3>
        {loadingJobs ? (
          <div>Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div>No jobs posted yet.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {jobs.map((job) => (
              <div
                key={job._id}
                style={{
                  background: "#fff",
                  minWidth: 280,
                  flex: "1 1 280px",
                  marginBottom: 16,
                  padding: 16,
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(74,144,226,0.06)",
                  position: "relative"
                }}
              >
                <strong style={{ fontSize: "1.1rem" }}>{job.title}</strong> <span style={{ color: "#4a90e2" }}>@ {job.company}</span>
                <div style={{ margin: "8px 0", color: "#444" }}>{job.description}</div>
                <button
                  onClick={() => toggleApplicants(job._id)}
                  style={{
                    background: "#e2e8f0",
                    color: "#22223b",
                    border: "none",
                    borderRadius: 4,
                    padding: "6px 12px",
                    cursor: "pointer",
                    marginBottom: 8
                  }}
                >
                  {expandedJob === job._id ? "Hide Applicants" : "View Applicants"}
                </button>
                {expandedJob === job._id && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Applicants:</strong>
                    {loadingApplicants[job._id] ? (
                      <div>Loading...</div>
                    ) : applicants[job._id] && applicants[job._id].length > 0 ? (
                      <ul>
                        {applicants[job._id].map((app) => (
                          <li key={app._id}>
                            {app.student?.email || "No email"}
                            {app.resumeUrl && (
                              <>
                                {" | "}
                                <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                                  View Resume
                                </a>
                              </>
                            )}
                            {" | "}
                            Status: <span style={{ color: app.status === "accepted" ? "#4caf50" : "#e67e22" }}>{app.status}</span>
                            {app.status !== "accepted" && (
                              <button
                                style={{
                                  marginLeft: 8,
                                  background: "#4caf50",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 4,
                                  padding: "4px 10px",
                                  cursor: "pointer"
                                }}
                                onClick={async () => {
                                  const token = localStorage.getItem("token");
                                  await axios.patch(
                                    `/api/applications/${app._id}/accept`,
                                    {},
                                    { headers: { Authorization: `Bearer ${token}` } }
                                  );
                                  // Optionally, refresh applicants list here
                                }}
                              >
                                Accept
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No applicants yet.</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RecruiterDashboard;