/**
 * Blocks Query Hook
 * 使用 React Query 管理区块数据
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { burntFeesApi } from '@/lib/api'
import type { BlocksResponse } from '@/types/api'

export interface UseBlocksOptions extends Omit<UseQueryOptions<BlocksResponse>, 'queryKey' | 'queryFn'> {
  chainId?: number
  limit?: number
}

/**
 * 获取区块列表 Hook
 */
export function useBlocks(options?: UseBlocksOptions) {
  const { chainId = 1, limit = 30, ...queryOptions } = options || {}

  return useQuery<BlocksResponse>({
    queryKey: ['blocks', chainId, limit],
    queryFn: () => burntFeesApi.getBlocks({ chainId, limit }),
    refetchInterval: 15000, // 15 秒刷新
    staleTime: 10000,
    ...queryOptions,
  })
}

