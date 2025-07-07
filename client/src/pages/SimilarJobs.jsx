import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SimilarJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/jobs/similar", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data.jobs);
      } catch (err) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div>Loading similar jobs...</div>;

  return (
    <div>
      <h2>Jobs Recommended For You</h2>
      {jobs.length === 0 && <div>No similar jobs found.</div>}
      <ul>
        {jobs.map(job => (
          <li key={job._id}>
            <strong>{job.title}</strong> at {job.company}
            <div>{job.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}