'use client'

import * as React from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient } from '@/lib/config/web3'

/**
 * Web3 Provider
 * 为整个应用提供 Wagmi 和 Reown AppKit 上下文
 * 
 * 策略：禁用自动连接，只在用户主动操作时才连接钱包
 */
export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  // 防止服务端渲染时的水合问题
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

