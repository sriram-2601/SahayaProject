import React, { useState, useEffect } from "react";
import { auth, db } from "./Firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import "../css/NotificationScheduler.css";

const NotificationScheduler = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [permissionState, setPermissionState] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();

  const getStorageKey = (uid) => `sahaya_notis_${uid || "guest"}`;

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (typeof Notification !== "undefined") {
      const perm = await Notification.requestPermission();
      setPermissionState(perm);
      if (perm === "granted") {
        new Notification("🌿 Sahaya Care", {
          body: "Mindful browser notifications are enabled! We will gently remind you.",
          icon: "/favicon.ico"
        });
      }
    }
  };

  // Load reminders
  const loadReminders = async (uid) => {
    const activeUid = uid || auth.currentUser?.uid || "guest";
    const storageKey = getStorageKey(activeUid);

    try {
      if (activeUid !== "guest") {
        const notiRef = collection(db, "Users", activeUid, "notifications");
        const snap = await getDocs(notiRef);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setReminders(list);
          localStorage.setItem(storageKey, JSON.stringify(list));
          return;
        }
      }
    } catch (err) {
      console.warn("Could not load cloud reminders:", err);
    }

    const cached = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setReminders(cached);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      loadReminders(user ? user.uid : "guest");
    });
    return () => unsubscribe();
  }, []);

  const triggerDesktopNotification = (msg) => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("🌿 Sahaya Mindful Reminder", {
        body: msg,
        icon: "/favicon.ico",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !message || !time) {
      alert("Please fill all fields");
      return;
    }

    const activeUid = auth.currentUser?.uid || "guest";
    const storageKey = getStorageKey(activeUid);

    // Schedule local in-browser timer if scheduled for today
    try {
      const now = new Date();
      const [hours, minutes] = time.split(":").map(Number);
      const targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);

      const delay = targetTime.getTime() - now.getTime();
      if (delay > 0 && delay < 86400000) {
        setTimeout(() => {
          triggerDesktopNotification(message);
        }, delay);
      }
    } catch (timeErr) {}

    const newReminder = {
      phoneNumber,
      message,
      time,
      createdAt: new Date().toISOString(),
      userId: activeUid,
    };

    // Save to Firestore
    try {
      if (activeUid !== "guest") {
        const docRef = await addDoc(collection(db, "Users", activeUid, "notifications"), newReminder);
        newReminder.id = docRef.id;
      } else {
        newReminder.id = Date.now().toString();
      }
    } catch (error) {
      newReminder.id = Date.now().toString();
    }

    // Save to local state and localStorage
    const updated = [newReminder, ...reminders];
    setReminders(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Optional backend notify
    try {
      fetch("http://localhost:4000/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, message, time }),
      }).catch(() => {});
    } catch (e) {}

    setStatusMsg("Mindful reminder scheduled! 🌿");
    setPhoneNumber("");
    setMessage("");
    setTime("");
  };

  const handleDeleteReminder = async (id) => {
    const activeUid = auth.currentUser?.uid || "guest";
    const storageKey = getStorageKey(activeUid);

    try {
      if (activeUid !== "guest") {
        await deleteDoc(doc(db, "Users", activeUid, "notifications", id));
      }
    } catch (e) {}

    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
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

          {/* Browser Notification Banner */}
          <div style={{
            background: permissionState === "granted" ? "#E8F5EE" : "#FEF3C7",
            border: `1px solid ${permissionState === "granted" ? "#A7F3D0" : "#FDE68A"}`,
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "18px",
            fontSize: "0.86rem",
          }}>
            <div>
              {permissionState === "granted" ? (
                <span style={{ color: "#065F46", fontWeight: 600 }}>
                  🔔 Desktop Notifications Active
                </span>
              ) : (
                <span style={{ color: "#92400E", fontWeight: 600 }}>
                  ⚠️ Enable notifications to receive instant browser alerts
                </span>
              )}
            </div>
            {permissionState !== "granted" ? (
              <button
                type="button"
                onClick={requestNotificationPermission}
                style={{
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Enable
              </button>
            ) : (
              <button
                type="button"
                onClick={() => triggerDesktopNotification("Take a slow, deep breath. You are doing well. 🌿")}
                style={{
                  background: "#065F46",
                  color: "white",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Test Alert
              </button>
            )}
          </div>

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

          {/* Active Reminders List */}
          <div style={{ marginTop: "28px", borderTop: "1px solid var(--color-border)", paddingTop: "20px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text-main)", marginBottom: "12px" }}>
              Active Mindful Check-ins ({reminders.length})
            </h3>
            {reminders.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
                No check-ins currently scheduled. Schedule one above to establish gentle daily habits.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {reminders.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: "12px 16px",
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--color-text-main)" }}>
                        ⏰ {r.time} • 📱 {r.phoneNumber}
                      </div>
                      <div style={{ fontSize: "0.84rem", color: "var(--color-text-body)", marginTop: "3px" }}>
                        "{r.message}"
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReminder(r.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#DC2626",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                      title="Cancel reminder"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
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

export default NotificationScheduler;
