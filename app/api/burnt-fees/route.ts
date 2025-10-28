/**
 * Burnt Fees 统计 API
 * 
 * 架构: RPC + PostgreSQL (无需 Subgraph)
 * 数据来源: burnt_fees 表 (自动计算 baseFee × gasUsed)
 * 
 * GET /api/burnt-fees?chainId=1&period=1d
 * 
 * 参数:
 * - chainId: 链 ID (可选，默认 1 = Ethereum)
 * - period: 时间段 (1h, 1d, 7d, 30d)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getBurntFeesStats } from '@/backend/postgresql/queries'
import { getChainConfig, isValidChainId, getEnabledChainIds } from '@/lib/chains-config'

// 时间周期映射
const PERIOD_CONFIG = {
  '1h': { seconds: 3600, label: '1 Hour' },
  '1d': { seconds: 86400, label: '1 Day' },
  '7d': { seconds: 604800, label: '7 Days' },
  '30d': { seconds: 2592000, label: '30 Days' },
} as const

type Period = keyof typeof PERIOD_CONFIG

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = Number(searchParams.get('chainId') || 1)
    const period = (searchParams.get('period') || '1d') as Period
    
    // 1. 验证 chainId
    if (!isValidChainId(chainId)) {
      return NextResponse.json({
        success: false,
        error: `Invalid or unsupported chain ID: ${chainId}`,
        supportedChains: getEnabledChainIds(),
      }, { status: 400 })
    }
    
    // 2. 验证周期参数
    if (!PERIOD_CONFIG[period]) {
      return NextResponse.json({
        success: false,
        error: 'Invalid period. Must be one of: 1h, 1d, 7d, 30d',
      }, { status: 400 })
    }
    
    // 3. 获取链配置
    const chainConfig = getChainConfig(chainId)!
    
    // 4. 计算时间范围
    const { seconds, label } = PERIOD_CONFIG[period]
    const now = Math.floor(Date.now() / 1000)
    const startTime = now - seconds
    
    // 5. 直接从 burnt_fees 表获取统计数据
    const stats = await getBurntFeesStats(startTime, now, chainId)
    
    if (stats.blockCount === 0) {
      return NextResponse.json({
        success: true,
        data: {
          chainId,
          chainName: chainConfig.name,
          chainSymbol: chainConfig.symbol,
          period,
          periodLabel: label,
          totalBurntEth: '0',
          avgBaseFeeGwei: '0',
          totalGasUsed: '0',
          blockCount: 0,
          avgBurntPerBlock: '0',
          dataSource: 'rpc+postgresql',
        },
        message: 'No data available for this period. Please run sync script first.',
        hint: 'Run: pnpm run sync:base-fees',
        timestamp: new Date().toISOString(),
      }, { status: 200 })
    }
    
    // 6. 计算平均每区块燃烧费用
    const avgBurntPerBlock = stats.blockCount > 0
      ? (parseFloat(stats.totalBurntEth) / stats.blockCount).toFixed(18)
      : '0'
    
    // 7. 返回统计结果
    return NextResponse.json({
      success: true,
      data: {
        chainId,
        chainName: chainConfig.name,
        chainSymbol: chainConfig.symbol,
        period,
        periodLabel: label,
        totalBurntEth: stats.totalBurntEth,
        avgBaseFeeGwei: stats.avgBaseFeeGwei,
        totalGasUsed: stats.totalGasUsed,
        blockCount: stats.blockCount,
        avgBurntPerBlock,
        dataSource: 'rpc+postgresql', // 标识数据来源
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Burnt fees API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch burnt fees data',
    }, { status: 500 })
  }
}

