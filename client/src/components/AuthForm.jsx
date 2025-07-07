import React, { useState } from "react";
import "./AuthForm.css";

export default function AuthForm({ type = "login", onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, role });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{type === "login" ? "Login to CareerGenie" : "Sign Up to CareerGenie"}</h2>
      <p className="auth-subtitle">
        {type === "login"
          ? "Access your dashboard as a Student, Recruiter, or Admin"
          : "Create your account to get started"}
      </p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <label htmlFor="role" style={{ fontWeight: 500, marginBottom: 4 }}>
        {type === "login" ? "Login as:" : "Sign up as:"}
      </label>
      <select
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <option value="student">Student</option>
        <option value="recruiter">Recruiter</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">{type === "login" ? "Login" : "Sign Up"}</button>
    </form>
  );
}
