'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';

interface Mascot {
  name: string;
  koreanName: string;
  image: string;
  greeting: string;
}

const mascots: Mascot[] = [
  {
    name: 'Mochi',
    koreanName: '모찌',
    image: '/Mochi_idle.webp',
    greeting: '안녕! 오늘도 열심히 단어 외워볼까?',
  },
  {
    name: 'Toasty',
    koreanName: '토스티',
    image: '/Toasty_idle.webp',
    greeting: '오늘의 리딩 준비됐어? 함께 읽어보자!',
  },
  {
    name: 'Coco',
    koreanName: '코코',
    image: '/Coco_idle.webp',
    greeting: '귀 기울여봐! 오늘도 리스닝 연습하자~',
  },
  {
    name: 'Rusty',
    koreanName: '러스티',
    image: '/Rusty_idle.webp',
    greeting: '목소리 내는 거 부끄럽지 않아. 같이 연습해보자!',
  },
  {
    name: 'Penny',
    koreanName: '페니',
    image: '/Penny_idle.webp',
    greeting: '생각을 글로 표현하는 시간! 오늘도 화이팅!',
  },
];

export default function Header() {
  const [todayMascot, setTodayMascot] = useState<Mascot>(mascots[0]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut, initialize } = useAuthStore();

  useEffect(() => {
    // 매일 다른 마스코트를 보여주기 (날짜 기반)
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const mascotIndex = dayOfYear % mascots.length;
    setTodayMascot(mascots[mascotIndex]);

    // 인증 상태 초기화
    initialize();
  }, [initialize]);

  return (
    <header className="bg-white shadow-[var(--shadow-soft)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={user ? '/dashboard' : '/'}>
              <h1 className="text-2xl font-bold text-text-primary font-[var(--font-title-en)] cursor-pointer hover:text-honey-brown transition-colors">
                TOEFL 80
              </h1>
            </Link>
          </div>

          {/* Today's Mascot Greeting */}
          <motion.div
            className="hidden md:flex items-center gap-3 bg-peach px-4 py-1.5 rounded-full h-12"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={todayMascot.image}
              alt={todayMascot.name}
              width={36}
              height={36}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xs text-text-secondary">
                오늘의 친구: {todayMascot.koreanName}
              </span>
              <span className="text-sm font-medium text-text-primary">
                {todayMascot.greeting}
              </span>
            </div>
          </motion.div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              // 로그인된 상태
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-warm-cream transition-colors"
                >
                  <div className="w-8 h-8 bg-strawberry-pink rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-text-primary">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-card border border-warm-cream py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-warm-cream transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      내 프로필
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-warm-cream transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      설정
                    </Link>
                    <hr className="my-2 border-warm-cream" />
                    <button
                      onClick={() => {
                        signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-strawberry-pink hover:bg-warm-cream transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // 로그인 안된 상태
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
