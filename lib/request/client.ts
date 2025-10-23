/**
 * HTTP请求客户端
 * 基于 axios 的简洁请求封装
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ApiResponse, RequestConfig, RequestError } from './types'
import { DEFAULT_REQUEST_CONFIG } from './config'

/**
 * HTTP请求客户端类
 */
export class HttpClient {
  private axiosInstance: AxiosInstance
  private config: RequestConfig

  constructor(baseURL: string = '', config: RequestConfig = {}) {
    this.config = { ...DEFAULT_REQUEST_CONFIG, ...config }
    
    // 创建 axios 实例
    this.axiosInstance = axios.create({
      baseURL,
      ...this.config,
    })

    // 设置请求拦截器
    this.setupRequestInterceptors()
    
    // 设置响应拦截器
    this.setupResponseInterceptors()
  }

  /**
   * 设置请求拦截器
   */
  private setupRequestInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 请求前处理
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  /**
   * 设置响应拦截器
   */
  private setupResponseInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 检查 API 响应状态
        const data = response.data
        if (data && typeof data === 'object' && data.status === '0' && data.message) {
          throw new RequestError(`API Error: ${data.message}`)
        }
        
        return response
      },
      (error: AxiosError) => {
        // 重试逻辑
        if (this.shouldRetry(error)) {
          return this.retryRequest(error.config!)
        }
        
        throw new RequestError(
          error.message || 'Request failed',
          error
        )
      }
    )
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: AxiosError): boolean {
    const retries = this.config.retries || 0
    const retryCount = (error.config as any)?.['__retryCount'] || 0
    
    return retryCount < retries && (
      !error.response || 
      error.response.status >= 500 ||
      error.code === 'ECONNABORTED'
    )
  }

  /**
   * 重试请求
   */
  private async retryRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    const retryCount = (config as any)['__retryCount'] || 0
    const retryDelay = this.config.retryDelay || 1000
    
    ;(config as any)['__retryCount'] = retryCount + 1
    
    // 延迟重试
    await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retryCount)))
    
    return this.axiosInstance.request(config)
  }

  /**
   * 发送HTTP请求
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.request<ApiResponse<T>>(config)
    return response.data
  }

  /**
   * GET请求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  /**
   * POST请求
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  /**
   * PUT请求
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  /**
   * PATCH请求
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  /**
   * 设置基础URL
   */
  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<RequestConfig>): void {
    this.config = { ...this.config, ...config }
    Object.assign(this.axiosInstance.defaults, config)
  }

  /**
   * 获取 axios 实例（用于高级用法）
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

/**
 * 默认HTTP客户端实例
 */
export const httpClient = new HttpClient()
