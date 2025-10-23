/**
 * 链配置管理
 * 统一的链配置，供项目各处使用
 */

/**
 * 链配置接口
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

/**
 * 支持的链类型
 */
export type SupportedChain = 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'base' | 'optimism'

/**
 * 链配置映射
 */
export const CHAIN_CONFIGS: Record<SupportedChain, ChainConfig> = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3',
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
  bsc: {
    id: 56,
    name: 'BSC',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    apiKey: process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || '',
    alchemyChainName: 'bnb-mainnet',
    color: '#F3BA2F',
    icon: '/coins/bsc.png',
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
} as const

/**
 * 获取链配置
 * @param chain - 链类型
 * @returns 链配置
 */
export function getChainConfig(chain: SupportedChain): ChainConfig {
  return CHAIN_CONFIGS[chain]
}

/**
 * 根据链 ID 获取链配置
 * @param chainId - 链 ID
 * @returns 链配置或 undefined
 */
export function getChainConfigById(chainId: number): ChainConfig | undefined {
  return Object.values(CHAIN_CONFIGS).find(config => config.id === chainId)
}

/**
 * 根据链 ID 字符串获取链配置
 * @param chainId - 链 ID 字符串
 * @returns 链配置或 undefined
 */
export function getChainConfigByIdString(chainId: string): ChainConfig | undefined {
  const id = parseInt(chainId, 10)
  return isNaN(id) ? undefined : getChainConfigById(id)
}

/**
 * 获取所有支持的链
 * @returns 所有链配置数组
 */
export function getAllChains(): ChainConfig[] {
  return Object.values(CHAIN_CONFIGS)
}

/**
 * 获取链的 Alchemy 端点 URL
 * @param chain - 链类型
 * @returns Alchemy 端点 URL
 */
export function getAlchemyEndpointURL(chain: SupportedChain): string {
  const config = getChainConfig(chain)
  return `https://${config.alchemyChainName}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
}

/**
 * 根据链 ID 获取 Alchemy 端点 URL
 * @param chainId - 链 ID
 * @returns Alchemy 端点 URL
 */
export function getAlchemyEndpointURLById(chainId: string): string {
  const config = getChainConfigByIdString(chainId)
  if (!config) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }
  return `https://${config.alchemyChainName}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
}

/**
 * 检查链是否支持
 * @param chain - 链类型
 * @returns 是否支持
 */
export function isSupportedChain(chain: string): chain is SupportedChain {
  return chain in CHAIN_CONFIGS
}

/**
 * 检查链 ID 是否支持
 * @param chainId - 链 ID
 * @returns 是否支持
 */
export function isSupportedChainId(chainId: number): boolean {
  return getChainConfigById(chainId) !== undefined
}

/**
 * 获取链的显示名称
 * @param chain - 链类型
 * @returns 显示名称
 */
export function getChainDisplayName(chain: SupportedChain): string {
  return getChainConfig(chain).name
}

/**
 * 获取链的符号
 * @param chain - 链类型
 * @returns 符号
 */
export function getChainSymbol(chain: SupportedChain): string {
  return getChainConfig(chain).symbol
}

/**
 * 获取链的浏览器 URL
 * @param chain - 链类型
 * @returns 浏览器 URL
 */
export function getChainExplorerUrl(chain: SupportedChain): string {
  return getChainConfig(chain).explorerUrl
}

/**
 * 获取链的颜色
 * @param chain - 链类型
 * @returns 颜色
 */
export function getChainColor(chain: SupportedChain): string {
  return getChainConfig(chain).color
}

/**
 * 获取链的图标
 * @param chain - 链类型
 * @returns 图标路径
 */
export function getChainIcon(chain: SupportedChain): string {
  return getChainConfig(chain).icon
}
