import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface GradeBadgeProps {
  grade: "S" | "A+" | "A" | "B+" | "B" | "C+" | "F";
}

const gradeStyles = {
  S: {
    gradient: "from-[#E5C17A] via-[#f4d89e] to-[#E5C17A]",
    shadow: "shadow-[0_0_40px_rgba(229,193,122,0.6)]",
    glow: "ring-4 ring-[#E5C17A]/30",
  },
  "A+": {
    gradient: "from-[#F7E6C3] to-[#e8d9b5]",
    shadow: "shadow-[0_0_20px_rgba(247,230,195,0.4)]",
    glow: "ring-3 ring-[#F7E6C3]/25",
  },
  A: {
    gradient: "from-[#e8ebe9] to-[#d9dcd9]",
    shadow: "shadow-lg",
    glow: "ring-2 ring-gray-200",
  },
  "B+": {
    gradient: "from-[#A8CBB7] via-[#c5dccf] to-[#A8CBB7]",
    shadow: "shadow-[0_0_30px_rgba(168,203,183,0.5)]",
    glow: "ring-4 ring-[#A8CBB7]/30",
  },
  B: {
    gradient: "from-[#A8CBB7] to-[#9fb8a8]",
    shadow: "shadow-[0_0_25px_rgba(168,203,183,0.4)]",
    glow: "ring-3 ring-[#A8CBB7]/25",
  },
  "C+": {
    gradient: "from-gray-200 to-gray-300",
    shadow: "shadow-md",
    glow: "ring-2 ring-gray-300/50",
  },
  F: {
    gradient: "from-gray-300 to-gray-400",
    shadow: "shadow-sm",
    glow: "ring-1 ring-gray-400/30",
  },
};

export function GradeBadge({ grade }: GradeBadgeProps) {
  const style = gradeStyles[grade];

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      }}
      className="relative"
    >
      {/* Floating sparkles for S and A+ grades */}
      {(grade === "S" || grade === "A+") && (
        <>
          <motion.div
            className="absolute -top-4 md:-top-6 -left-4 md:-left-6"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-[#E5C17A]" />
          </motion.div>
          <motion.div
            className="absolute -top-4 md:-top-6 -right-4 md:-right-6"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-[#A8CBB7]" />
          </motion.div>
          <motion.div
            className="absolute -bottom-4 md:-bottom-6 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
              opacity: [0.5, 1, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-[#F7E6C3]" />
          </motion.div>
        </>
      )}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`
          w-24 h-24 md:w-40 md:h-40 rounded-full 
          bg-gradient-to-br ${style.gradient}
          ${style.shadow} ${style.glow}
          flex items-center justify-center
          relative overflow-hidden
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        <span className="relative z-10 text-white drop-shadow-lg font-extrabold text-3xl md:text-6xl">
          {grade}
        </span>
      </motion.div>
    </motion.div>
  );
}
