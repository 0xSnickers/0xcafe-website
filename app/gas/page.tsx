import type { Metadata } from 'next'
import { MainLayout } from '@/components/layout/main-layout'
import { GasPriceSection } from '@/components/sections/gas-price-section'
import { BurnHistorySection } from '@/components/sections/burn-history-section'

export const metadata: Metadata = {
  title: 'Ethereum Gas Tracker - Real-time Gas Prices & Burnt Fees',
  description: 'Track Ethereum gas prices in real-time, view burnt fees statistics, and analyze blockchain burn history. Updated every 15 seconds.',
  keywords: [
    'ethereum gas tracker',
    'gas price now',
    'burnt fees',
    'eth gas price',
    'eip-1559',
    'base fee',
    'priority fee',
    'gas fee calculator',
  ],
  openGraph: {
    title: 'Ethereum Gas Tracker - 0xcafe',
    description: 'Real-time Ethereum gas prices and burnt fees analysis',
    url: 'https://www.0xcafe.fun/gas',
    images: [
      {
        url: '/og-gas.png',
        width: 1200,
        height: 630,
        alt: 'Ethereum Gas Tracker',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.0xcafe.fun/gas',
  },
}

export default function GasPage() {
  return (
    <MainLayout>
      <GasPriceSection />
      <BurnHistorySection />
    </MainLayout>
  )
}

