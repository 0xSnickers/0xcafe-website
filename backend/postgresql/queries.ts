/**
 * Database Query Functions
 * 
 * Reusable query functions for common database operations.
 * All queries use proper error handling and type safety.
 */

import { supabase } from './client'
import type { 
  BurnHistory, 
  GasPriceHistory, 
  BurnHistoryFilter, 
  GasPriceFilter,
  BaseFee,
  BurntFee 
} from './types'

/**
 * Fetch burn history records with optional filters
 */
export async function getBurnHistory(filter: BurnHistoryFilter = {}) {
  let query = supabase
    .from('burn_history')
    .select('*')
    .order('timestamp', { ascending: false })

  // Apply filters
  if (filter.chain_id) {
    query = query.eq('chain_id', filter.chain_id)
  }
  if (filter.category) {
    query = query.eq('category', filter.category)
  }
  if (filter.from_address) {
    query = query.eq('from_address', filter.from_address)
  }
  if (filter.start_date) {
    query = query.gte('timestamp', filter.start_date)
  }
  if (filter.end_date) {
    query = query.lte('timestamp', filter.end_date)
  }

  // Pagination
  const limit = filter.limit || 100
  const offset = filter.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query.returns<BurnHistory[]>()

  if (error) {
    console.error('Error fetching burn history:', error)
    throw new Error(`Failed to fetch burn history: ${error.message}`)
  }

  return { data: data || [], count: count || 0 }
}

/**
 * Fetch total burned amount by chain
 */
export async function getTotalBurnedByChain(chainId: number) {
  const { data, error } = await supabase
    .rpc('get_total_burned', { chain_id_param: chainId } as any)

  if (error) {
    console.error('Error fetching total burned:', error)
    throw new Error(`Failed to fetch total burned: ${error.message}`)
  }

  return data
}

/**
 * Fetch burn categories statistics
 */
export async function getBurnCategoriesStats(chainId?: number) {
  let query = supabase
    .from('burn_history')
    .select('category, burned_amount')

  if (chainId) {
    query = query.eq('chain_id', chainId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching burn categories:', error)
    throw new Error(`Failed to fetch burn categories: ${error.message}`)
  }

  // Aggregate by category
  const stats = (data || []).reduce((acc: Record<string, bigint>, item: { category: string; burned_amount: string }) => {
    const category = item.category
    const amount = BigInt(item.burned_amount)
    
    if (!acc[category]) {
      acc[category] = BigInt(0)
    }
    acc[category] += amount
    
    return acc
  }, {} as Record<string, bigint>)

  return Object.entries(stats).map(([category, amount]) => ({
    category,
    total_burned: (amount as bigint).toString(),
  }))
}

/**
 * Fetch gas price history
 */
export async function getGasPriceHistory(filter: GasPriceFilter = {}) {
  let query = supabase
    .from('gas_price_history')
    .select('*')
    .order('timestamp', { ascending: false })

  if (filter.chain_id) {
    query = query.eq('chain_id', filter.chain_id)
  }
  if (filter.start_date) {
    query = query.gte('timestamp', filter.start_date)
  }
  if (filter.end_date) {
    query = query.lte('timestamp', filter.end_date)
  }

  const limit = filter.limit || 100
  query = query.limit(limit)

  const { data, error } = await query.returns<GasPriceHistory[]>()

  if (error) {
    console.error('Error fetching gas price history:', error)
    throw new Error(`Failed to fetch gas price history: ${error.message}`)
  }

  return data || []
}

/**
 * Fetch latest gas price for a chain
 */
export async function getLatestGasPrice(chainId: number) {
  const { data, error } = await supabase
    .from('gas_price_history')
    .select('*')
    .eq('chain_id', chainId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching latest gas price:', error)
    return null
  }

  return data
}

/**
 * Insert new burn history record
 */
export async function insertBurnHistory(record: Omit<BurnHistory, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('burn_history')
    .insert(record as any)
    .select()
    .single()

  if (error) {
    console.error('Error inserting burn history:', error)
    throw new Error(`Failed to insert burn history: ${error.message}`)
  }

  return data
}

/**
 * Insert new gas price record
 */
export async function insertGasPrice(record: Omit<GasPriceHistory, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('gas_price_history')
    .insert(record as any)
    .select()
    .single()

  if (error) {
    console.error('Error inserting gas price:', error)
    throw new Error(`Failed to insert gas price: ${error.message}`)
  }

  return data
}

/**
 * Batch insert burn history records
 */
export async function batchInsertBurnHistory(
  records: Omit<BurnHistory, 'id' | 'created_at' | 'updated_at'>[]
) {
  const { data, error } = await supabase
    .from('burn_history')
    .insert(records as any)
    .select()

  if (error) {
    console.error('Error batch inserting burn history:', error)
    throw new Error(`Failed to batch insert burn history: ${error.message}`)
  }

  return data || []
}

// =============================================================================
// BaseFee Query Functions
// =============================================================================

/**
 * 获取指定区块的 baseFee
 * @param blockNumber 区块号
 * @param chainId 链 ID (default: 1)
 * @returns BaseFee 或 null
 */
export async function getBaseFeeByBlock(
  blockNumber: number,
  chainId: number = 1
): Promise<BaseFee | null> {
  const { data, error } = await supabase
    .from('base_fees')
    .select('*')
    .eq('block_number', blockNumber)
    .eq('chain_id', chainId)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching baseFee by block:', error)
    throw new Error(`Failed to fetch baseFee: ${error.message}`)
  }
  
  return data
}

/**
 * 批量获取 baseFee（按区块号数组）
 * @param blockNumbers 区块号数组
 * @param chainId 链 ID (default: 1)
 * @returns BaseFee 数组
 */
export async function getBaseFeesByBlocks(
  blockNumbers: number[],
  chainId: number = 1
): Promise<BaseFee[]> {
  if (blockNumbers.length === 0) return []
  
  const { data, error } = await supabase
    .from('base_fees')
    .select('*')
    .in('block_number', blockNumbers)
    .eq('chain_id', chainId)
    .order('block_number', { ascending: true })
  
  if (error) {
    console.error('Error fetching baseFees by blocks:', error)
    throw new Error(`Failed to fetch baseFees: ${error.message}`)
  }
  
  return data || []
}

/**
 * 批量获取 baseFee（按区块号范围）
 * @param startBlock 起始区块号
 * @param endBlock 结束区块号
 * @param chainId 链 ID (default: 1)
 * @returns BaseFee 数组
 */
export async function getBaseFeesByRange(
  startBlock: number,
  endBlock: number,
  chainId: number = 1
): Promise<BaseFee[]> {
  const { data, error } = await supabase
    .from('base_fees')
    .select('*')
    .gte('block_number', startBlock)
    .lte('block_number', endBlock)
    .eq('chain_id', chainId)
    .order('block_number', { ascending: true })
  
  if (error) {
    console.error('Error fetching baseFees by range:', error)
    throw new Error(`Failed to fetch baseFees: ${error.message}`)
  }
  
  return data || []
}

/**
 * 批量获取 baseFee（按时间范围）
 * @param startTime 起始时间戳（秒）
 * @param endTime 结束时间戳（秒）
 * @param chainId 链 ID (default: 1)
 * @returns BaseFee 数组
 */
export async function getBaseFeesByTime(
  startTime: number,
  endTime: number,
  chainId: number = 1
): Promise<BaseFee[]> {
  const { data, error } = await supabase
    .from('base_fees')
    .select('*')
    .gte('timestamp', startTime)
    .lte('timestamp', endTime)
    .eq('chain_id', chainId)
    .order('block_number', { ascending: true })
  
  if (error) {
    console.error('Error fetching baseFees by time:', error)
    throw new Error(`Failed to fetch baseFees: ${error.message}`)
  }
  
  return data || []
}

/**
 * 获取最新同步的区块号
 * @param chainId 链 ID (default: 1)
 * @returns 最新区块号或 null
 */
export async function getLatestSyncedBlock(
  chainId: number = 1
): Promise<number | null> {
  const { data, error } = await supabase
    .from('base_fees')
    .select('block_number')
    .eq('chain_id', chainId)
    .order('block_number', { ascending: false })
    .limit(1)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching latest synced block:', error)
    throw new Error(`Failed to fetch latest synced block: ${error.message}`)
  }
  
  return (data as any).block_number
}

/**
 * 批量插入或更新 baseFee 记录
 * @param records baseFee 记录数组
 * @returns 插入的记录数组
 */
export async function upsertBaseFees(
  records: Omit<BaseFee, 'id' | 'base_fee_gwei' | 'synced_at'>[]
): Promise<BaseFee[]> {
  if (records.length === 0) return []
  
  const { data, error } = await supabase
    .from('base_fees')
    .upsert(records as any, {
      onConflict: 'block_number,chain_id',
      ignoreDuplicates: false,
    })
    .select()
  
  if (error) {
    console.error('Error upserting baseFees:', error)
    throw new Error(`Failed to upsert baseFees: ${error.message}`)
  }
  
  return data || []
}

// =============================================================================
// BurntFee Query Functions
// =============================================================================

/**
 * 批量插入或更新 Burnt Fees 记录
 * @param records BurntFee 记录数组
 * @returns 插入的记录数组
 */
export async function upsertBurntFees(
  records: Omit<BurntFee, 'id' | 'base_fee_gwei' | 'burnt_fees' | 'burnt_fees_eth' | 'synced_at'>[]
): Promise<BurntFee[]> {
  if (records.length === 0) return []
  
  const { data, error } = await supabase
    .from('burnt_fees')
    .upsert(records as any, {
      onConflict: 'block_number,chain_id',
      ignoreDuplicates: false,
    })
    .select()
  
  if (error) {
    console.error('Error upserting burntFees:', error)
    throw new Error(`Failed to upsert burntFees: ${error.message}`)
  }
  
  return data || []
}

/**
 * 获取指定时间范围的燃烧费用统计
 * @param startTime 开始时间戳（秒）
 * @param endTime 结束时间戳（秒）
 * @param chainId 链 ID (default: 1)
 * @returns 聚合统计数据
 */
export async function getBurntFeesStats(
  startTime: number,
  endTime: number,
  chainId: number = 1
): Promise<{
  totalBurntEth: string
  avgBaseFeeGwei: string
  totalGasUsed: string
  blockCount: number
}> {
  const { data, error } = await supabase
    .from('burnt_fees')
    .select('burnt_fees_eth, base_fee_gwei, gas_used')
    .eq('chain_id', chainId)
    .gte('timestamp', startTime)
    .lte('timestamp', endTime)
  
  if (error) {
    console.error('Error fetching burnt fees stats:', error)
    throw new Error(`Failed to fetch burnt fees stats: ${error.message}`)
  }
  
  if (!data || data.length === 0) {
    return {
      totalBurntEth: '0',
      avgBaseFeeGwei: '0',
      totalGasUsed: '0',
      blockCount: 0,
    }
  }
  
  // 计算聚合数据
  let totalBurnt = 0
  let totalBaseFee = 0
  let totalGas = BigInt(0)
  
  for (const row of data as any[]) {
    totalBurnt += parseFloat(row.burnt_fees_eth || '0')
    totalBaseFee += parseFloat(row.base_fee_gwei || '0')
    totalGas += BigInt(row.gas_used || '0')
  }
  
  return {
    totalBurntEth: totalBurnt.toFixed(18),
    avgBaseFeeGwei: (totalBaseFee / data.length).toFixed(9),
    totalGasUsed: totalGas.toString(),
    blockCount: data.length,
  }
}

/**
 * 获取最近的燃烧费用记录
 * @param limit 数量限制
 * @param chainId 链 ID (default: 1)
 * @returns BurntFee 数组
 */
export async function getRecentBurntFees(
  limit: number = 30,
  chainId: number = 1
): Promise<BurntFee[]> {
  const { data, error } = await supabase
    .from('burnt_fees')
    .select('*')
    .eq('chain_id', chainId)
    .order('block_number', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching recent burnt fees:', error)
    throw new Error(`Failed to fetch recent burnt fees: ${error.message}`)
  }
  
  return data || []
}

/**
 * 获取指定区块范围的燃烧费用
 * @param startBlock 起始区块号
 * @param endBlock 结束区块号
 * @param chainId 链 ID (default: 1)
 * @returns BurntFee 数组
 */
export async function getBurntFeesByRange(
  startBlock: number,
  endBlock: number,
  chainId: number = 1
): Promise<BurntFee[]> {
  const { data, error } = await supabase
    .from('burnt_fees')
    .select('*')
    .eq('chain_id', chainId)
    .gte('block_number', startBlock)
    .lte('block_number', endBlock)
    .order('block_number', { ascending: true })
  
  if (error) {
    console.error('Error fetching burnt fees by range:', error)
    throw new Error(`Failed to fetch burnt fees: ${error.message}`)
  }
  
  return data || []
}

/**
 * 获取指定时间范围的燃烧费用
 * @param startTime 开始时间戳（秒）
 * @param endTime 结束时间戳（秒）
 * @param chainId 链 ID (default: 1)
 * @returns BurntFee 数组
 */
export async function getBurntFeesByTime(
  startTime: number,
  endTime: number,
  chainId: number = 1
): Promise<BurntFee[]> {
  const { data, error } = await supabase
    .from('burnt_fees')
    .select('*')
    .eq('chain_id', chainId)
    .gte('timestamp', startTime)
    .lte('timestamp', endTime)
    .order('timestamp', { ascending: true })
  
  if (error) {
    console.error('Error fetching burnt fees by time:', error)
    throw new Error(`Failed to fetch burnt fees: ${error.message}`)
  }
  
  return data || []
}

/**
 * 获取最新同步的燃烧费用区块号
 * @param chainId 链 ID (default: 1)
 * @returns 最新区块号或 null
 */
export async function getLatestSyncedBurntFeeBlock(
  chainId: number = 1
): Promise<number | null> {
  const { data, error } = await supabase
    .from('burnt_fees')
    .select('block_number')
    .eq('chain_id', chainId)
    .order('block_number', { ascending: false })
    .limit(1)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching latest synced burnt fee block:', error)
    throw new Error(`Failed to fetch latest synced block: ${error.message}`)
  }
  
  return (data as any).block_number
}

