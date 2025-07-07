import React, { useState } from "react";
import axios from "axios";

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resume) return;
    const formData = new FormData();
    formData.append("resume", resume);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/resume/upload", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data.analysis);
    } catch {
      setResult("Failed to analyze resume.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <h2>Resume Analyzer</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])} required />
        <button type="submit" disabled={loading}>{loading ? "Analyzing..." : "Upload & Analyze"}</button>
      </form>
      {result && (
        <div style={{ marginTop: 24, background: "#f4f8ff", padding: 16, borderRadius: 8 }}>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
