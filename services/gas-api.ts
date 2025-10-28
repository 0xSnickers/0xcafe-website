/**
 * Gas API 服务
 * 统一的 Gas 数据获取服务，简化调用过程
 */

import { SupportedChain, getChainConfig } from '../lib'
import { httpClient, getGasEndpoint, getBurnHistoryEndpoint, getBurnRankingEndpoint, getTotalBurnedEndpoint, getBurnCategoriesEndpoint } from '../lib/request'

/**
 * Gas 价格数据接口
 */
export interface GasPriceResponse {
  lastBlock: number
  safe: number
  propose: number
  fast: number
  baseFee: number
  gasPrice: number
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
      const endpoint = getGasEndpoint(chainId)
      
      // 直接使用 fetch，因为新 API 返回格式不同于 Etherscan
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      
      // 新 API 返回格式: { success: true, data: { ... } }
      if (!json.success || !json.data) {
        throw new Error('Invalid API response: missing data field')
      }

      const data = json.data

      return {
        lastBlock: this.parseInt(data.LastBlock),
        safe: this.parseFloat(data.SafeGasPrice),
        propose: this.parseFloat(data.ProposeGasPrice),
        fast: this.parseFloat(data.FastGasPrice),
        baseFee: this.parseFloat(data.suggestBaseFee),
        gasPrice: this.parseFloat(data.gasPrice),
        timestamp: data.timestamp * 1000, // API 返回秒，转换为毫秒
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
      const endpoint = getBurnHistoryEndpoint(chainId, limit, period)
      
      const response = await httpClient.get<{
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
      }>(endpoint)

      return response.result.blocks || []
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
      const endpoint = getBurnRankingEndpoint(chainId, limit, period)
      
      const response = await httpClient.get<Array<{
        rank: number
        address: string
        name: string
        category: string
        burnedETH: string
        burnedUSD: string
        percentage: string
        transactionCount: number
        lastActivity: number
      }>>(endpoint)

      return response.result || []
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
      const endpoint = getTotalBurnedEndpoint(chainId, period)
      
      const response = await httpClient.get<{
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
      }>(endpoint)

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
      const endpoint = getBurnCategoriesEndpoint(chainId, limit)
      
      const response = await httpClient.get<Array<{
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
      }>>(endpoint)

      return response.result || []
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
