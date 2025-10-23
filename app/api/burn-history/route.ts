/**
 * 燃烧历史 API 路由
 * 使用统一的 HTTP 模块
 */

import { NextRequest } from 'next/server'
import { 
  BurnDataApiService, 
  successResponse, 
  errorResponse, 
  handleApiError,
  handleOptionsRequest,
  validateChainId,
  validatePeriod,
  validateLimit,
  SUPPORTED_CHAIN_IDS,
  PERIODS 
} from '@/backend/http'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainid') || '1'
    const period = searchParams.get('period') || '5m'
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    // 验证参数
    if (!validateChainId(chainId, SUPPORTED_CHAIN_IDS)) {
      return errorResponse(
        `Invalid chain ID. Must be one of: ${SUPPORTED_CHAIN_IDS.join(', ')}`,
        'Validation Error',
        400
      )
    }

    if (!validatePeriod(period, PERIODS)) {
      return errorResponse(
        `Invalid period. Must be one of: ${Object.keys(PERIODS).join(', ')}`,
        'Validation Error',
        400
      )
    }

    if (!validateLimit(limit, 1, 500)) {
      return errorResponse(
        'Invalid limit. Must be between 1 and 500',
        'Validation Error',
        400
      )
    }

    // 使用统一服务获取燃烧历史
    const history = await BurnDataApiService.getBurnHistory(chainId, limit, period)

    return successResponse(history, 'OK')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS() {
  return handleOptionsRequest()
}