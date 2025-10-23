/**
 * Blocks API 服务
 * 统一的区块数据获取服务
 */

import { SupportedChain, getChainConfig } from '../lib'
import { httpClient, getLatestBlockEndpoint } from '../lib/request'

/**
 * 区块数据接口
 */
export interface BlockData {
  number: number
  timestamp: number
  baseFeePerGas: number // Gwei
  gasUsed: number
  gasLimit: number
  gasUsedPercent: string
  burntFees: string // ETH
  transactionCount: number
}

/**
 * Blocks API 服务类
 */
export class BlocksApiService {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
    if (baseUrl) {
      httpClient.setBaseURL(baseUrl)
    }
  }

  /**
   * 获取链 ID
   */
  private getChainId(chain: SupportedChain): string {
    return getChainConfig(chain).id.toString()
  }


  /**
   * 获取最新区块列表
   */
  async getLatestBlocks(chain: SupportedChain = 'ethereum', limit: number = 10): Promise<BlockData[]> {
    try {
      const chainId = this.getChainId(chain)
      const endpoint = getLatestBlockEndpoint(chainId)
      
      const response = await httpClient.get<BlockData[]>(endpoint, {
        params: { limit: limit.toString() }
      })

      return response.result || []
    } catch (error) {
      console.error('getLatestBlocks error:', error)
      throw error
    }
  }
}

// 创建默认实例
export const blocksApiService = new BlocksApiService()

// 创建特定基础 URL 的实例
export function createBlocksApiService(baseUrl: string): BlocksApiService {
  return new BlocksApiService(baseUrl)
}
