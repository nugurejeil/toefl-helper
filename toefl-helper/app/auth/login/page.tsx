'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { Button, Input, Card } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    const result = await signIn(email, password);

    if (result.error) {
      // 더 친절한 에러 메시지
      if (result.error.includes('Email not confirmed')) {
        setError('이메일 확인이 필요합니다. 받은 이메일을 확인해주세요.');
      } else if (result.error.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError(result.error);
      }
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <Card variant="white" size="lg" className="w-full max-w-md">
        <div className="space-y-6">
          {/* Logo & Mascot */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src="/Mochi_idle.webp"
                alt="Mochi"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-text-primary font-[var(--font-title-en)]">
              TOEFL 80
            </h1>
            <p className="text-text-secondary">
              반가워요! 다시 만나서 기뻐요 🎉
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              fullWidth
              error={error && !email ? '이메일을 입력해주세요' : undefined}
            />

            <Input
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              fullWidth
              error={error && !password ? '비밀번호를 입력해주세요' : undefined}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              로그인
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center space-y-2">
            <p className="text-sm text-text-secondary">
              아직 계정이 없으신가요?{' '}
              <Link
                href="/auth/signup"
                className="text-pink font-medium hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
