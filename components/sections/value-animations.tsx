'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

type AnimationType = 'flexible' | 'secure' | 'professional'

/**
 * 价值主张动画组件 - 客户端专用
 * 包含三种不同的动画效果
 */
export function ValueAnimations({ type }: { type: AnimationType }) {
  switch (type) {
    case 'flexible':
      return <FlexibleAnimation />
    case 'secure':
      return <SecureAnimation />
    case 'professional':
      return <ProfessionalAnimation />
  }
}

// 灵活定价动画
function FlexibleAnimation() {
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* Central gift box */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-8xl"
      >
        🎁
      </motion.div>

      {/* Free tag */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-0 left-1 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold shadow-lg"
      >
        100% FREE
      </motion.div>

      {/* Sparkles */}
      {[...Array(6)].map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180
        const radius = 80
        return (
          <motion.div
            key={i}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
            className="absolute text-2xl"
            style={{
              left: `calc(50% + ${radius * Math.cos(angle)}px)`,
              top: `calc(50% + ${radius * Math.sin(angle)}px)`,
            }}
          >
            ✨
          </motion.div>
        )
      })}
    </div>
  )
}

// 安全保障动画
function SecureAnimation() {
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* Central code window */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Code window */}
        <div className="w-40 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-2 border-blue-500/40 rounded-xl flex items-center justify-center p-4 shadow-xl">
          {/* Code lines */}
          <div className="space-y-2 w-full">
            {[0, 0.3, 0.6, 0.9].map((delay, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay }}
                className={`h-2 rounded ${
                  i === 1 ? 'bg-cyan-400/60 w-3/4' :
                  i === 2 ? 'bg-green-400/60 w-5/6' :
                  i === 3 ? 'bg-blue-400/60 w-2/3' :
                  'bg-blue-400/60 w-full'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating code brackets */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-16 right-2 text-2xl font-mono text-cyan-500"
      >
        &lt;/&gt;
      </motion.div>

      {/* Git branch icon */}
      <motion.div
        animate={{
          x: [0, 5, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-8 left-0 text-xl"
      >
        🌿
      </motion.div>
    </div>
  )
}

// 专业可靠动画
function ProfessionalAnimation() {
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* Central handshake */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-8xl"
      >
        🤝
      </motion.div>

      {/* Sparkles */}
      {[...Array(4)].map((_, i) => {
        const positions = [
          { top: '20%', left: '15%' },
          { top: '25%', right: '18%' },
          { bottom: '22%', left: '20%' },
          { bottom: '18%', right: '15%' },
        ]
        return (
          <motion.div
            key={i}
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
            className="absolute text-xl"
            style={positions[i]}
          >
            ✨
          </motion.div>
        )
      })}
    </div>
  )
}

