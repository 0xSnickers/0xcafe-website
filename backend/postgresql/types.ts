/**
 * Database Types
 * 
 * Auto-generated types for Supabase tables.
 * Run `pnpm run generate:types` to update these types from your database schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * BaseFee 数据类型
 */
export interface BaseFee {
  id: number
  block_number: number
  base_fee: string
  base_fee_gwei: string
  timestamp: number
  chain_id: number
  synced_at: string
}

/**
 * BurntFee 数据类型（区块级别的燃烧费用）
 */
export interface BurntFee {
  id: number
  block_number: number
  timestamp: number
  chain_id: number
  block_hash: string
  gas_limit: string
  gas_used: string
  base_fee: string
  base_fee_gwei: string // Generated column
  burnt_fees: string // Generated column (base_fee * gas_used)
  burnt_fees_eth: string // Generated column
  transaction_count: number
  synced_at: string
}

/**
 * Database schema definition
 * This should match your Supabase database structure
 */
export interface Database {
  public: {
    Tables: {
      // Example: burn_history table
      burn_history: {
        Row: {
          id: string
          block_number: number
          timestamp: string
          base_fee: string
          gas_used: string
          burned_amount: string
          tx_hash: string
          from_address: string
          to_address: string | null
          category: string
          chain_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          block_number: number
          timestamp: string
          base_fee: string
          gas_used: string
          burned_amount: string
          tx_hash: string
          from_address: string
          to_address?: string | null
          category: string
          chain_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          block_number?: number
          timestamp?: string
          base_fee?: string
          gas_used?: string
          burned_amount?: string
          tx_hash?: string
          from_address?: string
          to_address?: string | null
          category?: string
          chain_id?: number
          created_at?: string
          updated_at?: string
        }
      }
      
      // Example: gas_price_history table
      gas_price_history: {
        Row: {
          id: string
          chain_id: number
          timestamp: string
          base_fee: string
          priority_fee: string
          gas_price: string
          created_at: string
        }
        Insert: {
          id?: string
          chain_id: number
          timestamp: string
          base_fee: string
          priority_fee: string
          gas_price: string
          created_at?: string
        }
        Update: {
          id?: string
          chain_id?: number
          timestamp?: string
          base_fee?: string
          priority_fee?: string
          gas_price?: string
          created_at?: string
        }
      }

      // base_fees table
      base_fees: {
        Row: {
          id: number
          block_number: number
          base_fee: string
          base_fee_gwei: string
          timestamp: number
          chain_id: number
          synced_at: string
        }
        Insert: {
          id?: number
          block_number: number
          base_fee: string
          base_fee_gwei?: string
          timestamp: number
          chain_id?: number
          synced_at?: string
        }
        Update: {
          id?: number
          block_number?: number
          base_fee?: string
          base_fee_gwei?: string
          timestamp?: number
          chain_id?: number
          synced_at?: string
        }
      }

      // burnt_fees table
      burnt_fees: {
        Row: {
          id: number
          block_number: number
          timestamp: number
          chain_id: number
          block_hash: string
          gas_limit: string
          gas_used: string
          base_fee: string
          base_fee_gwei: string
          burnt_fees: string
          burnt_fees_eth: string
          transaction_count: number
          synced_at: string
        }
        Insert: {
          id?: number
          block_number: number
          timestamp: number
          chain_id?: number
          block_hash: string
          gas_limit: string
          gas_used: string
          base_fee: string
          base_fee_gwei?: string
          burnt_fees?: string
          burnt_fees_eth?: string
          transaction_count?: number
          synced_at?: string
        }
        Update: {
          id?: number
          block_number?: number
          timestamp?: number
          chain_id?: number
          block_hash?: string
          gas_limit?: string
          gas_used?: string
          base_fee?: string
          base_fee_gwei?: string
          burnt_fees?: string
          burnt_fees_eth?: string
          transaction_count?: number
          synced_at?: string
        }
      }

      // Add more table definitions as needed
    }
    Views: {
      // Define database views here
    }
    Functions: {
      get_total_burned: {
        Args: {
          chain_id_param: number
        }
        Returns: {
          total_burned: string
        }
      }
    }
    Enums: {
      // Define database enums here
    }
  }
}

/**
 * Type helpers for easier access to table types
 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

/**
 * Common query result types
 */
export type BurnHistory = Tables<'burn_history'>
export type GasPriceHistory = Tables<'gas_price_history'>

/**
 * Query filter types
 */
export interface BurnHistoryFilter {
  chain_id?: number
  category?: string
  from_address?: string
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}

export interface GasPriceFilter {
  chain_id?: number
  start_date?: string
  end_date?: string
  limit?: number
}

