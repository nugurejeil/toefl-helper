'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';

const features = [
  {
    icon: '📚',
    title: '스마트 단어 학습',
    description: '모찌와 함께하는 재미있는 플래시카드로 필수 TOEFL 단어를 마스터하세요',
    character: '/Mochi_idle.webp',
    color: 'from-butter-yellow/20 to-soft-peach/20',
  },
  {
    icon: '📖',
    title: '실전 리딩 연습',
    description: '토스티가 안내하는 실제 TOEFL 유형의 지문으로 읽기 실력을 향상시키세요',
    character: '/Toasty_idle.webp',
    color: 'from-soft-peach/20 to-strawberry-pink/20',
  },
  {
    icon: '🎧',
    title: '리스닝 완벽 대비',
    description: '코코와 함께 다양한 주제의 오디오로 듣기 능력을 키우세요',
    character: '/Coco_idle.webp',
    color: 'from-mint-green/20 to-warm-cream',
  },
  {
    icon: '🎤',
    title: 'AI 스피킹 분석',
    description: '러스티가 여러분의 발음과 유창성을 실시간으로 분석하고 피드백을 제공합니다',
    character: '/Rusty_idle.webp',
    color: 'from-strawberry-pink/20 to-honey-brown/20',
  },
  {
    icon: '✍️',
    title: '라이팅 첨삭',
    description: '페니와 함께 에세이 작성 능력을 향상시키고 상세한 피드백을 받으세요',
    character: '/Penny_idle.webp',
    color: 'from-honey-brown/20 to-soft-peach/20',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      className="relative overflow-hidden"
    >
      <div
        className={`bg-gradient-to-br ${feature.color} rounded-3xl p-12 md:p-16 min-h-[500px] flex flex-col justify-between backdrop-blur-sm`}
      >
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
            className="text-6xl mb-6"
          >
            {feature.icon}
          </motion.div>
          <h3 className="text-3xl md:text-4xl font-bold text-cocoa-brown mb-4 font-[var(--font-title-en)]">
            {feature.title}
          </h3>
          <p className="text-lg text-text-secondary leading-relaxed">
            {feature.description}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
          className="flex justify-center mt-8"
        >
          <Image
            src={feature.character}
            alt={feature.title}
            width={120}
            height={120}
            className="object-contain"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { user, initialize } = useAuthStore();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // 로그인된 사용자면 아무것도 렌더링하지 않음
  if (user) {
    return null;
  }

  return (
    <div className="bg-warm-cream overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="min-h-screen flex items-center justify-center px-4 relative"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold text-cocoa-brown mb-6 font-[var(--font-title-en)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              TOEFL 80
            </motion.h1>

            <motion.p
              className="text-2xl md:text-3xl text-text-secondary mb-4 font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              AI와 함께하는 똑똑한 TOEFL 학습
            </motion.p>

            <motion.p
              className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              귀여운 동물 친구들과 함께 매일 즐겁게 학습하며,
              <br />
              목표 점수 80점을 향해 나아가세요
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/auth/signup">
                <Button variant="primary" size="lg" className="px-12 py-6 text-lg">
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="px-12 py-6 text-lg">
                  로그인
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Mascot Characters - Zigzag Layout */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20 flex justify-center items-end gap-8 flex-wrap"
          >
            {[
              { src: '/Mochi_idle.webp', offset: 0 },
              { src: '/Toasty_idle.webp', offset: -40 },
              { src: '/Coco_idle.webp', offset: 20 },
              { src: '/Rusty_idle.webp', offset: -30 },
              { src: '/Penny_idle.webp', offset: 10 },
            ].map((item, i) => (
              <motion.div
                key={item.src}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1.2 + i * 0.1,
                }}
                whileHover={{
                  scale: 1.2,
                  y: item.offset - 10,
                  transition: { duration: 0.2 },
                }}
                style={{ marginBottom: `${item.offset}px` }}
              >
                <Image
                  src={item.src}
                  alt="Mascot"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-text-secondary"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-cocoa-brown mb-6 font-[var(--font-title-en)]">
              완벽한 학습 경험
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              5가지 영역을 체계적으로 학습하고
              <br />
              AI의 도움으로 실력을 빠르게 향상시키세요
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.slice(0, 4).map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>

          {/* 5번째 카드는 가운데 정렬 */}
          <div className="mt-8 max-w-2xl mx-auto">
            <FeatureCard feature={features[4]} index={4} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-warm-cream to-soft-peach">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-cocoa-brown mb-20 font-[var(--font-title-en)]">
              검증된 학습 효과
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { number: '2000+', label: '필수 단어' },
                { number: '100+', label: '실전 문제' },
                { number: 'AI', label: '실시간 피드백' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="text-6xl md:text-7xl font-bold text-strawberry-pink mb-4 font-baloo">
                    {stat.number}
                  </div>
                  <div className="text-xl text-text-secondary">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-cocoa-brown mb-8 font-[var(--font-title-en)]">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-text-secondary mb-12">
            회원가입은 무료이며, 언제든지 시작할 수 있습니다
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="px-16 py-6 text-lg">
                회원가입하고 시작하기
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-text-secondary">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-strawberry-pink font-medium hover:underline">
              로그인
            </Link>
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-warm-cream">
        <div className="max-w-6xl mx-auto text-center text-text-secondary">
          <p className="text-sm">
            © 2026 TOEFL 80. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
