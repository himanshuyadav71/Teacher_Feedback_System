import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, dob })
      });

      const data = await res.json();

      if (data.status === "ok") {
        localStorage.setItem("session_key", data.session_key);
        localStorage.setItem("enrollment", data.EnrollmentNo);
        localStorage.setItem("fullName", data.FullName);
        localStorage.setItem("email", data.Email);
        alert("Login Successful");
        navigate("/dashboard");
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      alert("Error connecting to server. Please check if backend is running.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Teacher Feedback System</h1>
          <p>Student Login Portal</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your college email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2025 Teacher Feedback System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
