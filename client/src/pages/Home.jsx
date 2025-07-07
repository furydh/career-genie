import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resume) return;
    setLoading(true);
    setAnalysis("");
    const formData = new FormData();
    formData.append("resume", resume);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAnalysis(data.analysis || "No analysis returned.");
    } catch {
      setAnalysis("Failed to analyze resume.");
    }
    setLoading(false);
  };

  return (
    <div className="main-bg">
      <div className="centered-container">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", gap: "1rem", marginBottom: "1rem" }}>
            <button className="main-btn" style={{ width: "auto" }} onClick={() => navigate("/login")}>Login</button>
            <button className="main-btn" style={{ width: "auto", background: "#357ac7" }} onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
          <h1 className="brand-title">CareerGenie</h1>
          <h2 className="main-title">AI Resume Analyzer</h2>
          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="file"
              accept=".pdf"
              onChange={e => setResume(e.target.files[0])}
              className="file-input"
              required
            />
            <button type="submit" className="main-btn" disabled={loading}>
              {loading ? "Analyzing..." : "Upload & Analyze"}
            </button>
          </form>
          {analysis && (
            <div className="analysis-box">
              <h3>Analysis Result</h3>
              <pre>{analysis}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
