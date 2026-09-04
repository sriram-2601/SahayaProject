import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const AnimatedCharacter = ({ emotion = "relaxed", breathingScale = 1 }) => {
  const meshRef = useRef();
  const ringRef = useRef();

  // Subtle hypnotic rotation & gentle floating
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
    }
  });

  const getColors = () => {
    switch (emotion) {
      case "happy":
        return { main: "#52B788", glow: "#74C69D" };
      case "sad":
        return { main: "#3B82F6", glow: "#93C5FD" };
      case "relaxed":
      default:
        return { main: "#2D6A4F", glow: "#52B788" };
    }
  };

  const colors = getColors();

  return (
    <group scale={breathingScale}>
      {/* Central Serene Meditation Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={colors.main}
          roughness={0.2}
          metalness={0.1}
          emissive={colors.glow}
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Orbiting Mindfulness Halo Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.8, 0.04, 16, 64]} />
        <meshStandardMaterial
          color={colors.glow}
          emissive={colors.glow}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
};

export default AnimatedCharacter;
