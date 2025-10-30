import React from 'react';
import { motion } from 'motion/react';

interface HerbProps {
  emoji: string;
  delay: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}

function Herb({ emoji, delay, position }: HerbProps) {
  return (
    <motion.div
      className="absolute text-4xl pointer-events-none opacity-40"
      style={position}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 10, -10, 0],
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
    >
      {emoji}
    </motion.div>
  );
}

export function FloatingHerbs() {
  const herbs = [
    { emoji: '🌿', delay: 0, position: { top: '10%', left: '5%' } },
    { emoji: '🍃', delay: 1, position: { top: '20%', right: '8%' } },
    { emoji: '🌱', delay: 2, position: { top: '60%', left: '3%' } },
    { emoji: '🥬', delay: 1.5, position: { top: '40%', right: '5%' } },
    { emoji: '🫐', delay: 0.5, position: { bottom: '20%', left: '10%' } },
    { emoji: '🍋', delay: 2.5, position: { bottom: '30%', right: '12%' } },
    { emoji: '🌸', delay: 3, position: { top: '50%', left: '8%' } },
    { emoji: '🌺', delay: 1.8, position: { top: '70%', right: '6%' } }
  ];

  return (
    <>
      {herbs.map((herb, index) => (
        <Herb key={index} {...herb} />
      ))}
    </>
  );
}
