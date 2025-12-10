'use client';

import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/animations';

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        {/* Animated mascots */}
        <motion.div
          className="flex justify-center gap-4 mb-8 text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {['🐹', '🐱', '🐻‍❄️', '🦊', '🐰'].map((emoji, index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.15,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Loading spinner */}
        <div className="flex justify-center mb-4">
          <LoadingSpinner size="lg" />
        </div>

        {/* Loading text */}
        <motion.p
          className="text-text-secondary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          로딩 중...
        </motion.p>
      </motion.div>
    </div>
  );
}
