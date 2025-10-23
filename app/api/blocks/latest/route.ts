/**
 * 最新区块 API 路由
 * 使用统一的 HTTP 模块
 */

import { NextRequest } from 'next/server'
import { 
  BlockApiService, 
  successResponse, 
  errorResponse, 
  handleApiError,
  handleOptionsRequest,
  validateChainId,
  validateLimit,
  SUPPORTED_CHAIN_IDS 
} from '@/backend/http'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainid') || '1'
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // 验证参数
    if (!validateChainId(chainId, SUPPORTED_CHAIN_IDS)) {
      return errorResponse(
        `Invalid chain ID. Must be one of: ${SUPPORTED_CHAIN_IDS.join(', ')}`,
        'Validation Error',
        400
      )
    }

    if (!validateLimit(limit, 1, 50)) {
      return errorResponse(
        'Invalid limit. Must be between 1 and 50',
        'Validation Error',
        400
      )
    }

    // 使用统一服务获取最新区块
    const blocks = await BlockApiService.getLatestBlocks(chainId, limit)

    return successResponse(blocks, 'OK')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS() {
  return handleOptionsRequest()
}
