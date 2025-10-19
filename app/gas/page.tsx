import { MainLayout } from '@/components/layout/main-layout'
import { GasPriceSection } from '@/components/sections/gas-price-section'
import { BurnHistorySection } from '@/components/sections/burn-history-section'

export default function GasPage() {
  return (
    <MainLayout>
      <GasPriceSection />
      <BurnHistorySection />
    </MainLayout>
  )
}

