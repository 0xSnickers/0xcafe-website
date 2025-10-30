/**
 * Burn Ranking Query Hook
 * 使用 React Query 管理燃烧排行数据
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { burntFeesApi } from '@/lib/api'
import type { RankingResponse } from '@/types/api'

export interface UseRankingOptions extends Omit<UseQueryOptions<RankingResponse>, 'queryKey' | 'queryFn'> {
  chainId?: number
  period?: string
  limit?: number
}

/**
 * 获取燃烧排行榜 Hook
 */
export function useRanking(options?: UseRankingOptions) {
  const { chainId = 1, period = '1d', limit = 20, ...queryOptions } = options || {}

  return useQuery<RankingResponse>({
    queryKey: ['burnt-fees-ranking', chainId, period, limit],
    queryFn: () => burntFeesApi.getRanking({ chainId, period, limit }),
    refetchInterval: 60000, // 1 分钟刷新
    staleTime: 30000,
    ...queryOptions,
  })
}

