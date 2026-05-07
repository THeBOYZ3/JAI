import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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

const GIF_POOL = [
  'bonk.gif',
  'excited.gif',
  'flip.gif',
  'intensifies.gif',
  'music.gif',
  'orbit-drift.gif',
  'pet.gif',
  'polish.gif',
  'recoil-pop.gif',
  'wave.gif'
];

export const VibeRain: React.FC<{ active: boolean }> = ({ active }) => {
  const [gifs, setGifs] = useState<GifItem[]>([]);

  const spawnGifs = useCallback(() => {
    const count = Math.floor(Math.random() * 5) + 1; // 1-5 GIFs
    const newGifs: GifItem[] = [];
    
    for (let i = 0; i < count; i++) {
      const src = GIF_POOL[Math.floor(Math.random() * GIF_POOL.length)];
      
      const xPos = Math.random() * 100;
      const startX = `${xPos}vw`; // Use vw for global horizontal positioning
      const startY = '-10vh';
      const endX = `${xPos + (Math.random() * 20 - 10)}vw`; 
      const endY = '110vh';

      newGifs.push({
        id: `${Date.now()}-${i}-${Math.random()}`,
        src,
        startX,
        startY,
        endX,
        endY,
        rotation: Math.random() * 360,
        scale: Math.random() * (1.2 - 0.7) + 0.7,
        duration: 6 + Math.random() * 4 // Graceful fall
      });
    }
    setGifs(newGifs);
  }, []);

  useEffect(() => {
    if (!active) {
      setGifs([]);
      return;
    }

    spawnGifs();
    const interval = setInterval(spawnGifs, 5000);
    return () => clearInterval(interval);
  }, [active, spawnGifs]);

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
            transition={{ 
              duration: gif.duration, 
              ease: "linear",
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
            className="absolute w-12 h-12 md:w-16 md:h-16"
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
