/**
 * 区块列表相关 React Query Hooks
 */

import { useQuery } from '@tanstack/react-query'

export const blocksQueryKeys = {
  all: ['blocks'] as const,
  list: (chainId: number, limit: number) => [...blocksQueryKeys.all, 'list', chainId, limit] as const,
}

interface BlockInfo {
  blockNumber: number
  blockHash: string
  timestamp: number
  blockAge: string
  baseFeeGwei: string
  gasUsed: string
  gasLimit: string
  gasUsedPercent: string
  burntFeesEth: string
  transactionCount: number
}

interface BlocksResponse {
  success: boolean
  data: BlockInfo[]
  meta: {
    chainId: number
    chainName: string
    chainSymbol: string
    total: number
    oldestBlock: number
    newestBlock: number
  }
  timestamp: string
  message?: string
  hint?: string
}

/**
 * 获取最近的区块列表
 * @param chainId 链 ID
 * @param limit 数量限制 (默认 30)
 * @param options React Query 选项
 */
export function useBlocks(
  chainId: number = 1,
  limit: number = 30,
  options?: {
    refetchInterval?: number
    enabled?: boolean
  }
) {
  return useQuery<BlockInfo[], Error>({
    queryKey: blocksQueryKeys.list(chainId, limit),
    queryFn: async () => {
      const response = await fetch(`/api/burnt-fees/blocks?chainId=${chainId}&limit=${limit}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blocks')
      }
      const data: BlocksResponse = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch blocks')
      }
      return data.data
    },
    refetchInterval: options?.refetchInterval ?? 12000, // 默认12秒刷新（1个区块）
    enabled: options?.enabled ?? true,
    staleTime: 10000,
    retry: 2,
  })
}

