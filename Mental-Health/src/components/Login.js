import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SignInwithGoogle from "./SignInWIthGoogle";
import "../css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/home";
  const redirectNotice = location.state?.from ? "Please sign in to access your private sanctuary." : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! Logged in successfully.", {
        position: "top-center",
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error: ", error.message);
      toast.error("Invalid credentials. Please verify your email and password.", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Brand Header */}
      <Link to="/" className="auth-brand-badge">
        <div className="auth-brand-icon">🌱</div>
        <span className="auth-brand-name">Sahaya</span>
      </Link>

      <div className="auth-card">
        <h2 className="auth-card-title">Welcome Back</h2>
        <p className="auth-card-subtitle">Enter your details to access your wellness sanctuary.</p>

        {redirectNotice && (
          <div style={{
            background: "#E8F5EE",
            color: "#1B4332",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "0.88rem",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "18px",
            border: "1px solid #A7D8BA"
          }}>
            🔒 {redirectNotice}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="auth-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="auth-switch-text">
            New to Sahaya?
            <Link to="/register" className="auth-switch-link">
              Create an account
            </Link>
          </p>

          <div className="auth-divider">or</div>

          <SignInwithGoogle />
        </form>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate("/")}>
        &larr; Back to Home
      </button>
    </div>
  );
}

export default Login;