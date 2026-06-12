import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface SequentialHighlightContextType {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  registerSentence: (index: number, length: number) => void;
}

const SequentialHighlightContext = createContext<SequentialHighlightContextType | null>(null);

export function useSequentialHighlight() {
  const context = useContext(SequentialHighlightContext);
  if (!context) {
    throw new Error("useSequentialHighlight must be used within a SequentialHighlightProvider");
  }
  return context;
}

interface ProviderProps {
  children: React.ReactNode;
}

export function SequentialHighlightProvider({ children }: ProviderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sentenceLengths = useRef<Record<number, number>>({});
  
  // FIXED: This line stops the GitHub Actions crash
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerSentence = (index: number, length: number) => {
    sentenceLengths.current[index] = length;
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const currentLen = sentenceLengths.current[activeIndex];
    if (currentLen !== undefined) {
      const duration = Math.max(1800, currentLen * 30);
      timerRef.current = setTimeout(() => {
        setActiveIndex((prev) => prev + 1);
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activeIndex]);

  return (
    <SequentialHighlightContext.Provider value={{ activeIndex, setActiveIndex, registerSentence }}>
      {children}
    </SequentialHighlightContext.Provider>
  );
}

interface HighlightSentenceProps {
  index: number;
  text: string;
  children: React.ReactNode;
  className?: string;
}

export function HighlightSentence({ index, text, children, className = "" }: HighlightSentenceProps) {
  const { activeIndex, setActiveIndex, registerSentence } = useSequentialHighlight();
  const isActive = activeIndex === index;
  const isPast = activeIndex > index;

  useEffect(() => {
    registerSentence(index, text.length);
  }, [index, text, registerSentence]);

  const handleClick = () => setActiveIndex(index);

  let cursorClass = "cursor-pointer";
  let textClass = "";
  let glowStyle: React.CSSProperties = {
    transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  if (isActive) {
    textClass = "text-white";
    glowStyle = {
      ...glowStyle,
      textShadow: "0 0 16px rgba(255, 255, 255, 0.8), 0 0 6px rgba(255, 255, 255, 0.4)",
      transform: "translateY(-1px)",
    };
  } else if (isPast) {
    textClass = "text-white/75";
  } else {
    textClass = "text-white/25";
  }

  return (
    <span
      onClick={handleClick}
      className={`inline transition-all duration-700 ease-in-out select-none ${textClass} ${cursorClass} ${className}`}
      style={glowStyle}
      title="Click to focus reading spotlight here"
    >
      {children}
    </span>
  );
}

interface HighlightListItemProps {
  index: number;
  text: string;
  children: React.ReactNode;
}

export function HighlightListItem({ index, text, children }: HighlightListItemProps) {
  const { activeIndex } = useSequentialHighlight();
  const isActive = activeIndex === index;

  return (
    <li className="flex items-start gap-3">
      <div
        className={`w-1.5 h-1.5 rounded-full mt-2.5 shrink-0 transition-all duration-700 ${
          isActive
            ? "bg-white scale-125 shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            : "bg-white/25"
        }`}
      />
      <HighlightSentence index={index} text={text} className="flex-1">
        {children}
      </HighlightSentence>
    </li>
  );
}
