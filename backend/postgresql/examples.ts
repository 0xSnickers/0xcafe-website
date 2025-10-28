/**
 * Usage Examples for PostgreSQL/Supabase Integration
 * 
 * This file contains practical examples of how to use the database functions
 * in different scenarios throughout the application.
 */

import {
  getBurnHistory,
  getTotalBurnedByChain,
  getBurnCategoriesStats,
  getGasPriceHistory,
  getLatestGasPrice,
  insertBurnHistory,
  batchInsertBurnHistory,
  retryOperation,
  weiToEther,
  getDateRange,
} from '@/backend/postgresql'

// ============================================================================
// Example 1: Fetch Recent Burn History for Display
// ============================================================================
export async function fetchRecentBurnsExample() {
  try {
    const { data, count } = await getBurnHistory({
      chain_id: 1, // Ethereum mainnet
      limit: 20,
      offset: 0,
    })

    console.log(`Found ${count} total records, showing ${data.length}`)
    
    // Transform for display
    const displayData = data.map(record => ({
      blockNumber: record.block_number,
      timestamp: new Date(record.timestamp).toLocaleString(),
      burnedEth: weiToEther(record.burned_amount),
      txHash: record.tx_hash,
      category: record.category,
    }))

    return displayData
  } catch (error) {
    console.error('Failed to fetch burn history:', error)
    return []
  }
}

// ============================================================================
// Example 2: Get Burn Statistics for Dashboard
// ============================================================================
export async function fetchBurnStatsExample() {
  try {
    // Get total burned for Ethereum
    const totalBurned = await getTotalBurnedByChain(1)
    
    // Get category breakdown
    const categories = await getBurnCategoriesStats(1)
    
    // Get last 7 days of data
    const { start_date, end_date } = getDateRange(7)
    const recentBurns = await getBurnHistory({
      chain_id: 1,
      start_date,
      end_date,
      limit: 1000,
    })

    return {
      totalBurned: weiToEther(totalBurned),
      categories: categories.map(cat => ({
        name: cat.category,
        amount: weiToEther(cat.total_burned),
      })),
      recentCount: recentBurns.data.length,
      last7Days: recentBurns.data,
    }
  } catch (error) {
    console.error('Failed to fetch burn stats:', error)
    throw error
  }
}

// ============================================================================
// Example 3: Real-time Gas Price Monitoring
// ============================================================================
export async function monitorGasPriceExample(chainId: number = 1) {
  try {
    // Get latest gas price
    const latest = await getLatestGasPrice(chainId)
    
    if (!latest) {
      console.log('No gas price data available')
      return null
    }

    // Get historical data for comparison
    const { start_date } = getDateRange(1) // Last 24 hours
    const history = await getGasPriceHistory({
      chain_id: chainId,
      start_date,
      limit: 100,
    })

    // Calculate average
    const avgGasPrice = history.reduce((sum, record) => 
      sum + BigInt(record.gas_price), BigInt(0)
    ) / BigInt(history.length)

    return {
      current: {
        baseFee: weiToEther(latest.base_fee),
        priorityFee: weiToEther(latest.priority_fee),
        total: weiToEther(latest.gas_price),
      },
      average24h: weiToEther(avgGasPrice.toString()),
      history: history.map(h => ({
        timestamp: new Date(h.timestamp),
        gasPrice: weiToEther(h.gas_price),
      })),
    }
  } catch (error) {
    console.error('Failed to monitor gas price:', error)
    return null
  }
}

// ============================================================================
// Example 4: Insert New Burn Data from Blockchain
// ============================================================================
export async function recordBurnFromBlockExample(blockData: {
  blockNumber: number
  transactions: Array<{
    hash: string
    from: string
    to: string | null
    gasUsed: string
    baseFee: string
    category: string
  }>
}) {
  try {
    const records = blockData.transactions.map(tx => {
      const burnedAmount = BigInt(tx.gasUsed) * BigInt(tx.baseFee)
      
      return {
        block_number: blockData.blockNumber,
        timestamp: new Date().toISOString(),
        base_fee: tx.baseFee,
        gas_used: tx.gasUsed,
        burned_amount: burnedAmount.toString(),
        tx_hash: tx.hash,
        from_address: tx.from.toLowerCase(),
        to_address: tx.to?.toLowerCase() || null,
        category: tx.category,
        chain_id: 1,
      }
    })

    // Batch insert with retry logic
    const inserted = await retryOperation(
      async () => await batchInsertBurnHistory(records),
      3
    )

    console.log(`Successfully inserted ${inserted.length} burn records`)
    return inserted
  } catch (error) {
    console.error('Failed to record burn data:', error)
    throw error
  }
}

// ============================================================================
// Example 5: API Route Handler for Burn History
// ============================================================================
export async function burnHistoryAPIExample(
  searchParams: URLSearchParams
) {
  try {
    // Parse query parameters
    const chainId = parseInt(searchParams.get('chain_id') || '1')
    const category = searchParams.get('category') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('page_size') || '50')

    // Fetch data
    const { data, count } = await getBurnHistory({
      chain_id: chainId,
      category,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })

    // Return paginated response
    return {
      success: true,
      data: data.map(record => ({
        ...record,
        burned_eth: weiToEther(record.burned_amount),
      })),
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize),
      },
    }
  } catch (error) {
    console.error('API error:', error)
    return {
      success: false,
      error: 'Failed to fetch burn history',
    }
  }
}

// ============================================================================
// Example 6: React Component Data Fetching
// ============================================================================
export async function useBurnHistoryExample() {
  // This would typically be used in a React component with useEffect or React Query
  
  try {
    // Fetch initial data
    const { data, count } = await getBurnHistory({
      chain_id: 1,
      limit: 50,
    })

    // Transform for component state
    return {
      burns: data,
      totalCount: count,
      loading: false,
      error: null,
    }
  } catch (error) {
    return {
      burns: [],
      totalCount: 0,
      loading: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ============================================================================
// Example 7: Advanced Filtering and Sorting
// ============================================================================
export async function advancedFilterExample() {
  try {
    // Get last 30 days of high-value burns
    const { start_date, end_date } = getDateRange(30)
    
    const { data } = await getBurnHistory({
      chain_id: 1,
      start_date,
      end_date,
      limit: 1000,
    })

    // Filter for burns > 0.1 ETH
    const highValueBurns = data.filter(record => 
      BigInt(record.burned_amount) > BigInt('100000000000000000') // 0.1 ETH in Wei
    )

    // Sort by burned amount (descending)
    const sorted = highValueBurns.sort((a, b) => 
      Number(BigInt(b.burned_amount) - BigInt(a.burned_amount))
    )

    // Get top 10
    const top10 = sorted.slice(0, 10)

    return top10.map(record => ({
      txHash: record.tx_hash,
      burnedEth: weiToEther(record.burned_amount),
      from: record.from_address,
      category: record.category,
      timestamp: record.timestamp,
    }))
  } catch (error) {
    console.error('Failed to fetch high-value burns:', error)
    return []
  }
}

