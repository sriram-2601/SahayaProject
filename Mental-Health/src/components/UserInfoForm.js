import React, { useState, useEffect } from "react";
import { auth, db, saveUserInfo } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
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
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Load existing profile details
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.firstName) setFirstName(data.firstName);
            if (data.lastName) setLastName(data.lastName);
            if (data.age) setAge(data.age);
            if (data.number) setNumber(data.number);
            if (data.address) setAddress(data.address);
          }
        } catch (err) {
          console.warn("Could not load remote profile:", err);
        }
      }
      // Check local fallback
      const local = localStorage.getItem("sahaya_profile");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (!firstName && parsed.firstName) setFirstName(parsed.firstName);
          if (!lastName && parsed.lastName) setLastName(parsed.lastName);
          if (!age && parsed.age) setAge(parsed.age);
          if (!number && parsed.number) setNumber(parsed.number);
          if (!address && parsed.address) setAddress(parsed.address);
        } catch (e) {}
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !age || !address || !number) {
      setErrorMessage("All fields are required to personalize your experience.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const profileData = { firstName, lastName, age, address, number };

    try {
      const currentUid = userId || auth.currentUser?.uid;
      if (currentUid) {
        await saveUserInfo(currentUid, profileData);
      }
      localStorage.setItem("sahaya_profile", JSON.stringify(profileData));
      setSuccessMessage("Your profile information has been securely updated! 🌿");
      setShowPopup(true);
    } catch (error) {
      // Graceful local cache fallback if Firestore offline
      localStorage.setItem("sahaya_profile", JSON.stringify(profileData));
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
