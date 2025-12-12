import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './Dashboard.css';

const Dashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') || 'Student';
  const enrollment = localStorage.getItem('enrollment') || '';
  const email = localStorage.getItem('email') || '';

  // Generate initials from full name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/my-teachers/`, {
        method: "GET",
        credentials: "include"
      });

      const data = await res.json();

      if (data.status === "ok") {
        setTeachers(data.subjects);
      } else {
        alert("Session expired — login again");
        navigate("/login");
      }
    } catch (error) {
      alert("Error fetching teachers. Please check backend connection.");
      console.error("Fetch teachers error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/logout/`, {
        method: "POST",
        credentials: "include"
      });

      const data = await res.json();

      if (data.status === "ok") {
        localStorage.clear();
        alert("Logged out successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      navigate("/login");
    }
  };

  const handleGiveFeedback = (subjectCode, allocationId, teacherName) => {
    navigate('/feedback', {
      state: {
        subjectCode,
        allocationId,
        teacherName
      }
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your teachers...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h2>Teacher Feedback System</h2>
        </div>
        <div className="nav-right">
          <span className="user-info">
            {fullName} ({enrollment})
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>My Teachers</h1>
          <p>Select a teacher to provide feedback</p>
        </div>

        {teachers.length === 0 ? (
          <div className="no-teachers">
            <p>No teachers assigned yet.</p>
          </div>
        ) : (
          <div className="teachers-grid">
            {teachers.map((subject) => (
              <div key={subject.subject_code} className="subject-card">
                <div className="subject-header">
                  <h3>{subject.subject_code}</h3>
                </div>
                <div className="teachers-list">
                  {subject.teachers.map((teacher) => (
                    <div key={teacher.allocation_id} className="teacher-item">
                      <div className="teacher-info">
                        <p className="teacher-name">{teacher.teacher_name}</p>
                        <p className="teacher-subject">{subject.subject_code}</p>
                      </div>
                      <button
                        onClick={() => handleGiveFeedback(
                          subject.subject_code,
                          teacher.allocation_id,
                          teacher.teacher_name
                        )}
                        className="feedback-btn"
                      >
                        Give Feedback
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
