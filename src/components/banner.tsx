"use client";
import { useEffect } from "react";
import { Button } from "./ui/button";

export default function EmojiRain() {
  useEffect(() => {
    // Dynamically load tsparticles
    const loadParticles = async () => {
      if (typeof window !== "undefined") {
        const { tsParticles } = await import("@tsparticles/engine");
        const { loadEmojiShape } = await import("@tsparticles/shape-emoji");

        // Load the emoji shape
        await loadEmojiShape(tsParticles);
      }
    };

    loadParticles();
  }, []);

  const startEmojiRain = async () => {
    if (typeof window !== "undefined") {
      const { tsParticles } = await import("@tsparticles/engine");

      try {
        await tsParticles.load({
          id: "tsparticles",
          options: {
            fullScreen: {
              enable: true,
              zIndex: 999,
            },
            background: {
              color: "transparent",
            },
            particles: {
              number: { value: 100 },
              move: {
                direction: "bottom",
                enable: true,
                speed: 3,
                straight: false,
              },
              shape: {
                type: "emoji",
                options: {
                  emoji: {
                    value: ["🤑", "🪙", "💰", "💴", "💵", "💶", "💷", "💸", "💳", "💹"],
                  },
                },
              },
              size: {
                value: { min: 10, max: 20 },
              },
              color: {
                value: ["#FFD700", "#FFFFFF"],
              },
            },
          },
        });
      } catch (error) {
        console.error("Particles load error:", error);
      }
    }
  };

  return (
    <div id="tsparticles-container" className="relative w-full">
      <Button onClick={startEmojiRain} className="bg-green-500 text-white p-2 rounded">
        Start Emoji Rain 🌧️
      </Button>
    </div>
  );
}
