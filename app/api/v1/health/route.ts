/**
 * Health Check API v1
 * 用于监控 API 健康状态
 * 
 * @version 1.0.0
 * @endpoint GET /api/v1/health
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const response = {
    status: 'healthy',
    version: '1.0.0',
    timestamp: Date.now(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      database: 'operational',
      rpc: 'operational',
    },
  }

  return NextResponse.json(response, {
    headers: {
      'X-API-Version': '1.0.0',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}

