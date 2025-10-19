/**
 * Telegram 相关类型定义
 */

/**
 * Telegram 用户信息
 */
export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

/**
 * Telegram 连接状态
 */
export type TelegramConnectionStatus = 'connected' | 'disconnected' | 'connecting'

/**
 * Telegram 连接信息
 */
export interface TelegramConnection {
  status: TelegramConnectionStatus
  user: TelegramUser | null
  connectedAt?: Date
}

/**
 * Telegram 认证配置
 */
export interface TelegramAuthConfig {
  botUsername: string
  requestAccess?: 'write' | 'read'
  size?: 'small' | 'medium' | 'large'
}

/**
 * Telegram 认证回调
 */
export type TelegramAuthCallback = (user: TelegramUser) => void | Promise<void>

