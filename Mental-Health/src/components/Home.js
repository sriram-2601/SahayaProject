import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav.js";
import Footer from "./Footer.js";
import "../css/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [chatbotName, setChatbotName] = useState(() => {
    return localStorage.getItem("chatbotName") || "";
  });
  const [nameSubmitted, setNameSubmitted] = useState(() => {
    return Boolean(localStorage.getItem("chatbotName"));
  });

  const handleNameChange = (e) => {
    setChatbotName(e.target.value);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (chatbotName.trim() !== "") {
      localStorage.setItem("chatbotName", chatbotName.trim());
      setNameSubmitted(true);
    }
  };

  const handleEditName = () => {
    setNameSubmitted(false);
  };

  return (
    <>
      <Nav chatbotName={chatbotName || "AI Companion"} />

      <div className="home-page-wrapper">
        <div className="home-container">
          {/* Welcome Banner Card */}
          <section className="home-welcome-card">
            <div className="home-welcome-badge">
              <span>🌿</span>
              <span>Your Safe Space For Healing & Growth</span>
            </div>

            <h1 className="home-welcome-title">
              Welcome to Sahaya, Friend.
            </h1>

            <p className="home-welcome-subtitle">
              Take a slow, deep breath. Whatever you are carrying today, you have a safe,
              confidential harbor to process thoughts, set gentle goals, and receive empathetic care.
            </p>

            {/* Chatbot Companion Naming */}
            {!nameSubmitted ? (
              <form onSubmit={handleNameSubmit} className="home-buddy-form">
                <input
                  type="text"
                  placeholder="Give your companion a name (e.g. Zen, Aanya)"
                  value={chatbotName}
                  onChange={handleNameChange}
                  className="home-buddy-input"
                  required
                />
                <button type="submit" className="home-buddy-btn">
                  Set Name
                </button>
              </form>
            ) : (
              <div className="home-buddy-active">
                <span>🤖 Companion: <strong>{chatbotName}</strong></span>
                <button
                  onClick={handleEditName}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-primary)",
                    fontSize: "0.82rem",
                    textDecoration: "underline",
                    cursor: "pointer",
                    marginLeft: "8px",
                  }}
                >
                  Change
                </button>
              </div>
            )}
          </section>

          {/* Pillars of Care */}
          <section>
            <div className="home-section-header">
              <div>
                <h2 className="home-section-title">Support & Wellness Pillars</h2>
                <p className="home-section-subtitle">
                  Holistic tools designed to ease anxiety, organize daily life, and provide reassurance.
                </p>
              </div>
            </div>

            <div className="home-cards-grid">
              {/* Card 1: Chatbot */}
              <Link to="/chatbot" className="home-pillar-card">
                <div className="home-pillar-card-img-wrapper">
                  <img src="images/Chatbot.jpg" alt="Chatbot" className="home-pillar-card-img" />
                  <span className="home-pillar-badge">Empathetic AI</span>
                </div>
                <div className="home-pillar-body">
                  <h3 className="home-pillar-title">
                    {chatbotName ? `${chatbotName} Companion` : "AI Companion"}
                  </h3>
                  <p className="home-pillar-desc">
                    Engage in soothing, confidential conversations whenever anxiety or stress arise.
                  </p>
                  <span className="home-pillar-link">
                    Start Conversation &rarr;
                  </span>
                </div>
              </Link>

              {/* Card 2: Assistant */}
              <Link to="/personal-assistant" className="home-pillar-card">
                <div className="home-pillar-card-img-wrapper">
                  <img src="images/personlassistant.jpg" alt="Personal Assistant" className="home-pillar-card-img" />
                  <span className="home-pillar-badge">Daily Care</span>
                </div>
                <div className="home-pillar-body">
                  <h3 className="home-pillar-title">Personal Assistant</h3>
                  <p className="home-pillar-desc">
                    Schedule mindful check-ins, hydration reminders, and gentle wellness notifications.
                  </p>
                  <span className="home-pillar-link">
                    Open Assistant &rarr;
                  </span>
                </div>
              </Link>

              {/* Card 3: Consultancy */}
              <Link to="/consultancy" className="home-pillar-card">
                <div className="home-pillar-card-img-wrapper">
                  <img src="images/consultancy.jpg" alt="Professional Guidance" className="home-pillar-card-img" />
                  <span className="home-pillar-badge">Certified Experts</span>
                </div>
                <div className="home-pillar-body">
                  <h3 className="home-pillar-title">Professional Guidance</h3>
                  <p className="home-pillar-desc">
                    Connect with qualified counselors and psychologists for specialized one-on-one sessions.
                  </p>
                  <span className="home-pillar-link">
                    Find a Specialist &rarr;
                  </span>
                </div>
              </Link>

              {/* Card 4: Todo Tracker */}
              <Link to="/tasksDone" className="home-pillar-card">
                <div className="home-pillar-card-img-wrapper">
                  <img src="images/Todo.webp" alt="Todo Tracker" className="home-pillar-card-img" />
                  <span className="home-pillar-badge">Mindful Habits</span>
                </div>
                <div className="home-pillar-body">
                  <h3 className="home-pillar-title">Goal & Habit Tracker</h3>
                  <p className="home-pillar-desc">
                    Break overwhelming days into peaceful, manageable steps. Celebrate small victories.
                  </p>
                  <span className="home-pillar-link">
                    Track Goals &rarr;
                  </span>
                </div>
              </Link>
            </div>
          </section>

          {/* Express Your Feelings Section */}
          <section className="home-feelings-card">
            <h2 className="home-section-title">Express & Release Your Feelings</h2>
            <p className="home-section-subtitle" style={{ maxWidth: "600px", margin: "0 auto" }}>
              Every emotion deserves a healthy outlet. Pick the medium that resonates with you right now.
            </p>

            <div className="home-feelings-grid">
              {/* Journal */}
              <div className="home-feeling-item" onClick={() => navigate("/notes")}>
                <div className="home-feeling-icon-box" style={{ background: "#E8F5EE" }}>
                  <span>📝</span>
                </div>
                <h3 className="home-feeling-title">Private Journal</h3>
                <p className="home-feeling-desc">
                  Safely write down and organize thoughts without judgment.
                </p>
              </div>

              {/* Scribble Pad */}
              <div className="home-feeling-item" onClick={() => navigate("/scribble-pad")}>
                <div className="home-feeling-icon-box" style={{ background: "#F0FDFA" }}>
                  <span>🎨</span>
                </div>
                <h3 className="home-feeling-title">Art & Scribble Pad</h3>
                <p className="home-feeling-desc">
                  Draw, release stress with brush strokes, and express visually.
                </p>
              </div>

              {/* 3D Mindful Model */}
              <div className="home-feeling-item" onClick={() => navigate("/Model")}>
                <div className="home-feeling-icon-box" style={{ background: "#EFF6FF" }}>
                  <span>🤖</span>
                </div>
                <h3 className="home-feeling-title">3D Character Space</h3>
                <p className="home-feeling-desc">
                  Interactive 3D expressions for meditation and relaxation.
                </p>
              </div>

              {/* Guided Meditation */}
              <div className="home-feeling-item" onClick={() => navigate("/meditation")}>
                <div className="home-feeling-icon-box" style={{ background: "#E8F5EE" }}>
                  <span>🧘</span>
                </div>
                <h3 className="home-feeling-title">Guided Meditation</h3>
                <p className="home-feeling-desc">
                  Box breathing and soothing nervous system calming rhythms.
                </p>
              </div>

              {/* Peer Support Community */}
              <div className="home-feeling-item" onClick={() => navigate("/chat-application")}>
                <div className="home-feeling-icon-box" style={{ background: "#FEF3C7" }}>
                  <span>💬</span>
                </div>
                <h3 className="home-feeling-title">Peer Support Lounge</h3>
                <p className="home-feeling-desc">
                  Share warm thoughts and receive reassurance from members.
                </p>
              </div>

              {/* Specialist Guidance */}
              <div className="home-feeling-item" onClick={() => navigate("/consultancy")}>
                <div className="home-feeling-icon-box" style={{ background: "#EEF2FF" }}>
                  <span>🤝</span>
                </div>
                <h3 className="home-feeling-title">Expert Counselor</h3>
                <p className="home-feeling-desc">
                  Reach out for tailored therapy appointments with top professionals.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Feedback link in tranquil theme */}
      <Link to="/feedback" className="home-feedback-fab" title="Help us improve">
        <span>💬</span>
        <span>Feedback</span>
      </Link>

      <Footer />
    </>
  );
};

export default Home;
