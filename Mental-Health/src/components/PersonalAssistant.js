import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import "../css/Consultancy.css";

const PersonalAssistant = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [todoList, setTodoList] = useState([
    "Take 3 mindful breaths before starting tasks",
    "Stay hydrated with a glass of water"
  ]);
  const [taskInput, setTaskInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddToDo = (e) => {
    e.preventDefault();
    if (taskInput.trim()) {
      setTodoList([...todoList, taskInput.trim()]);
      setTaskInput("");
    }
  };

  return (
    <>
      <Nav />
      <div className="consultancy-page-wrapper">
        <div className="consultancy-container">
          <div className="consultancy-header">
            <h1 className="consultancy-title">Daily Personal Assistant</h1>
            <p className="consultancy-subtitle">
              Current Time: <strong>{currentTime}</strong> • Helping you cultivate daily calmness and peaceful structure.
            </p>
          </div>

          <div className="profiles-grid">
            {/* Card 1: Notifications */}
            <div className="consultant-card">
              <div style={{ height: "180px", background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>
                ⏰
              </div>
              <div className="consultant-card-body">
                <h3 className="consultant-card-title">Mindful Reminders</h3>
                <p className="consultant-card-text">
                  Schedule gentle reminders for box breathing, hydration pauses, or grounding exercises right to your mobile.
                </p>
                <button
                  className="consultant-action-btn"
                  onClick={() => navigate("/notification-scheduler")}
                >
                  Schedule Mobile Reminder &rarr;
                </button>
              </div>
            </div>

            {/* Card 2: Quick To-Do List */}
            <div className="consultant-card">
              <div style={{ height: "180px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>
                📝
              </div>
              <div className="consultant-card-body">
                <h3 className="consultant-card-title">Quick Daily Intentions</h3>
                <p className="consultant-card-text">
                  Anchor your focus on gentle priorities. Celebrate completing them without feeling rushed.
                </p>

                <form onSubmit={handleAddToDo} style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add an intention..."
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                      fontSize: "0.9rem",
                      flex: 1
                    }}
                  />
                  <button type="submit" className="consultant-action-btn" style={{ width: "auto", padding: "8px 16px" }}>
                    Add
                  </button>
                </form>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {todoList.map((t, idx) => (
                    <li key={idx} style={{
                      padding: "8px 12px",
                      background: "var(--color-bg)",
                      borderRadius: "6px",
                      fontSize: "0.88rem",
                      color: "var(--color-text-body)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span>🌱</span> {t}
                    </li>
                  ))}
                </ul>

                <Link to="/tasksDone" className="consultant-action-btn consultant-secondary-btn" style={{ textDecoration: "none", textAlign: "center" }}>
                  Open Full Goal Tracker &rarr;
                </Link>
              </div>
            </div>
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

export default PersonalAssistant;
