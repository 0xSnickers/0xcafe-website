/**
 * Burn Categories Query Hook
 * 使用 React Query 管理燃烧类别数据
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { burntFeesApi } from '@/lib/api'
import type { CategoriesResponse } from '@/types/api'

export interface UseCategoriesOptions extends Omit<UseQueryOptions<CategoriesResponse>, 'queryKey' | 'queryFn'> {
  chainId?: number
  period?: string
}

/**
 * 获取燃烧类别统计 Hook
 */
export function useCategories(options?: UseCategoriesOptions) {
  const { chainId = 1, period = '1d', ...queryOptions } = options || {}

  return useQuery<CategoriesResponse>({
    queryKey: ['burnt-fees-categories', chainId, period],
    queryFn: () => burntFeesApi.getCategories({ chainId, period }),
    refetchInterval: 60000, // 1 分钟刷新
    staleTime: 30000,
    ...queryOptions,
  })
}

