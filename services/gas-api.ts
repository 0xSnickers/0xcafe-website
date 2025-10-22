/**
 * Gas API 服务
 * 统一的 Gas 数据获取服务，简化调用过程
 */

import { SupportedChain } from '../lib/request/types'

/**
 * Gas 价格数据接口
 */
export interface GasPriceResponse {
  lastBlock: number
  safe: number
  propose: number
  fast: number
  baseFee: number
  gasUsedRatio: number[]
  timestamp: number
}

/**
 * 燃烧数据接口
 */
export interface BurnDataResponse {
  blockNumber: number
  timestamp: number
  burned: number
  totalBurned: number
}

/**
 * Gas API 服务类
 */
export class GasApiService {
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
    const url = new URL(endpoint, this.baseUrl)
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
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * 获取 Gas 价格数据
   */
  async getGasPrice(chain: SupportedChain = 'ethereum'): Promise<GasPriceResponse> {
    const chainId = this.getChainId(chain)
    const response = await this.request<{
      status: string
      message: string
      result: {
        LastBlock: string
        SafeGasPrice: string
        ProposeGasPrice: string
        FastGasPrice: string
        suggestBaseFee: string
        gasUsedRatio: string
      }
    }>('/api/gas', { chainid: chainId })

    return {
      lastBlock: parseInt(response.result.LastBlock) || 0,
      safe: parseFloat(response.result.SafeGasPrice) || 0,
      propose: parseFloat(response.result.ProposeGasPrice) || 0,
      fast: parseFloat(response.result.FastGasPrice) || 0,
      baseFee: parseFloat(response.result.suggestBaseFee) || 0,
      gasUsedRatio: Array.isArray(response.result.gasUsedRatio) 
        ? response.result.gasUsedRatio 
        : [parseFloat(response.result.gasUsedRatio) || 0],
      timestamp: Date.now(),
    }
  }

  /**
   * 获取燃烧历史数据
   */
  async getBurnHistory(chain: SupportedChain = 'ethereum', limit: number = 10): Promise<BurnDataResponse[]> {
    const chainId = this.getChainId(chain)
    const response = await this.request<{
      status: string
      message: string
      result: {
        number: string
        timestamp: string
        baseFeePerGas: string
        gasUsed: string
        gasLimit: string
      }
    }>('/api/burn-history', { 
      chainid: chainId, 
      limit: limit.toString() 
    })

    const baseFeePerGas = parseInt(response.result.baseFeePerGas, 16) || 0
    const gasUsed = parseInt(response.result.gasUsed, 16) || 0
    const burned = (baseFeePerGas * gasUsed) / 1e18

    return [{
      blockNumber: parseInt(response.result.number, 16),
      timestamp: parseInt(response.result.timestamp, 16) * 1000,
      burned: burned,
      totalBurned: burned,
    }]
  }

  /**
   * 获取燃烧排名数据
   */
  async getBurnRanking(chain: SupportedChain = 'ethereum', limit: number = 10): Promise<Array<{
    rank: number
    address: string
    burned: number
    percentage: number
  }>> {
    const chainId = this.getChainId(chain)
    const response = await this.request<{
      status: string
      message: string
      result: {
        number: string
        baseFeePerGas: string
        gasUsed: string
      }
    }>('/api/burn-ranking', { 
      chainid: chainId, 
      limit: limit.toString() 
    })

    const baseFeePerGas = parseInt(response.result.baseFeePerGas, 16) || 0
    const gasUsed = parseInt(response.result.gasUsed, 16) || 0
    const burned = (baseFeePerGas * gasUsed) / 1e18

    return [{
      rank: 1,
      address: '0x0000000000000000000000000000000000000000',
      burned: burned,
      percentage: 0,
    }]
  }

  /**
   * 获取总燃烧量数据
   */
  async getTotalBurned(chain: SupportedChain = 'ethereum'): Promise<{
    totalBurned: number
    totalBurnedFormatted: string
  }> {
    const chainId = this.getChainId(chain)
    const response = await this.request<{
      status: string
      message: string
      result: {
        baseFeePerGas: string
        gasUsed: string
      }
    }>('/api/total-burned', { chainid: chainId })

    const baseFeePerGas = parseInt(response.result.baseFeePerGas, 16) || 0
    const gasUsed = parseInt(response.result.gasUsed, 16) || 0
    const totalBurned = (baseFeePerGas * gasUsed) / 1e18

    return {
      totalBurned,
      totalBurnedFormatted: totalBurned.toFixed(6),
    }
  }
}

// 创建默认实例
export const gasApiService = new GasApiService()

// 创建特定基础 URL 的实例
export function createGasApiService(baseUrl: string): GasApiService {
  return new GasApiService(baseUrl)
}
