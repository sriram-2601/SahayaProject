import React, { useEffect, useState } from "react";
import { auth, db } from "./Firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Nav from "./Nav";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            setUserDetails({
              firstName: user.displayName || "Wellness Member",
              email: user.email,
              lastName: "",
            });
          }

          // Fetch appointments
          try {
            const apptsRef = collection(db, "Users", user.uid, "appointments");
            const apptsSnap = await getDocs(apptsRef);
            if (!apptsSnap.empty) {
              setAppointments(apptsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            } else {
              const cachedAppts = JSON.parse(localStorage.getItem("sahaya_appointments") || "[]");
              setAppointments(cachedAppts);
            }
          } catch (e) {
            const cachedAppts = JSON.parse(localStorage.getItem("sahaya_appointments") || "[]");
            setAppointments(cachedAppts);
          }
        } catch {
          setUserDetails({
            firstName: user.displayName || "Wellness Member",
            email: user.email,
            lastName: "",
          });
          const cachedAppts = JSON.parse(localStorage.getItem("sahaya_appointments") || "[]");
          setAppointments(cachedAppts);
        }
      } else {
        // Fallback to local profile cache
        const local = localStorage.getItem("sahaya_profile");
        if (local) {
          setUserDetails(JSON.parse(local));
        }
        const cachedAppts = JSON.parse(localStorage.getItem("sahaya_appointments") || "[]");
        setAppointments(cachedAppts);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      localStorage.clear();
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

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
        paddingRight: "20px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "540px",
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          borderRadius: "var(--radius-xl)",
          padding: "36px 32px",
          boxShadow: "var(--shadow-lg)",
          textAlign: "center"
        }}>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2D6A4F, #52B788)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            fontWeight: 700,
            margin: "0 auto 16px auto",
            boxShadow: "0 4px 14px rgba(45, 106, 79, 0.25)"
          }}>
            {userDetails?.firstName ? userDetails.firstName.charAt(0).toUpperCase() : "S"}
          </div>

          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text-main)", margin: "0 0 6px 0" }}>
            My Wellness Sanctuary
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.88rem", margin: "0 0 20px 0" }}>
            Personal profile and scheduled wellness care
          </p>

          {loading ? (
            <p style={{ color: "var(--color-text-muted)" }}>Loading your sanctuary...</p>
          ) : userDetails ? (
            <div style={{ marginTop: "16px" }}>
              <div style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                textAlign: "left",
                marginBottom: "20px"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.95rem" }}>
                  <strong style={{ color: "var(--color-text-main)" }}>Name:</strong>{" "}
                  <span style={{ color: "var(--color-text-body)" }}>
                    {userDetails.firstName} {userDetails.lastName}
                  </span>
                </p>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.95rem" }}>
                  <strong style={{ color: "var(--color-text-main)" }}>Email:</strong>{" "}
                  <span style={{ color: "var(--color-text-body)" }}>{userDetails.email || "Confidential"}</span>
                </p>
                {userDetails.number && (
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.95rem" }}>
                    <strong style={{ color: "var(--color-text-main)" }}>Phone:</strong>{" "}
                    <span style={{ color: "var(--color-text-body)" }}>{userDetails.number}</span>
                  </p>
                )}
                {userDetails.age && (
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.95rem" }}>
                    <strong style={{ color: "var(--color-text-main)" }}>Age:</strong>{" "}
                    <span style={{ color: "var(--color-text-body)" }}>{userDetails.age}</span>
                  </p>
                )}
                {userDetails.address && (
                  <p style={{ margin: "0", fontSize: "0.95rem" }}>
                    <strong style={{ color: "var(--color-text-main)" }}>Location:</strong>{" "}
                    <span style={{ color: "var(--color-text-body)" }}>{userDetails.address}</span>
                  </p>
                )}
              </div>

              {/* Booked Consultations */}
              <div style={{
                background: "rgba(240, 24DF, 245, 0.4)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                textAlign: "left",
                marginBottom: "24px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, color: "var(--color-primary)" }}>
                    📅 Scheduled Consultations
                  </h3>
                  <button
                    onClick={() => navigate("/consultancy-profiles")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-primary)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline"
                    }}
                  >
                    + Book New
                  </button>
                </div>
                {appointments.length === 0 ? (
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    No active consultations scheduled. You can book an appointment with our specialists anytime.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {appointments.map((appt, i) => (
                      <div key={appt.id || i} style={{
                        padding: "10px 14px",
                        background: "#FFFFFF",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)",
                        fontSize: "0.88rem"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                          <span>{appt.consultantName || "Specialist Consultation"}</span>
                          <span style={{
                            fontSize: "0.75rem",
                            background: "#E8F5EE",
                            color: "#2D6A4F",
                            padding: "2px 8px",
                            borderRadius: "12px"
                          }}>
                            {appt.status || "Confirmed"}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                          🗓️ {appt.date || "Scheduled"} at {appt.time || "10:00 AM"} • 📍 {appt.location || "Online"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => navigate("/UserInfoForm")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "var(--color-primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(45, 106, 79, 0.2)"
                  }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "12px 20px",
                    background: "#FEE2E2",
                    color: "#DC2626",
                    border: "1px solid #FECACA",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "20px 0" }}>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "20px" }}>
                You are browsing as a guest.
              </p>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 28px",
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Sign In &rarr;
              </button>
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
}

export default Profile;
