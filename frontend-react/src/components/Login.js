import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { FaUser, FaCalendarAlt } from "react-icons/fa";
import API_BASE_URL from "../config";
import "react-datepicker/dist/react-datepicker.css";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Formatting date to YYYY-MM-DD using local time to avoid timezone issues
    const formattedDob = dob ? `${dob.getFullYear()}-${String(dob.getMonth() + 1).padStart(2, '0')}-${String(dob.getDate()).padStart(2, '0')}` : "";

    try {
      const res = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, dob: formattedDob }),
      });


      const data = await res.json();

      if (data.status === "ok") {
        if (typeof window !== 'undefined') {
          localStorage.setItem("session_key", data.session_key);
          localStorage.setItem("enrollment", data.EnrollmentNo);
          localStorage.setItem("fullName", data.FullName);
          localStorage.setItem("email", data.Email);
        }
        // Removed alert for smoother experience
        navigate("/dashboard");
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        // Handle other error messages
        setErrors({ form: [data.error || "Invalid credentials"] });
      }
    } catch (error) {
      setErrors({ form: ["Error connecting to server. Please check if backend is running."] });
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
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your college email"
                required
              />
            </div>
            {errors.email && (
              <div className="error-message">
                {errors.email.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <div className="input-icon-wrapper">
              <FaCalendarAlt className="input-icon" />
              <DatePicker
                selected={dob}
                onChange={(date) => setDob(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select your date of birth"
                className="date-picker-input"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                required
                maxDate={new Date()}
              />
            </div>
            {errors.dob && (
              <div className="error-message">
                {errors.dob.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>

          {errors.form && (
            <div className="error-message">
              {errors.form.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
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
