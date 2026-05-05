import { motion } from "motion/react";
import React from "react";

interface CrazyMovingTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const CrazyMovingText: React.FC<CrazyMovingTextProps> = ({ text, className, delay = 0 }) => {
  const characters = text.split("");

  return (
    <div className={`flex flex-wrap justify-center ${className}`}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + index * 0.05,
            duration: 0.5,
            ease: "easeOut"
          }}
          whileHover={{
            scale: 1.2,
            rotate: [
              Math.random() * 30 - 15,
              Math.random() * 30 - 15,
              Math.random() * 30 - 15,
              Math.random() * 30 - 15
            ],
            y: [-2, 2, -3, 3, 0],
            transition: {
              rotate: {
                repeat: Infinity,
                duration: 0.4,
                ease: "linear"
              },
              y: {
                repeat: Infinity,
                duration: 0.3,
                ease: "linear"
              },
              scale: {
                type: "spring",
                mass: 0.5,
                stiffness: 200,
                damping: 10
              }
            }
          }}
          className="inline-block cursor-default select-none whitespace-pre"
          style={{ willChange: "transform, opacity" }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

export default CrazyMovingText;
