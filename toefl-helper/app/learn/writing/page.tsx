'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PennyCharacter from '@/components/writing/PennyCharacter';
import WritingEditor from '@/components/writing/WritingEditor';
import PercentageLoader from '@/components/ui/PercentageLoader';
import { writingPrompts } from '@/lib/data/writingData';
import { WritingPrompt, WritingFeedback } from '@/lib/types/writing';
import { ChevronRight, RotateCcw, BookOpen } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import {
  createLearningSession,
  updateLearningSession,
  updateStreak,
  createLearningRecord,
} from '@/lib/utils/learningRecords';

type Phase = 'intro' | 'writing' | 'processing' | 'feedback' | 'complete';

export default function WritingPage() {
  const { user } = useAuthStore();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState<WritingPrompt>(
    writingPrompts[0]
  );
  const [essay, setEssay] = useState('');
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [pennyState, setPennyState] = useState<
    'idle' | 'writing' | 'thinking' | 'encouraging'
  >('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [promptStartTime, setPromptStartTime] = useState(Date.now());
  const [completedPrompts, setCompletedPrompts] = useState<number>(0);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      if (user && !sessionId) {
        const { data } = await createLearningSession({
          userId: user.id,
          sessionType: 'standard',
          contentType: 'writing',
        });
        if (data) {
          setSessionId(data.id);
        }
      }
    };

    initSession();
  }, [user, sessionId]);

  const handleStartWriting = () => {
    setPromptStartTime(Date.now());
    setPhase('writing');
    setPennyState('writing');
  };

  const handleSubmitEssay = async () => {
    setPhase('processing');
    setPennyState('thinking');

    try {
      const response = await fetch('/api/writing/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essay,
          prompt: currentPrompt.prompt,
          taskType: currentPrompt.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze essay');
      }

      const result: WritingFeedback = await response.json();
      setFeedback(result);
      setPhase('feedback');
      setPennyState('encouraging');

      // Save learning record
      if (user && sessionId) {
        const timeSpent = Math.floor((Date.now() - promptStartTime) / 1000);
        await createLearningRecord({
          userId: user.id,
          sessionId: sessionId,
          contentId: currentPrompt.id,
          isCorrect: result.scores.overall >= 7, // Consider overall score >= 7 as "correct"
          timeSpentSeconds: timeSpent,
          userAnswer: {
            prompt: currentPrompt.prompt,
            essay: essay,
            wordCount: essay.trim().split(/\s+/).filter(Boolean).length,
            scores: result.scores,
            estimatedScore: result.estimatedScore,
          },
          feedback: result.feedback,
        });
        setCompletedPrompts(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error analyzing essay:', error);
      alert('에세이 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      setPhase('writing');
      setPennyState('writing');
    }
  };

  const handleTimeUp = () => {
    if (essay.trim()) {
      handleSubmitEssay();
    } else {
      alert('시간이 종료되었습니다. 작성한 내용이 없어 제출할 수 없습니다.');
    }
  };

  const handleNextPrompt = () => {
    if (currentPromptIndex < writingPrompts.length - 1) {
      const nextIndex = currentPromptIndex + 1;
      setCurrentPromptIndex(nextIndex);
      setCurrentPrompt(writingPrompts[nextIndex]);
      setPhase('intro');
      setEssay('');
      setFeedback(null);
      setPennyState('idle');
      setPromptStartTime(Date.now());
    } else {
      // Complete session
      setPhase('complete');
      setPennyState('encouraging');

      // Update session and streak
      if (user && sessionId) {
        const totalTime = Math.floor((Date.now() - promptStartTime) / 1000);
        updateLearningSession({
          sessionId,
          durationSeconds: totalTime,
          isCompleted: true,
        });
        updateStreak(user.id);
      }
    }
  };

  const handleRetry = () => {
    setPhase('intro');
    setEssay('');
    setFeedback(null);
    setPennyState('idle');
  };

  const handleRestart = () => {
    setCurrentPromptIndex(0);
    setCurrentPrompt(writingPrompts[0]);
    setPhase('intro');
    setEssay('');
    setFeedback(null);
    setPennyState('idle');
  };

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit =
    wordCount >= currentPrompt.wordLimit.min &&
    wordCount <= currentPrompt.wordLimit.max;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pb-20">
        <PennyCharacter state={pennyState} />

        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card variant="white" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-butter-yellow/20 text-cocoa-brown rounded-full text-sm font-semibold">
                    Task {currentPromptIndex + 1}/{writingPrompts.length}
                  </span>
                  <span className="px-3 py-1 bg-soft-peach text-cocoa-brown rounded-full text-sm">
                    {currentPrompt.type === 'independent'
                      ? 'Independent Writing'
                      : 'Integrated Writing'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-cocoa-brown mb-4">
                  {currentPrompt.topic}
                </h3>

                {/* Reading passage for integrated tasks */}
                {currentPrompt.readingPassage && (
                  <div className="mb-6 p-4 bg-warm-cream rounded-lg">
                    <div className="flex items-center gap-2 mb-3 text-cocoa-brown font-bold">
                      <BookOpen size={20} />
                      <span>Reading Passage</span>
                    </div>
                    <div className="text-text-primary leading-relaxed whitespace-pre-line">
                      {currentPrompt.readingPassage}
                    </div>
                  </div>
                )}

                <div className="bg-soft-peach/30 p-4 rounded-lg mb-6">
                  <p className="text-text-primary leading-relaxed font-semibold">
                    {currentPrompt.prompt}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-warm-cream p-4 rounded-lg">
                    <div className="text-sm text-text-secondary mb-1">
                      단어 수
                    </div>
                    <div className="text-2xl font-bold text-cocoa-brown font-baloo">
                      {currentPrompt.wordLimit.min}-{currentPrompt.wordLimit.max}
                    </div>
                  </div>
                  <div className="bg-warm-cream p-4 rounded-lg">
                    <div className="text-sm text-text-secondary mb-1">
                      제한 시간
                    </div>
                    <div className="text-2xl font-bold text-cocoa-brown font-baloo">
                      {currentPrompt.timeLimit / 60}분
                    </div>
                  </div>
                </div>

                <div className="bg-mint-green/10 p-4 rounded-lg">
                  <h4 className="font-bold text-cocoa-brown mb-2">
                    평가 기준:
                  </h4>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• 구성: {currentPrompt.rubric.organization}</li>
                    <li>• 전개: {currentPrompt.rubric.development}</li>
                    <li>• 언어 사용: {currentPrompt.rubric.languageUse}</li>
                    <li>• 문법: {currentPrompt.rubric.grammar}</li>
                  </ul>
                </div>
              </Card>

              <Button
                onClick={handleStartWriting}
                variant="primary"
                className="w-full"
              >
                작성 시작하기
              </Button>
            </motion.div>
          )}

          {/* Writing Phase */}
          {phase === 'writing' && (
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card variant="white" className="p-6">
                <div className="mb-4 p-4 bg-warm-cream rounded-lg">
                  <p className="text-text-primary leading-relaxed font-semibold">
                    {currentPrompt.prompt}
                  </p>
                </div>

                <WritingEditor
                  value={essay}
                  onChange={setEssay}
                  timeLimit={currentPrompt.timeLimit}
                  wordLimit={currentPrompt.wordLimit}
                  onTimeUp={handleTimeUp}
                />
              </Card>

              <Button
                onClick={handleSubmitEssay}
                variant="primary"
                className="w-full"
                disabled={!canSubmit}
              >
                {canSubmit
                  ? '제출하기'
                  : `최소 ${currentPrompt.wordLimit.min}단어 이상 작성해주세요`}
              </Button>
            </motion.div>
          )}

          {/* Processing Phase */}
          {phase === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card variant="white" className="p-12 text-center">
                <PercentageLoader
                  message="에세이를 분석하고 있어요..."
                  subMessage="AI가 당신의 글을 읽고 피드백을 준비하고 있습니다"
                />
              </Card>
            </motion.div>
          )}

          {/* Feedback Phase */}
          {phase === 'feedback' && feedback && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Score Card */}
              <Card variant="white" className="p-6">
                <h3 className="text-xl font-bold text-cocoa-brown mb-4">
                  평가 결과
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center p-4 bg-warm-cream rounded-lg">
                    <div className="text-3xl font-bold text-strawberry-pink font-baloo">
                      {feedback.scores.organization}
                    </div>
                    <div className="text-sm text-text-secondary">구성</div>
                  </div>
                  <div className="text-center p-4 bg-warm-cream rounded-lg">
                    <div className="text-3xl font-bold text-honey-brown font-baloo">
                      {feedback.scores.development}
                    </div>
                    <div className="text-sm text-text-secondary">전개</div>
                  </div>
                  <div className="text-center p-4 bg-warm-cream rounded-lg">
                    <div className="text-3xl font-bold text-mint-green font-baloo">
                      {feedback.scores.languageUse}
                    </div>
                    <div className="text-sm text-text-secondary">언어</div>
                  </div>
                  <div className="text-center p-4 bg-warm-cream rounded-lg">
                    <div className="text-3xl font-bold text-butter-yellow font-baloo">
                      {feedback.scores.grammar}
                    </div>
                    <div className="text-sm text-text-secondary">문법</div>
                  </div>
                  <div className="text-center p-4 bg-soft-peach rounded-lg">
                    <div className="text-3xl font-bold text-cocoa-brown font-baloo">
                      {feedback.scores.overall}
                    </div>
                    <div className="text-sm text-text-secondary">종합</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-strawberry-pink/20 to-honey-brown/20 rounded-lg mb-4">
                  <div className="text-sm text-text-secondary mb-1">
                    예상 TOEFL 점수
                  </div>
                  <div className="text-4xl font-bold text-cocoa-brown font-baloo">
                    {feedback.estimatedScore} / 30
                  </div>
                </div>

                <div className="text-center text-sm text-text-secondary">
                  단어 수: {feedback.wordCount}개
                </div>
              </Card>

              {/* Detailed Analysis */}
              <Card variant="white" className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-cocoa-brown mb-3">
                  상세 분석
                </h3>

                <div className="space-y-3">
                  <div className="p-3 bg-warm-cream rounded-lg">
                    <h4 className="font-bold text-strawberry-pink mb-1">
                      📝 구성 (Organization)
                    </h4>
                    <p className="text-sm text-text-primary">
                      {feedback.detailedAnalysis.organization}
                    </p>
                  </div>

                  <div className="p-3 bg-warm-cream rounded-lg">
                    <h4 className="font-bold text-honey-brown mb-1">
                      💡 전개 (Development)
                    </h4>
                    <p className="text-sm text-text-primary">
                      {feedback.detailedAnalysis.development}
                    </p>
                  </div>

                  <div className="p-3 bg-warm-cream rounded-lg">
                    <h4 className="font-bold text-mint-green mb-1">
                      🗣️ 언어 사용 (Language Use)
                    </h4>
                    <p className="text-sm text-text-primary">
                      {feedback.detailedAnalysis.languageUse}
                    </p>
                  </div>

                  <div className="p-3 bg-warm-cream rounded-lg">
                    <h4 className="font-bold text-butter-yellow mb-1">
                      ✏️ 문법 (Grammar)
                    </h4>
                    <p className="text-sm text-text-primary">
                      {feedback.detailedAnalysis.grammar}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Feedback */}
              <Card variant="white" className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-mint-green mb-2">
                    ✨ 잘한 점
                  </h3>
                  <ul className="space-y-1">
                    {feedback.feedback.strengths.map((item, index) => (
                      <li key={index} className="text-text-primary">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-butter-yellow mb-2">
                    📈 개선할 점
                  </h3>
                  <ul className="space-y-1">
                    {feedback.feedback.improvements.map((item, index) => (
                      <li key={index} className="text-text-primary">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-strawberry-pink mb-2">
                    💡 제안
                  </h3>
                  <ul className="space-y-1">
                    {feedback.feedback.suggestions.map((item, index) => (
                      <li key={index} className="text-text-primary">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  다시 도전
                </Button>
                <Button
                  onClick={handleNextPrompt}
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  다음 문제
                  <ChevronRight size={18} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Complete Phase */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card variant="white" className="p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-cocoa-brown mb-2">
                  모든 문제를 완료했어요!
                </h3>
                <p className="text-text-secondary mb-6">
                  정말 수고했어요! 페니가 자랑스러워해요.
                </p>

                <Button
                  onClick={handleRestart}
                  variant="primary"
                  className="mx-auto"
                >
                  처음부터 다시 시작
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
