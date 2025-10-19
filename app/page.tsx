import { MainLayout } from '@/components/layout/main-layout'
import { HeroSection } from '@/components/sections/hero-section'
import { ToolsSection } from '@/components/sections/tools-section'
import { ValuesSection } from '@/components/sections/values-section'

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <ToolsSection />
      <ValuesSection />
    </MainLayout>
  )
}

