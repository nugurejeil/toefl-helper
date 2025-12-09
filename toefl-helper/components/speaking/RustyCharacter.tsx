'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface RustyCharacterProps {
  state: 'idle' | 'listening' | 'thinking' | 'encouraging';
  message?: string;
}

export default function RustyCharacter({
  state,
  message,
}: RustyCharacterProps) {
  const getStateMessage = () => {
    if (message) return message;

    switch (state) {
      case 'idle':
        return '안녕! 나는 러스티야. 스피킹 연습을 도와줄게!';
      case 'listening':
        return '잘 듣고 있어! 편하게 말해봐!';
      case 'thinking':
        return '흠... 네 답변을 분석하고 있어!';
      case 'encouraging':
        return '정말 잘했어! 계속 이렇게 하면 돼!';
      default:
        return '';
    }
  };

  const bounceAnimation = {
    idle: {
      y: [0, -8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    listening: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    thinking: {
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
      },
    },
    encouraging: {
      scale: [1, 1.1, 1],
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: 3,
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      {/* Character image */}
      <motion.div
        className="w-40 h-40"
        animate={bounceAnimation[state]}
      >
        <Image
          src="/Rusty_idle.webp"
          alt="Rusty the Fox"
          width={160}
          height={160}
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white px-6 py-3 rounded-2xl shadow-card max-w-md"
      >
        {/* Triangle pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />

        <p className="relative text-center text-cocoa-brown font-pretendard">
          {getStateMessage()}
        </p>
      </motion.div>
    </div>
  );
}
