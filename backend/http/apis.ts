/**
 * API 服务
 * 统一的 API 调用封装
 */

import { createHttpClient, ApiRequestError } from './client'
import { API_ENDPOINTS, CHAIN_ID_TO_ETHERSCAN } from './config'

// Gas 价格数据接口
export interface GasPriceData {
  lastBlock: number
  safe: number
  propose: number
  fast: number
  baseFee: number
  timestamp: number
}

/**
 * Gas API 服务
 */
export class GasApiService {
  private static etherscanClient = createHttpClient()

  /**
   * 使用 Etherscan API 获取 Gas 价格
   */
  static async getGasPrice(chainId: string): Promise<GasPriceData> {
    try {
      const subdomain = CHAIN_ID_TO_ETHERSCAN[chainId] || 'api.etherscan.io'
      const apiKey = API_ENDPOINTS.etherscan.apiKey
      
      const url = `https://${subdomain}/v2/api?chainid=${chainId}&module=gastracker&action=gasoracle&apikey=${apiKey}`
      
      this.etherscanClient.setBaseURL('')
      const response = await this.etherscanClient.get<{
        status: string
        message: string
        result: {
          LastBlock: string
          SafeGasPrice: string
          ProposeGasPrice: string
          FastGasPrice: string
          suggestBaseFee: string
        }
      }>(url)

      return {
        lastBlock: parseInt(response.result.LastBlock),
        safe: parseFloat(response.result.SafeGasPrice),
        propose: parseFloat(response.result.ProposeGasPrice),
        fast: parseFloat(response.result.FastGasPrice),
        baseFee: parseFloat(response.result.suggestBaseFee),
        timestamp: Date.now()
      }
    } catch (error) {
      throw new ApiRequestError(`Etherscan Gas API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
