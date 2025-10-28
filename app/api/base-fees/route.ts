import { NextRequest, NextResponse } from 'next/server'
import { getBaseFeesByTime, getBaseFeesByRange } from '@/backend/postgresql/queries'

/**
 * BaseFee API 路由
 * 
 * 用途：前端查询 baseFee 数据
 * 
 * 查询参数：
 * - startTime: 起始时间戳（秒）
 * - endTime: 结束时间戳（秒）
 * - startBlock: 起始区块号（可选，与时间范围二选一）
 * - endBlock: 结束区块号（可选）
 * - chainId: 链 ID（default: 1）
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // 解析参数
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')
    const startBlock = searchParams.get('startBlock')
    const endBlock = searchParams.get('endBlock')
    const chainId = Number(searchParams.get('chainId') || 1)
    
    let data
    
    // 按时间范围查询
    if (startTime && endTime) {
      data = await getBaseFeesByTime(
        Number(startTime),
        Number(endTime),
        chainId
      )
    }
    // 按区块范围查询
    else if (startBlock && endBlock) {
      data = await getBaseFeesByRange(
        Number(startBlock),
        Number(endBlock),
        chainId
      )
    }
    // 参数错误
    else {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: (startTime & endTime) or (startBlock & endBlock)',
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error) {
    console.error('BaseFee API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch base fees',
      },
      { status: 500 }
    )
  }
}

