import * as React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { Web3Provider } from '@/components/providers/web3-provider'
import { Analytics } from "@vercel/analytics/next"
import { locales, type Locale } from '@/lib/i18n/server'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

// 生成静态参数（用于静态生成）
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// 生成元数据（根据语言动态生成）
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeStr } = await params
  const locale = (localeStr === 'zh' ? 'zh' : 'en') as Locale
  
  const isZh = locale === 'zh'
  
  return {
    metadataBase: new URL('https://www.0xcafe.fun'),
    title: {
      default: isZh ? '0xcafe - 免费区块链工具' : '0xcafe - Free Blockchain Tools',
      template: '%s | 0xcafe',
    },
    description: isZh 
      ? '实时追踪以太坊 Gas 价格，分析燃烧费用，探索区块链数据 - 0xcafe 综合 Web3 分析平台'
      : 'Track Ethereum gas prices in real-time, analyze burnt fees, and explore blockchain data with 0xcafe - Your comprehensive Web3 analytics platform.',
    keywords: [
      'ethereum gas tracker',
      'gas price',
      'burnt fees',
      'blockchain analytics',
      'web3 tools',
      'crypto analytics',
      'ethereum statistics',
      'eip-1559',
      'base fee',
      'priority fee',
      ...(isZh ? ['以太坊 Gas 追踪器', 'Gas 价格', '燃烧费用', '区块链分析'] : []),
    ],
    authors: [{ name: '0xcafe', url: 'https://www.0xcafe.fun' }],
    creator: '0xcafe Team',
    publisher: '0xcafe',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? ['en_US'] : ['zh_CN'],
      url: `https://www.0xcafe.fun/${locale}`,
      title: isZh ? '0xcafe - 免费区块链工具' : '0xcafe - Free Blockchain Tools',
      description: isZh 
        ? '追踪以太坊 Gas 价格，分析燃烧费用，探索区块链数据'
        : 'Track Ethereum gas prices, analyze burnt fees, and explore blockchain data.',
      siteName: '0xcafe',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: '0xcafe - Web3 Analytics Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@0xcafe',
      creator: '@0xcafe',
      title: isZh ? '0xcafe - 以太坊 Gas 追踪器' : '0xcafe - Ethereum Gas Tracker',
      description: isZh 
        ? '追踪以太坊 Gas 价格和区块链分析'
        : 'Track Ethereum gas prices and blockchain analytics',
      images: ['/twitter-image.png'],
    },
    alternates: {
      canonical: `https://www.0xcafe.fun/${locale}`,
      languages: {
        'en-US': 'https://www.0xcafe.fun/en',
        'zh-CN': 'https://www.0xcafe.fun/zh',
      },
    },
    manifest: '/manifest.json',
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-icon.png',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale: localeStr } = await params
  const locale = (localeStr === 'zh' ? 'zh' : 'en') as Locale
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '0xcafe',
    url: 'https://www.0xcafe.fun',
    description: locale === 'zh' 
      ? '以太坊 Gas 追踪器与 Web3 分析平台'
      : 'Ethereum Gas Tracker & Web3 Analytics Platform',
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://www.0xcafe.fun/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider initialLocale={locale}>
            <Web3Provider>
              {children}
            </Web3Provider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

