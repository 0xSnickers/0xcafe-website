/**
 * 最新区块 API 路由
 * 获取最新的区块列表，包含燃烧数据
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
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // 验证参数
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

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          status: '0',
          error: 'Invalid limit',
          message: 'Limit must be between 1 and 50'
        },
        { status: 400 }
      )
    }

    // 获取最新区块号
    const latestBlockUrl = new URL(ETHERSCAN_BASE_URL)
    latestBlockUrl.searchParams.set('chainid', chainId)
    latestBlockUrl.searchParams.set('module', 'proxy')
    latestBlockUrl.searchParams.set('action', 'eth_blockNumber')
    latestBlockUrl.searchParams.set('apikey', ETHERSCAN_API_KEY)

    const latestBlockResponse = await makeHttpsRequest(latestBlockUrl.toString())

    if (!latestBlockResponse || !latestBlockResponse.result) {
      throw new Error('Failed to get latest block number')
    }

    const latestBlockNumber = parseInt(latestBlockResponse.result, 16)

    // 获取最近的 N 个区块
    const blocks = []
    const fetchPromises = []

    for (let i = 0; i < limit; i++) {
      const blockNumber = '0x' + (latestBlockNumber - i).toString(16)

      const blockUrl = new URL(ETHERSCAN_BASE_URL)
      blockUrl.searchParams.set('chainid', chainId)
      blockUrl.searchParams.set('module', 'proxy')
      blockUrl.searchParams.set('action', 'eth_getBlockByNumber')
      blockUrl.searchParams.set('tag', blockNumber)
      blockUrl.searchParams.set('boolean', 'false')
      blockUrl.searchParams.set('apikey', ETHERSCAN_API_KEY)

      fetchPromises.push(
        makeHttpsRequest(blockUrl.toString()).then(response => ({
          blockNumber: latestBlockNumber - i,
          data: response.result
        }))
      )
    }

    // 并行获取所有区块数据
    const blockResults = await Promise.all(fetchPromises)

    // 处理区块数据
    for (const { blockNumber, data } of blockResults) {
      if (!data) continue

      const baseFeePerGas = parseInt(data.baseFeePerGas || '0x0', 16)
      const gasUsed = parseInt(data.gasUsed || '0x0', 16)
      const gasLimit = parseInt(data.gasLimit || '0x0', 16)
      const timestamp = parseInt(data.timestamp || '0x0', 16)

      // 计算燃烧量 (baseFee * gasUsed)
      const burntFees = (baseFeePerGas * gasUsed) / 1e18 // 转换为 ETH

      // 计算 Gas 使用率
      const gasUsedPercent = gasLimit > 0 ? (gasUsed / gasLimit) * 100 : 0

      blocks.push({
        number: blockNumber,
        timestamp: timestamp * 1000, // 转换为毫秒
        baseFeePerGas: baseFeePerGas / 1e9, // 转换为 Gwei
        gasUsed,
        gasLimit,
        gasUsedPercent: gasUsedPercent.toFixed(2),
        burntFees: burntFees.toFixed(6),
        transactionCount: Array.isArray(data.transactions) ? data.transactions.length : 0,
      })
    }

    // 按区块号降序排序
    blocks.sort((a, b) => b.number - a.number)

    return NextResponse.json(
      {
        status: '1',
        message: 'OK',
        result: blocks,
        timestamp: Date.now(),
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=12', // 12秒缓存
        },
      }
    )
  } catch (error) {
    console.error('[Latest Blocks API Error]:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        status: '0',
        error: 'Failed to fetch latest blocks',
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
