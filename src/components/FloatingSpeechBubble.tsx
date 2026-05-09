import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const MESSAGES = [
  "Tired of the silence? Go ahead, click my face. I've got a little something special for your ears.",
  "You just gonna keep staring, or are you gonna click me for a surprise?",
  "My face is right here. Give it a tap, let’s see where the vibe goes.",
  "I know I look good, but clicking is way more fun than just looking.",
  "Don’t be shy. One click and I’ll give you a reason to stay.",
  "I’m waiting... click me and let’s turn the energy up.",
  "Is it just me, or does this site need a bit of music? Tap my face.",
  "Looking for the play button? It’s literally me. Don’t miss out.",
  "Bet you can’t click just once. Go ahead, try me.",
  "You, me, and some music. Just one click away."
];

export function FloatingSpeechBubble({ trackIndex }: { trackIndex: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const randomize = () => {
      setIndex((prev) => {
        let next = prev;
        while (next === prev && MESSAGES.length > 1) {
          next = Math.floor(Math.random() * MESSAGES.length);
        }
        return next;
      });
    };

    // Initial randomization on track change
    randomize();

    // Set up 5-second interval
    const interval = setInterval(randomize, 5000);
    return () => clearInterval(interval);
  }, [trackIndex]);

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 pointer-events-none z-[100] w-max">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.3, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 18,
            mass: 0.8
          }}
          className="relative px-3.5 py-2.5 bg-white/10 backdrop-blur-[12px] border border-white/20 rounded-[18px] shadow-[0_12px_40px_rgba(0,0,0,0.4)] w-[240px] sm:w-[260px] md:w-[280px] max-w-[70vw]"
        >
          {/* Shine gradient for iPhone glass feel */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[18px]" />
          
          <p className="relative z-10 text-white/90 text-[12px] md:text-[13px] leading-tight text-center font-medium tracking-tight">
            {MESSAGES[index]}
          </p>

          {/* Fixed Arrow pointing back to the icon */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/10 backdrop-blur-[12px] border-l border-t border-white/20 rotate-45 transform origin-center" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
