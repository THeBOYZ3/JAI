import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, RotateCcw } from 'lucide-react';

const AUDIO_URL = "https://raw.githubusercontent.com/THeBOYZ3/jai-project-assets/refs/heads/main/YTDown_YouTube_Skate-Avenue-PH-I-Knew-I-Loved-You-Rock-_Media_yRrpQ5Sh5n8_009_128k.mp3";

export const AudioPlayer: React.FC<{ onReady?: () => void; loading?: boolean }> = ({ onReady, loading }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  const handleCanPlayThrough = () => {
    if (onReady) onReady();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    setError(null);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error("Audio playback error:", e instanceof Error ? e.message : "Unknown error");
        setError("Playback blocked. Use the controls to start manually.");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setError(null);
  };

  const restartAudio = () => {
    if (!audioRef.current) return;
    setError(null);
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => {
      console.error("Audio playback error:", e instanceof Error ? e.message : "Unknown error");
      setError("Failed to restart audio.");
    });
    setIsPlaying(true);
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
        preload="metadata"
        onCanPlayThrough={handleCanPlayThrough}
        onError={handleAudioError}
      />
      
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
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowControls(!showControls)}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ willChange: "transform, opacity" }}
              className="relative w-14 h-14 md:w-20 md:h-20 rounded-full border border-white/20 overflow-hidden cursor-pointer bg-white/5 backdrop-blur-sm shadow-2xl z-20 flex-shrink-0"
            >
              <img 
                src="/ai-project-web/P.png" 
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
