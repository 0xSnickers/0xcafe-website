/**
 * Telegram 连接本地存储管理
 */

import { TelegramConnection } from '@/types/telegram'

const STORAGE_KEY = 'telegram_connection'

/**
 * Telegram 连接存储服务
 */
export class TelegramStorage {
  /**
   * 保存 Telegram 连接信息
   */
  static save(connection: TelegramConnection): void {
    try {
      if (typeof window === 'undefined') return
      
      const data = {
        ...connection,
        connectedAt: connection.connectedAt?.toISOString(),
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('[TelegramStorage] 保存失败:', error)
    }
  }

  /**
   * 获取保存的 Telegram 连接信息
   */
  static get(): TelegramConnection | null {
    try {
      if (typeof window === 'undefined') return null
      
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return null
      
      const parsed = JSON.parse(data)
      
      return {
        ...parsed,
        connectedAt: parsed.connectedAt ? new Date(parsed.connectedAt) : undefined,
      }
    } catch (error) {
      console.error('[TelegramStorage] 读取失败:', error)
      return null
    }
  }

  /**
   * 移除 Telegram 连接信息
   */
  static remove(): void {
    try {
      if (typeof window === 'undefined') return
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('[TelegramStorage] 删除失败:', error)
    }
  }

  /**
   * 清空所有存储
   */
  static clear(): void {
    this.remove()
  }
}

