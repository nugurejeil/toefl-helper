import { supabase } from '@/lib/supabase/client';

export type ContentType = 'vocabulary' | 'reading' | 'listening' | 'speaking' | 'writing';
export type SessionType = 'quick' | 'standard' | 'deep';

interface CreateSessionParams {
  userId: string;
  sessionType: SessionType;
  contentType: ContentType;
}

interface CreateRecordParams {
  userId: string;
  sessionId?: string;
  contentId: string;
  isCorrect?: boolean;
  timeSpentSeconds: number;
  userAnswer: any;
  feedback?: any;
}

interface UpdateSessionParams {
  sessionId: string;
  durationSeconds: number;
  isCompleted: boolean;
}

/**
 * 새로운 학습 세션을 생성합니다.
 */
export async function createLearningSession({
  userId,
  sessionType,
  contentType,
}: CreateSessionParams) {
  try {
    const { data, error } = await supabase
      .from('learning_sessions')
      .insert({
        user_id: userId,
        session_type: sessionType,
        content_type: contentType,
        started_at: new Date().toISOString(),
        is_completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating learning session:', error);
    return { data: null, error };
  }
}

/**
 * 학습 세션을 완료 상태로 업데이트합니다.
 */
export async function updateLearningSession({
  sessionId,
  durationSeconds,
  isCompleted,
}: UpdateSessionParams) {
  try {
    const { data, error } = await supabase
      .from('learning_sessions')
      .update({
        completed_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
        is_completed: isCompleted,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating learning session:', error);
    return { data: null, error };
  }
}

/**
 * 개별 학습 기록을 생성합니다.
 */
export async function createLearningRecord({
  userId,
  sessionId,
  contentId,
  isCorrect,
  timeSpentSeconds,
  userAnswer,
  feedback,
}: CreateRecordParams) {
  try {
    const { data, error } = await supabase
      .from('learning_records')
      .insert({
        user_id: userId,
        session_id: sessionId,
        content_id: contentId,
        is_correct: isCorrect,
        time_spent_seconds: timeSpentSeconds,
        user_answer: userAnswer,
        feedback: feedback,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating learning record:', error);
    return { data: null, error };
  }
}

/**
 * 사용자의 학습 통계를 가져옵니다.
 */
export async function getUserLearningStats(userId: string) {
  try {
    // 총 학습 시간
    const { data: sessions } = await supabase
      .from('learning_sessions')
      .select('duration_seconds')
      .eq('user_id', userId)
      .eq('is_completed', true);

    const totalSeconds = sessions?.reduce(
      (sum, session) => sum + (session.duration_seconds || 0),
      0
    ) || 0;

    // 전체 정답률
    const { data: records } = await supabase
      .from('learning_records')
      .select('is_correct')
      .eq('user_id', userId)
      .not('is_correct', 'is', null);

    const totalRecords = records?.length || 0;
    const correctRecords = records?.filter((r) => r.is_correct).length || 0;
    const accuracy = totalRecords > 0 ? (correctRecords / totalRecords) * 100 : 0;

    // 콘텐츠 타입별 통계
    const { data: sessionsByType } = await supabase
      .from('learning_sessions')
      .select('content_type')
      .eq('user_id', userId)
      .eq('is_completed', true);

    const contentTypeCounts = sessionsByType?.reduce((acc: any, session) => {
      acc[session.content_type] = (acc[session.content_type] || 0) + 1;
      return acc;
    }, {} as Record<ContentType, number>) || {};

    return {
      data: {
        totalSeconds,
        totalHours: Math.floor(totalSeconds / 3600),
        totalMinutes: Math.floor((totalSeconds % 3600) / 60),
        accuracy: Math.round(accuracy),
        totalRecords,
        correctRecords,
        contentTypeCounts,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error getting user learning stats:', error);
    return { data: null, error };
  }
}

/**
 * 콘텐츠 타입별 정답률을 계산합니다.
 */
export async function getAccuracyByContentType(userId: string, contentType: ContentType) {
  try {
    // 해당 콘텐츠 타입의 세션 ID들 가져오기
    const { data: sessions } = await supabase
      .from('learning_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('content_type', contentType);

    if (!sessions || sessions.length === 0) {
      return { data: { accuracy: 0, total: 0, correct: 0 }, error: null };
    }

    const sessionIds = sessions.map((s) => s.id);

    // 해당 세션들의 기록 가져오기
    const { data: records } = await supabase
      .from('learning_records')
      .select('is_correct')
      .in('session_id', sessionIds)
      .not('is_correct', 'is', null);

    const total = records?.length || 0;
    const correct = records?.filter((r) => r.is_correct).length || 0;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;

    return {
      data: {
        accuracy: Math.round(accuracy),
        total,
        correct,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error getting accuracy by content type:', error);
    return { data: null, error };
  }
}

/**
 * 스트릭을 업데이트하거나 생성합니다.
 */
export async function updateStreak(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 사용자의 기존 스트릭 레코드 확인
    const { data: existingStreak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existingStreak) {
      // 첫 학습 - 새 스트릭 레코드 생성
      const { data, error } = await supabase
        .from('streaks')
        .insert({
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    }

    // 마지막 활동 날짜 확인
    const lastActivityDate = existingStreak.last_activity_date;

    // 오늘 이미 학습했는지 확인
    if (lastActivityDate === today) {
      return { data: existingStreak, error: null };
    }

    // 어제 날짜 계산
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newCurrentStreak: number;

    if (lastActivityDate === yesterdayStr) {
      // 연속 학습 - 스트릭 증가
      newCurrentStreak = existingStreak.current_streak + 1;
    } else {
      // 스트릭 끊김 - 1부터 다시 시작
      newCurrentStreak = 1;
    }

    // 최장 스트릭 업데이트
    const newLongestStreak = Math.max(
      newCurrentStreak,
      existingStreak.longest_streak || 0
    );

    // 스트릭 레코드 업데이트
    const { data, error } = await supabase
      .from('streaks')
      .update({
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating streak:', error);
    return { data: null, error };
  }
}
