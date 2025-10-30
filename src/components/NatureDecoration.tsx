import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NatureElement {
  src: string;
  alt: string;
  size: number;
  rotation: number;
  delay: number;
}

const floatingAnimation = {
  y: [0, -20, 0],
  rotate: [0, 5, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export function NatureDecoration() {
  const elements: NatureElement[] = [
    {
      src: 'https://images.unsplash.com/photo-1712219003003-23f067d78e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlcnklMjB2ZWdldGFibGUlMjB3YXRlcmNvbG9yfGVufDF8fHx8MTc2MTgwODU1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'celery',
      size: 180,
      rotation: -15,
      delay: 0
    },
    {
      src: 'https://images.unsplash.com/flagged/photo-1587808816334-bc987a0868ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlYmVycmllcyUyMHdhdGVyY29sb3J8ZW58MXx8fHwxNzYxODA4NTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'blueberries',
      size: 140,
      rotation: 10,
      delay: 1
    },
    {
      src: 'https://images.unsplash.com/photo-1583118289889-f9e5ee78c82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMGNpdHJ1cyUyMHdhdGVyY29sb3J8ZW58MXx8fHwxNzYxODA4NTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'lemon',
      size: 120,
      rotation: -20,
      delay: 2
    },
    {
      src: 'https://images.unsplash.com/photo-1618468121353-aaa41d8fb2e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJicyUyMGJvdGFuaWNhbCUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjE4MDg1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'herbs',
      size: 160,
      rotation: 15,
      delay: 1.5
    },
    {
      src: 'https://images.unsplash.com/photo-1613291511109-ea3d67e68a25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkZmxvd2VycyUyMHBhc3RlbHxlbnwxfHx8fDE3NjE4MDg1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'wildflowers',
      size: 150,
      rotation: 8,
      delay: 0.5
    },
    {
      src: 'https://images.unsplash.com/photo-1548808918-a33260f83b25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBheWElMjBmcnVpdCUyMGJvdGFuaWNhbHxlbnwxfHx8fDE3NjE4MDg1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'papaya',
      size: 130,
      rotation: -12,
      delay: 2.5
    }
  ];

  return (
    <>
      {/* Top Left Corner */}
      <motion.div
        className="absolute top-8 left-8 pointer-events-none"
        animate={floatingAnimation}
        style={{ animationDelay: `${elements[0].delay}s` }}
      >
        <div 
          className="relative rounded-full overflow-hidden shadow-2xl"
          style={{ 
            width: elements[0].size,
            height: elements[0].size,
            transform: `rotate(${elements[0].rotation}deg)`
          }}
        >
          <ImageWithFallback
            src={elements[0].src}
            alt={elements[0].alt}
            className="w-full h-full object-cover opacity-60"
            style={{
              filter: 'sepia(0.2) saturate(0.7) brightness(1.1) contrast(0.9)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#A8CBB7]/30 to-[#F7E6C3]/30 mix-blend-overlay" />
        </div>
      </motion.div>

      {/* Top Right Corner */}
      <motion.div
        className="absolute top-16 right-12 pointer-events-none"
        animate={floatingAnimation}
        style={{ animationDelay: `${elements[1].delay}s` }}
      >
        <div 
          className="relative rounded-full overflow-hidden shadow-2xl"
          style={{ 
            width: elements[1].size,
            height: elements[1].size,
            transform: `rotate(${elements[1].rotation}deg)`
          }}
        >
          <ImageWithFallback
            src={elements[1].src}
            alt={elements[1].alt}
            className="w-full h-full object-cover opacity-50"
            style={{
              filter: 'sepia(0.3) saturate(0.6) brightness(1.2) contrast(0.85) hue-rotate(-10deg)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#E5C17A]/20 to-[#A8CBB7]/30 mix-blend-overlay" />
        </div>
      </motion.div>

      {/* Middle Left */}
      <motion.div
        className="absolute top-1/3 left-4 pointer-events-none"
        animate={floatingAnimation}
        style={{ animationDelay: `${elements[2].delay}s` }}
      >
        <div 
          className="relative rounded-full overflow-hidden shadow-2xl"
          style={{ 
            width: elements[2].size,
            height: elements[2].size,
            transform: `rotate(${elements[2].rotation}deg)`
          }}
        >
          <ImageWithFallback
            src={elements[2].src}
            alt={elements[2].alt}
            className="w-full h-full object-cover opacity-55"
            style={{
              filter: 'sepia(0.25) saturate(0.65) brightness(1.15) contrast(0.9)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#F7E6C3]/40 to-[#E5C17A]/20 mix-blend-overlay" />
        </div>
      </motion.div>

      {/* Middle Right */}
      <motion.div
        className="absolute top-1/2 right-8 pointer-events-none"
        animate={floatingAnimation}
        style={{ animationDelay: `${elements[3].delay}s` }}
      >
        <div 
          className="relative rounded-full overflow-hidden shadow-2xl"
          style={{ 
            width: elements[3].size,
            height: elements[3].size,
            transform: `rotate(${elements[3].rotation}deg)`
          }}
        >
          <ImageWithFallback
            src={elements[3].src}
            alt={elements[3].alt}
            className="w-full h-full object-cover opacity-50"
            style={{
              filter: 'sepia(0.2) saturate(0.7) brightness(1.1) contrast(0.88)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#A8CBB7]/25 to-[#9fb8a8]/30 mix-blend-overlay" />
        </div>
      </motion.div>

      {/* Bottom Left */}
      <motion.div
        className="absolute bottom-20 left-16 pointer-events-none"
        animate={floatingAnimation}
        style={{ animationDelay: `${elements[4].delay}s` }}
      >
        <div 
          className="relative rounded-full overflow-hidden shadow-2xl"
          style={{ 
            width: elements[4].size,
            height: elements[4].size,
            transform: `rotate(${elements[4].rotation}deg)`
          }}
        >
          <ImageWithFallback
            src={elements[4].src}
            alt={elements[4].alt}
            className="w-full h-full object-cover opacity-60"
            style={{
              filter: 'sepia(0.15) saturate(0.75) brightness(1.15) contrast(0.9) hue-rotate(5deg)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#F7E6C3]/30 to-[#A8CBB7]/25 mix-blend-overlay" />
        </div>
      </motion.div>

      {/* Bottom Right */}
      <motion.div
        className="absolute bottom-32 right-20 pointer-events-none"
        animate={floatingAnimation}
        style={{ animationDelay: `${elements[5].delay}s` }}
      >
        <div 
          className="relative rounded-full overflow-hidden shadow-2xl"
          style={{ 
            width: elements[5].size,
            height: elements[5].size,
            transform: `rotate(${elements[5].rotation}deg)`
          }}
        >
          <ImageWithFallback
            src={elements[5].src}
            alt={elements[5].alt}
            className="w-full h-full object-cover opacity-55"
            style={{
              filter: 'sepia(0.25) saturate(0.65) brightness(1.1) contrast(0.85)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#E5C17A]/25 to-[#F7E6C3]/35 mix-blend-overlay" />
        </div>
      </motion.div>
    </>
  );
}
