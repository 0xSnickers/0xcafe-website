/**
 * 统一响应处理
 * 提供标准的 API 响应格式
 */

import { NextResponse } from 'next/server'
import { ApiRequestError } from './client'

// 标准 API 响应接口
export interface ApiResponse<T = any> {
  status: '0' | '1'
  message: string
  result?: T
  error?: string
  timestamp?: number
}

/**
 * 成功响应
 */
export function successResponse<T = any>(
  data: T,
  message: string = 'OK',
  status: number = 200,
  headers: Record<string, string> = {}
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    status: '1',
    message,
    result: data,
    timestamp: Math.floor(Date.now() / 1000)
  }

  return NextResponse.json(response, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'public, max-age=5',
      ...headers,
    },
  })
}

/**
 * 错误响应
 */
export function errorResponse(
  message: string,
  error: string = 'Unknown error',
  status: number = 500,
  headers: Record<string, string> = {}
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    status: '0',
    message,
    error,
    timestamp: Math.floor(Date.now() / 1000)
  }

  return NextResponse.json(response, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
  })
}

/**
 * 参数验证错误响应
 */
export function validationErrorResponse(
  message: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return errorResponse(message, 'Validation Error', status)
}

/**
 * 处理 API 请求错误
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('[API Error]:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  })

  if (error instanceof ApiRequestError) {
    return errorResponse(
      'External API request failed',
      error.message,
      error.status || 500
    )
  }

  return errorResponse(
    'Internal server error',
    error instanceof Error ? error.message : 'Unknown error',
    500
  )
}

/**
 * 处理 CORS 预检请求
 */
export function handleOptionsRequest(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

/**
 * 验证链 ID
 */
export function validateChainId(chainId: string, supportedChainIds: readonly string[]): boolean {
  return supportedChainIds.includes(chainId)
}

/**
 * 验证时间段
 */
export function validatePeriod(period: string, supportedPeriods: Record<string, number>): boolean {
  return period in supportedPeriods
}

/**
 * 验证限制参数
 */
export function validateLimit(limit: number, min: number = 1, max: number = 100): boolean {
  return limit >= min && limit <= max
}
