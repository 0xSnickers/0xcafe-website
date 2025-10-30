/**
 * Gas Price Query Hook
 * 使用 React Query 管理 Gas Price 数据
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { gasApi } from '@/lib/api'
import type { GasPriceResponse } from '@/types/api'

export interface UseGasPriceOptions extends Omit<UseQueryOptions<GasPriceResponse>, 'queryKey' | 'queryFn'> {
  refetchInterval?: number
}

/**
 * 获取 Gas Price Hook
 * @param chainId - 链 ID
 * @param options - React Query 配置
 */
export function useGasPrice(chainId: number = 1, options?: UseGasPriceOptions) {
  return useQuery<GasPriceResponse>({
    queryKey: ['gas-price', chainId],
    queryFn: () => gasApi.getGasPrice(chainId),
    refetchInterval: options?.refetchInterval || 15000, // 默认 15 秒刷新
    staleTime: 10000, // 10 秒内数据不过期
    ...options,
  })
}

