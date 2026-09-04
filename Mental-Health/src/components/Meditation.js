import React, { useState, useEffect, useRef } from "react";
import Nav from "./Nav.js";
import Footer from "./Footer.js";
import { useNavigate } from "react-router-dom";
import "../css/Meditation.css";

const breathingModes = {
  box: {
    title: "Box Breathing",
    desc: "4-4-4-4 pattern used to relieve acute stress and regain emotional composure.",
    phases: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 4 },
      { name: "Exhale", duration: 4 },
      { name: "Hold", duration: 4 },
    ],
  },
  relax: {
    title: "4-7-8 Deep Relaxation",
    desc: "A soothing nervous-system reset to reduce anxiety and promote restful sleep.",
    phases: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 7 },
      { name: "Exhale Slowly", duration: 8 },
    ],
  },
  balanced: {
    title: "Balanced Coherence",
    desc: "5-5 gentle rhythm to synchronize heart rate variability and mental peace.",
    phases: [
      { name: "Inhale", duration: 5 },
      { name: "Exhale", duration: 5 },
    ],
  },
};

const Meditation = () => {
  const [selectedModeKey, setSelectedModeKey] = useState("box");
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [totalSecondsMindful, setTotalSecondsMindful] = useState(() => {
    return Number(localStorage.getItem("sahaya_meditation_seconds") || 0);
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const navigate = useNavigate();

  const activeMode = breathingModes[selectedModeKey];
  const currentPhase = activeMode.phases[currentPhaseIndex];

  // Gentle Web Audio peaceful tone
  const playPeacefulTone = (freq = 432) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {}
  };

  // Switch mode
  const handleSelectMode = (key) => {
    setSelectedModeKey(key);
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setCountdown(breathingModes[key].phases[0].duration);
  };

  // Breathing loop
  useEffect(() => {
    let timer = null;

    if (isActive) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Next phase
            const nextIndex = (currentPhaseIndex + 1) % activeMode.phases.length;
            setCurrentPhaseIndex(nextIndex);
            const nextDuration = activeMode.phases[nextIndex].duration;
            playPeacefulTone(nextIndex === 0 ? 528 : 432);
            return nextDuration;
          }
          return prev - 1;
        });

        // Tally mindful seconds
        setTotalSecondsMindful((prev) => {
          const updated = prev + 1;
          localStorage.setItem("sahaya_meditation_seconds", String(updated));
          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, currentPhaseIndex, activeMode, soundEnabled]);

  // Compute visual orb scale based on current phase
  const getOrbScale = () => {
    if (!isActive) return 1;
    const phaseName = currentPhase.name.toLowerCase();
    if (phaseName.includes("inhale")) return 1.35;
    if (phaseName.includes("hold")) return 1.25;
    return 0.85; // exhale
  };

  const toggleSession = () => {
    if (!isActive) {
      playPeacefulTone(528);
    }
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setCountdown(activeMode.phases[0].duration);
  };

  const mindfulMinutes = Math.floor(totalSecondsMindful / 60);

  return (
    <>
      <Nav />
      <div className="meditation-page-wrapper">
        <div className="meditation-card">
          <div style={{ fontSize: "2.8rem", marginBottom: "8px" }}>🧘</div>
          <h1 className="meditation-title">Guided Meditation & Breathwork</h1>
          <p className="meditation-subtitle">
            Paced breathing signals safety to your nervous system, lowering cortisol and gently soothing anxiety.
          </p>

          {/* Mode Selector */}
          <div className="meditation-tabs">
            {Object.keys(breathingModes).map((key) => (
              <button
                key={key}
                type="button"
                className={`meditation-tab-btn ${selectedModeKey === key ? "active" : ""}`}
                onClick={() => handleSelectMode(key)}
              >
                {breathingModes[key].title}
              </button>
            ))}
          </div>

          {/* Technique Description */}
          <div style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 16px",
            fontSize: "0.85rem",
            color: "var(--color-text-body)",
            maxWidth: "500px",
            margin: "0 auto 24px auto"
          }}>
            {activeMode.desc}
          </div>

          {/* Dynamic Breathing Orb */}
          <div className="breathing-visualizer-container">
            <div
              className="breathing-orb-outer"
              style={{
                transform: `scale(${getOrbScale()})`,
                transitionDuration: `${currentPhase.duration}s`,
              }}
            >
              <div className="breathing-orb-inner">
                <span className="breathing-phase-text">
                  {isActive ? currentPhase.name : "Ready"}
                </span>
                <span className="breathing-counter-text">
                  {isActive ? countdown : "🌿"}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="meditation-controls-row">
            <button
              type="button"
              className={`meditation-action-btn primary`}
              onClick={toggleSession}
            >
              {isActive ? "Pause Session" : "Begin Mindful Breathing"}
            </button>
            <button
              type="button"
              className="meditation-action-btn secondary"
              onClick={resetSession}
            >
              Reset
            </button>
            <button
              type="button"
              className="meditation-action-btn secondary"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="Toggle calming chime tones"
            >
              {soundEnabled ? "🔔 Chime On" : "🔕 Chime Off"}
            </button>
          </div>

          {/* Lifetime Mindful Minutes */}
          <div className="meditation-stats-bar">
            <span>🌱 Lifetime Mindful Practice: <strong>{mindfulMinutes} mins</strong></span>
            <span>💨 Active Pattern: <strong>{activeMode.title}</strong></span>
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

export default Meditation;
