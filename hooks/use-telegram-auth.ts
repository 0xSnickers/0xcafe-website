'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { TelegramUser, TelegramConnection, TelegramAuthConfig } from '@/types/telegram'
import { TelegramStorage } from '@/lib/telegram-storage'

/**
 * Telegram 认证状态消息
 */
interface TelegramAuthMessage {
  type: 'success' | 'error' | 'info'
  text: string
}

/**
 * Telegram 认证 Hook 返回值
 */
interface UseTelegramAuthReturn {
  connection: TelegramConnection | null
  isLoading: boolean
  message: TelegramAuthMessage | null
  widgetLoaded: boolean
  connect: () => void
  disconnect: () => void
  clearMessage: () => void
}

/**
 * Telegram 认证 Hook
 * 
 * 管理 Telegram Widget 的加载、认证流程和状态
 * 
 * @param config - Telegram 认证配置
 * @returns Telegram 认证状态和操作方法
 * 
 * @example
 * ```tsx
 * const { connection, connect, disconnect } = useTelegramAuth({
 *   botUsername: 'your_bot_username'
 * })
 * ```
 */
export function useTelegramAuth(config: TelegramAuthConfig): UseTelegramAuthReturn {
  const { botUsername, requestAccess = 'write', size = 'large' } = config

  const [connection, setConnection] = useState<TelegramConnection | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<TelegramAuthMessage | null>(null)
  const [widgetLoaded, setWidgetLoaded] = useState(false)
  const widgetContainerRef = useRef<HTMLDivElement | null>(null)

  /**
   * 加载已保存的连接信息
   */
  useEffect(() => {
    const saved = TelegramStorage.get()
    if (saved && saved.status === 'connected') {
      setConnection(saved)
    }
  }, [])

  /**
   * 加载 Telegram Widget Script
   */
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 检查脚本是否已加载
    const existingScript = document.getElementById('telegram-widget-script')
    if (existingScript) {
      setWidgetLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.id = 'telegram-widget-script'
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    
    script.onload = () => {
      // console.log('[Telegram] Widget 脚本加载成功')
      setWidgetLoaded(true)
    }
    
    script.onerror = () => {
      // console.error('[Telegram] Widget 脚本加载失败')
      setMessage({ type: 'error', text: '⚠️ Telegram Widget 加载失败，请刷新页面重试' })
    }

    document.head.appendChild(script)

    return () => {
      // 不移除脚本，因为可能被其他组件使用
    }
  }, [])

  /**
   * 处理 Telegram 授权回调
   */
  const handleTelegramAuth = useCallback(async (user: TelegramUser) => {
    // console.log('[Telegram] 收到授权回调:', user)
    setIsLoading(true)
    setMessage(null)

    try {
      // 调用后端验证（如果需要）
      // const response = await fetch('/api/telegram/auth/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(user),
      // })
      // 
      // if (!response.ok) throw new Error('验证失败')

      // 构建连接对象
      const newConnection: TelegramConnection = {
        status: 'connected',
        user,
        connectedAt: new Date(),
      }

      // console.log('[Telegram] 认证成功，保存连接信息')
      
      // 保存到本地存储
      TelegramStorage.save(newConnection)
      setConnection(newConnection)
      setMessage({ 
        type: 'success', 
        text: `✅ 欢迎，${user.first_name}！Telegram 连接成功` 
      })
    } catch (error) {
      // console.error('[Telegram] 授权失败:', error)
      setMessage({ 
        type: 'error', 
        text: '❌ Telegram 连接失败，请重试' 
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 设置全局回调函数
   */
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 定义全局回调函数
    ;(window as any).onTelegramAuth = handleTelegramAuth

    return () => {
      delete (window as any).onTelegramAuth
    }
  }, [handleTelegramAuth])

  /**
   * 渲染 Telegram Widget
   */
  const renderWidget = useCallback((container: HTMLDivElement) => {
    if (!widgetLoaded || !botUsername) {
      // console.log('[Telegram] Widget 渲染条件不满足:', { widgetLoaded, botUsername })
      return
    }

    // 清空容器
    container.innerHTML = ''

    // 创建 Telegram 登录按钮脚本
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', size)
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', requestAccess)

    container.appendChild(script)
    // console.log('[Telegram] Widget 已渲染，botUsername:', botUsername)
  }, [widgetLoaded, botUsername, size, requestAccess])

  /**
   * 连接 Telegram
   */
  const connect = useCallback(() => {
    setMessage({ type: 'info', text: '请点击下方按钮进行 Telegram 授权' })
  }, [])

  /**
   * 断开 Telegram 连接
   */
  const disconnect = useCallback(() => {
    TelegramStorage.remove()
    setConnection(null)
    setMessage({ type: 'success', text: '✅ Telegram 已断开连接' })

    // 重新渲染 Widget
    if (widgetContainerRef.current) {
      setTimeout(() => {
        if (widgetContainerRef.current) {
          renderWidget(widgetContainerRef.current)
        }
      }, 100)
    }
  }, [renderWidget])

  /**
   * 清除消息
   */
  const clearMessage = useCallback(() => {
    setMessage(null)
  }, [])

  /**
   * 设置 Widget 容器引用
   */
  useEffect(() => {
    if (widgetContainerRef.current && connection?.status !== 'connected' && widgetLoaded && botUsername) {
      renderWidget(widgetContainerRef.current)
    }
  }, [connection, renderWidget, widgetLoaded, botUsername])

  return {
    connection,
    isLoading,
    message,
    widgetLoaded,
    connect,
    disconnect,
    clearMessage,
  }
}

/**
 * 获取 Widget 容器引用的 Hook
 */
export function useTelegramWidgetRef() {
  return useRef<HTMLDivElement>(null)
}

