/**
 * 最近区块列表 API
 * 返回最近 N 个区块的燃烧费用详情
 */

import { NextRequest, NextResponse } from 'next/server'
import { getRecentBurntFees } from '@/backend/postgresql/queries'
import { getChainConfig } from '@/lib/chains-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = Number(searchParams.get('chainId') || 1)
    const limit = Number(searchParams.get('limit') || 30)

    // 验证参数
    const chainConfig = getChainConfig(chainId)
    if (!chainConfig) {
      return NextResponse.json({
        success: false,
        error: `Invalid chain ID: ${chainId}`,
      }, { status: 400 })
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json({
        success: false,
        error: 'Limit must be between 1 and 100',
      }, { status: 400 })
    }

    // 从数据库获取最近的区块
    const blocks = await getRecentBurntFees(limit, chainId)

    if (blocks.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No blocks found. Please run sync script first.',
        hint: 'Run: pnpm run sync:base-fees',
      }, { status: 200 })
    }

    // 计算区块年龄
    const now = Math.floor(Date.now() / 1000)
    
    // 格式化数据
    const formattedBlocks = blocks.map(block => {
      const blockAge = now - Number(block.timestamp)
      return {
        blockNumber: Number(block.block_number),
        blockHash: block.block_hash,
        timestamp: Number(block.timestamp),
        blockAge: `${blockAge}s ago`,
        baseFeeGwei: parseFloat(block.base_fee_gwei).toFixed(3),
        gasUsed: block.gas_used,
        gasLimit: block.gas_limit,
        gasUsedPercent: ((Number(block.gas_used) / Number(block.gas_limit)) * 100).toFixed(2),
        burntFeesEth: parseFloat(block.burnt_fees_eth).toFixed(6),
        transactionCount: block.transaction_count,
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedBlocks,
      meta: {
        chainId,
        chainName: chainConfig.name,
        chainSymbol: chainConfig.symbol,
        total: formattedBlocks.length,
        oldestBlock: formattedBlocks[formattedBlocks.length - 1]?.blockNumber,
        newestBlock: formattedBlocks[0]?.blockNumber,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Blocks API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blocks',
    }, { status: 500 })
  }
}

