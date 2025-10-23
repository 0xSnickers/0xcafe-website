/**
 * API 服务
 * 统一的 API 调用封装
 */

import { createHttpClient, ApiRequestError } from './client'
import { API_ENDPOINTS, CHAIN_ID_TO_NETWORK, CHAIN_ID_TO_ETHERSCAN } from './config'

// Gas 价格数据接口
export interface GasPriceData {
  lastBlock: number
  safe: number
  propose: number
  fast: number
  baseFee: number
  gasUsedRatio: number[]
  timestamp: number
}

// 区块数据接口
export interface BlockData {
  number: number
  timestamp: number
  baseFeePerGas: number
  gasUsed: number
  gasLimit: number
  gasUsedPercent: string
  burntFees: string
  transactionCount: number
}

// 燃烧历史数据接口
export interface BurnHistoryData {
  blockNumber: number
  timestamp: number
  baseFeePerGas: number
  gasUsed: number
  gasLimit: number
  gasUsedPercent: string
  burned: string
  transactionCount: number
}

// 燃烧排名数据接口
export interface BurnRankingData {
  rank: number
  address: string
  name: string
  category: string
  burnedETH: string
  burnedUSD: string
  percentage: string
  transactionCount: number
  lastActivity: number
}

// 总燃烧量数据接口
export interface TotalBurnedData {
  totalBurned: number
  totalBurnedFormatted: string
  burnRate: number
  burnRateFormatted: string
  avgBurnPerBlock: number
  avgGasUsedPercent: number
  blockCount: number
  trend?: Array<{ time: string; value: string; timestamp: number }>
}

// 燃烧类别数据接口
export interface BurnCategoryData {
  category: string
  burned: string
  percentage: string
  transactionCount: number
  uniqueAddresses: number
  topAddresses: Array<{
    address: string
    burned: string
    name: string
  }>
}

/**
 * Gas API 服务
 */
export class GasApiService {
  private static alchemyClient = createHttpClient()
  private static infuraClient = createHttpClient()

  /**
   * 使用 Alchemy 获取 Gas 价格
   */
  static async getGasPriceFromAlchemy(chainId: string): Promise<GasPriceData> {
    try {
      const network = CHAIN_ID_TO_NETWORK[chainId] || 'eth-mainnet'
      const url = `https://${network}.g.alchemy.com/v2/${API_ENDPOINTS.alchemy.apiKey}`
      
      this.alchemyClient.setBaseURL(url)
      
      const response = await this.alchemyClient.post('', {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: []
      })

      const currentGasPrice = parseInt(response.result, 16)
      const gasPriceInGwei = currentGasPrice / 1e9

      return {
        lastBlock: 0,
        safe: Math.round(gasPriceInGwei * 0.9),
        propose: Math.round(gasPriceInGwei),
        fast: Math.round(gasPriceInGwei * 1.1),
        baseFee: gasPriceInGwei,
        gasUsedRatio: [0.5],
        timestamp: Date.now()
      }
    } catch (error) {
      throw new ApiRequestError(`Alchemy Gas API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * 使用 Infura Gas API 获取 Gas 价格
   */
  static async getGasPriceFromInfura(chainId: string): Promise<GasPriceData> {
    try {
      const url = `${API_ENDPOINTS.infuraGas.baseUrl}/${API_ENDPOINTS.infuraGas.apiKey}/networks/${chainId}/suggestedGasFees`
      
      this.infuraClient.setBaseURL('')
      const response = await this.infuraClient.get(url)

      return {
        lastBlock: 0,
        safe: parseFloat(response.low.suggestedMaxFeePerGas),
        propose: parseFloat(response.medium.suggestedMaxFeePerGas),
        fast: parseFloat(response.high.suggestedMaxFeePerGas),
        baseFee: parseFloat(response.estimatedBaseFee),
        gasUsedRatio: [response.networkCongestion || 0.5],
        timestamp: Date.now()
      }
    } catch (error) {
      throw new ApiRequestError(`Infura Gas API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * 获取 Gas 价格（自动选择最佳提供商）
   */
  static async getGasPrice(chainId: string): Promise<GasPriceData> {
    try {
      return await this.getGasPriceFromInfura(chainId)
    } catch (infuraError) {
      console.warn('Infura Gas API failed, falling back to Alchemy:', infuraError)
      try {
        return await this.getGasPriceFromAlchemy(chainId)
      } catch (alchemyError) {
        throw new ApiRequestError(`Both Infura and Alchemy failed. Infura: ${infuraError instanceof Error ? infuraError.message : 'Unknown'}, Alchemy: ${alchemyError instanceof Error ? alchemyError.message : 'Unknown'}`)
      }
    }
  }
}

/**
 * 区块 API 服务
 */
export class BlockApiService {
  private static alchemyClient = createHttpClient()
  private static etherscanClient = createHttpClient()

  /**
   * 使用 Alchemy 获取最新区块
   */
  static async getLatestBlocksFromAlchemy(chainId: string, limit: number = 10): Promise<BlockData[]> {
    try {
      const network = CHAIN_ID_TO_NETWORK[chainId] || 'eth-mainnet'
      const url = `https://${network}.g.alchemy.com/v2/${API_ENDPOINTS.alchemy.apiKey}`
      
      this.alchemyClient.setBaseURL(url)

      // 获取最新区块号
      const latestBlockResponse = await this.alchemyClient.post('', {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: []
      })

      const latestBlockNumber = parseInt(latestBlockResponse.result, 16)
      const blocks: BlockData[] = []

      // 获取最近的 N 个区块
      const fetchPromises = []
      for (let i = 0; i < limit; i++) {
        const blockNumber = '0x' + (latestBlockNumber - i).toString(16)
        
        fetchPromises.push(
          this.alchemyClient.post('', {
            id: 1,
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [blockNumber, false]
          }).then(response => ({
            blockNumber: latestBlockNumber - i,
            data: response.result
          }))
        )
      }

      const blockResults = await Promise.all(fetchPromises)

      // 处理区块数据
      for (const { blockNumber, data } of blockResults) {
        if (!data) continue

        const baseFeePerGas = parseInt(data.baseFeePerGas || '0x0', 16)
        const gasUsed = parseInt(data.gasUsed || '0x0', 16)
        const gasLimit = parseInt(data.gasLimit || '0x0', 16)
        const timestamp = parseInt(data.timestamp || '0x0', 16)

        const burntFees = (baseFeePerGas * gasUsed) / 1e18
        const gasUsedPercent = gasLimit > 0 ? (gasUsed / gasLimit) * 100 : 0

        blocks.push({
          number: blockNumber,
          timestamp: timestamp * 1000,
          baseFeePerGas: baseFeePerGas / 1e9,
          gasUsed,
          gasLimit,
          gasUsedPercent: gasUsedPercent.toFixed(2),
          burntFees: burntFees.toFixed(6),
          transactionCount: Array.isArray(data.transactions) ? data.transactions.length : 0,
        })
      }

      return blocks.sort((a, b) => b.number - a.number)
    } catch (error) {
      throw new ApiRequestError(`Alchemy Block API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * 使用 Etherscan 获取最新区块
   */
  static async getLatestBlocksFromEtherscan(chainId: string, limit: number = 10): Promise<BlockData[]> {
    try {
      const subdomain = CHAIN_ID_TO_ETHERSCAN[chainId] || 'api.etherscan.io'
      const baseUrl = `https://${subdomain}/v2/api`
      
      this.etherscanClient.setBaseURL(baseUrl)

      // 获取最新区块号
      const latestBlockResponse = await this.etherscanClient.get('', {
        params: {
          chainid: chainId,
          module: 'proxy',
          action: 'eth_blockNumber',
          apikey: API_ENDPOINTS.etherscan.apiKey
        }
      })

      const latestBlockNumber = parseInt(latestBlockResponse.result, 16)
      const blocks: BlockData[] = []

      // 获取最近的 N 个区块
      const fetchPromises = []
      for (let i = 0; i < limit; i++) {
        const blockNumber = '0x' + (latestBlockNumber - i).toString(16)
        
        fetchPromises.push(
          this.etherscanClient.get('', {
            params: {
              chainid: chainId,
              module: 'proxy',
              action: 'eth_getBlockByNumber',
              tag: blockNumber,
              boolean: 'false',
              apikey: API_ENDPOINTS.etherscan.apiKey
            }
          }).then(response => ({
            blockNumber: latestBlockNumber - i,
            data: response.result
          }))
        )
      }

      const blockResults = await Promise.all(fetchPromises)

      // 处理区块数据
      for (const { blockNumber, data } of blockResults) {
        if (!data) continue

        const baseFeePerGas = parseInt(data.baseFeePerGas || '0x0', 16)
        const gasUsed = parseInt(data.gasUsed || '0x0', 16)
        const gasLimit = parseInt(data.gasLimit || '0x0', 16)
        const timestamp = parseInt(data.timestamp || '0x0', 16)

        const burntFees = (baseFeePerGas * gasUsed) / 1e18
        const gasUsedPercent = gasLimit > 0 ? (gasUsed / gasLimit) * 100 : 0

        blocks.push({
          number: blockNumber,
          timestamp: timestamp * 1000,
          baseFeePerGas: baseFeePerGas / 1e9,
          gasUsed,
          gasLimit,
          gasUsedPercent: gasUsedPercent.toFixed(2),
          burntFees: burntFees.toFixed(6),
          transactionCount: Array.isArray(data.transactions) ? data.transactions.length : 0,
        })
      }

      return blocks.sort((a, b) => b.number - a.number)
    } catch (error) {
      throw new ApiRequestError(`Etherscan Block API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * 获取最新区块（自动选择最佳提供商）
   */
  static async getLatestBlocks(chainId: string, limit: number = 10): Promise<BlockData[]> {
    try {
      return await this.getLatestBlocksFromAlchemy(chainId, limit)
    } catch (alchemyError) {
      console.warn('Alchemy failed, falling back to Etherscan:', alchemyError)
      try {
        return await this.getLatestBlocksFromEtherscan(chainId, limit)
      } catch (etherscanError) {
        throw new ApiRequestError(`Both Alchemy and Etherscan failed. Alchemy: ${alchemyError instanceof Error ? alchemyError.message : 'Unknown'}, Etherscan: ${etherscanError instanceof Error ? etherscanError.message : 'Unknown'}`)
      }
    }
  }
}

/**
 * 燃烧数据 API 服务
 */
export class BurnDataApiService {
  private static etherscanClient = createHttpClient()

  /**
   * 获取燃烧历史数据
   */
  static async getBurnHistory(chainId: string, _limit: number = 10, _period: string = '5m'): Promise<BurnHistoryData[]> {
    try {
      // 这里需要根据实际的 API 实现
      // 由于燃烧历史数据比较复杂，这里提供一个基础框架
      // TODO: 实现燃烧历史数据获取逻辑
      // 参数: chainId=${chainId}, limit=${_limit}, period=${_period}
      
      // 临时返回空数组，实际实现时会替换
      const result: BurnHistoryData[] = []
      return result
    } catch (error) {
      throw new ApiRequestError(`Burn History API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * 获取燃烧排名数据
   */
  static async getBurnRanking(chainId: string, _limit: number = 50, _period: string = '3h'): Promise<BurnRankingData[]> {
    try {
      // 这里需要根据实际的 API 实现
      // TODO: 实现燃烧排名数据获取逻辑
      // 参数: chainId=${chainId}, limit=${_limit}, period=${_period}
      
      // 临时返回空数组，实际实现时会替换
      const result: BurnRankingData[] = []
      return result
    } catch (error) {
      throw new ApiRequestError(`Burn Ranking API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * 获取总燃烧量数据
   */
  static async getTotalBurned(chainId: string, _period: string = '5m'): Promise<TotalBurnedData> {
    try {
      // 这里需要根据实际的 API 实现
      // TODO: 实现总燃烧量数据获取逻辑
      // 参数: chainId=${chainId}, period=${_period}
      
      // 临时返回默认数据，实际实现时会替换
      const result: TotalBurnedData = {
        totalBurned: 0,
        totalBurnedFormatted: '0',
        burnRate: 0,
        burnRateFormatted: '0',
        avgBurnPerBlock: 0,
        avgGasUsedPercent: 0,
        blockCount: 0,
      }
      return result
    } catch (error) {
      throw new ApiRequestError(`Total Burned API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * 获取燃烧类别数据
   */
  static async getBurnCategories(chainId: string, _limit: number = 50): Promise<BurnCategoryData[]> {
    try {
      // 这里需要根据实际的 API 实现
      // TODO: 实现燃烧类别数据获取逻辑
      // 参数: chainId=${chainId}, limit=${_limit}
      
      // 临时返回空数组，实际实现时会替换
      const result: BurnCategoryData[] = []
      return result
    } catch (error) {
      throw new ApiRequestError(`Burn Categories API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
