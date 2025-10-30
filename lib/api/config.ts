/**
 * API 配置
 * 支持 API 版本控制
 */

/**
 * API 版本
 */
export const API_VERSION = (process.env.NEXT_PUBLIC_API_VERSION || 'v1') as 'v1'

/**
 * API 基础路径
 */
export const API_BASE_PATH = `/api/${API_VERSION}`

/**
 * 构建 API URL
 */
export function buildApiUrl(endpoint: string): string {
  // 如果endpoint已经包含 /api/，直接返回
  if (endpoint.startsWith('/api/')) {
    return endpoint
  }
  
  // 否则添加版本前缀
  return `${API_BASE_PATH}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}

/**
 * API 配置选项
 */
export const apiConfig = {
  version: API_VERSION,
  basePath: API_BASE_PATH,
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
} as const

