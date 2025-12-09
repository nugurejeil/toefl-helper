'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import RustyCharacter from '@/components/speaking/RustyCharacter';
import AudioRecorder from '@/components/speaking/AudioRecorder';
import { speakingPrompts } from '@/lib/data/speakingData';
import { SpeakingPrompt, SpeakingFeedback } from '@/lib/types/speaking';
import { Clock, ChevronRight, RotateCcw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import {
  createLearningSession,
  updateLearningSession,
  updateStreak,
  createLearningRecord,
} from '@/lib/utils/learningRecords';

type Phase =
  | 'intro'
  | 'preparation'
  | 'recording'
  | 'processing'
  | 'feedback'
  | 'complete';

export default function SpeakingPage() {
  const { user } = useAuthStore();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState<SpeakingPrompt>(
    speakingPrompts[0]
  );
  const [preparationTimeLeft, setPreparationTimeLeft] = useState(
    speakingPrompts[0].preparationTime
  );
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [rustyState, setRustyState] = useState<
    'idle' | 'listening' | 'thinking' | 'encouraging'
  >('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [promptStartTime, setPromptStartTime] = useState(Date.now());
  const [completedPrompts, setCompletedPrompts] = useState<number>(0);

  // Preparation timer
  useEffect(() => {
    if (phase === 'preparation' && preparationTimeLeft > 0) {
      const timer = setTimeout(() => {
        setPreparationTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (phase === 'preparation' && preparationTimeLeft === 0) {
      // Auto transition to recording phase
      setPhase('recording');
      setRustyState('listening');
    }
  }, [phase, preparationTimeLeft]);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      if (user && !sessionId) {
        const { data } = await createLearningSession({
          userId: user.id,
          sessionType: 'standard',
          contentType: 'speaking',
        });
        if (data) {
          setSessionId(data.id);
        }
      }
    };

    initSession();
  }, [user, sessionId]);

  const handleStartSession = () => {
    setPromptStartTime(Date.now());
    setPhase('preparation');
    setPreparationTimeLeft(currentPrompt.preparationTime);
    setRustyState('idle');
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRustyState('listening');
  };

  const handleStopRecording = async (blob: Blob) => {
    setIsRecording(false);
    setPhase('processing');
    setRustyState('thinking');

    // Send audio to API for transcription and feedback
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      formData.append('prompt', currentPrompt.question);

      const response = await fetch('/api/speaking/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze speech');
      }

      const result: SpeakingFeedback = await response.json();
      setFeedback(result);
      setPhase('feedback');
      setRustyState('encouraging');

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
            prompt: currentPrompt.question,
            transcription: result.transcription,
            scores: result.scores,
            estimatedScore: result.estimatedScore,
          },
          feedback: result.feedback,
        });
        setCompletedPrompts(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error analyzing speech:', error);
      alert('음성 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      setPhase('recording');
      setRustyState('idle');
    }
  };

  const handleNextPrompt = () => {
    if (currentPromptIndex < speakingPrompts.length - 1) {
      const nextIndex = currentPromptIndex + 1;
      setCurrentPromptIndex(nextIndex);
      setCurrentPrompt(speakingPrompts[nextIndex]);
      setPhase('intro');
      setFeedback(null);
      setRustyState('idle');
      setPromptStartTime(Date.now());
    } else {
      // Complete session
      setPhase('complete');
      setRustyState('encouraging');

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
    setFeedback(null);
    setRustyState('idle');
  };

  const handleRestart = () => {
    setCurrentPromptIndex(0);
    setCurrentPrompt(speakingPrompts[0]);
    setPhase('intro');
    setFeedback(null);
    setRustyState('idle');
  };

  return (
    <PageLayout title="스피킹 연습" description="러스티와 함께 스피킹 실력을 키워봐요">
      <div className="max-w-3xl mx-auto pb-20">
        <RustyCharacter state={rustyState} />

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
                    Task {currentPromptIndex + 1}/{speakingPrompts.length}
                  </span>
                  <span className="px-3 py-1 bg-soft-peach text-cocoa-brown rounded-full text-sm">
                    {currentPrompt.type === 'independent'
                      ? 'Independent Task'
                      : 'Integrated Task'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-cocoa-brown mb-2">
                  {currentPrompt.topic}
                </h3>

                <p className="text-text-primary leading-relaxed mb-6">
                  {currentPrompt.question}
                </p>

                <div className="bg-warm-cream p-4 rounded-lg space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock size={16} />
                    <span>
                      준비 시간: {currentPrompt.preparationTime}초 | 답변 시간:{' '}
                      {currentPrompt.responseTime}초
                    </span>
                  </div>
                </div>

                <div className="bg-mint-green/10 p-4 rounded-lg">
                  <h4 className="font-bold text-cocoa-brown mb-2">
                    평가 기준:
                  </h4>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• 발음 및 전달력: {currentPrompt.rubric.delivery}</li>
                    <li>• 언어 사용: {currentPrompt.rubric.languageUse}</li>
                    <li>
                      • 주제 전개: {currentPrompt.rubric.topicDevelopment}
                    </li>
                  </ul>
                </div>
              </Card>

              <Button
                onClick={handleStartSession}
                variant="primary"
                className="w-full"
              >
                시작하기
              </Button>
            </motion.div>
          )}

          {/* Preparation Phase */}
          {phase === 'preparation' && (
            <motion.div
              key="preparation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card variant="white" className="p-8 text-center">
                <div className="mb-6">
                  <div className="text-6xl font-bold text-strawberry-pink font-baloo">
                    {preparationTimeLeft}
                  </div>
                  <p className="text-text-secondary mt-2">
                    준비 시간이 남았어요
                  </p>
                </div>

                <div className="bg-warm-cream p-4 rounded-lg">
                  <p className="text-text-primary leading-relaxed">
                    {currentPrompt.question}
                  </p>
                </div>

                <p className="text-sm text-text-secondary mt-4">
                  답변을 생각하는 시간입니다. 곧 녹음이 시작됩니다.
                </p>
              </Card>
            </motion.div>
          )}

          {/* Recording Phase */}
          {phase === 'recording' && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card variant="white" className="p-8">
                <div className="mb-6 bg-warm-cream p-4 rounded-lg">
                  <p className="text-text-primary leading-relaxed text-center">
                    {currentPrompt.question}
                  </p>
                </div>

                <AudioRecorder
                  isRecording={isRecording}
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  maxDuration={currentPrompt.responseTime}
                />
              </Card>
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
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-strawberry-pink border-t-transparent rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-cocoa-brown mb-2">
                  답변을 분석하고 있어요...
                </h3>
                <p className="text-text-secondary">
                  AI가 당신의 답변을 듣고 피드백을 준비하고 있습니다
                </p>
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-warm-cream rounded-lg">
                    <div className="text-3xl font-bold text-strawberry-pink font-baloo">
                      {feedback.scores.delivery}
                    </div>
                    <div className="text-sm text-text-secondary">발음</div>
                  </div>
                  <div className="text-center p-4 bg-warm-cream rounded-lg">
                    <div className="text-3xl font-bold text-honey-brown font-baloo">
                      {feedback.scores.languageUse}
                    </div>
                    <div className="text-sm text-text-secondary">언어 사용</div>
                  </div>
                  <div className="text-center p-4 bg-warm-cream rounded-lg">
                    <div className="text-3xl font-bold text-mint-green font-baloo">
                      {feedback.scores.topicDevelopment}
                    </div>
                    <div className="text-sm text-text-secondary">주제 전개</div>
                  </div>
                  <div className="text-center p-4 bg-soft-peach rounded-lg">
                    <div className="text-3xl font-bold text-cocoa-brown font-baloo">
                      {feedback.scores.overall}
                    </div>
                    <div className="text-sm text-text-secondary">종합</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-strawberry-pink/20 to-honey-brown/20 rounded-lg">
                  <div className="text-sm text-text-secondary mb-1">
                    예상 TOEFL 점수
                  </div>
                  <div className="text-4xl font-bold text-cocoa-brown font-baloo">
                    {feedback.estimatedScore} / 30
                  </div>
                </div>
              </Card>

              {/* Transcription */}
              <Card variant="white" className="p-6">
                <h3 className="text-lg font-bold text-cocoa-brown mb-3">
                  당신의 답변:
                </h3>
                <div className="bg-warm-cream p-4 rounded-lg">
                  <p className="text-text-primary leading-relaxed">
                    {feedback.transcription}
                  </p>
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
                  정말 수고했어요! 러스티가 자랑스러워해요.
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
