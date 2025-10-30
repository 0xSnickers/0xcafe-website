/**
 * 链配置
 * 集中管理所有链的配置信息
 */

export interface ChainConfig {
  id: number
  name: string
  symbol: string
  rpcUrl: string
  explorerUrl: string
  apiKey: string
  alchemyChainName: string
  color: string
  icon: string
}

export type SupportedChain = 'ethereum' | 'polygon' | 'arbitrum' | 'base' | 'optimism'

/**
 * 链配置映射 (仅 EIP-1559 兼容链)
 */
export const chainsConfig: Record<SupportedChain, ChainConfig> = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2',
    explorerUrl: 'https://etherscan.io',
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
    alchemyChainName: 'eth-mainnet',
    color: '#627EEA',
    icon: '/coins/eth.png',
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    apiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY || '',
    alchemyChainName: 'polygon-mainnet',
    color: '#8247E5',
    icon: '/coins/polygon.png',
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    apiKey: process.env.NEXT_PUBLIC_ARBISCAN_API_KEY || '',
    alchemyChainName: 'arb-mainnet',
    color: '#28A0F0',
    icon: '/coins/arbitrum.png',
  },
  base: {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    apiKey: process.env.NEXT_PUBLIC_BASESCAN_API_KEY || '',
    alchemyChainName: 'base-mainnet',
    color: '#0052FF',
    icon: '/coins/base.png',
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    apiKey: process.env.NEXT_PUBLIC_OPTIMISMSCAN_API_KEY || '',
    alchemyChainName: 'opt-mainnet',
    color: '#FF0420',
    icon: '/coins/op.png',
  },
}

/**
 * 获取链配置
 */
export function getChainConfig(chain: SupportedChain): ChainConfig {
  return chainsConfig[chain]
}

/**
 * 根据链 ID 获取链配置
 */
export function getChainConfigById(chainId: number): ChainConfig | undefined {
  return Object.values(chainsConfig).find(config => config.id === chainId)
}

/**
 * 获取所有支持的链
 */
export function getAllChains(): ChainConfig[] {
  return Object.values(chainsConfig)
}

/**
 * 获取链的 Alchemy 端点 URL
 */
export function getAlchemyEndpointURL(chain: SupportedChain): string {
  const config = getChainConfig(chain)
  return `https://${config.alchemyChainName}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
}

/**
 * 根据链 ID 获取 Alchemy 端点 URL
 */
export function getAlchemyEndpointURLById(chainId: string): string {
  const id = parseInt(chainId, 10)
  const config = getChainConfigById(id)
  if (!config) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }
  return `https://${config.alchemyChainName}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
}

