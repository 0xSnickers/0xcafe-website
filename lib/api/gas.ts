/**
 * Gas Price API 客户端
 * 统一的 Gas 数据获取接口
 */

import { apiClient, buildQueryString, type ApiResponse } from './client'
import { buildApiUrl } from './config'

/**
 * Gas Price 响应数据
 */
export interface GasPriceData {
  chainId?: number
  chainName?: string
  LastBlock: string
  SafeGasPrice: string
  ProposeGasPrice: string
  FastGasPrice: string
  baseFee: string
  gasPrice: string
  timestamp: number
  blockAge?: number
}

export interface GasPriceResponse extends ApiResponse<GasPriceData> {}

/**
 * Gas Price API
 */
export const gasApi = {
  /**
   * 获取 Gas Price
   * @param chainId - 链 ID (默认 1 = Ethereum)
   */
  getGasPrice: async (chainId: number = 1): Promise<GasPriceResponse> => {
    const query = buildQueryString({ chainid: chainId })
    // 使用 v1 API
    return apiClient.get<GasPriceResponse>(buildApiUrl(`/gas${query}`))
  },
}

