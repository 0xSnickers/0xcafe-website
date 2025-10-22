/**
 * 燃烧历史 API 路由
 * 代理 Etherscan API 请求，解决 CORS 问题
 */

import { NextRequest, NextResponse } from 'next/server'
import { makeHttpsRequest } from '@/lib/https-request'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'X9S3IXSVZ8W7P8D1EJV42KNMBG9I6PH6MX'
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/v2/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainid') || '1'
    const limit = searchParams.get('limit') || '10'
    
    // 构建 Etherscan API URL
    const etherscanUrl = new URL(ETHERSCAN_BASE_URL)
    etherscanUrl.searchParams.set('chainid', chainId)
    etherscanUrl.searchParams.set('module', 'proxy')
    etherscanUrl.searchParams.set('action', 'eth_getBlockByNumber')
    etherscanUrl.searchParams.set('tag', 'latest')
    etherscanUrl.searchParams.set('boolean', 'true')
    etherscanUrl.searchParams.set('apikey', ETHERSCAN_API_KEY)

    // 使用 Node.js https 模块发起请求到 Etherscan
    const data = await makeHttpsRequest(etherscanUrl.toString())

    // 返回数据给前端
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=10', // 10秒缓存
      },
    })
  } catch (error) {
    console.error('Burn History API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch burn history',
        message: error instanceof Error ? error.message : 'Unknown error'
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
