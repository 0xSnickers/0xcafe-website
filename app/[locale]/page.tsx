import { MainLayout } from '@/components/layout/main-layout'
import { HeroSectionServer } from '@/components/sections/hero-section-server'
import { ToolsSectionServer } from '@/components/sections/tools-section-server'
import { ValuesSectionServer } from '@/components/sections/values-section-server'
import type { Locale } from '@/lib/i18n/server'

// ISR: 重新验证时间为 5 分钟（300秒）
export const revalidate = 300

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeStr } = await params
  const locale = (localeStr === 'zh' ? 'zh' : 'en') as Locale

  return (
    <MainLayout>
      {/* 所有内容都由服务端组件渲染 - SEO 友好 */}
      <HeroSectionServer locale={locale} />
      <ToolsSectionServer locale={locale} />
      <ValuesSectionServer locale={locale} />
    </MainLayout>
  )
}

