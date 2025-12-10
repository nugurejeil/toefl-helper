'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface MochiReactionProps {
  isCorrect: boolean | null
  show: boolean
}

export default function MochiReaction({ isCorrect, show }: MochiReactionProps) {
  return (
    <AnimatePresence>
      {show && isCorrect !== null && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className="relative">
            {/* Mochi Character */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 1,
                repeat: 2,
              }}
              className="relative"
            >
              <Image
                src="/Mochi_idle.webp"
                alt="Mochi"
                width={200}
                height={200}
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Reaction Bubble - Comic Style */}
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-32 left-1/2 transform -translate-x-1/2"
            >
              <div className="relative">
                {/* Main bubble */}
                <div
                  className="px-8 py-4 rounded-3xl shadow-2xl whitespace-nowrap border-4 border-white bg-white relative"
                  style={{
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* Inner highlight for comic effect */}
                  <div className="absolute top-2 left-4 w-8 h-6 bg-gray-100 opacity-60 rounded-full blur-sm" />

                  <p className={`text-2xl font-bold relative z-10 ${
                    isCorrect ? 'text-mint-green' : 'text-strawberry-pink'
                  }`} style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)' }}>
                    {isCorrect ? '🎉 Perfect!' : '💪 Keep trying!'}
                  </p>
                </div>

                {/* Speech bubble tail - comic style with multiple layers */}
                <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2">
                  {/* Outer border tail */}
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[24px] border-t-white" />
                  {/* Inner fill tail */}
                  <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[20px] absolute -top-[24px] left-1/2 transform -translate-x-1/2 border-t-white" />
                </div>
              </div>
            </motion.div>

            {/* Confetti effect for correct answers */}
            {isCorrect && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 1,
                      opacity: 1
                    }}
                    animate={{
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 400 - 200,
                      scale: 0,
                      opacity: 0
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.02,
                    }}
                    className="absolute top-1/2 left-1/2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          '#A8D5BA',
                          '#F4D03F',
                          '#E8A0A0',
                          '#D4A574'
                        ][Math.floor(Math.random() * 4)]
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
