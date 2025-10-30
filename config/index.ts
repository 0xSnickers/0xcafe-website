/**
 * 配置中心
 * 统一导出所有配置
 */

import { chainsConfig, getChainConfig, getChainConfigById, getAllChains, getAlchemyEndpointURL, getAlchemyEndpointURLById, type SupportedChain, type ChainConfig } from './chains'

/**
 * 应用配置
 */
export const config = {
  // 链配置
  chains: chainsConfig,
  
  // API 配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 30000,
  },
  
  // 数据库配置
  database: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
  },
  
  // Web3 配置
  web3: {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  },
  
  // Telegram 配置
  telegram: {
    botUsername: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '',
    groupLink: process.env.NEXT_PUBLIC_TELEGRAM_GROUP_LINK || '',
  },
  
  // 社交链接
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_CONTACT_LINK || '',
    gmail: process.env.NEXT_PUBLIC_GMAIL_CONTACT_LINK || '',
  },
} as const

// 导出链相关的工具函数
export {
  getChainConfig,
  getChainConfigById,
  getAllChains,
  getAlchemyEndpointURL,
  getAlchemyEndpointURLById,
}

// 导出类型
export type { SupportedChain, ChainConfig }

