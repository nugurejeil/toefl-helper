'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <Card variant="peach" hoverable>
      <div className="flex items-center gap-4">
        {/* Fire Icon */}
        <motion.div
          className="text-5xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          🔥
        </motion.div>

        {/* Streak Info */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-pink font-[var(--font-number)]">
              {currentStreak}
            </span>
            <span className="text-sm text-text-secondary">일 연속</span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            최장 기록: <span className="font-medium text-text-primary">{longestStreak}일</span>
          </p>
        </div>

        {/* Encouragement Message */}
        <div className="hidden md:block text-right">
          {currentStreak === 0 ? (
            <p className="text-sm text-text-secondary">오늘부터 시작해보세요!</p>
          ) : currentStreak < 7 ? (
            <p className="text-sm text-pink font-medium">좋아요! 계속 가봐요! 💪</p>
          ) : currentStreak < 30 ? (
            <p className="text-sm text-pink font-medium">대단해요! 한 달까지 조금만 더! 🎉</p>
          ) : (
            <p className="text-sm text-pink font-medium">완벽해요! 습관이 되었네요! 🌟</p>
          )}
        </div>
      </div>
    </Card>
  );
}
