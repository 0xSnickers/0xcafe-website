/**
 * HTTP请求配置文件
 */

import { RequestConfig } from './types'

/**
 * 默认请求配置
 */
export const DEFAULT_REQUEST_CONFIG: RequestConfig = {
  timeout: 20000, // 20秒超时
  retries: 3, // 重试3次
  retryDelay: 1000, // 重试延迟1秒
  headers: {
    'Content-Type': 'application/json',
    // 'User-Agent': '0xcafe-website/1.0.0',
  },
  // Axios 特定配置
  validateStatus: (status) => status < 500, // 只对 5xx 状态码抛出错误
  maxRedirects: 5,
  withCredentials: false,
}

