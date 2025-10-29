import * as React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { Web3Provider } from '@/components/providers/web3-provider'
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.0xcafe.fun'),
  title: {
    default: '0xcafe - Ethereum Gas Tracker & Web3 Analytics',
    template: '%s | 0xcafe',
  },
  description: 'Track Ethereum gas prices in real-time, analyze burnt fees, and explore blockchain data with 0xcafe - Your comprehensive Web3 analytics platform.',
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
    locale: 'en_US',
    alternateLocale: ['zh_CN'],
    url: 'https://www.0xcafe.fun',
    title: '0xcafe - Ethereum Gas Tracker & Web3 Analytics',
    description: 'Track Ethereum gas prices, analyze burnt fees, and explore blockchain data.',
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
    title: '0xcafe - Ethereum Gas Tracker',
    description: 'Track Ethereum gas prices and blockchain analytics',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://www.0xcafe.fun',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '0xcafe',
    url: 'https://www.0xcafe.fun',
    description: 'Ethereum Gas Tracker & Web3 Analytics Platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.0xcafe.fun/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
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
          <I18nProvider>
            <Web3Provider>
              {children}
            </Web3Provider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

