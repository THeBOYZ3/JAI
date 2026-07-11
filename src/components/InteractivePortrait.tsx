import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BorderGlow } from "./BorderGlow";

interface Sticker {
  id: number;
  x: number;
  y: number;
  content: string;
}

export function InteractivePortrait() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const spawnSticker = useCallback(() => {
    if (!isHovered) return;

    const id = Date.now();
    const contents = ["🖤", "😘"];
    const content = contents[Math.floor(Math.random() * contents.length)];

    setStickers((prev) => [
      ...prev,
      { id, x: mousePos.current.x, y: mousePos.current.y, content },
    ]);

    // Cleanup sticker after animation
    setTimeout(() => {
      setStickers((prev) => prev.filter((s) => s.id !== id));
    }, 1000);
  }, [isHovered]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      // Spawn immediately on entry, then every 3s
      spawnSticker();
      interval = setInterval(spawnSticker, 3000);
    }
    return () => clearInterval(interval);
  }, [isHovered, spawnSticker]);

  const handleMouseMove = (e: React.MouseEvent | React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'clientX' in e ? e.clientX : (e as any).touches[0].clientX;
      const clientY = 'clientY' in e ? e.clientY : (e as any).touches[0].clientY;
      mousePos.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      mousePos.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      spawnSticker();
    }
  };

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="280 80 80"
      backgroundColor="transparent"
      borderRadius={16}
      glowRadius={30}
      glowIntensity={1.2}
      coneSpread={25}
      animated={true}
      colors={["#a855f7", "#ec4899", "#3b82f6"]}
      className="aspect-[4/5] relative w-full cursor-crosshair touch-none overflow-visible"
    >
      <div 
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onPointerDown={(e) => {
          setIsHovered(true);
          handleMouseMove(e);
          spawnSticker();
        }}
        onPointerUp={() => {
          // Prevent sticking on mobile: clear hover state on pointer up if it's a touch device
          if (window.matchMedia("(pointer: coarse)").matches) {
            setTimeout(() => setIsHovered(false), 1000);
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={() => setTimeout(() => setIsHovered(false), 1500)}
        className="w-full h-full bg-white/5 relative overflow-hidden group rounded-2xl"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        {/* Grayscale Transition Image */}
        <div className="absolute inset-0">
          <motion.img 
            src="P.png" 
            alt="Jai Portrait" 
            animate={{ 
              filter: isHovered ? "grayscale(0%) brightness(1) contrast(1.1)" : "grayscale(100%) brightness(0.75) contrast(1)",
              scale: isHovered ? 1 : 1.05
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ willChange: "filter, transform" }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Stickers Layer */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <AnimatePresence>
            {stickers.map((sticker) => (
              <motion.div
                key={sticker.id}
                initial={{ scale: 0, x: sticker.x, y: sticker.y, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: sticker.y - 100, // Drift upwards
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  duration: 0.8
                }}
                className="absolute text-2xl drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] select-none pointer-events-none"
                style={{ 
                  transform: "translate(-50%, -50%)",
                  color: "black",
                  textShadow: "0 0 5px rgba(255,255,255,0.2)"
                }}
              >
                {sticker.content}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-10 group-hover:opacity-40 transition-opacity duration-500">
          <p className="text-xs font-mono uppercase tracking-widest text-white/40 drop-shadow-lg">IDENT: JAIRUS / Age_17</p>
        </div>
      </div>
    </BorderGlow>
  );
}
