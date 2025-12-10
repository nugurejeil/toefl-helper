import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  value: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  size = 'md',
  className = '',
  animated = true,
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const containerClassName = `relative w-full ${sizeStyles[size]} bg-[var(--soft-peach)] rounded-full overflow-hidden ${className}`;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Progress
          </span>
          <span className="text-sm font-bold text-[var(--strawberry-pink)] font-[var(--font-number)]">
            {clampedValue}%
          </span>
        </div>
      )}
      <div className={containerClassName}>
        {animated ? (
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--soft-peach)] via-[var(--strawberry-pink)] to-[var(--strawberry-pink)]"
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
          />
        ) : (
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--soft-peach)] via-[var(--strawberry-pink)] to-[var(--strawberry-pink)]"
            style={{ width: `${clampedValue}%` }}
          />
        )}
        {clampedValue === 100 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
