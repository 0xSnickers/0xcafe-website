/**
 * Blocks API 服务
 * 统一的区块数据获取服务
 */

import { SupportedChain } from '../lib/request/types'

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
  }

  /**
   * 获取链 ID
   */
  private getChainId(chain: SupportedChain): string {
    const chainIdMap: Record<SupportedChain, string> = {
      'ethereum': '1',
      'bsc': '56',
      'polygon': '137',
      'arbitrum': '42161',
      'base': '8453',
      'optimism': '10',
    }
    return chainIdMap[chain] || '1'
  }

  /**
   * 发起 API 请求
   */
  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(endpoint, this.baseUrl || (typeof window !== 'undefined' ? window.location.origin : ''))
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `API request failed: ${response.status} ${response.statusText}`
      )
    }

    return response.json()
  }

  /**
   * 获取最新区块列表
   */
  async getLatestBlocks(chain: SupportedChain = 'ethereum', limit: number = 10): Promise<BlockData[]> {
    try {
      const chainId = this.getChainId(chain)
      const response = await this.request<{
        status: string
        message: string
        result: BlockData[]
        timestamp: number
      }>('/api/blocks/latest', {
        chainid: chainId,
        limit: limit.toString()
      })

      // 检查 API 响应状态
      if (response.status !== '1') {
        throw new Error(response.message || 'API returned error status')
      }

      return response.result
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
