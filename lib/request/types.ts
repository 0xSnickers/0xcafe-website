/**
 * HTTP请求相关类型定义
 */

/**
 * API响应基础结构
 */
export interface ApiResponse<T = any> {
  status: string
  message: string
  result: T
}

/**
 * 请求配置选项
 */
export interface RequestConfig {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
  headers?: Record<string, string>
}

/**
 * 请求错误类型
 */
export class RequestError extends Error {
  status?: number
  statusText?: string
  response?: Response
  data?: any

  constructor(message: string, options?: { cause?: any }) {
    super(message, options)
    this.name = 'RequestError'
  }
}

/**
 * Etherscan Gas Oracle 响应数据
 */
export interface EtherscanGasOracle {
  LastBlock: string
  SafeGasPrice: string
  ProposeGasPrice: string
  FastGasPrice: string
  suggestBaseFee: string
  gasUsedRatio: string
}

/**
 * Gas价格数据
 */
export interface GasPriceData {
  lastBlock: number
  safe: number
  propose: number
  fast: number
  baseFee: number
  gasUsedRatio: number[]
  timestamp: number
}

/**
 * 燃烧数据
 */
export interface BurnData {
  blockNumber: number
  timestamp: number
  burned: number
  totalBurned: number
}

/**
 * 燃烧排行数据
 */
export interface BurnRanking {
  rank: number
  address: string
  burned: number
  percentage: number
}

/**
 * 链配置
 */
export interface ChainConfig {
  id: number
  name: string
  symbol: string
  rpcUrl: string
  explorerUrl: string
  apiKey: string
}

/**
 * 支持的链类型
 */
export type SupportedChain = 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'base' | 'optimism'

/**
 * 请求方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * 请求参数
 */
export interface RequestParams {
  [key: string]: string | number | boolean | undefined
}
