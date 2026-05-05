import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoBackgroundProps {
  url: string;
  className?: string;
  overlayOpacity?: number;
  filter?: string;
}

export function VideoBackground({ url, className = "", overlayOpacity = 0.5, filter = "" }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (url.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      }
    } else {
      video.src = url;
    }
  }, [url]);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
        style={{ filter, transform: "translateZ(0)", willChange: "filter" }}
      />
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
      />
    </div>
  );
}
