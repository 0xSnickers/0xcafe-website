/**
 * Burnt Fees API 客户端
 * 燃烧费用相关数据获取
 */

import { apiClient, buildQueryString, type ApiResponse } from './client'
import { buildApiUrl } from './config'

/**
 * 区块信息
 */
export interface BlockInfo {
  blockNumber: number
  baseFeePerGas: string
  burntFees: string
  blockAge: string
}

/**
 * 燃烧排名项
 */
export interface RankingItem {
  rank: number
  address: string
  name: string
  category: string
  totalBurntEth: string
  transactionCount: number
  avgBurntPerTx: string
  percentage: string
}

/**
 * 燃烧类别项
 */
export interface CategoryItem {
  category: string
  totalBurntEth: string
  transactionCount: number
  uniqueAddresses: number
  percentage: string
}

/**
 * 燃烧统计数据
 */
export interface BurntFeesStats {
  period: string
  totalBurned: string
  burnRate: string
  avgBurnPerBlock: string
  avgGasUsedPercent: string
  blockCount: number
  timestamp: number
}

export interface BlocksResponse extends ApiResponse<BlockInfo[]> {}
export interface RankingResponse extends ApiResponse<RankingItem[]> {}
export interface CategoriesResponse extends ApiResponse<CategoryItem[]> {}
export interface BurntFeesResponse extends ApiResponse<BurntFeesStats> {}

/**
 * Burnt Fees API
 */
export const burntFeesApi = {
  /**
   * 获取最近的区块列表
   */
  getBlocks: async (params?: {
    chainId?: number
    limit?: number
  }): Promise<BlocksResponse> => {
    const query = buildQueryString(params || {})
    return apiClient.get<BlocksResponse>(buildApiUrl(`/burnt-fees/blocks${query}`))
  },

  /**
   * 获取燃烧排行榜
   */
  getRanking: async (params?: {
    chainId?: number
    period?: string
    limit?: number
  }): Promise<RankingResponse> => {
    const query = buildQueryString(params || {})
    return apiClient.get<RankingResponse>(buildApiUrl(`/burnt-fees/ranking${query}`))
  },

  /**
   * 获取燃烧类别统计
   */
  getCategories: async (params?: {
    chainId?: number
    period?: string
  }): Promise<CategoriesResponse> => {
    const query = buildQueryString(params || {})
    return apiClient.get<CategoriesResponse>(buildApiUrl(`/burnt-fees/categories${query}`))
  },

  /**
   * 获取燃烧统计数据
   */
  getStats: async (params?: {
    chainId?: number
    period?: string
  }): Promise<BurntFeesResponse> => {
    const query = buildQueryString(params || {})
    return apiClient.get<BurntFeesResponse>(buildApiUrl(`/burnt-fees${query}`))
  },
}

