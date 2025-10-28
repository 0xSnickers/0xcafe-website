/**
 * 燃烧排行榜相关 React Query Hooks
 */

import { useQuery } from '@tanstack/react-query'

export const rankingQueryKeys = {
  all: ['ranking'] as const,
  list: (chainId: number, period: string, limit: number) => 
    [...rankingQueryKeys.all, 'list', chainId, period, limit] as const,
  categories: (chainId: number, period: string) => 
    [...rankingQueryKeys.all, 'categories', chainId, period] as const,
}

interface RankingItem {
  rank: number
  address: string
  name: string
  category: string
  totalBurntEth: string
  transactionCount: number
  avgBurntPerTx: string
  percentage: string
}

interface CategoryItem {
  category: string
  totalBurntEth: string
  transactionCount: number
  uniqueAddresses: number
  percentage: string
}

/**
 * 获取燃烧排行榜
 * @param chainId 链 ID
 * @param period 时间段
 * @param limit 数量限制
 * @param options React Query 选项
 */
export function useRanking(
  chainId: number = 1,
  period: '1h' | '1d' | '7d' | '30d' = '1d',
  limit: number = 20,
  options?: {
    refetchInterval?: number
    enabled?: boolean
  }
) {
  return useQuery<RankingItem[], Error>({
    queryKey: rankingQueryKeys.list(chainId, period, limit),
    queryFn: async () => {
      const response = await fetch(
        `/api/burnt-fees/ranking?chainId=${chainId}&period=${period}&limit=${limit}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch ranking')
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch ranking')
      }
      return data.data
    },
    refetchInterval: options?.refetchInterval ?? 30000, // 默认30秒刷新
    enabled: options?.enabled ?? true,
    staleTime: 20000,
    retry: 2,
  })
}

/**
 * 获取燃烧类别统计
 * @param chainId 链 ID
 * @param period 时间段
 * @param options React Query 选项
 */
export function useCategories(
  chainId: number = 1,
  period: '1h' | '1d' | '7d' | '30d' = '1d',
  options?: {
    refetchInterval?: number
    enabled?: boolean
  }
) {
  return useQuery<CategoryItem[], Error>({
    queryKey: rankingQueryKeys.categories(chainId, period),
    queryFn: async () => {
      const response = await fetch(
        `/api/burnt-fees/categories?chainId=${chainId}&period=${period}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch categories')
      }
      return data.data
    },
    refetchInterval: options?.refetchInterval ?? 30000, // 默认30秒刷新
    enabled: options?.enabled ?? true,
    staleTime: 20000,
    retry: 2,
  })
}

