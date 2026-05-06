import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const EMOJIS = ["❤️", "😍", "✨", "Flexxy"];

interface Particle {
  id: number;
  content: string;
  x: number;
  delay: number;
  duration: number;
}

export function EmojiRain({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: Date.now() + i,
        content: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: Math.random() * 100, // percentage of viewport width
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {active && particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -100, x: `${p.x}vw`, opacity: 0, rotate: 0 }}
            animate={{ 
              y: "110vh", 
              opacity: [0, 1, 1, 0],
              rotate: 360,
              transition: { 
                y: { duration: p.duration, delay: p.delay, ease: "linear" },
                opacity: { duration: p.duration, delay: p.delay, times: [0, 0.1, 0.9, 1] },
                rotate: { duration: p.duration, delay: p.delay, ease: "linear" }
              }
            }}
            exit={{ opacity: 0 }}
            className="absolute text-2xl md:text-4xl pointer-events-none whitespace-nowrap"
            style={{ left: 0 }}
          >
            {p.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
