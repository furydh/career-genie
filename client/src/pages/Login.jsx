import React, { useState } from 'react';
import axios from 'axios';
import AuthForm from "../components/AuthForm";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async ({ email, password, role }) => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setMessage('Login successful!');
      // Redirect based on role
      if (res.data.role === 'admin') navigate('/admin-dashboard');
      else if (res.data.role === 'recruiter') navigate('/recruiter-dashboard');
      else navigate('/dashboard'); // for students or default
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="page-container">
      <div className="auth-box">
        <AuthForm type="login" onSubmit={handleLogin} />
        {message && <div style={{ color: '#e74c3c', marginTop: 10 }}>{message}</div>}
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          New to CareerGenie? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
