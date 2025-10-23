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
    const url = new URL(endpoint, this.baseUrl || window.location.origin)
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
   * 解析 gasUsedRatio 字符串为数组
   * Etherscan 返回格式: "0.233887,0.711344,0.469044,0.462337,0.440736"
   */
  private parseGasUsedRatio(ratio: string | number[] | undefined): number[] {
    if (Array.isArray(ratio)) {
      return ratio
    }

    if (typeof ratio === 'string') {
      return ratio.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
    }

    return [0]
  }

  /**
   * 安全解析浮点数
   */
  private parseFloat(value: string | number | undefined, defaultValue: number = 0): number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const parsed = parseFloat(value)
      return isNaN(parsed) ? defaultValue : parsed
    }
    return defaultValue
  }

  /**
   * 安全解析整数
   */
  private parseInt(value: string | number | undefined, defaultValue: number = 0): number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const parsed = parseInt(value)
      return isNaN(parsed) ? defaultValue : parsed
    }
    return defaultValue
  }

  /**
   * 获取 Gas 价格数据
   */
  async getGasPrice(chain: SupportedChain = 'ethereum'): Promise<GasPriceResponse> {
    try {
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
          gasUsedRatio: string | number[]
        }
      }>('/api/gas', { chainid: chainId })

      // 检查 API 响应状态
      if (response.status !== '1') {
        throw new Error(response.message || 'API returned error status')
      }

      return {
        lastBlock: this.parseInt(response.result.LastBlock),
        safe: this.parseFloat(response.result.SafeGasPrice),
        propose: this.parseFloat(response.result.ProposeGasPrice),
        fast: this.parseFloat(response.result.FastGasPrice),
        baseFee: this.parseFloat(response.result.suggestBaseFee),
        gasUsedRatio: this.parseGasUsedRatio(response.result.gasUsedRatio),
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error('getGasPrice error:', error)
      throw error
    }
  }

  /**
   * 获取燃烧历史数据
   */
  async getBurnHistory(chain: SupportedChain = 'ethereum', limit: number = 100, period: string = '1d'): Promise<Array<{
    blockNumber: number
    timestamp: number
    baseFeePerGas: number
    gasUsed: number
    gasLimit: number
    gasUsedPercent: string
    burned: string
    transactionCount: number
  }>> {
    try {
      const chainId = this.getChainId(chain)
      const response = await this.request<{
        status: string
        message: string
        result: {
          period: string
          totalBurned: string
          burnRate: string
          blockCount: number
          blocks: Array<{
            blockNumber: number
            timestamp: number
            baseFeePerGas: number
            gasUsed: number
            gasLimit: number
            gasUsedPercent: string
            burned: string
            transactionCount: number
          }>
          timestamp: number
        }
      }>('/api/burn-history', { 
        chainid: chainId, 
        limit: limit.toString(), 
        period 
      })

      // 检查 API 响应状态
      if (response.status !== '1') {
        throw new Error(response.message || 'API returned error status')
      }

      return response.result.blocks
    } catch (error) {
      console.error('getBurnHistory error:', error)
      throw error
    }
  }

  /**
   * 获取燃烧排名数据
   */
  async getBurnRanking(chain: SupportedChain = 'ethereum', limit: number = 50, period: string = '3h'): Promise<Array<{
    rank: number
    address: string
    name: string
    category: string
    burnedETH: string
    burnedUSD: string
    percentage: string
    transactionCount: number
    lastActivity: number
  }>> {
    try {
      const chainId = this.getChainId(chain)
      const response = await this.request<{
        status: string
        message: string
        result: Array<{
          rank: number
          address: string
          name: string
          category: string
          burnedETH: string
          burnedUSD: string
          percentage: string
          transactionCount: number
          lastActivity: number
        }>
        metadata: {
          period: string
          analyzedBlocks: number
          totalAddresses: number
          totalNetworkBurned: string
          totalNetworkBurnedUSD: string
          ethPrice: number
          timestamp: number
        }
      }>('/api/burn-ranking', {
        chainid: chainId,
        limit: limit.toString(),
        period
      })

      // 检查 API 响应状态
      if (response.status !== '1') {
        throw new Error(response.message || 'API returned error status')
      }

      return response.result
    } catch (error) {
      console.error('getBurnRanking error:', error)
      throw error
    }
  }

  /**
   * 获取总燃烧量数据
   */
  async getTotalBurned(chain: SupportedChain = 'ethereum', period: string = '5m'): Promise<{
    totalBurned: number
    totalBurnedFormatted: string
    burnRate: number
    burnRateFormatted: string
    avgBurnPerBlock: number
    avgGasUsedPercent: number
    blockCount: number
    trend?: Array<{ time: string; value: string; timestamp: number }>
  }> {
    try {
      const chainId = this.getChainId(chain)
      const response = await this.request<{
        status: string
        message: string
        result: {
          period: string
          totalBurned: string
          burnRate: string
          avgBurnPerBlock: string
          avgGasUsedPercent: string
          blockCount: number
          totalGasUsed: string
          totalGasLimit: string
          timestamp: number
          trend?: Array<{ time: string; value: string; timestamp: number }>
        }
      }>('/api/total-burned', { chainid: chainId, period })

      // 检查 API 响应状态
      if (response.status !== '1') {
        throw new Error(response.message || 'API returned error status')
      }

      const result = response.result

      return {
        totalBurned: parseFloat(result.totalBurned),
        totalBurnedFormatted: result.totalBurned,
        burnRate: parseFloat(result.burnRate),
        burnRateFormatted: result.burnRate,
        avgBurnPerBlock: parseFloat(result.avgBurnPerBlock),
        avgGasUsedPercent: parseFloat(result.avgGasUsedPercent),
        blockCount: result.blockCount,
        trend: result.trend,
      }
    } catch (error) {
      console.error('getTotalBurned error:', error)
      throw error
    }
  }

  /**
   * 获取燃烧类别数据
   */
  async getBurnCategories(chain: SupportedChain = 'ethereum', limit: number = 50): Promise<Array<{
    category: string
    burned: string
    percentage: string
    transactionCount: number
    uniqueAddresses: number
    topAddresses: Array<{
      address: string
      burned: string
      name: string
    }>
  }>> {
    try {
      const chainId = this.getChainId(chain)
      const response = await this.request<{
        status: string
        message: string
        result: Array<{
          category: string
          burned: string
          percentage: string
          transactionCount: number
          uniqueAddresses: number
          topAddresses: Array<{
            address: string
            burned: string
            name: string
          }>
        }>
        metadata: {
          totalBurned: string
          analyzedBlocks: number
          totalCategories: number
          timestamp: number
        }
      }>('/api/burn-categories', { chainid: chainId, limit: limit.toString() })

      // 检查 API 响应状态
      if (response.status !== '1') {
        throw new Error(response.message || 'API returned error status')
      }

      return response.result
    } catch (error) {
      console.error('getBurnCategories error:', error)
      throw error
    }
  }
}

// 创建默认实例
export const gasApiService = new GasApiService()

// 创建特定基础 URL 的实例
export function createGasApiService(baseUrl: string): GasApiService {
  return new GasApiService(baseUrl)
}
