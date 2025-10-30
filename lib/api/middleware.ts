/**
 * API 中间件
 * 提供统一的错误处理、日志记录、性能监控
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * API 日志中间件
 */
export function withLogging(handler: Function) {
  return async (request: NextRequest) => {
    const start = Date.now()
    const { pathname, searchParams } = new URL(request.url)
    
    console.log(`[API] ${request.method} ${pathname}`, {
      params: Object.fromEntries(searchParams),
      timestamp: new Date().toISOString(),
    })
    
    try {
      const response = await handler(request)
      const duration = Date.now() - start
      
      console.log(`[API] ${request.method} ${pathname} - ${response.status} (${duration}ms)`)
      
      return response
    } catch (error) {
      const duration = Date.now() - start
      console.error(`[API] ${request.method} ${pathname} - Error (${duration}ms)`, error)
      throw error
    }
  }
}

/**
 * API 错误处理中间件
 */
export function withErrorHandling(handler: Function) {
  return async (request: NextRequest) => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('[API] Unhandled error:', error)
      
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Internal server error',
          timestamp: Date.now(),
        },
        { status: 500 }
      )
    }
  }
}

/**
 * API CORS 中间件
 */
export function withCORS(handler: Function) {
  return async (request: NextRequest) => {
    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }
    
    const response = await handler(request)
    
    // 添加 CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  }
}

/**
 * API 速率限制中间件
 * @param limit - 每分钟最大请求数
 */
export function withRateLimit(limit: number = 60) {
  const requests = new Map<string, number[]>()
  
  return (handler: Function) => {
    return async (request: NextRequest) => {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      const now = Date.now()
      const windowStart = now - 60000 // 1 分钟窗口
      
      // 获取该 IP 的请求记录
      const ipRequests = requests.get(ip) || []
      const recentRequests = ipRequests.filter(time => time > windowStart)
      
      // 检查是否超过限制
      if (recentRequests.length >= limit) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many requests. Please try again later.',
            timestamp: Date.now(),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(windowStart + 60000).toISOString(),
            },
          }
        )
      }
      
      // 记录本次请求
      recentRequests.push(now)
      requests.set(ip, recentRequests)
      
      // 清理过期数据
      if (Math.random() < 0.01) { // 1% 概率清理
        for (const [key, times] of requests.entries()) {
          const validTimes = times.filter(t => t > windowStart)
          if (validTimes.length === 0) {
            requests.delete(key)
          } else {
            requests.set(key, validTimes)
          }
        }
      }
      
      const response = await handler(request)
      
      // 添加速率限制 headers
      response.headers.set('X-RateLimit-Limit', limit.toString())
      response.headers.set('X-RateLimit-Remaining', (limit - recentRequests.length).toString())
      response.headers.set('X-RateLimit-Reset', new Date(windowStart + 60000).toISOString())
      
      return response
    }
  }
}

/**
 * 组合多个中间件
 */
export function composeMiddleware(...middlewares: Function[]) {
  return (handler: Function) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}

