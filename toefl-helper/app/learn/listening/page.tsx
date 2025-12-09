'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { PageLayout } from '@/components/layout'
import { Button, Card, ProgressBar, Badge } from '@/components/ui'
import { CocoReaction } from '@/components/listening'
import { AudioPlayer } from '@/components/diagnostic/AudioPlayer'
import { getRandomListeningSession } from '@/lib/data/listeningData'
import { ListeningPassage, ListeningQuestion } from '@/lib/types/listening'
import { useAuthStore } from '@/store/authStore'
import {
  createLearningSession,
  updateLearningSession,
  updateStreak,
  createLearningRecord,
} from '@/lib/utils/learningRecords'

export default function ListeningLearningPage() {
  const { user } = useAuthStore()
  const [passage, setPassage] = useState<ListeningPassage | null>(null)
  const [questions, setQuestions] = useState<ListeningQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [showReaction, setShowReaction] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [sessionKey, setSessionKey] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [startTime, setStartTime] = useState(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const session = getRandomListeningSession()
      setPassage(session.passage)
      setQuestions(session.questions)
      setAnswers(new Array(session.questions.length).fill(null))
      setCurrentQuestionIndex(0)
      setIsCompleted(false)
      setStartTime(Date.now())
      setQuestionStartTime(Date.now())

      // Create learning session if user is logged in
      if (user) {
        const { data } = await createLearningSession({
          userId: user.id,
          sessionType: 'standard',
          contentType: 'listening',
        })
        if (data) {
          setSessionId(data.id)
        }
      }
    }

    initSession()
  }, [sessionKey, user])

  // Reset selection when question changes
  useEffect(() => {
    if (questions.length > 0) {
      setSelectedAnswer(null)
      setShowExplanation(false)
      setShowReaction(false)
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestionIndex, questions.length])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex)
    }
  }

  const handleSubmit = async () => {
    if (selectedAnswer === null) return

    // Update answers array
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = selectedAnswer
    setAnswers(newAnswers)

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)

    setShowExplanation(true)
    setShowReaction(true)

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

    // Hide reaction after 2 seconds
    setTimeout(() => {
      setShowReaction(false)
    }, 2000)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // Complete session
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

  const calculateResults = () => {
    const correctCount = answers.filter(
      (answer, idx) => answer === questions[idx].correctAnswer
    ).length
    const accuracy = (correctCount / questions.length) * 100
    return { correctCount, accuracy }
  }

  if (!passage || questions.length === 0) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-text-secondary">로딩 중...</p>
        </div>
      </PageLayout>
    )
  }

  if (isCompleted) {
    const { correctCount, accuracy } = calculateResults()

    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="cream" className="text-center p-8">
              {/* Coco Character */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="flex justify-center mb-6"
              >
                <Image
                  src="/Coco_idle.webp"
                  alt="Coco the Polar Bear"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </motion.div>

              <h1 className="text-3xl font-bold text-cocoa-brown mb-4">
                🎧 리스닝 세션 완료!
              </h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-mint-green">
                      {correctCount}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">맞은 문제</p>
                  </div>
                  <div className="text-4xl text-text-secondary">/</div>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-text-primary">
                      {questions.length}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">전체 문제</p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-2xl font-bold text-honey-brown mb-2">
                    정확도: {accuracy.toFixed(0)}%
                  </p>
                  <ProgressBar progress={accuracy} />
                </div>

                {accuracy >= 80 && (
                  <p className="text-mint text-lg font-semibold">
                    🌟 훌륭해요! 이 페이스로 계속 진행하세요!
                  </p>
                )}
                {accuracy >= 60 && accuracy < 80 && (
                  <p className="text-honey-brown text-lg font-semibold">
                    👍 잘했어요! 조금만 더 연습하면 완벽해질 거예요!
                  </p>
                )}
                {accuracy < 60 && (
                  <p className="text-strawberry-pink text-lg font-semibold">
                    💪 다시 한번 도전해보세요! 연습이 실력을 만듭니다!
                  </p>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={() => setSessionKey(prev => prev + 1)}
                >
                  다시 학습하기
                </Button>
                <Link href="/">
                  <Button variant="outline">홈으로</Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Coco Reaction Overlay */}
      <CocoReaction
        isCorrect={selectedAnswer === currentQuestion?.correctAnswer}
        show={showReaction}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src="/Coco_idle.webp"
                alt="Coco"
                width={60}
                height={60}
                className="object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-cocoa-brown">
                  리스닝 학습
                </h1>
                <p className="text-sm text-text-secondary">
                  코코와 함께하는 듣기 연습
                </p>
              </div>
            </div>
            <Badge variant="info">
              {currentQuestionIndex + 1} / {questions.length}
            </Badge>
          </div>

          <ProgressBar progress={progress} />
        </div>

        {/* Passage Info */}
        <Card variant="peach" className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-cocoa-brown mb-2">
                {passage.title}
              </h2>
              <div className="flex gap-2 mb-3">
                <Badge variant="default">{passage.topic}</Badge>
                <Badge variant="warning">
                  {passage.difficulty === 'beginner' && '초급'}
                  {passage.difficulty === 'intermediate' && '중급'}
                  {passage.difficulty === 'advanced' && '고급'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="text-lg">📝</span>
                <span>이 오디오에 대해 <strong className="text-honey-brown">{questions.length}개의 문제</strong>가 출제됩니다</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content - Audio Player */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card variant="white">
            <h3 className="text-lg font-bold text-cocoa-brown mb-4">
              🎧 오디오 듣기
            </h3>
            <AudioPlayer
              key={passage.id}
              audioUrl={passage.audioUrl}
              maxPlays={3}
              transcript={passage.transcript}
            />
          </Card>
        </div>

        {/* Question Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="white">
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <Badge variant="info">Q{currentQuestionIndex + 1}</Badge>
                  <h3 className="text-lg font-semibold text-text-primary flex-1">
                    {currentQuestion.question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrectAnswer = idx === currentQuestion.correctAnswer
                    const isSelectedAnswer = idx === selectedAnswer
                    const isWrongAnswer =
                      showExplanation && isSelectedAnswer && !isCorrectAnswer

                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={showExplanation}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          showExplanation
                            ? isCorrectAnswer
                              ? 'border-[#A8D5BA] bg-[#A8D5BA] bg-opacity-30'
                              : isWrongAnswer
                              ? 'border-[#E8A0A0] bg-[#E8A0A0] bg-opacity-30'
                              : 'border-gray-200 bg-gray-50 opacity-50'
                            : isSelectedAnswer
                            ? 'border-[#D4A574] bg-[#FFECD2] shadow-md'
                            : 'border-gray-200 bg-white hover:border-[#D4A574] hover:bg-[#FDF6E3]'
                        }`}
                        whileHover={!showExplanation ? { scale: 1.01 } : {}}
                        whileTap={!showExplanation ? { scale: 0.99 } : {}}
                      >
                        <div className="flex items-start gap-3">
                          {/* Radio indicator */}
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                              showExplanation
                                ? isCorrectAnswer
                                  ? 'border-[#A8D5BA] bg-[#A8D5BA]'
                                  : isWrongAnswer
                                  ? 'border-[#E8A0A0] bg-[#E8A0A0]'
                                  : 'border-gray-300'
                                : isSelectedAnswer
                                ? 'border-[#D4A574] bg-[#D4A574] ring-4 ring-[#D4A574] ring-opacity-20'
                                : 'border-gray-300'
                            }`}
                          >
                            {((showExplanation && isCorrectAnswer) ||
                              (showExplanation && isWrongAnswer) ||
                              isSelectedAnswer) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2.5 h-2.5 bg-white rounded-full"
                              />
                            )}
                          </div>

                          <div className="flex-1">
                            <p
                              className={`${
                                isSelectedAnswer && !showExplanation
                                  ? 'font-semibold'
                                  : ''
                              }`}
                            >
                              {option}
                            </p>
                            {showExplanation && isCorrectAnswer && (
                              <div className="mt-1">
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: '#A8D5BA' }}
                                >
                                  정답
                                </span>
                              </div>
                            )}
                            {showExplanation && isWrongAnswer && (
                              <div className="mt-1">
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: '#E8A0A0' }}
                                >
                                  선택한 답
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Explanation */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-warm-cream rounded-xl"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="font-semibold text-cocoa-brown mb-1">해설</p>
                      <p className="text-sm text-text-primary leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {!showExplanation ? (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                    className="flex-1"
                  >
                    답안 제출
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleNext} className="flex-1">
                    {currentQuestionIndex < questions.length - 1
                      ? '다음 문제'
                      : '결과 보기'}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </PageLayout>
  )
}
