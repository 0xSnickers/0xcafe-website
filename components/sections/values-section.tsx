'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * 价值主张区域
 * 展示灵活定价、安全保障、专业可靠三大特性
 */
export function ValuesSection() {
  const { t } = useTranslation()
  const router = useRouter()

  // 处理CTA按钮点击
  const handleCtaClick = (valueId: string) => {
    if (valueId === 'professional') {
      router.push('/contact')
    }
    // 其他按钮可以添加对应的逻辑
  }

  const values = [
    {
      id: 'flexible',
      illustration: (
        <div className="relative w-full h-64 flex items-center justify-center">
          {/* Central gift box representing free */}
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

          {/* Free tag floating */}
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

          {/* Sparkles around */}
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
      ),
    },
    {
      id: 'secure',
      illustration: (
        <div className="relative w-full h-64 flex items-center justify-center">
          {/* Central open book/code window */}
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
            {/* Open book/window background */}
            <div className="w-40 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-2 border-blue-500/40 rounded-xl flex items-center justify-center p-4 shadow-xl">
              {/* Code lines - simulating open source code */}
              <div className="space-y-2 w-full">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  className="h-2 bg-blue-400/60 rounded w-full"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  className="h-2 bg-cyan-400/60 rounded w-3/4"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  className="h-2 bg-green-400/60 rounded w-5/6"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                  className="h-2 bg-blue-400/60 rounded w-2/3"
                />
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

          {/* Git branch icon effect */}
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
      ),
    },
    {
      id: 'professional',
      illustration: (
        <div className="relative w-full h-64 flex items-center justify-center">
          {/* Central handshake - representing custom service & partnership */}
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

          {/* Sparkles - excellence */}
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
      ),
    },
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="relative group">
                {/* Card */}
                <div className="relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-6 text-center">
                    {t(`values.${value.id}.title`)}
                  </h3>

                  {/* Illustration */}
                  <div className="mb-6">{value.illustration}</div>

                  {/* Description */}
                  <p className="text-muted-foreground text-center leading-relaxed mb-6">
                    {t(`values.${value.id}.description`)}
                  </p>

                  {/* Link */}
                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      className="group/btn"
                      onClick={() => handleCtaClick(value.id)}
                    >
                      {t(`values.${value.id}.cta`)}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 rounded-2xl pointer-events-none" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

