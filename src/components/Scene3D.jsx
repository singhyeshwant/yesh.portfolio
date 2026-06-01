import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import TorsoModel from "./TorsoModel";
import { CAMERA } from "../lib/config";

export default function Scene3D({ entered, reduced, isMobile }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5]"
      aria-hidden="true"
    >
      <Canvas
        frameloop="always"
        dpr={[1, isMobile ? 1.25 : 1.5]}
        camera={{
          position: CAMERA.position,
          fov: CAMERA.fov,
          near: CAMERA.near,
          far: CAMERA.far,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.06;
        }}
      >
        {/* fade the figure's edges into the dark page for depth */}
        <fog attach="fog" args={["#060608", 4.2, 11]} />

        {/* --- cinematic 3-point + rim lighting --- */}
        <ambientLight intensity={0.36} />
        <hemisphereLight args={["#cfd9ff", "#1a1206", 0.35]} />
        {/* key */}
        <directionalLight position={[3.2, 4, 5]} intensity={2.5} color="#fff1da" />
        {/* cool rim / back light for that premium edge glow */}
        <directionalLight position={[-2.4, 2.2, -4.2]} intensity={3.4} color="#bfe6ff" />
        {/* soft fill */}
        <directionalLight position={[-4.2, 1, 2.4]} intensity={0.65} color="#9fb4ff" />
        {/* catchlight */}
        <pointLight position={[0.6, 1.3, 2.6]} intensity={0.55} color="#ffffff" />

        {/*
          OPTIONAL (needs internet at runtime — fetches an HDR from a CDN):
          adds realistic reflections. Uncomment + import { Environment } from "@react-three/drei".
          <Environment preset="studio" />
        */}

        <Suspense fallback={null}>
          <TorsoModel entered={entered} reduced={reduced} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
