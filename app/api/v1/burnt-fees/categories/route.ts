/**
 * Burnt Fees Categories API v1
 * 按 DEFI/MEV/XEN/NFT/L2 分类聚合燃烧费用
 * 
 * @version 1.0.0
 * @endpoint GET /api/v1/burnt-fees/categories?chainId={id}&period={period}
 */

import { NextRequest, NextResponse } from 'next/server'
import { ADDRESS_LABELS } from '@/lib/address-labels'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  version: string
  timestamp: number
  meta?: any
}

// Mock 数据
const MOCK_RANKING = [
  { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', burnt: '2.684', txCount: 1234 },
  { address: '0x0000000000000000000000000000000000000000', burnt: '2.357', txCount: 5678 },
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', burnt: '1.406', txCount: 892 },
  { address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', burnt: '0.636', txCount: 445 },
  { address: '0xE592427A0AEce92De3Edee1F18E0157C05861564', burnt: '0.617', txCount: 332 },
  { address: '0x1111111254EEB25477B68fb85Ed929f73A960582', burnt: '0.513', txCount: 289 },
  { address: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF', burnt: '0.488', txCount: 267 },
  { address: '0xE592427A0AEce92De3Edee1F18E0157C05861565', burnt: '0.480', txCount: 245 },
  { address: '0xBEeF690d32F15E8d0Ad5e2817c8c0F5c62b26Df4', burnt: '0.468', txCount: 123 },
  { address: '0xaB0287a1a3f4E0F5A8B8a1a1a1a1a1a5Dd8461', burnt: '0.423', txCount: 198 },
  { address: '0x0000000000071821e8033345A7Be174647bE0706', burnt: '0.406', txCount: 156 },
  { address: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41', burnt: '0.385', txCount: 134 },
  { address: '0xDef1C0ded9bec7F1a1670819833240f027b25EfE', burnt: '0.383', txCount: 128 },
  { address: '0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8', burnt: '0.337', txCount: 112 },
  { address: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f', burnt: '0.245', txCount: 89 },
  { address: '0x00000000006C3852cbEf3e08E8dF289169EdE581', burnt: '0.198', txCount: 67 },
]

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
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

    const categories = ['DEFI', 'MEV', 'XEN', 'NFT', 'L2', 'STABLECOIN', 'OTHER']
    categories.forEach(cat => {
      categoryMap.set(cat, { totalBurnt: 0, txCount: 0, addresses: 0 })
    })

    MOCK_RANKING.forEach(item => {
      let category = 'OTHER'
      
      if (item.address === '0x0000000000000000000000000000000000000000') {
        category = 'OTHER'
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

    const totalBurnt = Array.from(categoryMap.values())
      .reduce((sum, cat) => sum + cat.totalBurnt, 0)

    const categoriesData = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        category: name,
        totalBurntEth: data.totalBurnt.toFixed(6),
        transactionCount: data.txCount,
        uniqueAddresses: data.addresses,
        percentage: ((data.totalBurnt / totalBurnt) * 100).toFixed(2),
      }))
      .filter(item => parseFloat(item.totalBurntEth) > 0)
      .sort((a, b) => parseFloat(b.totalBurntEth) - parseFloat(a.totalBurntEth))

    const response: ApiResponse = {
      success: true,
      data: categoriesData,
      version: '1.0.0',
      timestamp: Date.now(),
      meta: {
        chainId,
        period,
        totalCategories: categoriesData.length,
        totalBurntEth: totalBurnt.toFixed(6),
        totalTransactions: Array.from(categoryMap.values())
          .reduce((sum, cat) => sum + cat.txCount, 0),
        dataSource: 'mock',
      },
    }

    return NextResponse.json(response, {
      headers: {
        'X-API-Version': '1.0.0',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('[API v1] Categories API error:', error)
    
    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories',
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

