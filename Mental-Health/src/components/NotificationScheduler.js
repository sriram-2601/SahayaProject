import React, { useState } from "react";
import { db } from "./Firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import "../css/NotificationScheduler.css";

const NotificationScheduler = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !message || !time) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "notifications"), {
        phoneNumber,
        message,
        time,
        createdAt: new Date(),
      });
      setStatusMsg("Notification scheduled successfully! 🌿");
      setPhoneNumber("");
      setMessage("");
      setTime("");
    } catch (error) {
      // Local cache fallback
      const savedNotis = JSON.parse(localStorage.getItem("sahaya_notis") || "[]");
      savedNotis.push({ phoneNumber, message, time });
      localStorage.setItem("sahaya_notis", JSON.stringify(savedNotis));
      setStatusMsg("Notification reminder saved locally! 🌿");
      setPhoneNumber("");
      setMessage("");
      setTime("");
    }
  };

  return (
    <>
      <Nav />
      <div className="notification-page-wrapper">
        <div className="notification-card">
          <div style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "8px" }}>⏰</div>
          <h2 className="notification-title">Schedule Mindful Reminder</h2>
          <p className="notification-subtitle">
            Set gentle check-ins to stay grounded, take mindful pauses, or remind yourself of daily wellness.
          </p>

          {statusMsg && (
            <div style={{
              background: "var(--color-primary-soft)",
              color: "var(--color-primary-hover)",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: "16px"
            }}>
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="notification-form">
            <div>
              <label className="noti-label">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="noti-label">Reminder Message</label>
              <textarea
                placeholder="e.g. Take 5 deep breaths, drink a glass of water, step outside for fresh air..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="textarea-field"
              />
            </div>

            <div>
              <label className="noti-label">Reminder Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <button type="submit" className="submit-btn">
              Schedule Notification
            </button>
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

export default NotificationScheduler;
