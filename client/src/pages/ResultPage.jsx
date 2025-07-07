import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>No resume data found. Please <button onClick={() => navigate("/")}>upload again</button>.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2> Parsed Resume Data</h2>
      <pre style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
