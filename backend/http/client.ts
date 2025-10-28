/**
 * HTTP 客户端
 * 基于 axios 的统一请求封装
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import https from 'https'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { REQUEST_CONFIG } from './config'

// 请求错误类
export class ApiRequestError extends Error {
  status?: number
  statusText?: string
  response?: any
  code?: string

  constructor(
    message: string,
    status?: number,
    statusText?: string,
    response?: any,
    code?: string
  ) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.statusText = statusText
    this.response = response
    this.code = code
  }
}

/**
 * HTTP 客户端类
 */
export class HttpClient {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string = '', config: AxiosRequestConfig = {}) {
    // 获取代理配置
    const agent = this.getProxyAgent()

    this.axiosInstance = axios.create({
      baseURL,
      timeout: REQUEST_CONFIG.timeout,
      headers: {
        ...REQUEST_CONFIG.headers,
        ...config.headers,
      },
      httpsAgent: agent,
      proxy: false, // 禁用 axios 内置代理，使用 httpsAgent
      ...config,
    })

    this.setupInterceptors()
  }

  /**
   * 获取代理配置
   */
  private getProxyAgent(): HttpsProxyAgent<string> | https.Agent {
    const proxy =
      process.env.HTTPS_PROXY ||
      process.env.https_proxy ||
      process.env.HTTP_PROXY ||
      process.env.http_proxy

    if (proxy) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using proxy:', proxy.replace(/:[^:]*@/, ':***@'))
      }
      return new HttpsProxyAgent(proxy)
    }

    return new https.Agent({
      rejectUnauthorized: false,
    })
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`)
        }
        return config
      },
      (error) => {
        console.error('[HTTP Request Error]:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[HTTP Response] ${response.status} ${response.config.url}`)
        }
        return response
      },
      (error: AxiosError) => {
        console.error('[HTTP Response Error]:', {
          message: error.message,
          status: error.response?.status,
          url: error.config?.url,
        })
        return Promise.reject(error)
      }
    )
  }

  /**
   * 发送请求（带重试机制 + 指数退避）
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    let lastError: AxiosError | null = null

    for (let attempt = 1; attempt <= REQUEST_CONFIG.maxRetries; attempt++) {
      try {
        const response = await this.axiosInstance.request<T>(config)
        return response.data
      } catch (error) {
        lastError = error as AxiosError
        const isLastAttempt = attempt === REQUEST_CONFIG.maxRetries

        // 判断是否应该重试
        const shouldRetry = this.shouldRetryError(lastError)

        if (isLastAttempt || !shouldRetry) {
          throw new ApiRequestError(
            `Request failed after ${attempt} attempt(s): ${lastError.message}`,
            lastError.response?.status,
            lastError.response?.statusText,
            lastError.response?.data,
            lastError.code
          )
        }

        // 指数退避：1s, 2s, 4s, 8s, 16s
        const backoffDelay = REQUEST_CONFIG.retryDelay * Math.pow(2, attempt - 1)
        // 添加随机抖动 (±20%)
        const jitter = backoffDelay * 0.2 * (Math.random() - 0.5)
        const delayTime = Math.min(backoffDelay + jitter, 30000) // 最大 30 秒

        if (process.env.NODE_ENV !== 'production') {
          console.log(`[HTTP Retry] Attempt ${attempt}/${REQUEST_CONFIG.maxRetries} failed, retrying in ${Math.round(delayTime)}ms...`)
        }

        await this.delay(delayTime)
      }
    }

    throw new ApiRequestError('Request failed after all retries')
  }

  /**
   * 判断错误是否应该重试
   */
  private shouldRetryError(error: AxiosError): boolean {
    // 网络错误,超时等应该重试
    if (!error.response) return true

    const status = error.response.status

    // 以下状态码应该重试
    const retryableStatuses = [
      408, // Request Timeout
      429, // Too Many Requests
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
    ]

    return retryableStatuses.includes(status)
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 设置基础 URL
   */
  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL
  }

  /**
   * 更新默认配置
   */
  updateConfig(config: Partial<AxiosRequestConfig>): void {
    Object.assign(this.axiosInstance.defaults, config)
  }

  /**
   * 获取 axios 实例
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

/**
 * 创建 HTTP 客户端
 */
export function createHttpClient(baseURL: string = '', config: AxiosRequestConfig = {}): HttpClient {
  return new HttpClient(baseURL, config)
}
