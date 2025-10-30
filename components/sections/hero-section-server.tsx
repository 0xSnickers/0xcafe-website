import * as React from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTranslations, type Locale } from '@/lib/i18n/server'
import { AnimatedCodeEditor } from './hero-animated-code'

/**
 * 首页英雄区域组件 - 服务端版本
 * SEO 优化：所有文字内容服务端渲染
 */
export async function HeroSectionServer({ locale }: { locale: Locale }) {
  const t = await getTranslations(locale)

  // 主流币种配置
  const coins = [
    { name: 'Ethereum', image: '/coins/eth.png' },
    { name: 'Optimism', image: '/coins/op.png' },
    { name: 'Polygon', image: '/coins/polygon.png' },
    { name: 'BSC', image: '/coins/bsc.png' },
    { name: 'Base', image: '/coins/base.png' },
    { name: 'Bitcoin', image: '/coins/btc.png' },
    { name: 'Solana', image: '/coins/solana.png' },
  ]

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden px-4 pt-24 pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content (服务端渲染) */}
          <div className="space-y-8">
            {/* Free Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 shadow-lg">
              <Sparkles className="h-5 w-5 text-green-500" />
              <span className="text-base font-bold text-green-500">{t('hero.freeBadge')}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>

            {/* Highlight Features */}
            <div className="flex flex-wrap gap-4">
              {['free', 'secure', 'professional'].map((key) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 backdrop-blur-sm"
                >
                  <span className="text-2xl">{t(`hero.features.${key}.icon`)}</span>
                  <span className="text-sm font-medium">{t(`hero.features.${key}.label`)}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button 
              size="lg" 
              className="h-12 px-8 text-base font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all"
            >
              {t('hero.cta')}
            </Button>
          </div>

          {/* Right side - Animated Illustration (客户端组件) */}
          <div className="relative hidden lg:flex items-center justify-center">
            <AnimatedCodeEditor coins={coins} />
          </div>
        </div>
      </div>

      {/* Background gradient orbs (静态，无需动画) */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
    </section>
  )
}

