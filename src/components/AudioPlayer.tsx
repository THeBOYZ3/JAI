import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, List, SkipBack, SkipForward, Repeat, Shuffle, X } from 'lucide-react';
import { FloatingSpeechBubble } from './FloatingSpeechBubble';
import { VibeRain } from './VibeRain';
import { playSound, SoundType } from '../lib/soundUtils';
import { MUSIC_TRACKS } from '../AssetShield';

export const AudioPlayer: React.FC<{ 
  onReady?: () => void; 
  loading?: boolean;
  onMusicStateChange?: (playing: boolean) => void;
}> = ({ onReady, loading, onMusicStateChange }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isPlayingEffect, setIsPlayingEffect] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false); // New state for physical playback
  
  // Sync playlist state to body for Chatbase visibility control
  useEffect(() => {
    if (showPlaylist) {
      document.body.setAttribute('data-playlist-open', 'true');
    } else {
      document.body.removeAttribute('data-playlist-open');
    }
  }, [showPlaylist]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

  // Sync to parent whenever internal visual playing state changes
  useEffect(() => {
    onMusicStateChange?.(isActuallyPlaying);
  }, [isActuallyPlaying, onMusicStateChange]);

  // Track the actual loaded URL to avoid redundant loads
  const loadedUrlRef = useRef<string>("");

  // Initial volume and track set
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      loadedUrlRef.current = currentTrack.url;
    }
  }, []);

  // Handle track changes and play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Force load if source changed
    if (loadedUrlRef.current !== currentTrack.url) {
      loadedUrlRef.current = currentTrack.url;
      audio.load();
    }

    if (isPlaying) {
      // Intent to play - load first to re-verify for CORS/MIME per user request
      audio.load();
      audio.play().catch(e => {
        console.warn("Playback prevented:", e.name);
        if (e.name === "NotAllowedError" || e.name === "NotSupportedError") {
          setError("Click Play to start music.");
        }
        setIsPlaying(false);
        setIsActuallyPlaying(false);
      });
    } else {
      audio.pause();
      setIsActuallyPlaying(false);
    }
  }, [currentTrack.url, isPlaying]);

  const triggerEffects = () => {
    // This maintains the visual effect state - only if actually playing
    setIsPlayingEffect(true);
    if (effectTimeoutRef.current) clearTimeout(effectTimeoutRef.current);
    effectTimeoutRef.current = setTimeout(() => {
      setIsPlayingEffect(false);
    }, 5000);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setError(null);
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Ensure src is set if it was somehow lost
        if (!audio.src || audio.src === window.location.href) {
          audio.src = currentTrack.url;
          loadedUrlRef.current = currentTrack.url;
        }
        audio.load(); // Force re-verification
        await audio.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Audio playback error:", e instanceof Error ? e.message : String(e));
      setError("Playback blocked. Please try clicking Play again.");
      setIsPlaying(false);
    }
  };

  const nextTrack = useCallback(() => {
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    }
  }, [isShuffle]);

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
  };

  const restartAudio = async () => {
    if (!audioRef.current) return;
    setError(null);
    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      setError("Failed to restart audio.");
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    // Source update is handled by useEffect
  };

  const handleAudioEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      nextTrack();
    }
  };

  return (
    <>
      <VibeRain active={isActuallyPlaying} />
      {/* Main Top Nav Controls */}
      <div className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center px-4 w-full max-w-sm pointer-events-none">
        <audio 
          ref={audioRef} 
          src={currentTrack.url}
          preload="auto"
          playsInline
          crossOrigin="anonymous"
          onPlaying={() => {
            setIsActuallyPlaying(true);
            triggerEffects();
          }}
          onPause={() => setIsActuallyPlaying(false)}
          onCanPlayThrough={() => onReady?.()}
          onEnded={handleAudioEnded}
          onError={() => {
            console.error("Audio Load Error for:", currentTrack.url);
            setError("Media load failed. Checking connection...");
            setIsPlaying(false);
            setIsActuallyPlaying(false);
          }}
        />

        <AnimatePresence>
          {!loading && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="relative flex items-center pointer-events-auto"
            >
              {/* TRIGGER LOGO */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playSound(SoundType.TAP);
                  setShowControls(!showControls);
                }}
                animate={isActuallyPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={isActuallyPlaying ? { 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                } : { type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-14 h-14 md:w-20 md:h-20 rounded-full border border-white/20 overflow-hidden cursor-pointer bg-white/5 backdrop-blur-sm shadow-2xl z-20"
              >
                <img 
                  src="P.png" 
                  alt="Track Cover" 
                  className="w-full h-full object-cover"
                />
                {isActuallyPlaying && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white/10"
                  />
                )}
              </motion.div>

              {!isActuallyPlaying && <FloatingSpeechBubble trackIndex={currentTrackIndex} />}

              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.7 }}
                    animate={{ opacity: 1, x: 8, scale: 0.85 }}
                    exit={{ opacity: 0, x: 20, scale: 0.7 }}
                    className="absolute left-full flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl"
                  >
                    <button
                      onClick={togglePlay}
                      className="w-11 h-11 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                    >
                      {isActuallyPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                    </button>
                    <button
                      onClick={() => {
                        playSound(SoundType.DRAWER);
                        setShowPlaylist(true);
                      }}
                      className="w-11 h-11 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                    >
                      <List size={14} />
                    </button>
                    <button
                      onClick={restartAudio}
                      className="w-11 h-11 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Playlist UI Drawer */}
      <AnimatePresence>
        {showPlaylist && (
          <div className="fixed inset-0 z-[200]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlaylist(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 md:bottom-8 left-0 right-0 md:left-auto md:right-8 w-full md:w-[400px] max-h-[75vh] md:max-h-[85vh] h-auto bg-neutral-900/95 backdrop-blur-2xl border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom)]"
            >
              <button 
                onClick={() => {
                  playSound(SoundType.TAP);
                  setShowPlaylist(false);
                }}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white/50 hover:text-white transition-all active:scale-90 z-30"
              >
                <X size={16} className="md:w-[18px] md:h-[18px]" />
              </button>

              {/* Player Header - Face Image with Fade */}
              <div className="relative pt-6 pb-2 md:pt-10 md:pb-6 flex flex-col items-center">
                <div className="relative w-16 h-16 md:w-[130px] md:h-[130px] rounded-full overflow-hidden border-2 border-white/10 shadow-2xl mb-2 md:mb-4 group">
                  <img 
                    src="P.png" 
                    alt="Jairus" 
                    style={{ 
                      maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', 
                      WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' 
                    }}
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
                </div>
                
                <div className="text-center px-6">
                  <h2 className="text-base md:text-xl font-bold text-white tracking-tighter line-clamp-1">{currentTrack.title}</h2>
                  <p className="text-[7px] md:text-[9px] text-blue-400/60 font-mono uppercase tracking-[0.3em] mt-1 md:mt-1.5 font-semibold">Live Feed • High Fidelity</p>
                </div>
              </div>

              {/* Controls */}
              <div className="px-6 pb-6 md:pb-8 flex flex-col items-center gap-3 md:gap-6">
                <div className="flex items-center justify-center gap-4 md:gap-5 w-full">
                  <button 
                    onClick={() => {
                      playSound(SoundType.TAP);
                      setIsShuffle(!isShuffle);
                    }}
                    className={`p-1.5 md:p-2 rounded-full transition-all hover:bg-white/5 active:scale-90 ${isShuffle ? 'text-blue-400 bg-blue-400/10' : 'text-white/40'}`}
                  >
                    <Shuffle size={14} className="md:w-4 md:h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      playSound(SoundType.TAP);
                      prevTrack();
                    }}
                    className="p-1.5 md:p-2 text-white/80 hover:text-white transition-all hover:scale-110 active:scale-90"
                  >
                    <SkipBack size={18} md:size={22} fill="currentColor" />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="w-12 h-12 md:w-14 md:h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    {isActuallyPlaying ? <Pause size={20} md:size={24} fill="black" /> : <Play size={20} md:size={24} fill="black" className="ml-1" />}
                  </button>
                  <button 
                    onClick={() => {
                      playSound(SoundType.TAP);
                      nextTrack();
                    }}
                    className="p-1.5 md:p-2 text-white/80 hover:text-white transition-all hover:scale-110 active:scale-90"
                  >
                    <SkipForward size={18} md:size={22} fill="currentColor" />
                  </button>
                  <button 
                    onClick={() => {
                      playSound(SoundType.TAP);
                      setIsLooping(!isLooping);
                    }}
                    className={`p-1.5 md:p-2 rounded-full transition-all hover:bg-white/5 active:scale-90 ${isLooping ? 'text-blue-400 bg-blue-400/10' : 'text-white/40'}`}
                  >
                    <Repeat size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>

                {/* Tracklist Container */}
                <div className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-1 md:p-1.5 h-auto max-h-[45vh] md:max-h-[280px] overflow-hidden flex flex-col">
                  <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 mb-1">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Digital Archive</span>
                    <span className="text-[10px] font-mono text-white/30">{MUSIC_TRACKS.length} Tracks</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar-hide overscroll-contain pb-2">
                    {MUSIC_TRACKS.map((track, index) => (
                      <button
                        key={track.id}
                        onClick={() => {
                          if (currentTrackIndex !== index) {
                            playSound(SoundType.TAP);
                            playTrack(index);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2.5 md:p-3.5 rounded-2xl transition-all group ${
                          currentTrackIndex === index ? 'bg-blue-400/10 text-blue-400' : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-3 md:gap-3.5">
                          <span className={`text-[8px] md:text-[9px] font-mono transition-opacity ${currentTrackIndex === index ? 'opacity-100' : 'opacity-20 group-hover:opacity-40'}`}>
                            {String(track.id).padStart(2, '0')}
                          </span>
                          <span className="text-[11px] md:text-xs font-semibold tracking-tight text-left line-clamp-1">{track.title}</span>
                        </div>
                        {currentTrackIndex === index && isActuallyPlaying && (
                          <div className="flex gap-0.5 items-end h-3 pb-0.5">
                            {[1,2,3].map(i => (
                              <motion.div
                                key={i}
                                animate={{ height: [3, 10, 3] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                className="w-[1.5px] bg-blue-400 rounded-full"
                              />
                            ))}
                          </div>
                        )}
                        {currentTrackIndex === index && !isActuallyPlaying && (
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-400/40" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
