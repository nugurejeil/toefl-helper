'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PercentageLoaderProps {
  message?: string;
  subMessage?: string;
}

export default function PercentageLoader({
  message = '분석하고 있어요...',
  subMessage = 'AI가 피드백을 준비하고 있습니다',
}: PercentageLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress with a realistic pace
    const intervals = [
      { duration: 100, increment: 1 }, // 0-30%: Fast start
      { duration: 150, increment: 1 }, // 30-60%: Medium pace
      { duration: 250, increment: 1 }, // 60-85%: Slow down
      { duration: 500, increment: 0.5 }, // 85-95%: Very slow (waiting for API)
    ];

    let currentProgress = 0;
    let currentPhase = 0;

    const updateProgress = () => {
      if (currentProgress >= 95) {
        // Stop at 95% and wait for actual completion
        return;
      }

      const phase = intervals[currentPhase];
      currentProgress += phase.increment;

      // Move to next phase based on progress
      if (currentProgress >= 30 && currentPhase === 0) {
        currentPhase = 1;
      } else if (currentProgress >= 60 && currentPhase === 1) {
        currentPhase = 2;
      } else if (currentProgress >= 85 && currentPhase === 2) {
        currentPhase = 3;
      }

      setProgress(Math.min(currentProgress, 95));

      setTimeout(updateProgress, phase.duration);
    };

    updateProgress();
  }, []);

  // Calculate circle parameters
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Circular Progress */}
      <div className="relative mb-6" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-warm-cream"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-strawberry-pink transition-all duration-300 ease-out"
          />
        </svg>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-cocoa-brown font-baloo">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-text-secondary mt-1">분석 중</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <h3 className="text-xl font-bold text-cocoa-brown mb-2">{message}</h3>
      <p className="text-text-secondary text-center">{subMessage}</p>

      {/* Loading dots animation */}
      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-strawberry-pink rounded-full"
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
