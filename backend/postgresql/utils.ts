/**
 * Database Utility Functions
 * 
 * Helper functions for common database operations and data transformations
 */

import { supabase } from './client'
import { postgresConfig } from './config'

/**
 * Retry a database operation with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxAttempts = postgresConfig.retry.maxAttempts
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt < maxAttempts) {
        const delay = postgresConfig.retry.delayMs * Math.pow(postgresConfig.retry.backoffMultiplier, attempt - 1)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries')
}

/**
 * Check if a table exists in the database
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0)
    
    return !error
  } catch {
    return false
  }
}

/**
 * Get table row count
 */
export async function getTableCount(tableName: string): Promise<number> {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true })
  
  if (error) {
    console.error(`Error counting rows in ${tableName}:`, error)
    return 0
  }
  
  return count || 0
}

/**
 * Format BigInt values for JSON serialization
 */
export function formatBigIntForJSON(obj: any): any {
  if (typeof obj === 'bigint') {
    return obj.toString()
  }
  
  if (Array.isArray(obj)) {
    return obj.map(formatBigIntForJSON)
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, formatBigIntForJSON(value)])
    )
  }
  
  return obj
}

/**
 * Convert Wei to Ether string
 */
export function weiToEther(wei: string | bigint): string {
  const weiValue = typeof wei === 'string' ? BigInt(wei) : wei
  const etherValue = Number(weiValue) / 1e18
  return etherValue.toFixed(6)
}

/**
 * Parse date range for queries
 */
export interface DateRange {
  start_date: string
  end_date: string
}

export function getDateRange(days: number): DateRange {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  
  return {
    start_date: start.toISOString(),
    end_date: end.toISOString(),
  }
}

/**
 * Build pagination params
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

export function getPaginationRange(params: PaginationParams) {
  const { page, pageSize } = params
  const offset = (page - 1) * pageSize
  const limit = Math.min(pageSize, postgresConfig.maxPageSize)
  
  return { offset, limit }
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Batch process array in chunks
 */
export async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await processor(batch)
    results.push(...batchResults)
  }
  
  return results
}

/**
 * Create a simple in-memory cache with TTL
 */
export class SimpleCache<T> {
  private cache = new Map<string, { value: T; expires: number }>()

  set(key: string, value: T, ttlSeconds: number): void {
    const expires = Date.now() + ttlSeconds * 1000
    this.cache.set(key, { value, expires })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

