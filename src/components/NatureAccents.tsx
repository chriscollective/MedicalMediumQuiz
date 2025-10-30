import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Flower2, Sparkles } from 'lucide-react';

interface NatureAccentsProps {
  variant?: 'minimal' | 'decorative';
}

export function NatureAccents({ variant = 'minimal' }: NatureAccentsProps) {
  const floatingAnimation = {
    y: [0, -10, 0],
    rotate: [0, 3, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (variant === 'minimal') {
    return (
      <>
        {/* Subtle leaf accents */}
        <motion.div
          className="absolute top-10 right-10 text-[#A8CBB7]/20 pointer-events-none"
          animate={floatingAnimation}
        >
          <Leaf className="w-16 h-16" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-10 left-10 text-[#E5C17A]/20 pointer-events-none"
          animate={floatingAnimation}
          style={{ animationDelay: '1s' }}
        >
          <Flower2 className="w-14 h-14" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-5 text-[#F7E6C3]/30 pointer-events-none"
          animate={floatingAnimation}
          style={{ animationDelay: '2s' }}
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
      </>
    );
  }

  return (
    <>
      {/* Decorative botanical borders */}
      <div className="absolute top-0 left-0 w-full h-32 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-4 left-10"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <div className="flex gap-2 opacity-30">
            <Leaf className="w-8 h-8 text-[#A8CBB7]" />
            <Flower2 className="w-8 h-8 text-[#E5C17A]" />
            <Leaf className="w-8 h-8 text-[#9fb8a8]" />
          </div>
        </motion.div>
        
        <motion.div
          className="absolute -top-4 right-16"
          animate={{ rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        >
          <div className="flex gap-2 opacity-30">
            <Flower2 className="w-8 h-8 text-[#F7E6C3]" />
            <Leaf className="w-8 h-8 text-[#A8CBB7]" />
            <Sparkles className="w-8 h-8 text-[#E5C17A]" />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute bottom-4 left-16"
          animate={{ rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        >
          <div className="flex gap-2 opacity-30">
            <Sparkles className="w-8 h-8 text-[#A8CBB7]" />
            <Leaf className="w-8 h-8 text-[#E5C17A]" />
            <Flower2 className="w-8 h-8 text-[#F7E6C3]" />
          </div>
        </motion.div>
        
        <motion.div
          className="absolute bottom-4 right-10"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <div className="flex gap-2 opacity-30">
            <Leaf className="w-8 h-8 text-[#9fb8a8]" />
            <Flower2 className="w-8 h-8 text-[#A8CBB7]" />
          </div>
        </motion.div>
      </div>
    </>
  );
}
