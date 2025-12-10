'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
          }}
          className="mb-8"
        >
          <div className="text-9xl font-bold text-pink font-[var(--font-number)] mb-4">
            404
          </div>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="text-6xl mb-4"
          >
            🤔
          </motion.div>
        </motion.div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-cocoa-brown mb-4">
          페이지를 찾을 수 없어요
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          앗! 찾으시는 페이지가 존재하지 않거나 이동했어요.
          <br />
          주소를 다시 확인해주세요.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/dashboard">
            <Button variant="primary" className="w-full">
              🏠 홈으로 돌아가기
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              랜딩 페이지로 가기
            </Button>
          </Link>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="mt-12 flex justify-center gap-4 text-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {['🐹', '🐱', '🐻‍❄️', '🦊', '🐰'].map((emoji, index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
