import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subjectCode, allocationId, teacherName } = location.state || {};

  const [feedback, setFeedback] = useState({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
    q7: 0,
    q8: 0,
    q9: 0,
    q10: 0,
    comments: ''
  });

  const [loading, setLoading] = useState(false);

  const questions = [
    "How would you rate the teacher's subject knowledge?",
    "How clear and organized are the lectures?",
    "Does the teacher encourage student participation?",
    "How effectively does the teacher use teaching aids?",
    "How approachable is the teacher for doubts?",
    "How well does the teacher manage classroom discipline?",
    "How relevant are the examples provided in class?",
    "How timely is the feedback on assignments?",
    "How well does the teacher prepare for classes?",
    "Overall, how satisfied are you with this teacher?"
  ];

  const handleRatingChange = (questionNum, rating) => {
    setFeedback(prev => ({
      ...prev,
      [`q${questionNum}`]: rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if all questions are rated
    const allRated = Object.keys(feedback).filter(key => key.startsWith('q')).every(
      key => feedback[key] > 0
    );

    if (!allRated) {
      alert("Please rate all questions before submitting.");
      return;
    }

    setLoading(true);

    const feedbackData = {
      subject_code: subjectCode,
      allocation_id: allocationId,
      ...feedback
    };

    try {
      const res = await fetch(`${API_BASE_URL}/submit-feedback/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(feedbackData)
      });

      const data = await res.json();

      if (data.status === "ok") {
        alert("Feedback submitted successfully!");
        navigate("/dashboard");
      } else {
        if (data.error === "feedback already submitted") {
          alert("You have already submitted feedback for this teacher.");
        } else if (data.error === "invalid teacher allocation") {
          alert("You selected wrong teacher or subject!");
        } else {
          alert("Error: " + data.error);
        }
      }
    } catch (error) {
      alert("Error submitting feedback. Please check backend connection.");
      console.error("Submit feedback error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!subjectCode || !allocationId) {
    return (
      <div className="feedback-container">
        <div className="error-message">
          <p>Invalid access. Please select a teacher from the dashboard.</p>
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Feedback for {teacherName}</h1>
        <p className="subject-info">Subject: {subjectCode}</p>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        {questions.map((question, index) => (
          <div key={index} className="question-block">
            <p className="question-text" data-number={index + 1}>
              {question}
            </p>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${feedback[`q${index + 1}`] >= star ? 'active' : ''}`}
                  onClick={() => handleRatingChange(index + 1, star)}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="comments-section">
          <label htmlFor="comments">Additional Comments (Optional)</label>
          <textarea
            id="comments"
            value={feedback.comments}
            onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="Share your additional thoughts about this teacher..."
            rows="4"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
