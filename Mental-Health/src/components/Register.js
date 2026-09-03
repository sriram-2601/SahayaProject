import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./Firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: "",
          createdAt: new Date(),
        });
      }

      toast.success("Account created successfully! Welcome to Sahaya.", {
        position: "top-center",
      });

      navigate("/login");
    } catch (error) {
      console.error("Registration Error: ", error.message);
      toast.error("Registration failed: " + error.message, {
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
        <h2 className="auth-card-title">Join Sahaya</h2>
        <p className="auth-card-subtitle">Create a private, safe space for your emotional wellness.</p>

        <form onSubmit={handleRegister}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                className="auth-input"
                placeholder="Jane"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="auth-input"
                placeholder="Doe"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
          </div>

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
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Free Account"}
          </button>

          <p className="auth-switch-text">
            Already have an account?
            <Link to="/login" className="auth-switch-link">
              Sign In
            </Link>
          </p>
        </form>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate("/")}>
        &larr; Back to Home
      </button>
    </div>
  );
}

export default Register;
