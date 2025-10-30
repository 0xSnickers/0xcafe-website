/**
 * Burnt Fees API 类型定义
 */

export interface BlockInfo {
  blockNumber: number
  baseFeePerGas: string
  burntFees: string
  blockAge: string
}

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

export interface CategoryItem {
  category: string
  totalBurntEth: string
  transactionCount: number
  uniqueAddresses: number
  percentage: string
}

export interface BurntFeesStats {
  period: string
  totalBurned: string
  burnRate: string
  avgBurnPerBlock: string
  avgGasUsedPercent: string
  blockCount: number
  timestamp: number
}

export interface BlocksResponse {
  success: boolean
  data: BlockInfo[]
  meta?: any
  timestamp?: string
}

export interface RankingResponse {
  success: boolean
  data: RankingItem[]
  meta?: any
  timestamp?: string
}

export interface CategoriesResponse {
  success: boolean
  data: CategoryItem[]
  meta?: any
  timestamp?: string
}

export interface BurntFeesResponse {
  success: boolean
  data: BurntFeesStats
  meta?: any
  timestamp?: string
}

