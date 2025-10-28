/**
 * Burnt Fees React Query Hooks (RPC + PostgreSQL 方案)
 * 
 * 直接调用 /api/burnt-fees API
 * 架构: RPC + PostgreSQL (无需 Subgraph)
 */

import { useQuery } from '@tanstack/react-query'

/**
 * Burnt Fees API 响应类型
 */
export interface BurntFeesData {
  chainId: number
  chainName: string
  chainSymbol: string
  period: string
  periodLabel: string
  totalBurntEth: string
  totalBurntGwei?: string
  avgBaseFeeGwei: string
  totalGasUsed: string
  blockCount: number
  avgBurntPerBlock: string
  avgBurntPerBlockEth?: string
  dataPoints?: number
  coverage?: string
  dataSource: string
}

export interface BurntFeesResponse {
  success: boolean
  data: BurntFeesData
  timestamp: string
  message?: string
  hint?: string
}

/**
 * 查询键
 */
export const burntFeesQueryKeys = {
  all: ['burntFees'] as const,
  byChainAndPeriod: (chainId: number, period: string) => 
    [...burntFeesQueryKeys.all, chainId, period] as const,
}

/**
 * 获取 Burnt Fees 统计数据
 * 
 * @param chainId - 链 ID (default: 1 = Ethereum)
 * @param period - 时间段 (1h, 1d, 7d, 30d)
 * @param options - React Query 选项
 * @returns Burnt Fees 统计数据
 */
export function useBurntFees(
  chainId: number = 1, 
  period: '1h' | '1d' | '7d' | '30d' = '1d',
  options?: {
    refetchInterval?: number | false
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery<BurntFeesResponse, Error>({
    queryKey: burntFeesQueryKeys.byChainAndPeriod(chainId, period),
    queryFn: async () => {
      const response = await fetch(
        `/api/burnt-fees?chainId=${chainId}&period=${period}`
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch burnt fees data')
      }

      return response.json()
    },
    refetchInterval: options?.refetchInterval ?? false, // 默认不自动刷新
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 60000, // 默认 60 秒
    retry: 2,
    retryDelay: 2000,
  })
}

/**
 * 格式化 Burnt Fees 数据为组件友好的格式
 */
export function useFormattedBurntFees(chainId: number = 1, period: '1h' | '1d' | '7d' | '30d' = '1d') {
  const { data, isLoading, error, refetch } = useBurntFees(chainId, period)

  // 格式化后的数据
  const formatted = {
    // 总燃烧量
    totalBurned: data?.data ? parseFloat(data.data.totalBurntEth) : 0,
    totalBurnedFormatted: data?.data ? parseFloat(data.data.totalBurntEth).toFixed(2) : '0.00',
    
    // 燃烧率 (ETH/min)
    burnRate: data?.data ? (parseFloat(data.data.totalBurntEth) / (data.data.blockCount * 12 / 60)).toFixed(4) : '0.0000',
    burnRateFormatted: data?.data ? (parseFloat(data.data.totalBurntEth) / (data.data.blockCount * 12 / 60)).toFixed(4) : '0.0000',
    
    // 平均每区块燃烧量
    avgBurnPerBlock: data?.data ? parseFloat(data.data.avgBurntPerBlock) : 0,
    avgBurnPerBlockFormatted: data?.data ? parseFloat(data.data.avgBurntPerBlock).toFixed(6) : '0.000000',
    
    // 平均 Gas 使用率
    avgGasUsedPercent: data?.data ? ((parseFloat(data.data.totalGasUsed) / (data.data.blockCount * 30000000)) * 100).toFixed(2) : '0.00',
    
    // 平均 baseFee
    avgBaseFee: data?.data ? parseFloat(data.data.avgBaseFeeGwei) : 0,
    avgBaseFeeFormatted: data?.data ? parseFloat(data.data.avgBaseFeeGwei).toFixed(2) : '0.00',
    
    // 区块数量
    blockCount: data?.data?.blockCount || 0,
    
    // 链信息
    chainName: data?.data?.chainName || 'Ethereum',
    chainSymbol: data?.data?.chainSymbol || 'ETH',
    
    // 时间段
    period: period,
    periodLabel: data?.data?.periodLabel || period,
    
    // 数据源
    dataSource: data?.data?.dataSource || 'unknown',
    
    // 原始数据
    raw: data?.data,
  }

  return {
    data: formatted,
    isLoading,
    error,
    refetch,
  }
}

/**
 * 多时间段 Burnt Fees 数据（用于对比）
 */
export function useMultiPeriodBurntFees(chainId: number = 1) {
  const hour = useBurntFees(chainId, '1h')
  const day = useBurntFees(chainId, '1d')
  const week = useBurntFees(chainId, '7d')
  const month = useBurntFees(chainId, '30d')

  return {
    '1h': hour,
    '1d': day,
    '7d': week,
    '30d': month,
    isLoading: hour.isLoading || day.isLoading || week.isLoading || month.isLoading,
    hasError: !!hour.error || !!day.error || !!week.error || !!month.error,
    refetchAll: () => {
      hour.refetch()
      day.refetch()
      week.refetch()
      month.refetch()
    },
  }
}

