import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Send role along with email and password
      const res = await axios.post('/api/auth/login', form); // Adjust endpoint as needed
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setMessage('Login successful!');
      // Redirect or update UI as needed
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <label htmlFor="role">Login as:</label>
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="student">Student</option>
        <option value="recruiter">Recruiter</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Login</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default Login;