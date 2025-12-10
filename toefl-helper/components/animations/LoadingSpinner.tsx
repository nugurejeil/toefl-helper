'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'var(--strawberry-pink)'
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <motion.div
      className={`${sizeMap[size]} rounded-full border-t-transparent`}
      style={{ borderColor: color, borderTopColor: 'transparent' }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
    />
  );
}
