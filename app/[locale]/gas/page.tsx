import type { Metadata } from 'next'
import { MainLayout } from '@/components/layout/main-layout'
import { GasPriceSection } from '@/components/sections/gas-price-section'
import { BurnHistorySection } from '@/components/sections/burn-history-section'
import { type Locale } from '@/lib/i18n/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeStr } = await params
  const locale = (localeStr === 'zh' ? 'zh' : 'en') as Locale
  const isZh = locale === 'zh'
  
  return {
    title: isZh 
      ? '以太坊 Gas 追踪器 - 实时 Gas 价格与燃烧费用'
      : 'Ethereum Gas Tracker - Real-time Gas Prices & Burnt Fees',
    description: isZh
      ? '实时追踪以太坊 Gas 价格，查看燃烧费用统计，分析区块链燃烧历史。每 15 秒更新一次。'
      : 'Track Ethereum gas prices in real-time, view burnt fees statistics, and analyze blockchain burn history. Updated every 15 seconds.',
    keywords: [
      'ethereum gas tracker',
      'gas price now',
      'burnt fees',
      'eth gas price',
      'eip-1559',
      'base fee',
      'priority fee',
      'gas fee calculator',
      ...(isZh ? ['以太坊 Gas 追踪器', 'Gas 价格', '燃烧费用', 'Gas 费用计算器'] : []),
    ],
    openGraph: {
      title: isZh 
        ? '以太坊 Gas 追踪器 - 0xcafe'
        : 'Ethereum Gas Tracker - 0xcafe',
      description: isZh
        ? '实时以太坊 Gas 价格和燃烧费用分析'
        : 'Real-time Ethereum gas prices and burnt fees analysis',
      url: `https://www.0xcafe.fun/${locale}/gas`,
      images: [
        {
          url: '/og-gas.png',
          width: 1200,
          height: 630,
          alt: isZh ? '以太坊 Gas 追踪器' : 'Ethereum Gas Tracker',
        },
      ],
    },
    alternates: {
      canonical: `https://www.0xcafe.fun/${locale}/gas`,
      languages: {
        'en-US': 'https://www.0xcafe.fun/en/gas',
        'zh-CN': 'https://www.0xcafe.fun/zh/gas',
      },
    },
  }
}

export default function GasPage() {
  return (
    <MainLayout>
      <GasPriceSection />
      <BurnHistorySection />
    </MainLayout>
  )
}

