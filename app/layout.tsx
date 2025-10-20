import * as React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { Web3Provider } from '@/components/providers/web3-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '0xcafe - Build the Future',
  description: 'Innovative solutions for modern challenges',
  keywords: ['web3', 'blockchain', 'technology', 'innovation'],
  authors: [{ name: '0xcafe' }],
  creator: '0xcafe',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://0xcafe.fun',
    title: '0xcafe - Build the Future',
    description: 'Innovative solutions for modern challenges',
    siteName: '0xcafe',
  },
  twitter: {
    card: 'summary_large_image',
    title: '0xcafe - Build the Future',
    description: 'Innovative solutions for modern challenges',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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

