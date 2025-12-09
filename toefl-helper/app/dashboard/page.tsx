'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { PageLayout } from '@/components/layout';
import {
  StreakCounter,
  LearningCardGrid,
  TodaysPlan,
  ProgressRing,
  DiagnosticTestBanner,
} from '@/components/home';
import { supabase } from '@/lib/supabase/client';
import { getUserLearningStats } from '@/lib/utils/learningRecords';

export default function DashboardPage() {
  const router = useRouter();
  const { user, initialize, isInitialized } = useAuthStore();
  const [dashboardData, setDashboardData] = useState({
    streak: { current: 0, longest: 0 },
    progress: { currentWeek: 1, totalWeeks: 12, estimatedScore: 0 },
    todaysPlan: [] as any[],
    stats: {
      totalSeconds: 0,
      totalHours: 0,
      totalMinutes: 0,
      accuracy: 0,
      totalRecords: 0,
      correctRecords: 0,
    },
    isLoading: true,
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  // 인증 체크
  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/');
    }
  }, [user, isInitialized, router]);

  // 대시보드 데이터 로드
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        // 1. 스트릭 데이터 가져오기
        const { data: streakData } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // 2. 학습 통계 가져오기
        const { data: stats } = await getUserLearningStats(user.id);

        // 3. 오늘 완료한 세션 가져오기
        const today = new Date().toISOString().split('T')[0];
        const { data: todaySessions } = await supabase
          .from('learning_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_completed', true)
          .gte('completed_at', `${today}T00:00:00`)
          .lte('completed_at', `${today}T23:59:59`);

        // 오늘의 학습 플랜 생성
        const contentTypeEmojis: Record<string, string> = {
          vocabulary: '🐹',
          reading: '🐱',
          listening: '🐻‍❄️',
          speaking: '🦊',
          writing: '🐰',
        };

        const contentTypeNames: Record<string, string> = {
          vocabulary: '단어 학습',
          reading: '리딩 연습',
          listening: '리스닝 연습',
          speaking: '스피킹 연습',
          writing: '라이팅 연습',
        };

        const allContentTypes = ['vocabulary', 'reading', 'listening', 'speaking', 'writing'];
        const completedTypes = new Set(todaySessions?.map((s) => s.content_type) || []);

        const todaysPlan = allContentTypes.map((type) => ({
          title: contentTypeNames[type],
          emoji: contentTypeEmojis[type],
          completed: completedTypes.has(type),
          duration: type === 'vocabulary' ? '5분' : '10분',
        }));

        // 예상 점수 계산 (정확도 기반)
        const estimatedScore = stats?.accuracy
          ? Math.min(120, Math.round(30 + (stats.accuracy / 100) * 90))
          : 0;

        setDashboardData({
          streak: {
            current: streakData?.current_streak || 0,
            longest: streakData?.longest_streak || 0,
          },
          progress: {
            currentWeek: 1,
            totalWeeks: 12,
            estimatedScore,
          },
          todaysPlan,
          stats: stats || {
            totalSeconds: 0,
            totalHours: 0,
            totalMinutes: 0,
            accuracy: 0,
            totalRecords: 0,
            correctRecords: 0,
          },
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setDashboardData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // 로딩 중이거나 로그인 안된 경우
  if (!isInitialized || !user || dashboardData.isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-strawberry-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            안녕하세요, {user.user_metadata?.full_name || '학습자'}님! 👋
          </h1>
          <p className="text-text-secondary">
            오늘도 토플 80점을 향해 한 걸음 더 나아가볼까요?
          </p>
        </div>

        {/* Streak Counter */}
        <StreakCounter
          currentStreak={dashboardData.streak.current}
          longestStreak={dashboardData.streak.longest}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Learning Cards & Plan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Plan */}
            <TodaysPlan planItems={dashboardData.todaysPlan} />

            {/* Diagnostic Test Banner */}
            <DiagnosticTestBanner />

            {/* Learning Cards Grid */}
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                학습 섹션 선택
              </h2>
              <LearningCardGrid />
            </div>
          </div>

          {/* Right Column - Progress Ring */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ProgressRing
                currentWeek={dashboardData.progress.currentWeek}
                totalWeeks={dashboardData.progress.totalWeeks}
                estimatedScore={dashboardData.progress.estimatedScore}
              />
            </div>
          </div>
        </div>

        {/* Learning Stats */}
        {dashboardData.stats.totalRecords > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              📊 학습 통계
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-mint-green font-[var(--font-number)]">
                  {dashboardData.stats.totalHours}
                </div>
                <div className="text-sm text-text-secondary mt-1">시간</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-honey-brown font-[var(--font-number)]">
                  {dashboardData.stats.totalMinutes}
                </div>
                <div className="text-sm text-text-secondary mt-1">분</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-strawberry-pink font-[var(--font-number)]">
                  {dashboardData.stats.accuracy}%
                </div>
                <div className="text-sm text-text-secondary mt-1">정답률</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cocoa-brown font-[var(--font-number)]">
                  {dashboardData.stats.totalRecords}
                </div>
                <div className="text-sm text-text-secondary mt-1">문제</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
