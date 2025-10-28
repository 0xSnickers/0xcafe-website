#!/usr/bin/env tsx

/**
 * BaseFee & Burnt Fees 同步脚本
 * 
 * 功能：
 * 1. 从 RPC 获取最新区块的完整信息 (baseFee, gasUsed, gasLimit, etc.)
 * 2. 查询 Supabase 中最后同步的区块号
 * 3. 批量同步缺失区块的数据
 * 4. 计算并存储 Burnt Fees (baseFee × gasUsed)
 * 5. 同时写入 base_fees 和 burnt_fees 表
 * 
 * 用法：
 * - 直接运行: tsx scripts/sync-base-fees.ts
 * - 定时任务: 配置 Cron Job 或 Vercel Cron
 */

import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { supabase } from '../backend/postgresql/client'
import { 
  getLatestSyncedBlock, 
  upsertBaseFees,
  getLatestSyncedBurntFeeBlock,
  upsertBurntFees 
} from '../backend/postgresql/queries'
import { getAlchemyEndpointURLById } from '../lib/chains'

// 配置
const CHAIN_ID = 1 // Ethereum Mainnet
const BATCH_SIZE = 100 // 每批次处理的区块数
const MAX_BLOCKS = 1000 // 单次运行最多同步的区块数

// 获取 RPC URL (优先使用 Alchemy，否则使用备用)
const RPC_URL = getAlchemyEndpointURLById(CHAIN_ID.toString())

// 创建 viem 客户端
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(RPC_URL),
})

/**
 * 主函数
 */
export async function syncBaseFees() {
  console.log('🚀 开始同步 baseFee 数据...')
  console.log(`📡 RPC URL: ${RPC_URL}`)
  
  try {
    // 1. 获取链上最新区块号
    const latestBlockNumber = await publicClient.getBlockNumber()
    console.log(`📦 链上最新区块: ${latestBlockNumber}`)
    
    // 2. 获取 Supabase 中最后同步的区块
    const lastSyncedBlock = await getLatestSyncedBlock(CHAIN_ID)
    const startBlock = lastSyncedBlock 
      ? BigInt(lastSyncedBlock) + BigInt(1)
      : latestBlockNumber - BigInt(MAX_BLOCKS)
    
    console.log(`🔍 上次同步区块: ${lastSyncedBlock || '无'}`)
    console.log(`🔍 开始区块: ${startBlock}`)
    
    // 3. 计算需要同步的区块数量
    const blocksToSync = Math.min(
      Number(latestBlockNumber - startBlock + BigInt(1)),
      MAX_BLOCKS
    )
    
    if (blocksToSync <= 0) {
      console.log('✅ 没有新区块需要同步')
      return {
        success: true,
        synced: 0,
        message: 'No new blocks to sync'
      }
    }
    
    console.log(`📊 需要同步 ${blocksToSync} 个区块`)
    
    // 4. 批量同步
    let syncedCount = 0
    const errors: string[] = []
    
    for (let i = 0; i < blocksToSync; i += BATCH_SIZE) {
      const batchEnd = Math.min(i + BATCH_SIZE, blocksToSync)
      const batchStart = startBlock + BigInt(i)
      const batchEndBlock = startBlock + BigInt(batchEnd - 1)
      
      try {
        const synced = await syncBatch(batchStart, batchEndBlock)
        syncedCount += synced
        console.log(`✅ 进度: ${syncedCount}/${blocksToSync} (批次: ${i / BATCH_SIZE + 1})`)
      } catch (error) {
        const errorMsg = `批次 ${i / BATCH_SIZE + 1} 失败: ${error instanceof Error ? error.message : String(error)}`
        console.error(`❌ ${errorMsg}`)
        errors.push(errorMsg)
      }
    }
    
    console.log('🎉 同步完成!')
    console.log(`📊 统计: ${syncedCount}/${blocksToSync} 个区块`)
    
    if (errors.length > 0) {
      console.warn(`⚠️  ${errors.length} 个批次失败`)
    }
    
    return {
      success: errors.length === 0,
      synced: syncedCount,
      total: blocksToSync,
      errors: errors.length > 0 ? errors : undefined
    }
  } catch (error) {
    console.error('❌ 同步失败:', error)
    throw error
  }
}

/**
 * 批量同步一批区块（包含 baseFee 和 Burnt Fees）
 * @param startBlock 起始区块号
 * @param endBlock 结束区块号
 * @returns 成功同步的区块数
 */
async function syncBatch(startBlock: bigint, endBlock: bigint): Promise<number> {
  const blockNumbers: bigint[] = []
  for (let i = startBlock; i <= endBlock; i++) {
    blockNumbers.push(i)
  }
  
  // 并发获取区块数据（获取完整区块信息）
  const blocks = await Promise.all(
    blockNumbers.map(num => 
      publicClient.getBlock({ 
        blockNumber: num,
        includeTransactions: false // 不需要交易详情，只需要交易数量
      })
        .catch(error => {
          console.warn(`⚠️  获取区块 ${num} 失败:`, error.message)
          return null
        })
    )
  )
  
  // 过滤有效区块
  const validBlocks = blocks.filter((block): block is NonNullable<typeof block> => 
    block !== null && 
    block.baseFeePerGas !== undefined && 
    block.baseFeePerGas !== null
  )
  
  if (validBlocks.length === 0) {
    return 0
  }
  
  // 准备 base_fees 表数据
  const baseFeeRecords = validBlocks.map(block => ({
    block_number: Number(block.number),
    base_fee: block.baseFeePerGas!.toString(),
    timestamp: Number(block.timestamp),
    chain_id: CHAIN_ID,
  }))
  
  // 准备 burnt_fees 表数据（包含 gasUsed 等信息）
  const burntFeeRecords = validBlocks.map(block => ({
    block_number: Number(block.number),
    timestamp: Number(block.timestamp),
    chain_id: CHAIN_ID,
    block_hash: block.hash || '',
    gas_limit: block.gasLimit.toString(),
    gas_used: block.gasUsed.toString(),
    base_fee: block.baseFeePerGas!.toString(),
    transaction_count: block.transactions?.length || 0,
  }))
  
  // 批量插入两个表（并行执行）
  try {
    await Promise.all([
      upsertBaseFees(baseFeeRecords),
      upsertBurntFees(burntFeeRecords)
    ])
    
    return validBlocks.length
  } catch (error) {
    console.error('Error upserting data:', error)
    throw error
  }
}

// 如果直接运行脚本
if (require.main === module) {
  syncBaseFees()
    .then((result) => {
      console.log('\n✅ 同步结果:', result)
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ 同步失败:', error)
      process.exit(1)
    })
}

