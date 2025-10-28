/**
 * Etherscan 专用客户端
 * 增强版:支持多 API Key 轮询、速率限制、请求缓存
 */

import { HttpClient, ApiRequestError } from './client'
import { ETHERSCAN_CONFIG, CHAIN_ID_TO_ETHERSCAN } from './config'
import { AxiosRequestConfig } from 'axios'

/**
 * 简单的内存缓存
 */
class MemoryCache {
  private cache = new Map<string, { data: any; expireAt: number }>()

  set(key: string, data: any, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expireAt: Date.now() + ttlMs,
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expireAt) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(): void {
    this.cache.clear()
  }

  // 定期清理过期缓存
  startCleanupInterval(intervalMs: number = 60000): void {
    setInterval(() => {
      const now = Date.now()
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expireAt) {
          this.cache.delete(key)
        }
      }
    }, intervalMs)
  }
}

/**
 * 速率限制器 (令牌桶算法)
 */
class RateLimiter {
  private tokens: number
  private lastRefill: number
  private readonly capacity: number
  private readonly refillRate: number

  constructor(requestsPerSecond: number) {
    this.capacity = requestsPerSecond
    this.tokens = requestsPerSecond
    this.lastRefill = Date.now()
    this.refillRate = requestsPerSecond
  }

  private refill(): void {
    const now = Date.now()
    const timePassed = (now - this.lastRefill) / 1000
    const tokensToAdd = timePassed * this.refillRate

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd)
    this.lastRefill = now
  }

  async acquire(): Promise<void> {
    while (true) {
      this.refill()

      if (this.tokens >= 1) {
        this.tokens -= 1
        return
      }

      // 等待一段时间再重试
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
}

/**
 * Etherscan 客户端
 */
export class EtherscanClient extends HttpClient {
  private currentKeyIndex = 0
  private cache = new MemoryCache()
  private rateLimiter = new RateLimiter(ETHERSCAN_CONFIG.rateLimitPerSecond)

  constructor() {
    super('', {
      timeout: ETHERSCAN_CONFIG.timeout,
    })

    // 启动缓存清理
    this.cache.startCleanupInterval()
  }

  /**
   * 获取下一个可用的 API Key (轮询)
   */
  private getNextApiKey(): string {
    const keys = ETHERSCAN_CONFIG.apiKeys
    if (keys.length === 0) {
      throw new ApiRequestError('No Etherscan API keys configured')
    }

    const key = keys[this.currentKeyIndex]
    this.currentKeyIndex = (this.currentKeyIndex + 1) % keys.length

    return key
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(url: string, params: any): string {
    const paramStr = JSON.stringify(params)
    return `etherscan:${url}:${paramStr}`
  }

  /**
   * 带缓存的 GET 请求
   */
  async getCached<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    cacheTtlMs: number = 12000 // 默认 12 秒缓存
  ): Promise<T> {
    // 生成缓存键
    const cacheKey = this.getCacheKey(url, config?.params || {})

    // 尝试从缓存获取
    const cached = this.cache.get(cacheKey)
    if (cached) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Etherscan Cache Hit]:', url)
      }
      return cached
    }

    // 速率限制
    await this.rateLimiter.acquire()

    // 添加 API Key 到请求参数
    const apiKey = this.getNextApiKey()
    const requestConfig = {
      ...config,
      params: {
        ...config?.params,
        apikey: apiKey,
      },
    }

    // 发送请求
    let lastError: any = null

    // 如果有多个 API Key,尝试所有的 Key
    for (let keyAttempt = 0; keyAttempt < ETHERSCAN_CONFIG.apiKeys.length; keyAttempt++) {
      try {
        const result = await this.get<T>(url, requestConfig)

        // 缓存结果
        this.cache.set(cacheKey, result, cacheTtlMs)

        return result
      } catch (error) {
        lastError = error

        // 如果是 API Key 相关错误,尝试下一个 Key
        if (error instanceof ApiRequestError && error.status === 429) {
          if (process.env.NODE_ENV !== 'production') {
            console.log(`[Etherscan] API Key ${keyAttempt + 1} rate limited, trying next...`)
          }

          // 更新 API Key
          requestConfig.params.apikey = this.getNextApiKey()

          // 等待一段时间
          await new Promise(resolve => setTimeout(resolve, 1000))
          continue
        }

        // 其他错误直接抛出
        throw error
      }
    }

    throw lastError || new ApiRequestError('All Etherscan API keys failed')
  }

  /**
   * Etherscan 专用请求方法
   */
  async etherscanRequest<T = any>(
    chainId: string,
    params: Record<string, string>,
    cacheTtlMs: number = 12000
  ): Promise<T> {
    const subdomain = CHAIN_ID_TO_ETHERSCAN[chainId] || 'api.etherscan.io'
    const url = `https://${subdomain}/v2/api`

    return this.getCached<T>(url, {
      params: {
        chainid: chainId,
        ...params,
      },
    }, cacheTtlMs)
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear()
  }
}

/**
 * 创建单例
 */
let etherscanClientInstance: EtherscanClient | null = null

export function getEtherscanClient(): EtherscanClient {
  if (!etherscanClientInstance) {
    etherscanClientInstance = new EtherscanClient()
  }
  return etherscanClientInstance
}
