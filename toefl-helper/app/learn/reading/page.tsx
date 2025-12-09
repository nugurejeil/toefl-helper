'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getRandomReadingSession } from '@/lib/data/readingData'
import { ReadingPassage, ReadingQuestion, ReadingAnswer } from '@/lib/types/reading'
import ToastyReaction from '@/components/reading/ToastyReaction'
import { PageLayout } from '@/components/layout'
import { Button, Card, Badge } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'
import {
  createLearningSession,
  updateLearningSession,
  updateStreak,
  createLearningRecord,
} from '@/lib/utils/learningRecords'

export default function ReadingLearningPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [passage, setPassage] = useState<ReadingPassage | null>(null)
  const [questions, setQuestions] = useState<ReadingQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<ReadingAnswer[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [showReaction, setShowReaction] = useState(false)
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [sessionKey, setSessionKey] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const initSession = async () => {
      // Load random reading session
      const session = getRandomReadingSession()
      setPassage(session.passage)
      setQuestions(session.questions)
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setAnswers([])
      setShowExplanation(false)
      setShowReaction(false)
      setLastAnswer(null)
      setIsCompleted(false)
      setStartTime(Date.now())
      setQuestionStartTime(Date.now())

      // Create learning session if user is logged in
      if (user) {
        const { data } = await createLearningSession({
          userId: user.id,
          sessionType: 'standard',
          contentType: 'reading',
        })
        if (data) {
          setSessionId(data.id)
        }
      }
    }

    initSession()
  }, [sessionKey, user])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0
  const correctCount = answers.filter(a => a.isCorrect).length

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !currentQuestion) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)

    const answer: ReadingAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent
    }

    setAnswers([...answers, answer])
    setLastAnswer(isCorrect)
    setShowReaction(true)
    setShowExplanation(true)

    // Save learning record
    if (user && sessionId) {
      await createLearningRecord({
        userId: user.id,
        sessionId: sessionId,
        contentId: currentQuestion.id,
        isCorrect: isCorrect,
        timeSpentSeconds: timeSpent,
        userAnswer: {
          question: currentQuestion.question,
          selectedAnswer: currentQuestion.options[selectedAnswer],
          correctAnswer: currentQuestion.options[currentQuestion.correctAnswer],
        },
      })
    }

    setTimeout(() => {
      setShowReaction(false)
    }, 2000)
  }

  const handleNextQuestion = () => {
    setShowExplanation(false)
    setSelectedAnswer(null)
    setLastAnswer(null)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setQuestionStartTime(Date.now())
    } else {
      // Session completed
      setIsCompleted(true)

      // Update session and streak
      if (user && sessionId) {
        const durationSeconds = Math.floor((Date.now() - startTime) / 1000)
        updateLearningSession({
          sessionId,
          durationSeconds,
          isCompleted: true,
        })
        updateStreak(user.id)
      }
    }
  }

  const handleRestart = () => {
    setSessionKey(prev => prev + 1)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (!passage || questions.length === 0) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl mb-4">🐱</div>
            <p className="text-text-secondary">지문을 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (isCompleted) {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60)
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto">
          {/* Header with Toasty */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Image
              src="/Toasty_idle.webp"
              alt="Toasty"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-cocoa-brown mb-2">
              🎉 세션 완료!
            </h1>
            <p className="text-text-secondary">
              토스티와 함께 리딩 학습을 마쳤어요
            </p>
          </motion.div>

          {/* Results Card */}
          <Card variant="white" className="p-8 mb-6">
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-mint-green bg-opacity-20 p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-mint font-[var(--font-number)]">
                    {correctCount}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">맞춘 문제</p>
                </div>
                <div className="bg-strawberry-pink bg-opacity-20 p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-pink font-[var(--font-number)]">
                    {questions.length - correctCount}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">틀린 문제</p>
                </div>
              </div>

              {/* Accuracy */}
              <div className="bg-soft-peach p-6 rounded-xl text-center">
                <p className="text-5xl font-bold text-cocoa-brown font-[var(--font-number)] mb-2">
                  {accuracy}%
                </p>
                <p className="text-text-secondary">정확도</p>
              </div>

              {/* Time & Passage Info */}
              <div className="text-center space-y-2">
                <p className="text-text-secondary text-sm">
                  ⏱️ 소요 시간: <span className="font-semibold">{timeSpent}분</span>
                </p>
                <p className="text-text-secondary text-sm">
                  📖 주제: <span className="font-semibold">{passage.topic}</span>
                </p>
              </div>

              {/* Encouragement Message */}
              <div className="text-center py-4">
                {accuracy >= 80 && (
                  <p className="text-mint text-lg font-semibold">
                    🌟 훌륭해요! 독해 실력이 뛰어나시네요!
                  </p>
                )}
                {accuracy >= 50 && accuracy < 80 && (
                  <p className="text-honey text-lg font-semibold">
                    👍 잘하고 있어요! 꾸준히 연습하면 더 좋아질 거예요!
                  </p>
                )}
                {accuracy < 50 && (
                  <p className="text-pink text-lg font-semibold">
                    💪 괜찮아요! 다양한 지문을 읽으면서 실력을 키워가요!
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button variant="primary" onClick={handleRestart} className="w-full">
              다른 지문으로 학습하기
            </Button>
            <Button variant="outline" onClick={handleGoHome} className="w-full">
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src="/Toasty_idle.webp"
                alt="Toasty"
                width={50}
                height={50}
              />
              <div>
                <h1 className="text-2xl font-bold text-cocoa-brown">
                  리딩 학습
                </h1>
                <p className="text-sm text-text-secondary">
                  토스티 고양이와 함께
                </p>
              </div>
            </div>
            <Badge variant="warning">
              Standard Session (10분)
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
              <span>문제 진행률</span>
              <span>{currentQuestionIndex + 1} / {questions.length}</span>
            </div>
            <div className="w-full h-3 bg-white rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-soft-peach to-honey-brown"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
              <span className="text-mint-green">✓</span>
              <span className="text-sm font-semibold text-text-primary">{correctCount}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
              <span className="text-strawberry-pink">✗</span>
              <span className="text-sm font-semibold text-text-primary">{answers.length - correctCount}</span>
            </div>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Passage */}
          <Card variant="white" className="p-6 lg:sticky lg:top-6 h-fit max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-soft-peach">
                <h2 className="text-xl font-bold text-cocoa-brown">
                  {passage.title}
                </h2>
                <Badge variant="info">{passage.topic}</Badge>
              </div>

              <div className="prose prose-sm max-w-none">
                {passage.passage.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-text-primary leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-soft-peach text-sm text-text-secondary">
                <span>단어 수: {passage.wordCount}</span>
              </div>
            </div>
          </Card>

          {/* Right: Questions */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="cream" className="p-6">
                  <div className="space-y-4">
                    {/* Question */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="default">
                          문제 {currentQuestionIndex + 1}
                        </Badge>
                        <span className="text-xs text-text-secondary capitalize">
                          {currentQuestion.questionType.replace('-', ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-cocoa-brown">
                        {currentQuestion.question}
                      </h3>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => {
                        const isCorrectAnswer = idx === currentQuestion.correctAnswer
                        const isSelectedAnswer = idx === selectedAnswer
                        const isWrongAnswer = showExplanation && isSelectedAnswer && !isCorrectAnswer

                        return (
                          <motion.button
                            key={idx}
                            onClick={() => !showExplanation && setSelectedAnswer(idx)}
                            disabled={showExplanation}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              showExplanation
                                ? isCorrectAnswer
                                  ? 'border-[#A8D5BA] bg-[#A8D5BA] bg-opacity-30 shadow-lg'
                                  : isWrongAnswer
                                  ? 'border-[#E8A0A0] bg-[#E8A0A0] bg-opacity-30 shadow-md'
                                  : 'border-gray-200 bg-gray-50 opacity-60'
                                : isSelectedAnswer
                                ? 'border-[#E8A0A0] bg-[#FFECD2] shadow-lg ring-2 ring-[#E8A0A0] ring-opacity-30'
                                : 'border-transparent bg-white hover:border-[#D4A574] hover:shadow-md'
                            }`}
                            whileHover={!showExplanation ? { scale: 1.02 } : {}}
                            whileTap={!showExplanation ? { scale: 0.98 } : {}}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                  showExplanation
                                    ? isCorrectAnswer
                                      ? 'border-[#A8D5BA] bg-[#A8D5BA] shadow-md'
                                      : isWrongAnswer
                                      ? 'border-[#E8A0A0] bg-[#E8A0A0] shadow-md'
                                      : 'border-gray-300 bg-white'
                                    : isSelectedAnswer
                                    ? 'border-[#E8A0A0] bg-[#E8A0A0] shadow-md'
                                    : 'border-[#D4A574] bg-white'
                                }`}
                              >
                                {showExplanation && isCorrectAnswer && (
                                  <span className="text-white text-sm font-bold">✓</span>
                                )}
                                {showExplanation && isWrongAnswer && (
                                  <span className="text-white text-sm font-bold">✗</span>
                                )}
                                {!showExplanation && isSelectedAnswer && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-3 h-3 bg-white rounded-full"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <span className={`${
                                  showExplanation && isCorrectAnswer
                                    ? 'text-cocoa-brown font-bold'
                                    : showExplanation && isWrongAnswer
                                    ? 'text-text-primary font-semibold'
                                    : isSelectedAnswer && !showExplanation
                                    ? 'text-cocoa-brown font-semibold'
                                    : 'text-text-primary'
                                }`}>
                                  {option}
                                </span>
                                {showExplanation && isCorrectAnswer && (
                                  <div className="mt-1">
                                    <span className="text-xs font-semibold" style={{ color: '#A8D5BA' }}>정답</span>
                                  </div>
                                )}
                                {showExplanation && isWrongAnswer && (
                                  <div className="mt-1">
                                    <span className="text-xs font-semibold" style={{ color: '#E8A0A0' }}>선택한 답</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 p-4 bg-white rounded-xl border-2 border-honey-brown">
                            <h4 className="font-semibold text-cocoa-brown mb-2 flex items-center gap-2">
                              <span>💡</span>
                              <span>해설</span>
                            </h4>
                            <p className="text-sm text-text-primary leading-relaxed">
                              {currentQuestion.explanation}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Action Button */}
            <div>
              {!showExplanation ? (
                <Button
                  variant="primary"
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="w-full"
                >
                  답안 제출
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNextQuestion}
                  className="w-full"
                >
                  {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '결과 보기'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Toasty Reaction */}
        <ToastyReaction isCorrect={lastAnswer} show={showReaction} />
      </div>
    </PageLayout>
  )
}
