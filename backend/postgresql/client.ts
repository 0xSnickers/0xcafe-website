/**
 * Supabase PostgreSQL Client
 * 
 * This module provides a configured Supabase client instance for database operations.
 * It supports both server-side and client-side usage with proper error handling.
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Validate environment variables
// Support both NEXT_PUBLIC_ prefix (for Next.js client) and without prefix (for server/CI)
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.SUPABASE_URL

const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file or GitHub Secrets.'
  )
}

/**
 * Supabase client instance with typed database schema
 * Use this for all database operations
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': '0xcafe-website',
    },
  },
})

/**
 * Create a Supabase client for server-side operations
 * This should be used in API routes and server components
 */
export const createServerClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase server environment variables')
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * Health check function to verify database connection
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('_health_check').select('*').limit(1)
    return !error
  } catch {
    return false
  }
}

export default supabase

