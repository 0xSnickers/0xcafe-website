/**
 * Gas 价格 API 路由
 * 代理 Etherscan API 请求，解决 CORS 问题
 */

import { NextRequest, NextResponse } from 'next/server'
import { makeHttpsRequest } from '@/lib/https-request'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || 'X9S3IXSVZ8W7P8D1EJV42KNMBG9I6PH6MX'
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/v2/api'

// 支持的链 ID
const SUPPORTED_CHAIN_IDS = ['1', '56', '137', '42161', '8453', '10']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainid') || '1'

    // 验证 chain ID
    if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
      return NextResponse.json(
        {
          status: '0',
          error: 'Invalid chain ID',
          message: `Chain ID must be one of: ${SUPPORTED_CHAIN_IDS.join(', ')}`
        },
        { status: 400 }
      )
    }

    // 构建 Etherscan API URL
    const etherscanUrl = new URL(ETHERSCAN_BASE_URL)
    etherscanUrl.searchParams.set('chainid', chainId)
    etherscanUrl.searchParams.set('module', 'gastracker')
    etherscanUrl.searchParams.set('action', 'gasoracle')
    etherscanUrl.searchParams.set('apikey', ETHERSCAN_API_KEY)

    // 使用优化的 HTTPS 请求工具
    const data = await makeHttpsRequest(etherscanUrl.toString())

    // 验证响应数据
    if (!data || !data.result) {
      throw new Error('Invalid response from Etherscan API')
    }

    // 返回数据给前端
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=5', // 5秒缓存
      },
    })
  } catch (error) {
    console.error('[Gas API Error]:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        status: '0',
        error: 'Failed to fetch gas data',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
