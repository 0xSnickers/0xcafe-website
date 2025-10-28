/**
 * 燃烧类别统计 API
 * 按 DEFI/MEV/XEN/NFT/L2 分类聚合燃烧费用
 * 
 * 注意：当前基于排行榜数据聚合，实际实现需要完整的交易数据
 */

import { NextRequest, NextResponse } from 'next/server'
import { ADDRESS_LABELS } from '@/lib/address-labels'

// Mock 数据：基于排行榜聚合
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
  { address: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f', burnt: '0.245', txCount: 89 },   // Arbitrum Bridge (L2)
  { address: '0x00000000006C3852cbEf3e08E8dF289169EdE581', burnt: '0.198', txCount: 67 },   // OpenSea (NFT)
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = Number(searchParams.get('chainId') || 1)
    const period = searchParams.get('period') || '1d'

    // 按类别聚合
    const categoryMap = new Map<string, {
      totalBurnt: number
      txCount: number
      addresses: number
    }>()

    // 初始化类别
    const categories = ['DEFI', 'MEV', 'XEN', 'NFT', 'L2', 'STABLECOIN', 'OTHER']
    categories.forEach(cat => {
      categoryMap.set(cat, { totalBurnt: 0, txCount: 0, addresses: 0 })
    })

    // 聚合数据
    MOCK_RANKING.forEach(item => {
      let category = 'OTHER'
      
      // 获取地址标签
      if (item.address === '0x0000000000000000000000000000000000000000') {
        category = 'OTHER' // Native Transfer
      } else {
        const label = ADDRESS_LABELS[item.address.toLowerCase()]
        if (label) {
          category = label.category
        }
      }

      const current = categoryMap.get(category)!
      current.totalBurnt += parseFloat(item.burnt)
      current.txCount += item.txCount
      current.addresses += 1
    })

    // 计算总量
    const totalBurnt = Array.from(categoryMap.values())
      .reduce((sum, cat) => sum + cat.totalBurnt, 0)

    // 格式化返回数据
    const categoriesData = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        category: name,
        totalBurntEth: data.totalBurnt.toFixed(6),
        transactionCount: data.txCount,
        uniqueAddresses: data.addresses,
        percentage: ((data.totalBurnt / totalBurnt) * 100).toFixed(2),
      }))
      .filter(item => parseFloat(item.totalBurntEth) > 0) // 只返回有数据的类别
      .sort((a, b) => parseFloat(b.totalBurntEth) - parseFloat(a.totalBurntEth)) // 按燃烧量排序

    return NextResponse.json({
      success: true,
      data: categoriesData,
      meta: {
        chainId,
        period,
        totalCategories: categoriesData.length,
        totalBurntEth: totalBurnt.toFixed(6),
        totalTransactions: Array.from(categoryMap.values())
          .reduce((sum, cat) => sum + cat.txCount, 0),
        dataSource: 'mock',
        note: 'This is mock data. Real implementation requires transaction-level data aggregation.',
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories',
    }, { status: 500 })
  }
}

