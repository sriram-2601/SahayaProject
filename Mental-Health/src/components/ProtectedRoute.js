import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "./Firebase";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 15% 15%, #EAF5EE 0%, #F5F8F7 50%, #EEF4FA 100%)",
        color: "var(--color-primary)",
        fontFamily: "inherit"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px", animation: "pulse 1.8s infinite" }}>🌱</div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-text-main)", margin: "0 0 8px 0" }}>
          Verifying Sanctuary Access...
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", margin: 0 }}>
          Securing your mindful space
        </p>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated visitors to login, preserving intended location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
