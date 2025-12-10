'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Error Animation */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
          }}
          className="mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="text-8xl mb-4"
          >
            😵
          </motion.div>
        </motion.div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-cocoa-brown mb-4">
          앗! 문제가 발생했어요
        </h1>
        <p className="text-text-secondary mb-2">
          예상치 못한 오류가 발생했습니다.
        </p>

        {/* Error details in dev mode */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 mb-6 p-4 bg-white rounded-xl text-left">
            <summary className="cursor-pointer font-semibold text-pink mb-2">
              개발자 정보 (상세 오류)
            </summary>
            <pre className="text-xs text-text-secondary overflow-auto max-h-40">
              {error.message}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className="space-y-3 mt-8">
          <Button
            variant="primary"
            onClick={reset}
            className="w-full"
          >
            🔄 다시 시도하기
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard'}
            className="w-full"
          >
            🏠 홈으로 돌아가기
          </Button>
        </div>

        {/* Decorative mascot */}
        <motion.div
          className="mt-12 text-6xl"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          🐹
        </motion.div>
        <p className="mt-4 text-sm text-text-secondary">
          모찌가 문제를 해결하려고 노력 중이에요!
        </p>
      </motion.div>
    </div>
  );
}
