/**
 * Gas Price API 类型定义
 */

export interface GasPriceData {
  chainId?: number
  chainName?: string
  LastBlock: string
  SafeGasPrice: string
  ProposeGasPrice: string
  FastGasPrice: string
  baseFee: string
  gasPrice: string
  timestamp: number
  blockAge?: number
  priorityFees?: {
    low: string
    average: string
    high: string
  }
}

export interface GasPriceResponse {
  success: boolean
  data: GasPriceData
  message?: string
  error?: string
}

