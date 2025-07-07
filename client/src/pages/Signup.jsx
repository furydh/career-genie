import React, { useState } from 'react';
import axios from 'axios';
import AuthForm from "../components/AuthForm";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async ({ email, password, role }) => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/signup', { email, password, role });
      setMessage(res.data.message || 'Signup successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="page-container">
      <div className="auth-box">
        <AuthForm type="signup" onSubmit={handleSignup} />
        {message && <div style={{ color: '#e67e22', marginTop: 10 }}>{message}</div>}
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}