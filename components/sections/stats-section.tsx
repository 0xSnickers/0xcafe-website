'use client'

import * as React from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { TrendingUp, Users, Zap, Globe } from 'lucide-react'

/**
 * 统计数据展示区域
 * 展示关键指标和数据
 */
export function StatsSection() {
  const { t } = useTranslation()

  const stats = [
    {
      icon: Users,
      key: 'users',
      target: 10000,
      suffix: '+',
      color: 'text-blue-500',
    },
    {
      icon: TrendingUp,
      key: 'growth',
      target: 250,
      suffix: '%',
      color: 'text-green-500',
    },
    {
      icon: Zap,
      key: 'transactions',
      target: 1000000,
      suffix: '+',
      color: 'text-yellow-500',
    },
    {
      icon: Globe,
      key: 'countries',
      target: 50,
      suffix: '+',
      color: 'text-purple-500',
    },
  ]

  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {t('stats.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('stats.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.key} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface StatCardProps {
  stat: {
    icon: React.ElementType
    key: string
    target: number
    suffix: string
    color: string
  }
  index: number
}

function StatCard({ stat, index }: StatCardProps) {
  const { t } = useTranslation()
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  
  const count = useMotionValue(0)
  const rounded = useSpring(count, { stiffness: 50, damping: 30 })
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    if (isInView) {
      count.set(stat.target)
    }
  }, [isInView, stat.target, count])

  React.useEffect(() => {
    return rounded.on('change', (latest) => {
      setDisplayValue(Math.floor(latest))
    })
  }, [rounded])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="relative group"
    >
      <div className="relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300">
        {/* Icon */}
        <div className={`mb-4 ${stat.color}`}>
          <stat.icon className="h-10 w-10" />
        </div>

        {/* Value */}
        <div className="space-y-2">
          <div className="text-4xl md:text-5xl font-bold">
            {formatNumber(displayValue)}
            <span className="text-3xl">{stat.suffix}</span>
          </div>
          <div className="text-muted-foreground font-medium">
            {t(`stats.items.${stat.key}.label`)}
          </div>
          <p className="text-sm text-muted-foreground/80">
            {t(`stats.items.${stat.key}.description`)}
          </p>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300" />
      </div>
    </motion.div>
  )
}

