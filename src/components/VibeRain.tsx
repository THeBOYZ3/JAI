import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GIF_POOL } from '../AssetShield';

interface GifItem {
  id: string;
  src: string;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  rotation: number;
  scale: number;
  duration: number;
}

export const VibeRain: React.FC<{ active: boolean }> = ({ active }) => {
  const [gifs, setGifs] = useState<GifItem[]>([]);

  useEffect(() => {
    // Clear GIFs when deactivated to immediately free up CPU/GPU resources
    if (!active) {
      setGifs([]);
    }
  }, [active]);

  const spawnGif = useCallback(() => {
    setGifs(prev => {
      if (prev.length >= 10) return prev;
      
      const src = GIF_POOL[Math.floor(Math.random() * GIF_POOL.length)];
      const xPos = Math.random() * 100;
      const duration = 3 + Math.random() * 4; // 3s to 7s
      
      const newGif: GifItem = {
        id: Math.random().toString(36).substring(2, 11),
        src,
        startX: `${xPos}vw`,
        startY: '-15vh',
        endX: `${xPos + (Math.random() * 20 - 10)}vw`,
        endY: '110vh',
        rotation: Math.random() * 360,
        scale: Math.random() * (1.2 - 0.7) + 0.7,
        duration
      };
      
      return [...prev, newGif];
    });
  }, []);

  const removeGif = useCallback((id: string) => {
    setGifs(prev => prev.filter(g => g.id !== id));
  }, []);

  useEffect(() => {
    if (!active) {
      setGifs([]);
      return;
    }

    const timer = setInterval(() => {
      spawnGif();
    }, 500 + Math.random() * 500); // 500ms to 1s staggered

    return () => clearInterval(timer);
  }, [active, spawnGif]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden w-[100vw] h-[100vh]">
      <AnimatePresence>
        {active && gifs.map((gif) => (
          <motion.div
            key={gif.id}
            initial={{ 
              opacity: 0, 
              scale: 0, 
              top: gif.startY,
              left: gif.startX,
              rotate: gif.rotation 
            }}
            animate={{ 
              opacity: 0.8, 
              scale: gif.scale,
              top: gif.endY,
              left: gif.endX,
              rotate: gif.rotation + (Math.random() * 180 - 90)
            }}
            exit={{ opacity: 0, scale: 0 }}
            onAnimationComplete={() => removeGif(gif.id)}
            transition={{ 
              duration: gif.duration, 
              ease: "linear",
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
            style={{ willChange: 'transform' }}
            className="absolute w-12 h-12 md:w-16 md:h-16 transform-gpu"
          >
            <img 
              src={gif.src} 
              alt="" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
