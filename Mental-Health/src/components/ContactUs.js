import React from 'react';
import Nav from "./Nav.js";
import Footer from "./Footer.js";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <div style={{
        minHeight: "100vh",
        paddingTop: "96px",
        paddingBottom: "80px",
        background: "radial-gradient(circle at 15% 15%, #EAF5EE 0%, #F5F8F7 50%, #EEF4FA 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "20px",
        paddingRight: "20px"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "600px",
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          borderRadius: "var(--radius-xl)",
          padding: "44px 36px",
          boxShadow: "var(--shadow-lg)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "2.8rem", marginBottom: "8px" }}>🌱</div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-main)", margin: "0 0 8px 0" }}>
            Contact Sahaya Care
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", margin: "0 0 28px 0" }}>
            Have questions, feedback, or need guidance? We are always here to support your journey.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left", marginBottom: "28px" }}>
            <div style={{
              padding: "16px 20px",
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}>
              <span style={{ fontSize: "1.5rem" }}>✉️</span>
              <div>
                <p style={{ margin: "0 0 2px 0", fontSize: "0.82rem", color: "var(--color-text-light)", fontWeight: 600 }}>Email Support</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-primary)", fontWeight: 600 }}>support@sahayacare.org</p>
              </div>
            </div>

            <div style={{
              padding: "16px 20px",
              background: "#EBF8F2",
              border: "1px solid #A7D8BA",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}>
              <span style={{ fontSize: "1.5rem" }}>📞</span>
              <div>
                <p style={{ margin: "0 0 2px 0", fontSize: "0.82rem", color: "#1B4332", fontWeight: 600 }}>24/7 National Mental Health Toll-Free</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#2D6A4F", fontWeight: 700 }}>1800-599-0019 (KIRAN India)</p>
              </div>
            </div>

            <div style={{
              padding: "16px 20px",
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}>
              <span style={{ fontSize: "1.5rem" }}>📍</span>
              <div>
                <p style={{ margin: "0 0 2px 0", fontSize: "0.82rem", color: "var(--color-text-light)", fontWeight: 600 }}>Headquarters</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-text-body)" }}>Hyderabad, Telangana, 501401, INDIA</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/feedback")}
            style={{
              width: "100%",
              padding: "12px",
              background: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(45, 106, 79, 0.2)"
            }}
          >
            Leave a Message &rarr;
          </button>
        </div>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <Footer />
    </>
  );
};

export default ContactUs;
