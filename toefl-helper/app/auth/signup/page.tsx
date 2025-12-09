'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { Button, Input, Card } from '@/components/ui';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    const result = await signUp(email, password, fullName);

    if (result.error) {
      setError(result.error);
    } else {
      // 회원가입 성공 - 이메일 확인 필요 여부 체크
      alert('회원가입이 완료되었습니다! 이메일 확인이 필요한 경우, 받은 이메일을 확인해주세요.');
      router.push('/auth/login');
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
                src="/Toasty_idle.webp"
                alt="Toasty"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-text-primary font-[var(--font-title-en)]">
              TOEFL 80
            </h1>
            <p className="text-text-secondary">
              환영해요! 함께 토플 80점을 향해 가볼까요? 🚀
            </p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="이름"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="홍길동"
              fullWidth
            />

            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              fullWidth
            />

            <Input
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상 입력하세요"
              helperText="8자 이상 입력해주세요"
              fullWidth
            />

            <Input
              label="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              fullWidth
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
              회원가입
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center space-y-2">
            <p className="text-sm text-text-secondary">
              이미 계정이 있으신가요?{' '}
              <Link
                href="/auth/login"
                className="text-pink font-medium hover:underline"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
