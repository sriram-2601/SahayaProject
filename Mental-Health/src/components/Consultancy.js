import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav.js";
import Footer from "./Footer.js";
import "../css/Consultancy.css";

const profiles = [
  {
    id: 1,
    name: "Consultancy & Specialists",
    bio: "Book private one-on-one sessions with certified psychologists, psychiatrists, and specialized mental health experts.",
    link: "/consultancy-profiles",
    actionText: "View Specialists",
    badge: "Clinical Experts",
    icon: "🩺"
  },
  {
    id: 2,
    name: "Personal Assistant & Reminders",
    bio: "Schedule gentle daily wellness reminders, hydration check-ins, and personal routines to keep your mind balanced.",
    link: "/personal-assistant",
    actionText: "Open Assistant",
    badge: "Daily Wellness",
    icon: "⏰"
  },
];

const Consultancy = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <div className="consultancy-page-wrapper">
        <div className="consultancy-container">
          <div className="consultancy-header">
            <h1 className="consultancy-title">Guidance & Support Services</h1>
            <p className="consultancy-subtitle">
              Choose professional psychological care or daily personalized assistance to support your peace of mind.
            </p>
          </div>

          <div className="profiles-grid">
            {profiles.map((profile) => (
              <div key={profile.id} className="consultant-card">
                <div style={{ padding: "28px 24px 16px", background: "var(--color-bg)", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "var(--color-surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    boxShadow: "var(--shadow-sm)"
                  }}>
                    {profile.icon}
                  </div>
                  <div>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                      background: "var(--color-primary-light)",
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      textTransform: "uppercase"
                    }}>
                      {profile.badge}
                    </span>
                    <h3 style={{ margin: "6px 0 0", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-text-main)" }}>
                      {profile.name}
                    </h3>
                  </div>
                </div>

                <div className="consultant-card-body">
                  <p className="consultant-card-text">{profile.bio}</p>
                  <Link to={profile.link} className="consultant-action-btn" style={{ textDecoration: "none" }}>
                    <span>{profile.actionText}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
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

export default Consultancy;
