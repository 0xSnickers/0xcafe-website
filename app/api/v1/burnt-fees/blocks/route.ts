/**
 * Burnt Fees Blocks API v1
 * 返回最近 N 个区块的燃烧费用详情
 * 
 * @version 1.0.0
 * @endpoint GET /api/v1/burnt-fees/blocks?chainId={id}&limit={num}
 */

import { NextRequest, NextResponse } from 'next/server'
import { getRecentBurntFees } from '@/backend/postgresql/queries'
import { getChainConfigById } from '@/config'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  version: string
  timestamp: number
  meta?: any
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const chainId = Number(searchParams.get('chainId') || 1)
    const limit = Number(searchParams.get('limit') || 30)

    // 验证参数
    const chainConfig = getChainConfigById(chainId)
    if (!chainConfig) {
      const errorResponse: ApiResponse = {
        success: false,
        error: `Invalid chain ID: ${chainId}`,
        version: '1.0.0',
        timestamp: Date.now(),
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    if (limit < 1 || limit > 100) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Limit must be between 1 and 100',
        version: '1.0.0',
        timestamp: Date.now(),
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // 从数据库获取最近的区块
    const blocks = await getRecentBurntFees(limit, chainId)

    if (blocks.length === 0) {
      const response: ApiResponse = {
        success: true,
        data: [],
        message: 'No blocks found. Please run sync script first.',
        version: '1.0.0',
        timestamp: Date.now(),
        meta: {
          hint: 'Run: pnpm run sync:base-fees',
        },
      }
      return NextResponse.json(response, {
        headers: {
          'X-API-Version': '1.0.0',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      })
    }

    // 计算区块年龄
    const now = Math.floor(Date.now() / 1000)
    
    // 格式化数据
    const formattedBlocks = blocks.map(block => {
      const blockAge = now - Number(block.timestamp)
      return {
        blockNumber: Number(block.block_number),
        baseFeePerGas: parseFloat(block.base_fee_gwei).toFixed(3),
        burntFees: parseFloat(block.burnt_fees_eth).toFixed(6),
        blockAge: `${blockAge}s ago`,
      }
    })

    const response: ApiResponse = {
      success: true,
      data: formattedBlocks,
      version: '1.0.0',
      timestamp: Date.now(),
      meta: {
        chainId,
        chainName: chainConfig.name,
        total: formattedBlocks.length,
        oldestBlock: formattedBlocks[formattedBlocks.length - 1]?.blockNumber,
        newestBlock: formattedBlocks[0]?.blockNumber,
      },
    }

    return NextResponse.json(response, {
      headers: {
        'X-API-Version': '1.0.0',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5',
      },
    })
  } catch (error) {
    console.error('[API v1] Blocks API error:', error)
    
    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blocks',
      version: '1.0.0',
      timestamp: Date.now(),
    }

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        'X-API-Version': '1.0.0',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    })
  }
}

