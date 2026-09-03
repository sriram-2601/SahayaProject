import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import "../css/ScribblePad.css";

const presetColors = [
  { label: "Slate", hex: "#1E293B" },
  { label: "Sage", hex: "#2D6A4F" },
  { label: "Teal", hex: "#0D9488" },
  { label: "Ocean", hex: "#2563EB" },
  { label: "Lavender", hex: "#6366F1" },
  { label: "Rose", hex: "#E11D48" },
  { label: "Warmth", hex: "#D97706" },
  { label: "Eraser", hex: "#FFFFFF" }
];

const ScribblePad = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const ctxRef = useRef(null);
  const navigate = useNavigate();

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#2D6A4F");
  const [brushSize, setBrushSize] = useState(4);
  const [history, setHistory] = useState([]);
  const [savedAlert, setSavedAlert] = useState("");

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sahaya_drawings")) || [];
      setHistory(saved);
    } catch {
      setHistory([]);
    }
  }, []);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctxRef.current = ctx;
  }, []);

  // Update stroke properties
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
    if (ctxRef.current) {
      ctxRef.current.closePath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (ctxRef.current && canvas) {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = canvas.toDataURL();
    const updated = [img, ...history.slice(0, 8)];
    setHistory(updated);
    localStorage.setItem("sahaya_drawings", JSON.stringify(updated));
    setSavedAlert("Drawing saved 🎨");
    setTimeout(() => setSavedAlert(""), 2000);
  };

  const loadImage = (imgSrc) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imgSrc;
  };

  const deleteImage = (index) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem("sahaya_drawings", JSON.stringify(updated));
  };

  return (
    <>
      <Nav />
      <div className="scribble-page-wrapper">
        <div className="scribble-container">
          {/* Controls Sidebar */}
          <aside className="scribble-sidebar">
            <div>
              <h2 className="scribble-sidebar-title">Art & Expression</h2>
              <p className="scribble-sidebar-desc">
                Release stress through creative, intuitive drawing.
              </p>
            </div>

            {/* Color Swatches */}
            <div className="scribble-tool-group">
              <label className="scribble-tool-label">
                <span>Color Palette</span>
                <span style={{ fontSize: "0.8rem", color: color }}>● Active</span>
              </label>
              <div className="scribble-swatches">
                {presetColors.map((c) => (
                  <button
                    key={c.hex}
                    className={`scribble-swatch-btn ${color === c.hex ? "active" : ""}`}
                    style={{ backgroundColor: c.hex, border: c.hex === "#FFFFFF" ? "1px solid #CBD5E1" : "none" }}
                    onClick={() => setColor(c.hex)}
                    title={c.label}
                  />
                ))}
              </div>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="scribble-color-picker"
                title="Custom Color"
              />
            </div>

            {/* Brush Width */}
            <div className="scribble-tool-group">
              <label className="scribble-tool-label">
                <span>Brush Size</span>
                <span>{brushSize}px</span>
              </label>
              <input
                type="range"
                min="1"
                max="24"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="scribble-slider"
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button className="scribble-action-btn scribble-btn-primary" onClick={saveImage}>
                <span>💾</span> Save Expression
              </button>
              <button className="scribble-action-btn scribble-btn-secondary" onClick={clearCanvas}>
                <span>✨</span> Clear Canvas
              </button>
              {savedAlert && (
                <p style={{ margin: 0, textAlign: "center", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.85rem" }}>
                  {savedAlert}
                </p>
              )}
            </div>

            {/* Saved Art History */}
            {history.length > 0 && (
              <div className="scribble-history">
                <h3 className="scribble-history-title">Saved Gallery</h3>
                <div className="scribble-history-grid">
                  {history.map((imgSrc, index) => (
                    <div key={index} className="scribble-thumb-card">
                      <img
                        src={imgSrc}
                        alt={`drawing-${index}`}
                        className="scribble-thumb-img"
                        onClick={() => loadImage(imgSrc)}
                      />
                      <button
                        className="scribble-thumb-delete"
                        onClick={() => deleteImage(index)}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Canvas Board */}
          <div className="scribble-canvas-wrapper" ref={containerRef}>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="drawing-canvas"
            />
          </div>
        </div>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    </>
  );
};

export default ScribblePad;
