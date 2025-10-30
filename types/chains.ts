/**
 * 链相关类型定义
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

