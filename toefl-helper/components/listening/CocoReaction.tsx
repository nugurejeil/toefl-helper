'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface CocoReactionProps {
  isCorrect: boolean | null
  show: boolean
}

export default function CocoReaction({ isCorrect, show }: CocoReactionProps) {
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
            {/* Coco Character */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, -3, 3, 0]
              }}
              transition={{
                duration: 0.8,
                repeat: 2,
              }}
              className="relative"
            >
              <Image
                src="/Coco_idle.webp"
                alt="Coco"
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
                    {isCorrect ? '🎧 Great listening!' : '👂 Listen again!'}
                  </p>
                </div>

                {/* Speech bubble tail */}
                <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[24px] border-t-white" />
                  <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[20px] absolute -top-[24px] left-1/2 transform -translate-x-1/2 border-t-white" />
                </div>
              </div>
            </motion.div>

            {/* Snowflakes effect for correct answers (Coco is a polar bear!) */}
            {isCorrect && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 1,
                      opacity: 1
                    }}
                    animate={{
                      x: Math.random() * 300 - 150,
                      y: Math.random() * 300 - 150,
                      scale: 0,
                      opacity: 0
                    }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.03,
                    }}
                    className="absolute top-1/2 left-1/2"
                  >
                    <div className="text-2xl">
                      {['❄️', '⭐', '💙', '🌨️'][Math.floor(Math.random() * 4)]}
                    </div>
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
