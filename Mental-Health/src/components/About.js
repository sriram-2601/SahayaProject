import React from 'react';
import Nav from "./Nav.js";
import Footer from "./Footer.js";
import { useNavigate } from "react-router-dom";
import '../css/About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <div className="about-page-wrapper">
        <div className="about-container">
          <div className="about-card">
            <div className="about-badge">
              <span>🌱</span>
              <span>Our Compassionate Mission</span>
            </div>

            <h1 className="about-title">About Sahaya</h1>

            <p className="about-intro">
              "Sahaya" translates to help, companionship, and support. We believe that no one should ever have to navigate emotional vulnerability alone.
            </p>

            <p className="about-text">
              Sahaya was created as a peaceful digital sanctuary dedicated to mental health awareness, early emotional distress detection, and stigma-free support. Whether you are dealing with daily anxiety, burnout, loneliness, or seeking personal self-reflection, our platform provides non-judgmental guidance available at your fingertips.
            </p>

            <p className="about-text">
              By blending thoughtful, empathetic conversational AI with mindful journaling, expressive art therapy, and seamless connections to licensed clinical professionals, Sahaya bridges the gap between everyday emotional needs and qualified psychological care.
            </p>

            {/* Core Values */}
            <div className="about-values-grid">
              <div className="about-value-box">
                <div className="about-value-icon">🔒</div>
                <h3 className="about-value-title">Absolute Privacy</h3>
                <p className="about-value-desc">
                  Your thoughts, journal entries, and chats remain private, safe, and confidential.
                </p>
              </div>

              <div className="about-value-box">
                <div className="about-value-icon">🌿</div>
                <h3 className="about-value-title">Zero Judgment</h3>
                <p className="about-value-desc">
                  A sanctuary built on empathy, validating your feelings exactly as they are.
                </p>
              </div>

              <div className="about-value-box">
                <div className="about-value-icon">🩺</div>
                <h3 className="about-value-title">Clinical Connection</h3>
                <p className="about-value-desc">
                  Direct pathways to verified psychologists and therapists when professional care is needed.
                </p>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="about-helpline-box">
              <span style={{ fontSize: "2rem" }}>💡</span>
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "#1B4332", fontSize: "1rem", fontWeight: 700 }}>
                  Immediate Crisis Assistance
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#2D6A4F" }}>
                  Sahaya is a supportive companion, not an emergency crisis service. If you or someone you know is in severe distress, please contact the national mental health toll-free helpline at <strong>1800-599-0019 (KIRAN)</strong> or call your local emergency medical service immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <Footer />
    </>
  );
};

export default About;
