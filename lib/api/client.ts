/**
 * API 客户端基础封装
 * 统一的 HTTP 请求处理
 */

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public _data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 基础 API 客户端
 */
export const apiClient = {
  /**
   * GET 请求
   */
  async get<T>(url: string, options?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        )
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  },

  /**
   * POST 请求
   */
  async post<T>(url: string, body?: any, options?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      })

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        )
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  },
}

/**
 * 构建查询字符串
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

