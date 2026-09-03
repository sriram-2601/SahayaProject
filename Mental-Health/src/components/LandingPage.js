import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './Firebase';
import "../css/LandingPage.css";

const moods = [
  { emoji: "😌", label: "Peaceful", reply: "That’s wonderful. Let’s nurture this moment of calm." },
  { emoji: "🌿", label: "A bit anxious", reply: "Take a deep breath. You are safe here, and we can take it one moment at a time." },
  { emoji: "🌧️", label: "Feeling low", reply: "Your feelings are valid. You don't have to carry the weight alone." },
  { emoji: "💡", label: "Seeking clarity", reply: "Let's explore what’s on your mind together in a quiet, supportive space." },
  { emoji: "🧘", label: "Need grounding", reply: "Let's center yourself with soothing guidance, breathing, and reflection." }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);

  const handleStartSession = () => {
    if (auth.currentUser) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  return (
    <div className="landing-wrapper">
      {/* Ambient background glows */}
      <div className="landing-ambient-glow" />
      <div className="landing-ambient-glow-left" />

      {/* Header */}
      <header className="landing-header">
        <div className="landing-brand">
          <div className="landing-brand-icon">🌱</div>
          <div className="landing-brand-text">
            <h2>Sahaya</h2>
            <p>Mental Well-being Sanctuary</p>
          </div>
        </div>

        <button className="landing-auth-btn" onClick={() => navigate("/login")}>
          <span>Sign In</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      {/* Main Hero Section */}
      <main className="landing-hero">
        <div className="landing-badge">
          <span>🕊️</span>
          <span>A Compassionate, Safe Space For Your Mind</span>
        </div>

        <h1 className="landing-title">
          You don't have to carry it alone.{" "}
          <span className="peaceful-gradient-text">Sahaya is here to listen.</span>
        </h1>

        <p className="landing-subtitle">
          An empathetic, non-judgmental AI companion designed to understand your emotions,
          help you reflect, and guide you toward peace and professional support whenever you need it.
        </p>

        {/* Action Buttons */}
        <div className="landing-actions">
          <button className="landing-btn-primary" onClick={handleStartSession}>
            <span>Willing to Share?</span>
            <span>💬</span>
          </button>
          <button className="landing-btn-secondary" onClick={() => navigate("/about")}>
            <span>Learn About Sahaya</span>
            <span>🌱</span>
          </button>
        </div>

        {/* Interactive Mood Check-in Card */}
        <div className="landing-mood-card">
          <h2 className="landing-mood-title">How are you feeling right now?</h2>
          <p className="landing-mood-desc">Tap a mood to begin a moment of mindful awareness.</p>

          <div className="mood-pills">
            {moods.map((m, index) => (
              <button
                key={index}
                className={`mood-pill ${selectedMood?.label === m.label ? "active" : ""}`}
                onClick={() => handleMoodSelect(m)}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="mood-response-box">
              <p style={{ margin: 0, fontWeight: 500 }}>
                {selectedMood.reply}{" "}
                <button
                  onClick={() => navigate("/chatbot")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: "0 4px",
                  }}
                >
                  Talk with Sahaya &rarr;
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="landing-trust-row">
          <div className="trust-item">
            <span>🔒</span>
            <span>Private & Confidential</span>
          </div>
          <div className="trust-item">
            <span>🌿</span>
            <span>Non-Judgmental Guidance</span>
          </div>
          <div className="trust-item">
            <span>💚</span>
            <span>24/7 Empathetic Support</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;