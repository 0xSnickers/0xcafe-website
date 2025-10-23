/**
 * 燃烧类别 API 路由
 * 分析交易类型，提供类别统计和燃烧占比分析
 */

import { NextRequest, NextResponse } from 'next/server'
import { makeHttpsRequest } from '@/lib/https-request'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'X9S3IXSVZ8W7P8D1EJV42KNMBG9I6PH6MX'
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/v2/api'

// 支持的链 ID
const SUPPORTED_CHAIN_IDS = ['1', '56', '137', '42161', '8453', '10']

// 已知的合约地址分类
const CONTRACT_CATEGORIES = {
  // DeFi 协议
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': { name: 'Uniswap V2: Router 2', category: 'DEFI' },
  '0xE592427A0AEce92De3Edee1F18E0157C05861564': { name: 'Uniswap V3: Router', category: 'DEFI' },
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45': { name: 'Uniswap V3: Router 2', category: 'DEFI' },
  '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F': { name: 'SushiSwap: Router', category: 'DEFI' },
  '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506': { name: 'SushiSwap: Router 2', category: 'DEFI' },
  '0x1111111254EEB25477B68fb85Ed929f73A960582': { name: '1inch: Router', category: 'DEFI' },
  '0x1111111254fb6c44bAC0beD2854e76F90643097d': { name: '1inch: Router 2', category: 'DEFI' },
  '0x881D40237659C251811CEC9c364ef91dC08D300C': { name: 'Metamask: Swap Router', category: 'DEFI' },
  '0xDef1C0ded9bec7F1a1670819833240f027b25EfF': { name: '0x Protocol', category: 'DEFI' },
  
  // 稳定币
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': { name: 'Tether: USDT Stablecoin', category: 'STABLECOIN' },
  '0xA0b86a33E6441b8c4C8C0E4A0e8A0e8A0e8A0e8A': { name: 'USDC', category: 'STABLECOIN' },
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': { name: 'Dai Stablecoin', category: 'STABLECOIN' },
  
  // NFT 市场
  '0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b': { name: 'OpenSea: Seaport', category: 'NFT' },
  '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC': { name: 'OpenSea: Seaport 1.1', category: 'NFT' },
  '0x59728544B08AB483533076417FbBB2fD0B17CE3a': { name: 'LooksRare: Exchange', category: 'NFT' },
  '0x74312363e45DCaBA76c59ec49a7aa8A65a67Ee3': { name: 'X2Y2: Exchange', category: 'NFT' },
  
  // MEV 相关
  '0x9008D19f58AAbD9eD0D60971565AA8510560ab41': { name: 'CoW Protocol: Settlement', category: 'MEV' },
  '0x9008D19f58AAbD9eD0D60971565AA8510560ab41': { name: 'CoW Protocol: GPv2Settlement', category: 'MEV' },
  '0x3b66e1dC4F6C5c8C0E4A0e8A0e8A0e8A0e8A0e8A': { name: 'Flashbots: MEV-Boost', category: 'MEV' },
  
  // 交易所
  '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE': { name: 'Binance: Hot Wallet', category: 'EXCHANGE' },
  '0x28C6c06298d514Db089934071355E5743bf21d60': { name: 'Binance: Cold Wallet', category: 'EXCHANGE' },
  '0x56Eddb7aa87536c09CCc2793473599fD21A8b17F': { name: 'Binance: Dex Router', category: 'EXCHANGE' },
  '0x3cd751E6b0078Be393132286c442345e5DC49699': { name: 'Okex: Dex Router', category: 'EXCHANGE' },
  '0x5a6A4D5445683280d4C4C0E4A0e8A0e8A0e8A0e8A': { name: 'Coinbase: Wallet', category: 'EXCHANGE' },
  
  // L2 相关
  '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a': { name: 'Arbitrum: Bridge', category: 'L2' },
  '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1': { name: 'Optimism: Bridge', category: 'L2' },
  '0x3154Cf16ccdb4C6d922629664174b904d80F2C35': { name: 'Polygon: Bridge', category: 'L2' },
  
  // 其他
  '0x0000000000000000000000000000000000000000': { name: 'Native Transfer', category: 'NATIVE' },
} as const

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainid') || '1'
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // 验证参数
    if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
      return NextResponse.json(
        {
          status: '0',
          error: 'Invalid chain ID',
          message: `Chain ID must be one of: ${SUPPORTED_CHAIN_IDS.join(', ')}`
        },
        { status: 400 }
      )
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          status: '0',
          error: 'Invalid limit',
          message: 'Limit must be between 1 and 100'
        },
        { status: 400 }
      )
    }

    // 获取最新区块号
    const latestBlockUrl = new URL(ETHERSCAN_BASE_URL)
    latestBlockUrl.searchParams.set('chainid', chainId)
    latestBlockUrl.searchParams.set('module', 'proxy')
    latestBlockUrl.searchParams.set('action', 'eth_blockNumber')
    latestBlockUrl.searchParams.set('apikey', ETHERSCAN_API_KEY)

    const latestBlockResponse = await makeHttpsRequest(latestBlockUrl.toString())

    if (!latestBlockResponse || !latestBlockResponse.result) {
      throw new Error('Failed to get latest block number')
    }

    const latestBlockNumber = parseInt(latestBlockResponse.result, 16)

    // 获取最近的区块数据进行分析
    const blocksToAnalyze = Math.min(20, limit) // 分析最近20个区块
    const categoryMap = new Map<string, {
      category: string
      burned: number
      transactionCount: number
      uniqueAddresses: Set<string>
      topAddresses: Array<{ address: string; burned: number; name?: string }>
    }>()

    const fetchPromises = []

    for (let i = 0; i < blocksToAnalyze; i++) {
      const blockNumber = '0x' + (latestBlockNumber - i).toString(16)

      const blockUrl = new URL(ETHERSCAN_BASE_URL)
      blockUrl.searchParams.set('chainid', chainId)
      blockUrl.searchParams.set('module', 'proxy')
      blockUrl.searchParams.set('action', 'eth_getBlockByNumber')
      blockUrl.searchParams.set('tag', blockNumber)
      blockUrl.searchParams.set('boolean', 'true') // 包含交易详情
      blockUrl.searchParams.set('apikey', ETHERSCAN_API_KEY)

      fetchPromises.push(
        makeHttpsRequest(blockUrl.toString()).then(response => ({
          blockNumber: latestBlockNumber - i,
          data: response.result
        }))
      )
    }

    // 并行获取所有区块数据
    const blockResults = await Promise.all(fetchPromises)

    // 分析每个区块的交易
    for (const { blockNumber, data } of blockResults) {
      if (!data || !Array.isArray(data.transactions)) continue

      const baseFeePerGas = parseInt(data.baseFeePerGas || '0x0', 16)

      // 分析每个交易
      for (const tx of data.transactions) {
        if (!tx.to) continue // 跳过合约创建交易

        const gasUsed = parseInt(tx.gasUsed || '0x0', 16)
        
        // 计算燃烧量 (baseFee * gasUsed)
        const burned = (baseFeePerGas * gasUsed) / 1e18

        const address = tx.to.toLowerCase()
        
        // 检查是否是已知合约
        const contractInfo = CONTRACT_CATEGORIES[address as keyof typeof CONTRACT_CATEGORIES]
        const category = contractInfo?.category || 'OTHER'
        
        if (categoryMap.has(category)) {
          const existing = categoryMap.get(category)!
          existing.burned += burned
          existing.transactionCount += 1
          existing.uniqueAddresses.add(address)
          
          // 更新top地址
          const addressIndex = existing.topAddresses.findIndex(addr => addr.address === address)
          if (addressIndex >= 0) {
            existing.topAddresses[addressIndex].burned += burned
          } else {
            existing.topAddresses.push({
              address,
              burned,
              name: contractInfo?.name
            })
          }
        } else {
          categoryMap.set(category, {
            category,
            burned,
            transactionCount: 1,
            uniqueAddresses: new Set([address]),
            topAddresses: [{
              address,
              burned,
              name: contractInfo?.name
            }]
          })
        }
      }
    }

    // 计算总燃烧量
    const totalBurned = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.burned, 0)

    // 转换为数组并排序
    const categories = Array.from(categoryMap.values())
      .map(cat => {
        // 排序top地址
        cat.topAddresses.sort((a, b) => b.burned - a.burned)
        
        return {
          category: cat.category,
          burned: cat.burned.toFixed(6),
          percentage: totalBurned > 0 ? ((cat.burned / totalBurned) * 100).toFixed(2) : '0.00',
          transactionCount: cat.transactionCount,
          uniqueAddresses: cat.uniqueAddresses.size,
          topAddresses: cat.topAddresses.slice(0, 5).map(addr => ({
            address: addr.address,
            burned: addr.burned.toFixed(6),
            name: addr.name || `Address ${addr.address.slice(0, 8)}...`
          }))
        }
      })
      .sort((a, b) => parseFloat(b.burned) - parseFloat(a.burned))

    return NextResponse.json(
      {
        status: '1',
        message: 'OK',
        result: categories,
        metadata: {
          totalBurned: totalBurned.toFixed(6),
          analyzedBlocks: blocksToAnalyze,
          totalCategories: categories.length,
          timestamp: Date.now(),
        },
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=15', // 15秒缓存
        },
      }
    )
  } catch (error) {
    console.error('[Burn Categories API Error]:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        status: '0',
        error: 'Failed to fetch burn categories',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
