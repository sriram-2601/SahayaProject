import React, { useState } from "react";
import { saveUserInfo } from "./Firebase";
import "../css/UserInfoForm.css";
import Footer from "./Footer";
import Navbar from "./Nav";
import { useNavigate } from "react-router-dom";

function UserInfoForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !age || !address || !number) {
      setErrorMessage("All fields are required to personalize your experience.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await saveUserInfo(firstName, lastName, age, address, number);
      setSuccessMessage("Your profile information has been securely updated! 🌿");
      setShowPopup(true);
    } catch (error) {
      // Graceful local cache fallback if Firestore offline
      localStorage.setItem("sahaya_profile", JSON.stringify({ firstName, lastName, age, address, number }));
      setSuccessMessage("Your profile details have been saved locally! 🌿");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="user-info-page-wrapper">
        <div className="user-info-card">
          <h1 className="user-info-title">Profile Settings</h1>
          <p className="user-info-subtitle">
            Personalize your details so Sahaya can cater to your specific wellness needs.
          </p>

          {errorMessage && (
            <p style={{ color: "#DC2626", background: "#FEF2F2", padding: "10px", borderRadius: "8px", fontSize: "0.9rem", textAlign: "center" }}>
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="user-form-group">
                <label className="user-form-label">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="user-form-input"
                  placeholder="First name"
                  required
                />
              </div>

              <div className="user-form-group">
                <label className="user-form-label">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="user-form-input"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="user-form-group">
                <label className="user-form-label">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="user-form-input"
                  placeholder="e.g. 24"
                  required
                />
              </div>

              <div className="user-form-group">
                <label className="user-form-label">Mobile Number</label>
                <input
                  type="tel"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="user-form-input"
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            <div className="user-form-group">
              <label className="user-form-label">City / Region</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="user-form-input"
                placeholder="e.g. Hyderabad, Telangana"
                required
              />
            </div>

            <button className="user-form-submit-btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile Details"}
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showPopup && (
        <div className="user-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="user-popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🌱</div>
            <h3 style={{ margin: "0 0 8px 0", color: "var(--color-primary)" }}>Profile Updated</h3>
            <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.92rem" }}>
              {successMessage}
            </p>
            <button className="user-popup-btn" onClick={() => setShowPopup(false)}>
              Continue
            </button>
          </div>
        </div>
      )}

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <Footer />
    </>
  );
}

export default UserInfoForm;
