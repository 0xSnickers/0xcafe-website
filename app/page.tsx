import { MainLayout } from '@/components/layout/main-layout'
import { HeroSection } from '@/components/sections/hero-section'
import { ToolsSection } from '@/components/sections/tools-section'
import { ValuesSection } from '@/components/sections/values-section'

// ISR: 重新验证时间为 5 分钟（300秒）
export const revalidate = 300

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <ToolsSection />
      <ValuesSection />
    </MainLayout>
  )
}

