import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; // ✅ loadFull for all features

function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine); // load everything
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(
    () => ({
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "grab" },
          resize: true,
        },
        modes: {
          push: { quantity: 4 },
          grab: { distance: 200, duration: 0.5 },
        },
      },
      particles: {
        color: { value: "#00ffff" },
        links: {
          color: "#1397d5ff",
          distance: 150,
          enable: false,
          opacity: 0.8,
          width: 1,
        },
        move: {
          enable: true,
          speed: 4,
          outModes: { default: "out" },
          gravity: { acceleration: 9.81, enable: false, maxSpeed: 30 },
          direction: "top",
        },
        number: { density: { enable: true }, value: 100 },
        opacity: { value: 0.5 },
        shape: { type: "circle" }, // You can now use "image", "star", etc.
        size: { value: { min: 1, max: 5 } },
      },
      detectRetina: true,
    }),
    [],
  );

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 -z-10"
      options={options}
    />
  );
}

export default ParticlesBackground;
