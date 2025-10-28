/**
 * Gas 数据相关 React Query Hooks
 * 按照 PROMPT.md 规范实现
 * 使用简化的 API 服务
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createGasApiService } from '@/services/gas-api'
import { createBlocksApiService } from '@/services/blocks-api'
import { SupportedChain } from '@/lib'

/**
 * Gas 数据查询键
 */
export const gasQueryKeys = {
  all: ['gas'] as const,
  gasPrice: (chain: SupportedChain) => [...gasQueryKeys.all, 'gasPrice', chain] as const,
  burnHistory: (chain: SupportedChain, limit?: number, period?: string) => [...gasQueryKeys.all, 'burnHistory', chain, limit, period] as const,
  burnRanking: (chain: SupportedChain, limit?: number, period?: string) => [...gasQueryKeys.all, 'burnRanking', chain, limit, period] as const,
  totalBurned: (chain: SupportedChain, period?: string) => [...gasQueryKeys.all, 'totalBurned', chain, period] as const,
  burnCategories: (chain: SupportedChain, limit?: number) => [...gasQueryKeys.all, 'burnCategories', chain, limit] as const,
  latestBlock: (chain: SupportedChain) => [...gasQueryKeys.all, 'latestBlock', chain] as const,
  latestBlocks: (chain: SupportedChain, limit?: number) => [...gasQueryKeys.all, 'latestBlocks', chain, limit] as const,
}

/**
 * 获取 Gas 价格数据
 * 
 * @param chain - 链类型
 * @param options - 查询选项
 * @returns Gas 价格数据查询结果
 */
export function useGasPrice(chain: SupportedChain = 'ethereum', options?: {
  refetchInterval?: number
  enabled?: boolean
}) {
  return useQuery({
    queryKey: gasQueryKeys.gasPrice(chain),
    queryFn: async () => {
      const api = createGasApiService('')
      return await api.getGasPrice(chain)
    },
    refetchInterval: options?.refetchInterval ?? 5000, // 默认5秒刷新
    enabled: options?.enabled ?? true,
    staleTime: 3000, // 3秒内认为数据是新鲜的
    retry: 2,
    retryDelay: 2000,
  })
}

/**
 * 获取燃烧历史数据
 *
 * @param chain - 链类型
 * @param limit - 数据条数限制
 * @param period - 时间段
 * @param options - 查询选项
 * @returns 燃烧历史数据查询结果
 */
export function useBurnHistory(chain: SupportedChain = 'ethereum', limit: number = 100, period: string = '1d', options?: {
  refetchInterval?: number
  enabled?: boolean
}) {
  return useQuery({
    queryKey: gasQueryKeys.burnHistory(chain, limit, period),
    queryFn: async () => {
      const api = createGasApiService('')
      return await api.getBurnHistory(chain, limit, period)
    },
    refetchInterval: false, // 禁用自动刷新，只通过手动触发
    enabled: options?.enabled ?? true,
    staleTime: Infinity, // 数据不会过期
    retry: 2,
    retryDelay: 2000,
  })
}

/**
 * 获取燃烧排行榜
 *
 * @param chain - 链类型
 * @param limit - 数据条数限制
 * @param period - 时间段
 * @param options - 查询选项
 * @returns 燃烧排行榜查询结果
 */
export function useBurnRanking(chain: SupportedChain = 'ethereum', limit: number = 50, period: string = '3h', options?: {
  refetchInterval?: number
  enabled?: boolean
}) {
  return useQuery({
    queryKey: gasQueryKeys.burnRanking(chain, limit, period),
    queryFn: async () => {
      const api = createGasApiService('')
      return await api.getBurnRanking(chain, limit, period)
    },
    refetchInterval: options?.refetchInterval ?? 0, // 禁用自动刷新
    enabled: options?.enabled ?? false, // 默认不自动加载
    staleTime: 60000, // 60秒内认为数据是新鲜的
    retry: 2,
    retryDelay: 2000,
  })
}

/**
 * 获取燃烧总量
 *
 * @param chain - 链类型
 * @param period - 时间段
 * @param options - 查询选项
 * @returns 燃烧总量查询结果
 */
export function useTotalBurned(chain: SupportedChain = 'ethereum', period: string = '1d', options?: {
  refetchInterval?: number
  enabled?: boolean
}) {
  return useQuery({
    queryKey: gasQueryKeys.totalBurned(chain, period),
    queryFn: async () => {
      const api = createGasApiService('')
      return await api.getTotalBurned(chain, period)
    },
    refetchInterval: false, // 禁用自动刷新，只通过手动触发
    enabled: options?.enabled ?? true,
    staleTime: Infinity, // 数据不会过期
    retry: 3,
    retryDelay: 1000,
  })
}

/**
 * 获取最新区块数据
 * 
 * @param chain - 链类型
 * @param options - 查询选项
 * @returns 最新区块数据查询结果
 */
export function useLatestBlock(chain: SupportedChain = 'ethereum', options?: {
  refetchInterval?: number
  enabled?: boolean
}) {
  return useQuery({
    queryKey: gasQueryKeys.latestBlock(chain),
    queryFn: async () => {
      const api = createGasApiService('')
      const burnHistory = await api.getBurnHistory(chain, 1)
      return burnHistory[0] || null
    },
    refetchInterval: options?.refetchInterval ?? 12000, // 默认12秒刷新（一个区块时间）
    enabled: options?.enabled ?? true,
    staleTime: 10000, // 10秒内认为数据是新鲜的
    retry: 3,
    retryDelay: 1000,
  })
}

/**
 * 预加载 Gas 数据
 * 
 * @param chain - 链类型
 * @returns 预加载函数
 */
export function usePrefetchGasData(chain: SupportedChain = 'ethereum') {
  const queryClient = useQueryClient()

  const prefetchAll = () => {
    queryClient.prefetchQuery({
      queryKey: gasQueryKeys.gasPrice(chain),
      queryFn: async () => {
        const api = createGasApiService('')
        return await api.getGasPrice(chain)
      },
    })

    queryClient.prefetchQuery({
      queryKey: gasQueryKeys.burnHistory(chain),
      queryFn: async () => {
        const api = createGasApiService('')
        return await api.getBurnHistory(chain)
      },
    })

    queryClient.prefetchQuery({
      queryKey: gasQueryKeys.totalBurned(chain),
      queryFn: async () => {
        const api = createGasApiService('')
        return await api.getTotalBurned()
      },
    })
  }

  return { prefetchAll }
}

/**
 * 获取最新区块数据
 *
 * @param chain - 链类型
 * @param limit - 区块数量
 * @param options - 查询选项
 * @returns 最新区块数据查询结果
 */
export function useLatestBlocks(chain: SupportedChain = 'ethereum', limit: number = 10, options?: {
  refetchInterval?: number
  enabled?: boolean
}) {
  return useQuery({
    queryKey: gasQueryKeys.latestBlocks(chain, limit),
    queryFn: async () => {
      const api = createBlocksApiService('')
      return await api.getLatestBlocks(chain, limit)
    },
    refetchInterval: options?.refetchInterval ?? 12000, // 12秒刷新（一个区块时间）
    enabled: options?.enabled ?? true,
    staleTime: 10000, // 10秒内认为数据是新鲜的
    retry: 2,
    retryDelay: 2000,
  })
}

/**
 * 获取燃烧类别数据
 *
 * @param chain - 链类型
 * @param limit - 数据条数限制
 * @param options - 查询选项
 * @returns 燃烧类别数据查询结果
 */
export function useBurnCategories(chain: SupportedChain = 'ethereum', limit: number = 50, options?: {
  refetchInterval?: number
  enabled?: boolean
}) {
  return useQuery({
    queryKey: gasQueryKeys.burnCategories(chain, limit),
    queryFn: async () => {
      const api = createGasApiService('')
      return await api.getBurnCategories(chain, limit)
    },
    refetchInterval: false, // 禁用自动刷新，只通过手动触发
    enabled: options?.enabled ?? true,
    staleTime: Infinity, // 数据不会过期
    retry: 2,
    retryDelay: 2000,
  })
}

/**
 * 清除 Gas 数据缓存
 *
 * @returns 清除缓存函数
 */
export function useClearGasCache() {
  const queryClient = useQueryClient()

  const clearAll = () => {
    queryClient.removeQueries({
      queryKey: gasQueryKeys.all,
    })
  }

  const clearByChain = (chain: SupportedChain) => {
    queryClient.removeQueries({
      queryKey: gasQueryKeys.gasPrice(chain),
    })
  }

  return { clearAll, clearByChain }
}
