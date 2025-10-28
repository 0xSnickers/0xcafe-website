/**
 * 多链配置管理
 * 
 * 统一管理所有支持链的配置信息
 * 架构: RPC + PostgreSQL (无需 Subgraph)
 */

export interface ChainConfig {
  chainId: number
  name: string
  symbol: string
  rpcUrl: string
  blockTime: number // 平均出块时间（秒）
  enabled: boolean
  explorerUrl: string
}

/**
 * 支持的链配置
 * 
 * 注意：目前只启用了 Ethereum (chainId: 1)
 * 未来新增链只需：
 * 1. 添加配置到此对象
 * 2. 配置 RPC URL 环境变量
 * 3. 运行同步脚本
 * 4. 将 enabled 设为 true
 */
export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
  // Ethereum Mainnet
  1: {
    chainId: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: process.env.RPC_URL_ETHEREUM || process.env.NEXT_PUBLIC_RPC_URL || 'https://eth.llamarpc.com',
    blockTime: 12,
    enabled: true,
    explorerUrl: 'https://etherscan.io',
  },
  
  // Polygon (待启用)
  137: {
    chainId: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: process.env.RPC_URL_POLYGON || 'https://polygon-rpc.com',
    blockTime: 2,
    enabled: false,
    explorerUrl: 'https://polygonscan.com',
  },
  
  // Base (待启用)
  8453: {
    chainId: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: process.env.RPC_URL_BASE || 'https://mainnet.base.org',
    blockTime: 2,
    enabled: false,
    explorerUrl: 'https://basescan.org',
  },
  
  // Arbitrum (待启用)
  42161: {
    chainId: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: process.env.RPC_URL_ARBITRUM || 'https://arb1.arbitrum.io/rpc',
    blockTime: 0.25,
    enabled: false,
    explorerUrl: 'https://arbiscan.io',
  },
  
  // Optimism (待启用)
  10: {
    chainId: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: process.env.RPC_URL_OPTIMISM || 'https://mainnet.optimism.io',
    blockTime: 2,
    enabled: false,
    explorerUrl: 'https://optimistic.etherscan.io',
  },
  
  // BSC (待启用)
  56: {
    chainId: 56,
    name: 'BNB Chain',
    symbol: 'BNB',
    rpcUrl: process.env.RPC_URL_BSC || 'https://bsc-dataseed.binance.org',
    blockTime: 3,
    enabled: false,
    explorerUrl: 'https://bscscan.com',
  },
}

/**
 * 获取链配置
 * @param chainId 链 ID
 * @returns 链配置对象，如果链未启用或不存在则返回 null
 */
export function getChainConfig(chainId: number): ChainConfig | null {
  const config = SUPPORTED_CHAINS[chainId]
  if (!config) {
    return null
  }
  return config.enabled ? config : null
}

/**
 * 获取所有已启用的链
 * @returns 已启用的链配置数组
 */
export function getEnabledChains(): ChainConfig[] {
  return Object.values(SUPPORTED_CHAINS).filter(chain => chain.enabled)
}

/**
 * 获取已启用的链 ID 列表
 * @returns 链 ID 数组
 */
export function getEnabledChainIds(): number[] {
  return getEnabledChains().map(chain => chain.chainId)
}

/**
 * 验证 chainId 是否有效（已启用）
 * @param chainId 链 ID
 * @returns 是否有效
 */
export function isValidChainId(chainId: number): boolean {
  const config = SUPPORTED_CHAINS[chainId]
  return config !== undefined && config.enabled
}

/**
 * 验证 chainId 是否存在（无论是否启用）
 * @param chainId 链 ID
 * @returns 是否存在
 */
export function isChainIdSupported(chainId: number): boolean {
  return SUPPORTED_CHAINS[chainId] !== undefined
}

/**
 * 获取默认链 ID
 * @returns 默认链 ID (Ethereum)
 */
export function getDefaultChainId(): number {
  return 1 // Ethereum
}

/**
 * 获取所有支持的链（包括未启用的）
 * @returns 所有链配置数组
 */
export function getAllChains(): ChainConfig[] {
  return Object.values(SUPPORTED_CHAINS)
}

/**
 * 根据链名称获取配置
 * @param name 链名称（不区分大小写）
 * @returns 链配置对象或 null
 */
export function getChainConfigByName(name: string): ChainConfig | null {
  const normalizedName = name.toLowerCase()
  const config = Object.values(SUPPORTED_CHAINS).find(
    chain => chain.name.toLowerCase() === normalizedName
  )
  return config?.enabled ? config : null
}

