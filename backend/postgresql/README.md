# PostgreSQL/Supabase Integration

This directory contains all database-related code for connecting to and querying Supabase PostgreSQL.

## 📁 Structure

```
backend/postgresql/
├── client.ts       # Supabase client configuration
├── config.ts       # Database configuration and settings
├── types.ts        # TypeScript type definitions for database schema
├── queries.ts      # Reusable query functions
├── utils.ts        # Utility functions for database operations
├── index.ts        # Main entry point (exports all modules)
└── README.md       # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm add @supabase/supabase-js
```

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: For server-side operations with elevated privileges
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

You can find these values in your Supabase project settings:
- Go to https://app.supabase.com
- Select your project
- Navigate to Settings > API
- Copy the URL and keys

### 3. Basic Usage

```typescript
import { supabase, getBurnHistory, getLatestGasPrice } from '@/backend/postgresql'

// Fetch burn history
const { data, count } = await getBurnHistory({
  chain_id: 1,
  limit: 50
})

// Fetch latest gas price
const gasPrice = await getLatestGasPrice(1)

// Direct query
const { data, error } = await supabase
  .from('burn_history')
  .select('*')
  .eq('chain_id', 1)
  .limit(10)
```

## 📊 Database Schema

### Tables

#### `burn_history`
Stores historical data of ETH burned in transactions.

```typescript
{
  id: string                 // UUID
  block_number: number       // Block number
  timestamp: string          // ISO 8601 timestamp
  base_fee: string          // Wei (as string for precision)
  gas_used: string          // Gas units
  burned_amount: string     // Wei burned
  tx_hash: string           // Transaction hash
  from_address: string      // Sender address
  to_address: string | null // Receiver address
  category: string          // Transaction category
  chain_id: number          // Chain identifier
  created_at: string        // Record creation time
  updated_at: string        // Record update time
}
```

#### `gas_price_history`
Stores historical gas price data.

```typescript
{
  id: string           // UUID
  chain_id: number     // Chain identifier
  timestamp: string    // ISO 8601 timestamp
  base_fee: string     // Base fee in Wei
  priority_fee: string // Priority fee in Wei
  gas_price: string    // Total gas price in Wei
  created_at: string   // Record creation time
}
```

## 🔧 Available Functions

### Query Functions

#### `getBurnHistory(filter)`
Fetch burn history with optional filters.

```typescript
const { data, count } = await getBurnHistory({
  chain_id: 1,
  category: 'transfer',
  start_date: '2024-01-01T00:00:00Z',
  end_date: '2024-12-31T23:59:59Z',
  limit: 100,
  offset: 0
})
```

#### `getTotalBurnedByChain(chainId)`
Get total burned amount for a specific chain.

```typescript
const total = await getTotalBurnedByChain(1)
```

#### `getBurnCategoriesStats(chainId?)`
Get burn statistics grouped by category.

```typescript
const stats = await getBurnCategoriesStats(1)
// Returns: [{ category: 'transfer', total_burned: '12345...' }, ...]
```

#### `getGasPriceHistory(filter)`
Fetch gas price history with optional filters.

```typescript
const history = await getGasPriceHistory({
  chain_id: 1,
  start_date: '2024-10-01T00:00:00Z',
  limit: 50
})
```

#### `getLatestGasPrice(chainId)`
Get the latest gas price for a chain.

```typescript
const latestPrice = await getLatestGasPrice(1)
```

### Insert Functions

#### `insertBurnHistory(record)`
Insert a single burn history record.

```typescript
await insertBurnHistory({
  block_number: 12345678,
  timestamp: new Date().toISOString(),
  base_fee: '50000000000',
  gas_used: '21000',
  burned_amount: '1050000000000000',
  tx_hash: '0x...',
  from_address: '0x...',
  to_address: '0x...',
  category: 'transfer',
  chain_id: 1
})
```

#### `batchInsertBurnHistory(records)`
Insert multiple records in a single transaction.

```typescript
await batchInsertBurnHistory([
  { /* record 1 */ },
  { /* record 2 */ },
  // ...
])
```

### Utility Functions

#### `retryOperation(operation, maxAttempts)`
Retry a database operation with exponential backoff.

```typescript
const result = await retryOperation(
  async () => await someDbOperation(),
  3 // max attempts
)
```

#### `weiToEther(wei)`
Convert Wei to Ether string.

```typescript
const ether = weiToEther('1000000000000000000') // '1.000000'
```

#### `getDateRange(days)`
Get date range for the last N days.

```typescript
const { start_date, end_date } = getDateRange(7) // Last 7 days
```

## 🔐 Security Best Practices

1. **Never expose service role key in client-side code**
   - Only use `NEXT_PUBLIC_SUPABASE_ANON_KEY` in client components
   - Use `SUPABASE_SERVICE_ROLE_KEY` only in server-side code (API routes, server components)

2. **Use Row Level Security (RLS)**
   - Enable RLS on all tables in Supabase dashboard
   - Define policies for read/write access

3. **Validate input**
   - Always validate and sanitize user input before queries
   - Use TypeScript types for compile-time safety

4. **Use prepared statements**
   - Supabase automatically uses parameterized queries
   - Never concatenate user input into SQL strings

## 🧪 Testing Database Connection

```typescript
import { checkDatabaseConnection, getDatabaseInfo } from '@/lib/postgresql'

// Check if database is accessible
const isConnected = await checkDatabaseConnection()
console.log('Database connected:', isConnected)

// Get database configuration info
const info = getDatabaseInfo()
console.log('Database info:', info)
```

## 📝 Type Generation

To generate TypeScript types from your database schema:

1. Install Supabase CLI:
```bash
pnpm add -D supabase
```

2. Login to Supabase:
```bash
npx supabase login
```

3. Generate types:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/postgresql/types.ts
```

Or add to `package.json`:
```json
{
  "scripts": {
    "generate:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/postgresql/types.ts"
  }
}
```

## 🔄 Migration Guide

If you need to update the database schema:

1. Make changes in Supabase dashboard or using SQL
2. Regenerate types (see above)
3. Update query functions in `queries.ts` if needed
4. Update types in `types.ts` manually if auto-generation doesn't work

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 🐛 Troubleshooting

### Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is active and not paused
- Ensure your IP is not blocked by Supabase

### Type Errors
- Regenerate types from database schema
- Check if table structure matches type definitions
- Ensure all required fields are provided in queries

### Performance Issues
- Add database indexes for frequently queried columns
- Use pagination for large result sets
- Implement caching for frequently accessed data
- Use RPC functions for complex queries

## 🤝 Contributing

When adding new database functionality:
1. Add types to `types.ts`
2. Add queries to `queries.ts`
3. Add utilities to `utils.ts`
4. Export from `index.ts`
5. Update this README

