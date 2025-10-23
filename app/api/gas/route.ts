/**
 * Gas 价格 API 路由
 * 使用统一的 HTTP 模块
 */

import { NextRequest } from 'next/server'
import { 
  GasApiService, 
  successResponse, 
  errorResponse, 
  handleApiError,
  handleOptionsRequest,
  validateChainId,
  SUPPORTED_CHAIN_IDS 
} from '@/backend/http'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainid') || '1'

    // 验证链 ID
    if (!validateChainId(chainId, SUPPORTED_CHAIN_IDS)) {
      return errorResponse(
        `Invalid chain ID. Must be one of: ${SUPPORTED_CHAIN_IDS.join(', ')}`,
        'Validation Error',
        400
      )
    }

    // 使用统一服务获取 Gas 价格
    const gasData = await GasApiService.getGasPrice(chainId)

    // 构建响应数据（保持与原有格式兼容）
    const result = {
      LastBlock: '0',
      SafeGasPrice: gasData.safe.toString(),
      ProposeGasPrice: gasData.propose.toString(),
      FastGasPrice: gasData.fast.toString(),
      suggestBaseFee: gasData.baseFee.toFixed(2),
      gasUsedRatio: gasData.gasUsedRatio.join(','),
      timestamp: Math.floor(gasData.timestamp / 1000)
    }

    return successResponse(result, 'OK')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS() {
  return handleOptionsRequest()
}
