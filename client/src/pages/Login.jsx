import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthForm from "../components/AuthForm";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <div className="auth-container">
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
      <header className="auth-header">
        <div className="logo">
          <span className="logo-text">CareerGenie</span>
        </div>
        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className={`auth-card ${isVisible ? 'fade-in' : ''}`}>
          <div className="auth-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your CareerGenie account</p>
          
          <AuthForm type="login" onSubmit={handleLogin} />
          
          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <div className="auth-footer">
            <span>New to CareerGenie?</span>
            <Link to="/signup" className="auth-link">Create Account</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
