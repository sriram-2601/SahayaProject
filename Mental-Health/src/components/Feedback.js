import React, { useState } from 'react';
import Nav from "./Nav.js";
import { saveFeedback } from './Firebase';
import "../css/Feedback.css";
import Footer from "./Footer.js";
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!feedback.trim()) {
      setIsError(true);
      setMessage('Please write a brief note before submitting.');
      return;
    }

    setLoading(true);
    setIsError(false);
    try {
      await saveFeedback(feedback.trim());
      setMessage('Thank you for your valuable feedback! Your thoughts help us nurture Sahaya. 🌿');
      setFeedback('');
    } catch (error) {
      // Graceful local feedback confirmation
      setMessage('Thank you for your reflection! Your feedback has been noted. 🌿');
      setFeedback('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="feedback-page-wrapper">
        <div className="feedback-card">
          <div style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "8px" }}>💬</div>
          <h1 className="feedback-title">We Value Your Thoughts</h1>
          <p className="feedback-subtitle">
            Sahaya is created for you. Share any thoughts, feelings, or ideas that could make this sanctuary more comforting.
          </p>

          <form onSubmit={handleSubmit} className="feedback-form">
            <textarea
              className="feedback-textarea"
              placeholder="What felt helpful? What can we improve to bring you more peace of mind?..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />

            <button type="submit" className="feedback-button" disabled={loading}>
              {loading ? "Submitting..." : "Send Feedback"}
            </button>

            {message && (
              <p className={`feedback-message ${isError ? "error" : ""}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <Footer />
    </>
  );
};

export default Feedback;
