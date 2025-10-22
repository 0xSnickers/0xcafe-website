/**
 * HTTP请求客户端
 */

import { ApiResponse, RequestConfig, RequestError, RequestParams } from './types'

// 扩展RequestInit类型以包含params
interface ExtendedRequestInit {
  method?: string
  headers?: Record<string, string>
  body?: string
  params?: RequestParams
  signal?: AbortSignal
}

/**
 * HTTP请求客户端类
 */
export class HttpClient {
  private baseURL: string
  private config: RequestConfig

  constructor(baseURL: string = '', config: RequestConfig = {}) {
    this.baseURL = baseURL
    this.config = { ...config }
  }

  /**
   * 发送HTTP请求
   */
  async request<T = any>(
    url: string,
    options: ExtendedRequestInit = {}
  ): Promise<ApiResponse<T>> {
    const { params, ...requestOptions } = options
    
    // 构建完整URL
    const fullUrl = this.buildUrl(url, params)
    
    // 合并请求配置
    const mergedOptions: ExtendedRequestInit = {
      method: 'GET',
      headers: {
        ...this.config.headers,
        ...requestOptions.headers,
      },
      ...requestOptions,
    }

    // 设置超时
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(fullUrl, {
        ...mergedOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw this.createError(response)
      }

      const data = await response.json()
      
      // 检查Etherscan API响应状态
      if (data.status === '0' && data.message) {
        throw new Error(`API Error: ${data.message}`)
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new RequestError('Request timeout', { cause: error })
        }
        throw error
      }
      
      throw new RequestError('Unknown error occurred', { cause: error })
    }
  }

  /**
   * GET请求
   */
  async get<T = any>(url: string, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET', params })
  }

  /**
   * POST请求
   */
  async post<T = any>(url: string, data?: any, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
      params,
    })
  }

  /**
   * PUT请求
   */
  async put<T = any>(url: string, data?: any, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      params,
    })
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(url: string, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE', params })
  }

  /**
   * 构建完整URL
   */
  private buildUrl(url: string, params?: RequestParams): string {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`
    
    if (!params) return fullUrl

    const urlObj = new URL(fullUrl)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.set(key, String(value))
      }
    })

    return urlObj.toString()
  }

  /**
   * 创建错误对象
   */
  private createError(response: Response): RequestError {
    const error = new RequestError(`HTTP ${response.status}: ${response.statusText}`)
    error.status = response.status
    error.statusText = response.statusText
    error.response = response
    return error
  }

  /**
   * 设置基础URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<RequestConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

/**
 * 默认HTTP客户端实例
 */
export const httpClient = new HttpClient()
