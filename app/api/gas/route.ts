/**
 * Gas 价格 API 路由
 * 使用 Alchemy RPC 获取实时数据
 */

import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, formatGwei } from 'viem'
import { mainnet } from 'viem/chains'
import { getAlchemyEndpointURLById } from '@/lib/chains'

export async function GET(request: NextRequest) {
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

    // 计算 Gas 价格建议（基于 baseFee 和优先费用）
    const baseFeeGwei = Number(formatGwei(latestBlock.baseFeePerGas || BigInt(0)))
    const gasPriceGwei = Number(formatGwei(gasPrice))
    
    // Safe = baseFee + 1 Gwei
    // Propose = baseFee + 1.5 Gwei
    // Fast = baseFee + 2 Gwei
    const safeGasPrice = baseFeeGwei + 1
    const proposeGasPrice = baseFeeGwei + 1.5
    const fastGasPrice = baseFeeGwei + 2

    // 构建响应数据（保持与原有格式兼容）
    const result = {
      LastBlock: latestBlock.number.toString(),
      SafeGasPrice: safeGasPrice.toFixed(8),
      ProposeGasPrice: proposeGasPrice.toFixed(8),
      FastGasPrice: fastGasPrice.toFixed(8),
      suggestBaseFee: baseFeeGwei.toFixed(8),
      gasPrice: gasPriceGwei.toFixed(8),
      timestamp: Number(latestBlock.timestamp),
      blockAge: Math.floor(Date.now() / 1000) - Number(latestBlock.timestamp),
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'OK',
    })
  } catch (error) {
    console.error('Gas API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch gas price',
      },
      { status: 500 }
    )
  }
}

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
