/**
 * HTTP 请求配置
 * 统一的配置管理
 */

// 支持的链 ID
export const SUPPORTED_CHAIN_IDS = ['1', '56', '137', '42161', '8453', '10'] as const

// 支持的时间段（毫秒）
export const PERIODS = {
  '30s': 30 * 1000,
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
} as const

// 请求配置
export const REQUEST_CONFIG = {
  timeout: 30000, // 30秒
  maxRetries: 3,
  retryDelay: 1000, // 1秒
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': '0xcafe-website/1.0.0',
  },
} as const

// API 端点配置
export const API_ENDPOINTS = {
  // Alchemy API
  alchemy: {
    baseUrl: 'https://eth-mainnet.g.alchemy.com/v2',
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
  },
  
  // Etherscan API
  etherscan: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
  },
  
  // Infura API
  infura: {
    baseUrl: 'https://mainnet.infura.io/v3',
    apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || '',
  },
  
  // Infura Gas API
  infuraGas: {
    baseUrl: 'https://gas.api.infura.io/v3',
    apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || '',
  },
} as const

// 链 ID 到网络名称的映射
export const CHAIN_ID_TO_NETWORK: Record<string, string> = {
  '1': 'eth-mainnet',
  '56': 'bsc-mainnet', 
  '137': 'polygon-mainnet',
  '42161': 'arb-mainnet',
  '8453': 'base-mainnet',
  '10': 'opt-mainnet',
}

// 链 ID 到 Etherscan 子域的映射
export const CHAIN_ID_TO_ETHERSCAN: Record<string, string> = {
  '1': 'api.etherscan.io',
  '56': 'api.bscscan.com',
  '137': 'api.polygonscan.com',
  '42161': 'api.arbiscan.io',
  '8453': 'api.basescan.org',
  '10': 'api-optimistic.etherscan.io',
}
