/**
 * HTTP请求配置文件
 */

import { ChainConfig, RequestConfig, SupportedChain } from './types'

/**
 * 默认请求配置
 */
export const DEFAULT_REQUEST_CONFIG: RequestConfig = {
  timeout: 10000, // 10秒超时
  retries: 3, // 重试3次
  retryDelay: 1000, // 重试延迟1秒
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': '0xcafe-website/1.0.0',
  },
}

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
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || 'X9S3IXSVZ8W7P8D1EJV42KNMBG9I6PH6MX',
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    apiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY || '',
  },
  bsc: {
    id: 56,
    name: 'BSC',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    apiKey: process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || '',
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    apiKey: process.env.NEXT_PUBLIC_ARBISCAN_API_KEY || '',
  },
  base: {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    apiKey: process.env.NEXT_PUBLIC_BASESCAN_API_KEY || '',
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    apiKey: process.env.NEXT_PUBLIC_OPTIMISMSCAN_API_KEY || '',
  },
}

/**
 * API端点配置
 */
export const API_ENDPOINTS = {
  ETHERSCAN: {
    BASE_URL: 'https://api.etherscan.io/v2/api', // 使用 V2 API
    GAS_ORACLE: '/gastracker',
    BLOCK: '/proxy',
  },
  POLYGONSCAN: {
    BASE_URL: 'https://api.polygonscan.com/api',
    GAS_ORACLE: '/gastracker',
    BLOCK: '/proxy',
  },
  BSCSCAN: {
    BASE_URL: 'https://api.bscscan.com/api',
    GAS_ORACLE: '/gastracker',
    BLOCK: '/proxy',
  },
  ARBISCAN: {
    BASE_URL: 'https://api.arbiscan.io/api',
    GAS_ORACLE: '/gastracker',
    BLOCK: '/proxy',
  },
  BASESCAN: {
    BASE_URL: 'https://api.basescan.org/api',
    GAS_ORACLE: '/gastracker',
    BLOCK: '/proxy',
  },
  OPTIMISMSCAN: {
    BASE_URL: 'https://api-optimistic.etherscan.io/api',
    GAS_ORACLE: '/gastracker',
    BLOCK: '/proxy',
  },
} as const

/**
 * 获取链配置
 */
export function getChainConfig(chain: SupportedChain): ChainConfig {
  return CHAIN_CONFIGS[chain]
}

/**
 * 获取API端点
 */
export function getApiEndpoint(chain: SupportedChain, endpoint: keyof typeof API_ENDPOINTS.ETHERSCAN) {
  const chainKey = chain.toUpperCase() as keyof typeof API_ENDPOINTS
  const chainEndpoints = API_ENDPOINTS[chainKey]
  if (chainEndpoints && endpoint in chainEndpoints) {
    return chainEndpoints[endpoint as keyof typeof chainEndpoints]
  }
  return API_ENDPOINTS.ETHERSCAN[endpoint]
}
