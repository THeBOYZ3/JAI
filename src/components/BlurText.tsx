import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function BlurText({ text, className = "", delay = 0 }: BlurTextProps) {
  const words = text.split(" ");

  return (
    <div className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.1,
            ease: "easeOut",
          }}
          className="mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
