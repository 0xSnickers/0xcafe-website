/**
 * PostgreSQL/Supabase Module
 * 
 * Main entry point for database operations.
 * Export all database-related functions and types.
 */

// Client
export { supabase, createServerClient, checkDatabaseConnection } from './client'

// Types
export type {
  Database,
  Tables,
  Inserts,
  Updates,
  BurnHistory,
  GasPriceHistory,
  BurnHistoryFilter,
  GasPriceFilter,
} from './types'

// Queries
export {
  getBurnHistory,
  getTotalBurnedByChain,
  getBurnCategoriesStats,
  getGasPriceHistory,
  getLatestGasPrice,
  insertBurnHistory,
  insertGasPrice,
  batchInsertBurnHistory,
} from './queries'

// Config
export { postgresConfig, validatePostgresConfig, getDatabaseInfo } from './config'

// Utils
export * from './utils'

