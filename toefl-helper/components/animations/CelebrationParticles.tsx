'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  rotation: number;
  delay: number;
}

interface CelebrationParticlesProps {
  show: boolean;
  emoji?: string[];
  count?: number;
}

export default function CelebrationParticles({
  show,
  emoji = ['⭐', '✨', '🎉', '🎊', '💫'],
  count = 15,
}: CelebrationParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: emoji[Math.floor(Math.random() * emoji.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);
    }
  }, [show, count, emoji]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute text-4xl"
              initial={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: 0,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0.5],
                rotate: particle.rotation,
                y: [-20, -100],
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 2,
                delay: particle.delay,
              }}
            >
              {particle.emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
