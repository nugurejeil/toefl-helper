# TOEFL 80 구현 Todo 리스트

## Phase 1: 기반 구축 + 디자인 시스템 ✅ **완료**

### 프로젝트 셋업 ✅
- [x] Next.js 프로젝트 초기화
- [x] 필요한 패키지 설치 (Supabase, Framer Motion, Zustand)
- [x] Tailwind CSS 4 설정
- [x] 환경 변수 템플릿 생성 (.env.local.example)
- [x] Supabase 클라이언트 설정 (lib/supabase/client.ts)
- [ ] Supabase 프로젝트 생성 및 실제 연동 (사용자가 직접 설정 필요)

### 디자인 시스템 구축 ✅
- [x] 컬러 토큰 정의 (app/globals.css)
  - [x] Warm Cream: `#FDF6E3`
  - [x] Soft Peach: `#FFECD2`
  - [x] Strawberry Pink: `#E8A0A0`
  - [x] Honey Brown: `#D4A574`
  - [x] Cocoa Brown: `#8B6F5C`
  - [x] Mint Green: `#A8D5BA`
  - [x] Butter Yellow: `#F4D03F`
- [x] 폰트 설정 (app/layout.tsx)
  - [x] Pretendard Variable (한글)
  - [x] Quicksand (영어 제목)
  - [x] Nunito (영어 본문)
  - [x] Baloo 2 (숫자/강조)
- [x] 기본 spacing, border-radius, shadow 토큰 정의

### 기본 UI 컴포넌트 ✅
- [x] Button 컴포넌트 (Primary/Secondary/Outline variants)
- [x] Card 컴포넌트 (Cream/Peach/White variants, hoverable)
- [x] Input 컴포넌트 (에러 상태, 헬퍼 텍스트)
- [x] ProgressBar 컴포넌트 (그라데이션, 애니메이션)
- [x] Badge 컴포넌트 (Success/Warning/Info/Default)
- [x] UI 컴포넌트 index 파일 (components/ui/index.ts)

### 마스코트 캐릭터 에셋 ✅
- [x] 모찌 (햄스터) idle 이미지 - 단어 섹션
- [x] 토스티 (고양이) idle 이미지 - 리딩 섹션
- [x] 코코 (북극곰) idle 이미지 - 리스닝 섹션
- [x] 러스티 (여우) idle 이미지 - 스피킹 섹션
- [x] 페니 (토끼) idle 이미지 - 라이팅 섹션
- [x] 데모 페이지에 캐릭터 이미지 통합

### 레이아웃 컴포넌트 ✅
- [x] Header (캐릭터 인사 포함) - components/layout/Header.tsx
- [x] Bottom Navigation (아이콘 + 라벨) - components/layout/BottomNav.tsx
- [x] 기본 페이지 레이아웃 - components/layout/PageLayout.tsx
- [x] 레이아웃 컴포넌트 index 파일
- [ ] 종이 텍스처 배경 적용

### 인증 ✅ **완료**
- [x] Zustand 인증 스토어 (store/authStore.ts)
- [x] 회원가입 페이지 (app/auth/signup/page.tsx)
- [x] 로그인 페이지 (app/auth/login/page.tsx)
- [x] 로그아웃 기능 (authStore에 포함)
- [x] 인증 상태 관리 (Zustand + Supabase)
- [x] Supabase 프로젝트 실제 연동
- [x] 헤더에 로그인/회원가입 버튼 추가
- [x] 로그인 후 프로필 드롭다운 메뉴 (프로필, 설정, 로그아웃)
- [x] 에러 메시지 개선 (이메일 확인, 잘못된 인증 정보)
- [x] 회원가입 후 이메일 확인 안내

### DB 스키마 설계 ✅
- [x] profiles 테이블 (프로필, 설정)
- [x] contents 테이블 (학습 콘텐츠)
- [x] learning_sessions 테이블 (세션 정의)
- [x] learning_records 테이블 (학습 기록)
- [x] streaks 테이블 (스트릭 추적)
- [x] user_progress 테이블 (진도 관리)
- [x] RLS 정책 설정
- [x] Functions & Triggers
- [x] 마이그레이션 파일 (supabase/migrations/20241202_initial_schema.sql)
- [x] DB 스키마 문서 (supabase/DATABASE_SCHEMA.md)

---

## Phase 2: 핵심 학습 기능

### 랜딩 페이지 ✅ **완료**
- [x] 애플 스타일 Hero 섹션 (대형 타이포그래피, fade-in 애니메이션)
- [x] 5마리 캐릭터 지그재그 레이아웃 (hover 효과)
- [x] 5개 기능 소개 카드 (스크롤 애니메이션)
- [x] 통계 섹션 (scale 애니메이션)
- [x] CTA 버튼 (회원가입/로그인)
- [x] 로그인 사용자 자동 리다이렉트 (→ /dashboard)

### 대시보드 (홈 화면) ✅ **완료**
- [x] 오늘의 마스코트 인사 헤더 (Header 컴포넌트에 포함)
- [x] 스트릭 카운터 (불꽃 아이콘) - components/home/StreakCounter.tsx
- [x] 학습 카드 그리드 (5개 섹션, 캐릭터 표시) - components/home/LearningCardGrid.tsx
- [x] 오늘의 학습 플랜 카드 - components/home/TodaysPlan.tsx
- [x] 진도 프로그레스 링 - components/home/ProgressRing.tsx
- [x] Quick Stats (암기 단어, 완료 리딩/리스닝, 학습 시간)
- [x] 대시보드 페이지 (app/dashboard/page.tsx)
- [x] 인증 보호 (비로그인 시 랜딩 페이지로 리다이렉트)

### 진단 테스트 ✅ **완료**
- [x] 진단 테스트 시작 페이지
- [x] 리딩 샘플 문제 UI
- [x] 리스닝 샘플 문제 UI (오디오 플레이어)
- [x] 점수 계산 로직
- [x] 결과 페이지 (섹션별 분석)
- [x] 오디오 파일 연동
- [x] 문제별 상태 초기화
- [x] 선택 버튼 시각적 피드백 개선

### 단어 학습 (모찌 햄스터) ✅ **완료**
- [x] 플래시카드 컴포넌트 (뒤집기 애니메이션)
- [x] 모찌 캐릭터 반응 (정답/오답)
- [x] 단어장 데이터 시드 (20개 단어)
- [x] 정답/오답 기록 저장
- [x] 5분 Quick Session 완료 플로우

### 리딩 학습 (토스티 고양이) ✅ **완료**
- [x] 지문 뷰어 컴포넌트
- [x] 문제 풀이 UI (객관식)
- [x] 토스티 캐릭터 반응
- [x] 해설 표시
- [x] 10분 Standard Session 완료 플로우
- [x] 3개의 리딩 지문 (Coffee, Sleep, Urban Green Spaces)
- [x] 각 지문당 3문제 (총 9문제)
- [x] 분할 레이아웃 (지문 | 문제)

### 리스닝 학습 (코코 북극곰) ✅ **완료**
- [x] 오디오 플레이어 컴포넌트 (진단 테스트에서 재사용)
- [x] 코코 캐릭터 표시 및 반응 애니메이션
- [x] 문제 풀이 UI
- [x] 10분 Standard Session 완료 플로우
- [x] 3개의 리스닝 지문 (Art History, Biology, Office Hours)
- [x] 각 지문당 3문제 (총 9문제)
- [x] 오디오 재생 및 트랜스크립트 표시

---

## Phase 3: AI 통합

### 스피킹 연습 (러스티 여우) ✅ **완료**
- [x] 마이크 녹음 기능 (Web Audio API)
- [x] 녹음 버튼 UI
- [x] 녹음 중 웨이브 애니메이션
- [x] Whisper API 연동 (STT)
- [x] Claude API 연동 (피드백 생성)
- [x] 피드백 결과 UI
- [x] 러스티 캐릭터 컴포넌트
- [x] 준비 시간 타이머
- [x] 답변 시간 제한
- [x] 3개의 스피킹 프롬프트 (Independent Task)
- [x] 점수 평가 (발음, 언어 사용, 주제 전개)
- [x] 상세 피드백 (강점, 개선점, 제안)

### 라이팅 연습 (페니 토끼) ✅ **완료**
- [x] 텍스트 에디터 컴포넌트
- [x] 글자수/시간 제한 표시
- [x] 페니 캐릭터 표시
- [x] Claude API 연동 (피드백 생성)
- [x] 피드백 결과 UI
- [x] 3개의 라이팅 프롬프트 (Independent & Integrated)
- [x] 점수 평가 (구성, 전개, 언어 사용, 문법)
- [x] 상세 피드백 (강점, 개선점, 제안)
- [x] 실시간 타이머 및 단어 수 카운터

---

## Phase 4: 개인화 & 진도관리 ✅ **완료**

### 학습 기록 시스템 ✅
- [x] 학습 기록 저장 유틸리티 함수 생성 (lib/utils/learningRecords.ts)
- [x] 단어 학습에 기록 저장 통합
- [x] 리딩 학습에 기록 저장 통합
- [x] 리스닝 학습에 기록 저장 통합
- [x] 스피킹 학습에 기록 저장 통합
- [x] 라이팅 학습에 기록 저장 통합
- [x] 스트릭 시스템 구현 (연속 학습 일수 추적)
- [x] 데이터베이스 스키마 수정 (content_id TEXT 타입 변경)

### 대시보드 실시간 데이터 통합 ✅
- [x] 스트릭 카운터 (실제 데이터 연동)
- [x] 오늘의 학습 플랜 (완료 세션 자동 체크)
- [x] 학습 통계 표시 (총 시간, 정답률, 문제 수)
- [x] 예상 TOEFL 점수 계산 (정답률 기반)
- [x] Supabase 실시간 데이터 로드

### 적응형 학습 (향후 구현)
- [ ] 난이도 조절 알고리즘
- [ ] 약점 섹션 분석
- [ ] 맞춤 콘텐츠 추천

### 대시보드 추가 기능 (향후 구현)
- [ ] 12주 커리큘럼 진도 바
- [ ] 주간 학습 통계 차트
- [ ] 일일 목표 설정 & 달성률

---

## Phase 5: Polish & 출시

### 애니메이션 ✅
- [x] 페이지 전환 애니메이션
- [x] 버튼 호버/탭 애니메이션
- [x] 로딩 애니메이션
- [x] 정답 축하 파티클 효과

### 최적화 & 배포 ✅
- [x] 이미지 최적화
- [x] 에러 핸들링
- [x] Vercel 배포 설정
- [ ] 도메인 연결 (사용자 설정 필요)

---

## 컬러 Quick Reference

```css
/* Primary Colors */
--warm-cream: #FDF6E3;
--soft-peach: #FFECD2;
--strawberry-pink: #E8A0A0;
--honey-brown: #D4A574;
--cocoa-brown: #8B6F5C;

/* Status Colors */
--mint-green: #A8D5BA;
--butter-yellow: #F4D03F;

/* Text Colors */
--text-primary: #3D3D3D;
--text-secondary: #7A7A7A;

/* Border Radius */
--radius-sm: 8px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-full: 9999px;

/* Shadows */
--shadow-soft: 0 4px 12px rgba(139, 111, 92, 0.1);
--shadow-card: 0 8px 24px rgba(139, 111, 92, 0.15);
```
