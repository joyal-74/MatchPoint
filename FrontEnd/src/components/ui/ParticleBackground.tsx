import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

const ParticleBackground = () => {
    const particlesInit = useCallback(async (engine: any) => {
        await loadFull(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            className="absolute inset-0 w-full h-full"
            options={{
                background: { color: "transparent" },
                fullScreen: { enable: false },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "repulse" },
                        resize: true,
                    },
                },
                particles: {
                    color: { value: "#ffffff" },
                    links: {
                        enable: true,
                        color: "#ffffff",
                        distance: 150,
                        opacity: 0.3,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 1.2,
                        direction: "none",
                        outModes: { default: "bounce" },
                    },
                    number: {
                        value: 80,
                        density: { enable: true, area: 800 },
                    },
                    opacity: { value: 0.5 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 3 } },
                },
                detectRetina: true,
            }}
        />
    );
};

export default ParticleBackground;
