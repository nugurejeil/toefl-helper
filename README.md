# TOEFL 80

바쁜 직장인을 위한 3개월 토플 학습 웹앱

## 프로젝트 개요

TOEFL 80은 풀타임 직장인이 3개월 안에 토플 80점대를 달성할 수 있도록 설계된 모바일 학습 앱입니다. 평일 9-6 근무, 육아 등 시간적 제약이 있는 사용자가 출퇴근 시간, 점심시간, 아이들 취침 후 등 자투리 시간을 활용하여 효율적으로 학습할 수 있습니다.

## 기술 스택

- **Frontend**: Next.js 16 (App Router)
- **Backend**: Supabase
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **State Management**: Zustand
- **TypeScript**: 5.x

## 디자인 시스템

### 컬러 팔레트

- **Warm Cream** (`#FDF6E3`) - 메인 배경색
- **Soft Peach** (`#FFECD2`) - 카드 배경
- **Strawberry Pink** (`#E8A0A0`) - Primary 버튼
- **Honey Brown** (`#D4A574`) - Secondary 버튼
- **Cocoa Brown** (`#8B6F5C`) - 텍스트
- **Mint Green** (`#A8D5BA`) - 성공 상태
- **Butter Yellow** (`#F4D03F`) - 경고 알림

### 폰트

- **한글**: Pretendard Variable
- **영어 제목**: Quicksand
- **영어 본문**: Nunito
- **숫자/강조**: Baloo 2

### 마스코트 캐릭터

- 🐹 **모찌 (Mochi)** - 단어 학습 담당 햄스터
- 🐱 **토스티 (Toasty)** - 리딩 담당 고양이
- 🐻‍❄️ **코코 (Coco)** - 리스닝 담당 북극곰
- 🦊 **러스티 (Rusty)** - 스피킹 담당 여우
- 🐰 **페니 (Penny)** - 라이팅 담당 토끼

## 시작하기

### 1. 패키지 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 파일을 생성하고, Supabase 및 OpenAI API 키를 설정하세요.

```bash
cp .env.local.example .env.local
```

필요한 환경 변수:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 프로젝트 구조

```
toefl-helper/
├── app/                    # Next.js App Router
│   ├── auth/              # 인증 관련 페이지
│   │   ├── login/         # 로그인 페이지
│   │   └── signup/        # 회원가입 페이지
│   ├── layout.tsx         # 루트 레이아웃 (폰트 설정)
│   ├── page.tsx           # 메인 페이지 (디자인 시스템 데모)
│   └── globals.css        # 글로벌 스타일 (디자인 토큰)
├── components/
│   ├── layout/            # 레이아웃 컴포넌트
│   │   ├── Header.tsx     # 헤더 (오늘의 마스코트)
│   │   ├── BottomNav.tsx  # 하단 네비게이션
│   │   ├── PageLayout.tsx # 페이지 레이아웃 wrapper
│   │   └── index.ts       # export
│   └── ui/                # 재사용 가능한 UI 컴포넌트
│       ├── Button.tsx     # 버튼 컴포넌트
│       ├── Card.tsx       # 카드 컴포넌트
│       ├── Input.tsx      # 입력 필드 컴포넌트
│       ├── ProgressBar.tsx # 프로그레스 바 컴포넌트
│       ├── Badge.tsx      # 뱃지 컴포넌트
│       └── index.ts       # export
├── lib/
│   └── supabase/
│       └── client.ts      # Supabase 클라이언트 설정
├── store/                 # Zustand 상태 관리
│   └── authStore.ts       # 인증 스토어
├── supabase/              # Supabase 관련 파일
│   ├── migrations/        # DB 마이그레이션
│   │   └── 20241202_initial_schema.sql
│   └── DATABASE_SCHEMA.md # DB 스키마 문서
├── public/                # 정적 파일
│   ├── Mochi_idle.webp   # 모찌 캐릭터
│   ├── Toasty_idle.webp  # 토스티 캐릭터
│   ├── Coco_idle.webp    # 코코 캐릭터
│   ├── Rusty_idle.webp   # 러스티 캐릭터
│   └── Penny_idle.webp   # 페니 캐릭터
├── TOEFL80_PRD_v2.md     # 제품 요구사항 문서
├── TOEFL80_TODO.md       # 구현 Todo 리스트
└── README.md             # 프로젝트 문서
```

## UI 컴포넌트

### Button

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">클릭</Button>
<Button variant="secondary" size="lg">클릭</Button>
<Button variant="outline" isLoading>로딩중...</Button>
```

### Card

```tsx
import { Card } from '@/components/ui';

<Card variant="cream" hoverable>
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</Card>
```

### Input

```tsx
import { Input } from '@/components/ui';

<Input
  label="이메일"
  type="email"
  placeholder="example@email.com"
  fullWidth
/>
```

### ProgressBar

```tsx
import { ProgressBar } from '@/components/ui';

<ProgressBar value={75} showLabel size="md" />
```

### Badge

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">완료</Badge>
<Badge variant="warning">주의</Badge>
```

## Phase 1 완료 항목

### 프로젝트 셋업
- ✅ Next.js 프로젝트 초기화
- ✅ Supabase, Framer Motion, Zustand 설치
- ✅ Tailwind CSS 커스텀 컬러 토큰 정의
- ✅ 폰트 설정 (Pretendard, Quicksand, Nunito, Baloo 2)
- ✅ 환경 변수 템플릿 생성
- ✅ Supabase 클라이언트 설정

### 디자인 시스템
- ✅ 기본 UI 컴포넌트 구현 (Button, Card, Input, ProgressBar, Badge)
- ✅ 캐릭터 이미지 통합 (5개 마스코트)
- ✅ 디자인 시스템 데모 페이지

### 레이아웃
- ✅ Header 컴포넌트 (오늘의 마스코트 인사)
- ✅ Bottom Navigation (모바일 네비게이션)
- ✅ PageLayout 컴포넌트

### 인증 시스템
- ✅ Zustand 인증 스토어
- ✅ 로그인 페이지 (`/auth/login`)
- ✅ 회원가입 페이지 (`/auth/signup`)
- ✅ 로그아웃 기능

### 데이터베이스
- ✅ DB 스키마 설계 (6개 테이블)
- ✅ Supabase 마이그레이션 파일
- ✅ RLS 정책 설정
- ✅ Functions & Triggers

## 배포

### Vercel 배포

이 프로젝트는 Vercel에 최적화되어 있습니다.

#### 1. Vercel에 배포하기

```bash
# Vercel CLI 설치 (아직 설치하지 않았다면)
pnpm add -g vercel

# 배포
vercel
```

또는 GitHub 저장소를 Vercel에 연결하여 자동 배포를 설정할 수 있습니다.

#### 2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

**필수 환경 변수:**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anonymous Key
- `OPENAI_API_KEY`: OpenAI API 키 (Whisper STT용)
- `ANTHROPIC_API_KEY`: Anthropic API 키 (Claude 피드백용)

#### 3. 빌드 설정

Vercel은 자동으로 Next.js 프로젝트를 감지하지만, 다음 설정을 확인하세요:

- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next` (자동 설정)
- **Install Command**: `pnpm install`

#### 4. 성능 최적화

- ✅ 이미지 최적화 (WebP, AVIF 지원)
- ✅ 자동 코드 스플리팅
- ✅ 서버 컴포넌트 활용
- ✅ 압축 활성화
- ✅ 보안 헤더 설정

### 빌드 및 프로덕션

```bash
# 로컬에서 프로덕션 빌드 테스트
pnpm build
pnpm start
```

## 프로젝트 진행 상황

자세한 내용은 `TOEFL80_TODO.md`를 참고하세요.

### 완료된 Phase
- ✅ Phase 1: 기반 구축 + 디자인 시스템
- ✅ Phase 2: 핵심 학습 기능
- ✅ Phase 3: AI 통합
- ✅ Phase 4: 개인화 & 진도관리
- 🚧 Phase 5: Polish & 출시 (진행 중)

## 문서

- [Product Requirements Document](./TOEFL80_PRD_v2.md) - 제품 요구사항 문서
- [Todo List](./TOEFL80_TODO.md) - 구현 Todo 리스트

## 라이선스

이 프로젝트는 교육 목적으로 개발되었습니다.
