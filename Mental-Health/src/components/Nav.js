import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "./Firebase.js";
import "../css/Nav.css";

const Nav = ({ chatbotName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sahaya-navbar">
      <div className="sahaya-nav-container">
        {/* Brand Logo */}
        <Link to="/home" className="sahaya-brand">
          <div className="sahaya-brand-icon">
            <span>🌱</span>
          </div>
          <span>Sahaya</span>
          <span className="sahaya-brand-badge">Care</span>
        </Link>

        {/* Navigation Links */}
        <ul className={`sahaya-nav-links ${mobileMenuOpen ? "open" : ""}`}>
          <li>
            <Link
              to="/home"
              className={`sahaya-nav-link ${isActive("/home") ? "active" : ""}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/chatbot"
              className={`sahaya-nav-link ${isActive("/chatbot") ? "active" : ""}`}
            >
              {chatbotName ? `${chatbotName}` : "AI Companion"}
            </Link>
          </li>
          <li>
            <Link
              to="/consultancy"
              className={`sahaya-nav-link ${isActive("/consultancy") || isActive("/consultancy-profiles") ? "active" : ""}`}
            >
              Consultancy
            </Link>
          </li>
          <li>
            <Link
              to="/personal-assistant"
              className={`sahaya-nav-link ${isActive("/personal-assistant") ? "active" : ""}`}
            >
              Assistant
            </Link>
          </li>
          <li>
            <Link
              to="/notes"
              className={`sahaya-nav-link ${isActive("/notes") ? "active" : ""}`}
            >
              Journal
            </Link>
          </li>
          <li>
            <Link
              to="/scribble-pad"
              className={`sahaya-nav-link ${isActive("/scribble-pad") ? "active" : ""}`}
            >
              Scribble
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`sahaya-nav-link ${isActive("/about") ? "active" : ""}`}
            >
              About
            </Link>
          </li>
        </ul>

        {/* Right Section / Profile */}
        <div className="sahaya-nav-right">
          <div className="profile-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="profile-avatar-btn"
              onClick={toggleDropdown}
              aria-label="User Profile"
              title="Account Options"
            >
              <div className="avatar-circle">S</div>
              <span style={{ fontSize: "0.88rem", fontWeight: "600", color: "var(--color-text-body)" }}>
                Account
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: "2px" }}>
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showDropdown && (
              <div className="profile-dropdown-menu">
                <Link
                  to="/UserInfoForm"
                  className="dropdown-item-link"
                  onClick={() => setShowDropdown(false)}
                >
                  <span>👤</span> Profile Details
                </Link>
                <Link
                  to="/tasksDone"
                  className="dropdown-item-link"
                  onClick={() => setShowDropdown(false)}
                >
                  <span>✅</span> My Daily Goals
                </Link>
                <Link
                  to="/feedback"
                  className="dropdown-item-link"
                  onClick={() => setShowDropdown(false)}
                >
                  <span>💬</span> Share Feedback
                </Link>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item-link logout"
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
