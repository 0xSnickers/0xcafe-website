import * as React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTranslations, type Locale } from '@/lib/i18n/server'
import { ValueAnimations } from './value-animations'

/**
 * 价值主张区域 - 服务端版本
 * SEO 优化：所有文字内容服务端渲染
 */
export async function ValuesSectionServer({ locale }: { locale: Locale }) {
  const t = await getTranslations(locale)

  const values = [
    {
      id: 'flexible',
      animationType: 'flexible' as const,
      ctaHref: null, // 灵活定价没有特定链接
    },
    {
      id: 'secure',
      animationType: 'secure' as const,
      ctaHref: null,
    },
    {
      id: 'professional',
      animationType: 'professional' as const,
      ctaHref: `/${locale}/contact`,
    },
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((value) => (
            <div key={value.id} className="relative">
              <div className="relative group">
                {/* Card */}
                <div className="relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-6 text-center">
                    {t(`values.${value.id}.title`)}
                  </h3>

                  {/* Animated Illustration */}
                  <div className="mb-6">
                    <ValueAnimations type={value.animationType} />
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-center leading-relaxed mb-6">
                    {t(`values.${value.id}.description`)}
                  </p>

                  {/* CTA */}
                  <div className="text-center">
                    {value.ctaHref ? (
                      <Link href={value.ctaHref}>
                        <Button variant="ghost" className="group/btn">
                          {t(`values.${value.id}.cta`)}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="ghost" className="group/btn">
                        {t(`values.${value.id}.cta`)}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 rounded-2xl pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

