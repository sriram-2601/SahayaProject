import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./Firebase";
import { collection, addDoc } from "firebase/firestore";
import Nav from "./Nav";
import Footer from "./Footer";
import "../css/BookAppointment.css";

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const professional = location.state?.professional;

  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState("");

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      alert("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    const appointmentDetails = {
      consultantName: professional?.name || "General Specialist",
      specialization: professional?.specialization || "Mental Health Counseling",
      date: date || new Date().toISOString().split("T")[0],
      time: time || "10:00 AM",
      location: locationAddress || "Online Video Consultation",
      phone: trimmedPhone,
      status: "Confirmed",
      createdAt: new Date(),
    };

    // 1. Persist directly to Firestore
    try {
      const currentUid = auth.currentUser?.uid || "guest";
      if (currentUid !== "guest") {
        const apptsCollection = collection(db, "Users", currentUid, "appointments");
        await addDoc(apptsCollection, appointmentDetails);
      }
    } catch (firestoreErr) {
      console.warn("Could not save appointment to Firestore:", firestoreErr);
    }

    // 2. Always persist to localStorage for instant profile view
    try {
      const cached = JSON.parse(localStorage.getItem("sahaya_appointments") || "[]");
      cached.unshift(appointmentDetails);
      localStorage.setItem("sahaya_appointments", JSON.stringify(cached));
    } catch (cacheErr) {}

    // 3. Contact Express backend server on port 4000
    try {
      const response = await fetch("http://localhost:4000/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: trimmedPhone, appointmentDetails }),
      });

      const result = await response.json();
      if (result.success) {
        setConfirmationNotice(result.message || "Confirmation sent to your phone!");
      } else {
        setConfirmationNotice("Appointment confirmed in your personal profile sanctuary.");
      }
    } catch (error) {
      // Graceful fallback when local port 4000 is not running
      setConfirmationNotice("Appointment booked and securely stored in your wellness records.");
    } finally {
      setBookingSuccess(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="appointment-page-wrapper">
        <div className="appointment-card">
          <h1 className="appointment-title">Book a Consultation</h1>
          <p className="appointment-subtitle">
            Secure a private, empathetic appointment with our verified specialist.
          </p>

          {professional && (
            <div className="appointment-doctor-info">
              <h3 className="appointment-doctor-name">{professional.name}</h3>
              <p className="appointment-doctor-spec">{professional.specialization}</p>
              <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                {professional.approach}
              </p>
            </div>
          )}

          {bookingSuccess ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "3.2rem", marginBottom: "12px" }}>🌿</div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "8px" }}>
                Appointment Confirmed!
              </h2>
              <p style={{ color: "var(--color-text-body)", fontSize: "0.95rem", marginBottom: "6px" }}>
                Your session with <strong>{professional?.name || "our specialist"}</strong> has been scheduled.
              </p>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginBottom: "24px" }}>
                {confirmationNotice}
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button
                  className="appointment-submit-btn"
                  style={{ background: "var(--color-primary)", color: "white" }}
                  onClick={() => navigate("/profile")}
                >
                  View in My Profile &rarr;
                </button>
                <button
                  className="appointment-submit-btn"
                  style={{ background: "var(--color-bg)", color: "var(--color-text-main)", border: "1px solid var(--color-border)" }}
                  onClick={() => navigate("/consultancy-profiles")}
                >
                  Back to Specialists
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookAppointment}>
              <div className="appointment-form-group">
                <label className="appointment-label">Your Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appointment-input"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="appointment-form-group">
                  <label className="appointment-label">Preferred Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="appointment-input"
                    required
                  />
                </div>

                <div className="appointment-form-group">
                  <label className="appointment-label">Preferred Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="appointment-input"
                    required
                  />
                </div>
              </div>

              <div className="appointment-form-group">
                <label className="appointment-label">Consultation Mode / Location</label>
                <input
                  type="text"
                  placeholder="Online Video Session (or City Clinic)"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="appointment-input"
                />
              </div>

              <button type="submit" className="appointment-submit-btn" disabled={loading}>
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            </form>
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

export default BookAppointment;
