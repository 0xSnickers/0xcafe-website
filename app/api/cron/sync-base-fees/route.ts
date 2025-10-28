import { NextRequest, NextResponse } from 'next/server'
import { syncBaseFees } from '@/scripts/sync-base-fees'

/**
 * BaseFee 同步 Cron API
 * 
 * 用途：通过 Vercel Cron 或其他定时任务调用
 * 
 * 安全：
 * - 使用 Authorization 头验证请求
 * - 设置环境变量 CRON_SECRET
 */

export const runtime = 'nodejs'
export const maxDuration = 60 // 最长运行 60 秒

export async function GET(request: NextRequest) {
  try {
    // 验证 Cron 密钥
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // eslint-disable-next-line no-console
    console.log('🔄 Cron job triggered:', new Date().toISOString())
    
    // 执行同步
    const result = await syncBaseFees()
    
    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Cron job failed:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// 也支持 POST 方法（用于手动触发）
export async function POST(request: NextRequest) {
  return GET(request)
}

