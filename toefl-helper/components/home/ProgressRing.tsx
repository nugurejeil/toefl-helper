'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

interface ProgressRingProps {
  currentWeek: number;
  totalWeeks?: number;
  estimatedScore?: number;
}

export default function ProgressRing({
  currentWeek,
  totalWeeks = 12,
  estimatedScore,
}: ProgressRingProps) {
  const progress = (currentWeek / totalWeeks) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card variant="white">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-text-primary">12주 진도</h2>
          <p className="text-sm text-text-secondary mt-1">3개월 학습 여정</p>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Background Circle */}
            <svg width="180" height="180" className="transform -rotate-90">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="var(--soft-peach)"
                strokeWidth="12"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--soft-peach)" />
                  <stop offset="100%" stopColor="var(--strawberry-pink)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-pink font-[var(--font-number)]">
                {currentWeek}
              </span>
              <span className="text-sm text-text-secondary">/ {totalWeeks}주</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-peach rounded-xl">
            <p className="text-2xl font-bold text-pink font-[var(--font-number)]">
              {Math.round(progress)}%
            </p>
            <p className="text-xs text-text-secondary mt-1">완료율</p>
          </div>
          <div className="text-center p-3 bg-peach rounded-xl">
            <p className="text-2xl font-bold text-honey font-[var(--font-number)]">
              {estimatedScore || '—'}
            </p>
            <p className="text-xs text-text-secondary mt-1">예상 점수</p>
          </div>
        </div>

        {/* Phase Info */}
        <div className="text-center p-3 bg-cream rounded-xl">
          {currentWeek <= 4 ? (
            <p className="text-sm text-text-primary">
              <span className="font-medium text-pink">Phase 1:</span> 기초 회복 기간 🌱
            </p>
          ) : currentWeek <= 8 ? (
            <p className="text-sm text-text-primary">
              <span className="font-medium text-pink">Phase 2:</span> 약점 집중 공략 💪
            </p>
          ) : (
            <p className="text-sm text-text-primary">
              <span className="font-medium text-pink">Phase 3:</span> 실전 대비 기간 🎯
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
