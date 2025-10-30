/**
 * Gas Price API v1
 * 提供实时 Gas 价格查询
 * 
 * @version 1.0.0
 * @endpoint GET /api/v1/gas?chainid={chainId}
 */

import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, formatGwei } from 'viem'
import { mainnet } from 'viem/chains'
import { getAlchemyEndpointURLById } from '@/config'

/**
 * API Response 标准格式
 */
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  version: string
  timestamp: number
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainid') || '1'

    // 创建 RPC 客户端
    const rpcUrl = getAlchemyEndpointURLById(chainId)
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(rpcUrl),
    })

    // 并发获取最新区块和 Gas 价格
    const [latestBlock, gasPrice] = await Promise.all([
      publicClient.getBlock({ blockTag: 'latest' }),
      publicClient.getGasPrice(),
    ])

    // 将 gasPrice 转换为 Gwei (参考 Etherscan Gas Tracker)
    const gasPriceGwei = Number(formatGwei(gasPrice))
    const baseFeeGwei = Number(formatGwei(latestBlock.baseFeePerGas || BigInt(0)))
    
    // 参考 Etherscan Gas Tracker 的计算方式
    const safeGasPrice = gasPriceGwei * 0.9
    const proposeGasPrice = gasPriceGwei
    const fastGasPrice = gasPriceGwei * 1.1

    // 构建响应数据
    const result = {
      LastBlock: latestBlock.number.toString(),
      SafeGasPrice: safeGasPrice.toFixed(8),
      ProposeGasPrice: proposeGasPrice.toFixed(8),
      FastGasPrice: fastGasPrice.toFixed(8),
      baseFee: baseFeeGwei.toFixed(8),
      gasPrice: gasPriceGwei.toFixed(8),
      timestamp: Number(latestBlock.timestamp),
      blockAge: Math.floor(Date.now() / 1000) - Number(latestBlock.timestamp),
    }

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'OK',
      version: '1.0.0',
      timestamp: Date.now(),
    }

    return NextResponse.json(response, {
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-API-Version': '1.0.0',
      },
    })
  } catch (error) {
    console.error('[API v1] Gas API error:', error)
    
    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch gas price',
      version: '1.0.0',
      timestamp: Date.now(),
    }

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-API-Version': '1.0.0',
      },
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-API-Version': '1.0.0',
    },
  })
}

