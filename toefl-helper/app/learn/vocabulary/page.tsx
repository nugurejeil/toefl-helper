'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getRandomWords } from '@/lib/data/vocabularyData'
import { VocabularyWord } from '@/lib/types/vocabulary'
import Flashcard from '@/components/vocabulary/Flashcard'
import MochiReaction from '@/components/vocabulary/MochiReaction'
import { PageLayout } from '@/components/layout'
import { Button, Card, Badge } from '@/components/ui'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Confetti, CelebrationParticles } from '@/components/animations'
import { useAuthStore } from '@/store/authStore'
import {
  createLearningSession,
  updateLearningSession,
  updateStreak,
  createLearningRecord,
} from '@/lib/utils/learningRecords'

export default function VocabularyLearningPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [words, setWords] = useState<VocabularyWord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [showReaction, setShowReaction] = useState(false)
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [sessionKey, setSessionKey] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [wordStartTime, setWordStartTime] = useState(Date.now())
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const initSession = async () => {
      // Load 10 random words for the session
      const sessionWords = getRandomWords(10)
      setWords(sessionWords)
      setCurrentIndex(0)
      setIsFlipped(false)
      setCorrectCount(0)
      setIncorrectCount(0)
      setShowReaction(false)
      setLastAnswer(null)
      setIsCompleted(false)
      setStartTime(Date.now())
      setWordStartTime(Date.now())
      setShowCelebration(false)

      // Create learning session if user is logged in
      if (user) {
        const { data } = await createLearningSession({
          userId: user.id,
          sessionType: 'quick',
          contentType: 'vocabulary',
        })
        if (data) {
          setSessionId(data.id)
        }
      }
    }

    initSession()
  }, [sessionKey, user])

  const currentWord = words[currentIndex]
  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0
  const totalAnswered = correctCount + incorrectCount

  // Trigger celebration when session is completed with high accuracy
  useEffect(() => {
    if (isCompleted && words.length > 0) {
      const total = correctCount + incorrectCount
      const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0
      if (accuracy >= 80) {
        setShowCelebration(true)
      }
    }
  }, [isCompleted, correctCount, incorrectCount, words.length])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = async (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(correctCount + 1)
      // Trigger celebration effects for correct answers
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 100)
    } else {
      setIncorrectCount(incorrectCount + 1)
    }

    setLastAnswer(isCorrect)
    setShowReaction(true)

    // Save learning record
    if (user && sessionId) {
      const timeSpentSeconds = Math.floor((Date.now() - wordStartTime) / 1000)
      await createLearningRecord({
        userId: user.id,
        sessionId: sessionId,
        contentId: currentWord.id,
        isCorrect: isCorrect,
        timeSpentSeconds: timeSpentSeconds,
        userAnswer: {
          word: currentWord.word,
          answered: isCorrect ? 'correct' : 'incorrect',
        },
      })
    }

    setTimeout(() => {
      setShowReaction(false)
      setLastAnswer(null)

      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsFlipped(false)
        setWordStartTime(Date.now()) // Reset timer for next word
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
    }, 2000)
  }

  const handleRestart = () => {
    setSessionKey(prev => prev + 1)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (words.length === 0) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl mb-4">🐹</div>
            <p className="text-text-secondary">단어를 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (isCompleted) {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60)
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0

    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto">
          {/* Header with Mochi */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Image
              src="/Mochi_idle.webp"
              alt="Mochi"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-cocoa-brown mb-2">
              🎉 세션 완료!
            </h1>
            <p className="text-text-secondary">
              모찌와 함께 단어 학습을 마쳤어요
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
                  <p className="text-sm text-text-secondary mt-1">맞춘 단어</p>
                </div>
                <div className="bg-strawberry-pink bg-opacity-20 p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-pink font-[var(--font-number)]">
                    {incorrectCount}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">틀린 단어</p>
                </div>
              </div>

              {/* Accuracy */}
              <div className="bg-soft-peach p-6 rounded-xl text-center">
                <p className="text-5xl font-bold text-cocoa-brown font-[var(--font-number)] mb-2">
                  {accuracy}%
                </p>
                <p className="text-text-secondary">정확도</p>
              </div>

              {/* Time */}
              <div className="text-center">
                <p className="text-text-secondary text-sm">
                  ⏱️ 소요 시간: <span className="font-semibold">{timeSpent}분</span>
                </p>
              </div>

              {/* Encouragement Message */}
              <div className="text-center py-4">
                {accuracy >= 80 && (
                  <p className="text-mint text-lg font-semibold">
                    🌟 완벽해요! 이 페이스로 계속 진행하세요!
                  </p>
                )}
                {accuracy >= 50 && accuracy < 80 && (
                  <p className="text-honey text-lg font-semibold">
                    👍 잘하고 있어요! 조금만 더 연습하면 완벽해질 거예요!
                  </p>
                )}
                {accuracy < 50 && (
                  <p className="text-pink text-lg font-semibold">
                    💪 포기하지 마세요! 반복 학습이 실력 향상의 비결이에요!
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button variant="primary" onClick={handleRestart} className="w-full">
              다시 학습하기
            </Button>
            <Button variant="outline" onClick={handleGoHome} className="w-full">
              홈으로 돌아가기
            </Button>
          </div>

          {/* Celebration for high accuracy */}
          <CelebrationParticles
            show={showCelebration}
            emoji={['🌟', '⭐', '✨', '🎉', '🎊']}
            count={20}
          />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src="/Mochi_idle.webp"
                alt="Mochi"
                width={50}
                height={50}
              />
              <div>
                <h1 className="text-2xl font-bold text-cocoa-brown">
                  단어 학습
                </h1>
                <p className="text-sm text-text-secondary">
                  모찌 햄스터와 함께
                </p>
              </div>
            </div>
            <Badge variant="info">
              Quick Session (5분)
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
              <span>진행률</span>
              <span>{currentIndex + 1} / {words.length}</span>
            </div>
            <div className="w-full h-3 bg-white rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-mint-green to-honey-brown"
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
              <span className="text-sm font-semibold text-text-primary">{incorrectCount}</span>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-6">
          <Flashcard
            word={currentWord}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
        </div>

        {/* Answer Buttons */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-2xl mx-auto"
          >
            <Button
              variant="outline"
              onClick={() => handleAnswer(false)}
              className="flex-1 border-strawberry-pink text-strawberry-pink hover:bg-strawberry-pink hover:text-white"
            >
              ✗ 몰랐어요
            </Button>
            <Button
              variant="primary"
              onClick={() => handleAnswer(true)}
              className="flex-1 bg-mint-green hover:bg-mint-green hover:opacity-90"
            >
              ✓ 알았어요
            </Button>
          </motion.div>
        )}

        {/* Mochi Reaction */}
        <MochiReaction isCorrect={lastAnswer} show={showReaction} />

        {/* Celebration Effects */}
        <Confetti trigger={showConfetti} variant="burst" />
      </div>
    </PageLayout>
  )
}
