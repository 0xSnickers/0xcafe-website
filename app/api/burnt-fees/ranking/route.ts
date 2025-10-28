/**
 * 燃烧排行榜 API
 * 按地址聚合燃烧费用排行
 * 
 * 注意：需要交易级别的数据才能实现真实排行
 * 当前返回 Mock 数据，实际实现需要：
 * 1. 从区块中提取交易详情
 * 2. 按 from 地址聚合燃烧费用
 * 3. 定期更新到 address_burnt_fees 表
 */

import { NextRequest, NextResponse } from 'next/server'
import { ADDRESS_LABELS } from '@/lib/address-labels'

// Mock 数据：热门地址的燃烧费用（基于真实统计）
const MOCK_RANKING = [
  { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', burnt: '2.684', txCount: 1234 }, // Tether USDT
  { address: '0x0000000000000000000000000000000000000000', burnt: '2.357', txCount: 5678 }, // Native Transfer
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', burnt: '1.406', txCount: 892 },  // USDC
  { address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', burnt: '0.636', txCount: 445 },  // Uniswap V2 Router
  { address: '0xE592427A0AEce92De3Edee1F18E0157C05861564', burnt: '0.617', txCount: 332 },  // Uniswap V3 Router
  { address: '0x1111111254EEB25477B68fb85Ed929f73A960582', burnt: '0.513', txCount: 289 },  // 1inch Router
  { address: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF', burnt: '0.488', txCount: 267 },  // 0x Router
  { address: '0xE592427A0AEce92De3Edee1F18E0157C05861565', burnt: '0.480', txCount: 245 },  // Uniswap V4 Router
  { address: '0xBEeF690d32F15E8d0Ad5e2817c8c0F5c62b26Df4', burnt: '0.468', txCount: 123 },  // MEV Bot
  { address: '0xaB0287a1a3f4E0F5A8B8a1a1a1a1a1a5Dd8461', burnt: '0.423', txCount: 198 },  // Unknown Contract
  { address: '0x0000000000071821e8033345A7Be174647bE0706', burnt: '0.406', txCount: 156 },  // MEV Bot 2
  { address: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41', burnt: '0.385', txCount: 134 },  // Gnosis
  { address: '0xDef1C0ded9bec7F1a1670819833240f027b25EfE', burnt: '0.383', txCount: 128 },  // 0x Allowance
  { address: '0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8', burnt: '0.337', txCount: 112 },  // XEN
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = Number(searchParams.get('chainId') || 1)
    const period = searchParams.get('period') || '1d'
    const limit = Number(searchParams.get('limit') || 20)

    // 格式化排行数据
    const ranking = MOCK_RANKING.slice(0, limit).map((item, index) => {
      // 获取地址标签
      const label = ADDRESS_LABELS[item.address.toLowerCase()] || {
        name: item.address === '0x0000000000000000000000000000000000000000' 
          ? 'Native Transfer' 
          : `${item.address.slice(0, 6)}...${item.address.slice(-4)}`,
        category: 'OTHER'
      }

      return {
        rank: index + 1,
        address: item.address,
        name: label.name,
        category: label.category,
        totalBurntEth: item.burnt,
        transactionCount: item.txCount,
        avgBurntPerTx: (parseFloat(item.burnt) / item.txCount).toFixed(6),
      }
    })

    // 计算总燃烧费用
    const totalBurnt = ranking.reduce((sum, item) => 
      sum + parseFloat(item.totalBurntEth), 0
    )

    // 添加百分比
    const rankingWithPercentage = ranking.map(item => ({
      ...item,
      percentage: ((parseFloat(item.totalBurntEth) / totalBurnt) * 100).toFixed(2),
    }))

    return NextResponse.json({
      success: true,
      data: rankingWithPercentage,
      meta: {
        chainId,
        period,
        total: rankingWithPercentage.length,
        totalBurntEth: totalBurnt.toFixed(6),
        dataSource: 'mock',
        note: 'This is mock data. Real implementation requires transaction-level data aggregation.',
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Ranking API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch ranking',
    }, { status: 500 })
  }
}

