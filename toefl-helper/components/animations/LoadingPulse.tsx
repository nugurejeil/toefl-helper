'use client';

import { motion } from 'framer-motion';

interface LoadingPulseProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function LoadingPulse({
  size = 'md',
  color = 'var(--strawberry-pink)'
}: LoadingPulseProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse */}
      <motion.div
        className={`absolute rounded-full ${sizeMap[size]}`}
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Inner circle */}
      <motion.div
        className={`relative rounded-full ${sizeMap[size]}`}
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 0.9, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
    </div>
  );
}
