import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, RotateCcw } from 'lucide-react';
import { EmojiRain } from './EmojiRain';

const AUDIO_URL = "https://raw.githubusercontent.com/THeBOYZ3/jai-project-assets/refs/heads/main/YTDown_YouTube_Skate-Avenue-PH-I-Knew-I-Loved-You-Rock-_Media_yRrpQ5Sh5n8_009_128k.mp3";

export const AudioPlayer: React.FC<{ onReady?: () => void; loading?: boolean }> = ({ onReady, loading }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isPlayingEffect, setIsPlayingEffect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  const triggerEffects = () => {
    setIsPlayingEffect(true);
    if (effectTimeoutRef.current) clearTimeout(effectTimeoutRef.current);
    effectTimeoutRef.current = setTimeout(() => {
      setIsPlayingEffect(false);
    }, 5000);
  };

  const handleCanPlayThrough = () => {
    if (onReady) onReady();
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    setError(null);
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        triggerEffects();
      }
    } catch (e) {
      console.error("Audio playback error:", e instanceof Error ? e.message : "Unknown error");
      setError("Playback blocked. Please try clicking Play again.");
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setIsPlayingEffect(false);
    setError(null);
  };

  const restartAudio = async () => {
    if (!audioRef.current) return;
    setError(null);
    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);
      triggerEffects();
    } catch (e) {
      console.error("Audio playback error:", e instanceof Error ? e.message : "Unknown error");
      setError("Failed to restart audio.");
    }
  };

  const handleAudioError = () => {
    console.error("Audio element source error");
    setError("Media resource check failed. Verify the GitHub raw link.");
    setIsPlaying(false);
  };

  return (
    <div className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center px-4 w-full max-w-sm pointer-events-none">
      <audio 
        ref={audioRef} 
        src={AUDIO_URL} 
        loop 
        preload="auto"
        playsInline
        crossOrigin="anonymous"
        onCanPlayThrough={handleCanPlayThrough}
        onError={handleAudioError}
      />

      <EmojiRain active={isPlayingEffect} />
      
      <AnimatePresence>
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex items-center pointer-events-auto"
          >
            {/* TRIGGER LOGO (Centered) */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: isPlayingEffect ? 0 : 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowControls(!showControls)}
              animate={isPlayingEffect ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlayingEffect ? { 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                type: "spring", stiffness: 300, damping: 20 
              } : { type: "spring", stiffness: 300, damping: 20 }}
              style={{ willChange: "transform, opacity" }}
              className="relative w-14 h-14 md:w-20 md:h-20 rounded-full border border-white/20 overflow-hidden cursor-pointer bg-white/5 backdrop-blur-sm shadow-2xl z-20 flex-shrink-0"
            >
              <img 
                src="P.png" 
                alt="Logo" 
                className="w-full h-full object-cover text-white text-[8px] text-center"
                referrerPolicy="no-referrer"
              />
              {isPlaying && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/10"
                />
              )}
            </motion.div>

            {/* LOVE EXPRESSION OVERLAY */}
            <AnimatePresence>
              {isPlayingEffect && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-xl"
                >
                  <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-white/90">
                    Made with Love ❤️
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CONTROLS PANEL (Floating Side Panel) */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.7 }}
                  animate={{ opacity: 1, x: 8, scale: 0.85 }}
                  exit={{ opacity: 0, x: 20, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ willChange: "transform, opacity" }}
                  className="absolute left-full flex flex-col gap-2 z-10 md:scale-100 origin-left"
                >
                  <div className="flex items-center gap-2 md:gap-3 bg-black/80 backdrop-blur-xl border border-white/10 p-1.5 md:p-2 pr-3 md:pr-4 rounded-full shadow-2xl">
                    <button
                      onClick={togglePlay}
                      className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Square size={14} fill="white" /> : <Play size={14} fill="white" />}
                    </button>
                    <button
                      onClick={stopAudio}
                      className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                      title="Stop"
                    >
                      <Square size={14} />
                    </button>
                    <button
                      onClick={restartAudio}
                      className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                      title="Restart"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 left-0 text-[9px] md:text-[10px] text-red-400 bg-black/90 px-2 py-1 rounded-md backdrop-blur-md border border-red-900/30 w-max max-w-[150px] md:max-w-[180px] shadow-lg"
                    >
                      {error}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
