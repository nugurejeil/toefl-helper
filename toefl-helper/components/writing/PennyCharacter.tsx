'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface PennyCharacterProps {
  state: 'idle' | 'writing' | 'thinking' | 'encouraging';
  message?: string;
}

export default function PennyCharacter({
  state,
  message,
}: PennyCharacterProps) {
  const getStateMessage = () => {
    if (message) return message;

    switch (state) {
      case 'idle':
        return '안녕! 나는 페니야. 라이팅 연습을 도와줄게!';
      case 'writing':
        return '좋아! 네 생각을 자유롭게 표현해봐!';
      case 'thinking':
        return '음... 네 글을 꼼꼼히 읽어보고 있어!';
      case 'encouraging':
        return '훌륭한 글이야! 많이 발전했어!';
      default:
        return '';
    }
  };

  const bounceAnimation = {
    idle: {
      y: [0, -12, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 0.8,
      },
    },
    writing: {
      y: [0, -8, 0, -4, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatDelay: 0.3,
      },
    },
    thinking: {
      y: [0, -3, 0],
      rotate: [0, -2, 2, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
      },
    },
    encouraging: {
      y: [0, -20, -5, -15, 0],
      scale: [1, 1.05, 1, 1.05, 1],
      transition: {
        duration: 0.8,
        repeat: 3,
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      {/* Character image */}
      <motion.div className="w-40 h-40" animate={bounceAnimation[state]}>
        <Image
          src="/Penny_idle.webp"
          alt="Penny the Rabbit"
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
