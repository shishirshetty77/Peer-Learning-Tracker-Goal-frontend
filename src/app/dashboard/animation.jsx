"use client";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: false, // we manually control layout
          background: { color: { value: "#000000" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 120, enable: true, opacity: 0.5, width: 1 },
            collisions: { enable: true },
            move: { enable: true, speed: 1, outModes: { default: "bounce" } },
            number: { value: 80 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}