'use client'

import * as React from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'
import { markUserInteraction, getModalInstance } from '@/lib/config/web3'

/**
 * 钱包连接按钮组件
 * 集成 Reown AppKit，支持多链钱包连接
 */
export function WalletButton() {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [isReady, setIsReady] = React.useState(false)

  // 初始化完成标记
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 300) // 短暂延迟确保页面稳定
    
    return () => clearTimeout(timer)
  }, [])

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // 手动打开钱包连接 modal
  const handleConnect = React.useCallback(() => {
    if (!isReady) return
    
    try {
      // 标记用户已交互
      markUserInteraction()
      
      // 获取或创建 modal 实例
      const modalInstance = getModalInstance()
      
      if (modalInstance?.open) {
        modalInstance.open()
      }
    } catch (error) {
      console.error('Failed to open wallet modal:', error)
    }
  }, [isReady])

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        variant="default"
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        disabled={!isReady}
      >
        <Wallet className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">{t('wallet.connect')}</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-0 sm:gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">
            {address && formatAddress(address)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('wallet.myAccount')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          const modalInstance = getModalInstance()
          modalInstance?.open?.()
        }}>
          <User className="mr-2 h-4 w-4" />
          {t('wallet.viewAccount')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          const modalInstance = getModalInstance()
          modalInstance?.open?.({ view: 'Networks' })
        }}>
          <span className="mr-2">🌐</span>
          {t('wallet.switchNetwork')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => disconnect()}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('wallet.disconnect')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

