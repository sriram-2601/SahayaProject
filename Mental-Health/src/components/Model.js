import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Character from "./Character";
import { OrbitControls } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

const animationsList = [
  { key: "idle", label: "🧘 Resting Calm" },
  { key: "wave", label: "👋 Warm Welcome" },
  { key: "jump", label: "✨ Uplifted" },
  { key: "swingdance", label: "💃 Playful Joy" },
  { key: "shrug", label: "🤷 Gentle Shrug" },
  { key: "react", label: "💡 Mindful Spark" },
  { key: "golf", label: "🎯 Focus & Aim" },
  { key: "rope", label: "🏃 Energy Flow" },
  { key: "pockets", label: "🌿 Peaceful Stroll" },
];

const Model = () => {
  const [currentAnimationName, setCurrentAnimationName] = useState("idle");
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <div style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at 50% 50%, #E8F5EE 0%, #F5F8F7 60%, #E0F2FE 100%)",
        overflow: "hidden"
      }}>
        {/* 3D Canvas */}
        <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={0.8} />
          <Character
            glbPath="/Character2.glb"
            texturePath="/stacy.jpg"
            currentAnimationName={currentAnimationName}
            position={[0, -1.8, 0]}
            scale={0.018}
          />
        </Canvas>

        {/* Peaceful Animation Selector Dock */}
        <div
          style={{
            position: "absolute",
            top: "84px",
            right: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(14px)",
            padding: "16px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
            zIndex: 10
          }}
        >
          <div style={{
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "var(--color-primary)",
            marginBottom: "4px",
            textAlign: "center"
          }}>
            3D Expressions
          </div>
          {animationsList.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentAnimationName(item.key)}
              style={{
                background: currentAnimationName === item.key ? "var(--color-primary)" : "var(--color-bg)",
                color: currentAnimationName === item.key ? "#FFFFFF" : "var(--color-text-body)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                padding: "8px 14px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    </>
  );
};

export default Model;
