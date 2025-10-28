/**
 * PostgreSQL/Supabase Configuration
 * 
 * Central configuration for database connections and settings
 */

export const postgresConfig = {
  // Connection settings
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Query settings
  defaultPageSize: 100,
  maxPageSize: 1000,
  
  // Cache settings (in seconds)
  cache: {
    gasPrice: 60, // 1 minute
    burnHistory: 300, // 5 minutes
    stats: 600, // 10 minutes
  },

  // Retry settings
  retry: {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  },

  // Table names
  tables: {
    burnHistory: 'burn_history',
    gasPriceHistory: 'gas_price_history',
    burnCategories: 'burn_categories',
    chainStats: 'chain_stats',
  },

  // RPC function names
  rpcFunctions: {
    getTotalBurned: 'get_total_burned',
    getBurnRanking: 'get_burn_ranking',
    getChainStats: 'get_chain_stats',
  },
} as const

/**
 * Validate configuration
 */
export function validatePostgresConfig(): boolean {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error('Missing required Supabase environment variables:', missing)
    return false
  }

  return true
}

/**
 * Get database connection info (for debugging)
 */
export function getDatabaseInfo() {
  return {
    url: postgresConfig.url,
    hasAnonKey: !!postgresConfig.anonKey,
    hasServiceKey: !!postgresConfig.serviceRoleKey,
    isConfigured: validatePostgresConfig(),
  }
}

