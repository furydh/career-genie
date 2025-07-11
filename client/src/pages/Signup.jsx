import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthForm from "../components/AuthForm";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className="auth-title">Join CareerGenie</h1>
          <p className="auth-subtitle">Create your account and start your career journey</p>
          
          <AuthForm type="signup" onSubmit={handleSignup} />
          
          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="auth-link">Sign In</Link>
          </div>
        </div>
      </main>
    </div>
  );
}