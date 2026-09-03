import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav.js";
import Footer from "./Footer.js";
import "../css/ConsultancyProfiles.css";

const professionals = [
  {
    id: 1,
    name: "Dr. Alice Walker",
    specialization: "Clinical Psychologist",
    experience: "12 years",
    approach: "Cognitive Behavioral Therapy (CBT) & Mindfulness",
    age: 45,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "Dr. Ben Carter",
    specialization: "Psychiatrist & Neurotherapist",
    experience: "15 years",
    approach: "Compassionate Counseling & Holistic Wellness",
    age: 50,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Dr. Clara Evans",
    specialization: "Family & Youth Psychologist",
    experience: "8 years",
    approach: "Compassion-Focused Therapy & Family Support",
    age: 38,
    image: "https://images.unsplash.com/photo-1594824813628-9844781498b3?auto=format&fit=crop&q=80&w=400",
  },
];

const ConsultancyProfiles = () => {
  const navigate = useNavigate();
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  return (
    <>
      <Nav />

      <div className="specialists-page-wrapper">
        <div className="specialists-container">
          <div className="specialists-header">
            <h1 className="specialists-title">Mental Health Specialists</h1>
            <p className="specialists-subtitle">
              Verified clinical professionals dedicated to providing you a safe, confidential, and empathetic space.
            </p>
          </div>

          <div className="specialists-grid">
            {professionals.map((prof) => (
              <div
                key={prof.id}
                className="specialist-card"
                onClick={() => setSelectedProfessional(prof)}
              >
                <img
                  src={prof.image}
                  alt={prof.name}
                  className="specialist-img"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/300/200?random=${prof.id}`;
                  }}
                />
                <div className="specialist-card-body">
                  <h3 className="specialist-name">{prof.name}</h3>
                  <span className="specialist-spec">{prof.specialization}</span>
                  <div className="specialist-meta">
                    <p style={{ margin: "0 0 6px" }}>Experience: {prof.experience}</p>
                    <p style={{ margin: "0", color: "var(--color-text-body)" }}>{prof.approach}</p>
                  </div>
                  <button
                    className="specialist-book-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/book-appointment", { state: { professional: prof } });
                    }}
                  >
                    Book Appointment &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Specialist Detail Modal */}
          {selectedProfessional && (
            <div className="peaceful-modal-overlay" onClick={() => setSelectedProfessional(null)}>
              <div className="peaceful-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-doctor-header">
                  <img
                    src={selectedProfessional.image}
                    alt={selectedProfessional.name}
                    className="modal-doctor-avatar"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/100/100?random=${selectedProfessional.id}`;
                    }}
                  />
                  <div>
                    <h2 style={{ margin: "0 0 4px", fontSize: "1.3rem", fontWeight: 700, color: "var(--color-text-main)" }}>
                      {selectedProfessional.name}
                    </h2>
                    <span style={{ fontSize: "0.9rem", color: "var(--color-primary)", fontWeight: 600 }}>
                      {selectedProfessional.specialization}
                    </span>
                  </div>
                </div>

                <div className="modal-field">
                  <strong>Experience:</strong> {selectedProfessional.experience}
                </div>
                <div className="modal-field">
                  <strong>Therapeutic Approach:</strong> {selectedProfessional.approach}
                </div>
                <div className="modal-field">
                  <strong>Age:</strong> {selectedProfessional.age}
                </div>

                <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
                  <button
                    className="specialist-book-btn"
                    onClick={() =>
                      navigate("/book-appointment", { state: { professional: selectedProfessional } })
                    }
                  >
                    Confirm & Book Appointment
                  </button>
                  <button
                    onClick={() => setSelectedProfessional(null)}
                    style={{
                      padding: "10px 18px",
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: 600,
                      cursor: "pointer",
                      color: "var(--color-text-body)",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <Footer />
    </>
  );
};

export default ConsultancyProfiles;
