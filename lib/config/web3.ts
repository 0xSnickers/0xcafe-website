/**
 * Web3 配置文件
 * 配置 Reown AppKit (WalletConnect) 和支持的区块链网络
 */

import { createAppKit } from '@reown/appkit/react'
import { mainnet, bsc, polygon, arbitrum, base } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 环境变量验证
if (!process.env.NEXT_PUBLIC_REOWN_PROJECT_ID) {
  console.warn('Warning: NEXT_PUBLIC_REOWN_PROJECT_ID is not set in .env.local')
}

// 配置项目元数据
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || ''

export const metadata = {
  name: '0xcafe',
  description: 'Web3 Utility Toolbox - 100% Free Tools',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://0xcafe.tools',
  icons: ['/favicon.jpg']
}

// 配置支持的网络
export const networks = [
  mainnet,   // Ethereum
  bsc,       // Binance Smart Chain
  polygon,   // Polygon
  arbitrum,  // Arbitrum
  base,      // Base
]

// 解析环境变量中的链ID
const getSupportedChainIds = (): number[] => {
  const chains = process.env.NEXT_PUBLIC_SUPPORTED_CHAINS || '1,56,137,42161,8453'
  return chains.split(',').map(id => parseInt(id.trim(), 10))
}

export const supportedChainIds = getSupportedChainIds()

// 创建 Wagmi Adapter（禁用自动连接）
export const wagmiAdapter = new WagmiAdapter({
  networks: networks as any,
  projectId,
  ssr: true, // 启用服务端渲染支持，防止客户端水合问题
})

// 配置 Wagmi 禁用自动重连
if (typeof window !== 'undefined') {
  // 清除可能导致自动连接的缓存
  try {
    const walletConnectKeys = Object.keys(localStorage).filter(
      key => key.startsWith('wc@2:') || 
             key.startsWith('wagmi.') || 
             key.startsWith('reown') ||
             key.includes('walletconnect')
    )
    // 不完全删除，只标记为需要手动重连
    walletConnectKeys.forEach(key => {
      if (!key.includes('.store')) { // 保留存储，只清除连接状态
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    // 忽略错误
  }
}

// 创建 Query Client
export const queryClient = new QueryClient()

// AppKit 实例的延迟创建包装器
let _modal: any = null
let _isCreating = false
let _userInteracted = false

/**
 * 创建 AppKit 实例
 * 使用标志位确保只在用户交互后创建
 */
function createModalInstance() {
  if (_modal) return _modal
  if (_isCreating) return null
  
  _isCreating = true
  
  try {
    _modal = createAppKit({
      adapters: [wagmiAdapter],
      networks: networks as any,
      defaultNetwork: mainnet,
      projectId,
      metadata,
      features: {
        analytics: true,
        email: false,
        socials: [],
        emailShowWallets: true,
      },
      themeMode: 'dark',
      themeVariables: {
        '--w3m-color-mix': '#FF6B00',
        '--w3m-accent': '#FF6B00',
        '--w3m-border-radius-master': '12px',
      },
    })
    
    return _modal
  } catch (error) {
    console.error('Failed to create AppKit:', error)
    _isCreating = false
    return null
  }
}

/**
 * 标记用户已交互
 * 只有在用户交互后才允许创建 modal
 */
export function markUserInteraction() {
  _userInteracted = true
}

/**
 * 获取 modal 实例（如果需要的话创建）
 */
export function getModalInstance() {
  if (!_userInteracted) return null
  return _modal || createModalInstance()
}

// 导出一个代理对象
// eslint-disable-next-line no-undef
export const modal = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getModalInstance()
    if (!instance) {
      // 如果还没有实例，返回空函数
      if (prop === 'open' || prop === 'close') {
        return () => {
          console.warn('AppKit not initialized yet. User interaction required.')
        }
      }
      return undefined
    }
    return instance[prop]
  }
})

// 导出 Wagmi Config
export const config = wagmiAdapter.wagmiConfig

