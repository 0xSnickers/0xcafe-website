/**
 * PostgreSQL (Supabase) 配置测试脚本
 * 
 * 用于验证 Supabase 数据库连接和配置是否正常
 */

import { supabase } from '@/backend/postgresql/client'
import { 
  getBaseFeeByBlock,
  getBaseFeesByBlocks,
  getBaseFeesByRange,
  getLatestSyncedBlock,
  upsertBaseFees
} from '@/backend/postgresql/queries'

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function success(message: string) {
  log(`✅ ${message}`, colors.green)
}

function error(message: string) {
  log(`❌ ${message}`, colors.red)
}

function info(message: string) {
  log(`ℹ️  ${message}`, colors.blue)
}

function section(title: string) {
  log(`\n${'='.repeat(60)}`, colors.cyan)
  log(title, colors.cyan)
  log('='.repeat(60), colors.cyan)
}

/**
 * 测试 1: 基础连接测试
 */
async function testConnection() {
  section('测试 1: Supabase 基础连接')
  
  try {
    // 尝试查询一个简单的系统表
    const { data, error } = await supabase
      .from('base_fees')
      .select('count')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') { // PGRST116 是"未找到"错误
      throw error
    }
    
    success('Supabase 连接成功')
    return true
  } catch (err) {
    error(`连接失败: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

/**
 * 测试 2: 环境变量检查
 */
async function testEnvironmentVariables() {
  section('测试 2: 环境变量检查')
  
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
  
  let allPresent = true
  
  for (const [key, value] of Object.entries(requiredVars)) {
    if (value) {
      success(`${key}: 已设置`)
      // 显示部分值（隐藏敏感信息）
      if (key.includes('KEY')) {
        info(`  值: ${value.substring(0, 20)}...`)
      } else {
        info(`  值: ${value}`)
      }
    } else {
      error(`${key}: 未设置`)
      allPresent = false
    }
  }
  
  return allPresent
}

/**
 * 测试 3: 表结构验证
 */
async function testTableStructure() {
  section('测试 3: base_fees 表结构验证')
  
  try {
    // 检查表是否存在及其结构
    const { data, error } = await supabase
      .from('base_fees')
      .select('*')
      .limit(1)
    
    if (error) {
      if (error.code === '42P01') {
        error('base_fees 表不存在，需要运行迁移脚本')
        info('请执行: psql -h <host> -U <user> -d <database> -f backend/postgresql/migrations/001_create_base_fees.sql')
        return false
      }
      throw error
    }
    
    success('base_fees 表存在')
    
    if (data && data.length > 0) {
      info(`  已有数据: ${data.length} 条记录`)
      info(`  示例记录: ${JSON.stringify(data[0], null, 2)}`)
    } else {
      info('  表为空，这是正常的')
    }
    
    return true
  } catch (err) {
    error(`表结构验证失败: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

/**
 * 测试 4: 插入和查询测试
 */
async function testInsertAndQuery() {
  section('测试 4: 插入和查询功能')
  
  try {
    // 生成测试数据
    const testBlock = Math.floor(Date.now() / 1000) // 使用时间戳作为伪区块号
    const testData = {
      block_number: testBlock,
      base_fee: '30000000000', // 30 Gwei in Wei
      timestamp: Math.floor(Date.now() / 1000),
      chain_id: 1,
    }
    
    info('正在插入测试数据...')
    const inserted = await upsertBaseFees([testData])
    
    if (inserted && inserted.length > 0) {
      success(`成功插入测试数据 (block_number: ${testBlock})`)
    }
    
    // 查询刚插入的数据
    info('正在查询测试数据...')
    const fetched = await getBaseFeeByBlock(testBlock, 1)
    
    if (fetched && fetched.block_number === testBlock) {
      success('成功查询测试数据')
      info(`  查询结果: ${JSON.stringify(fetched, null, 2)}`)
    } else {
      error('查询测试数据失败')
      return false
    }
    
    // 测试批量查询
    info('测试批量查询...')
    const batchFetched = await getBaseFeesByBlocks([testBlock], 1)
    if (batchFetched && batchFetched.length > 0) {
      success('批量查询成功')
    }
    
    // 清理测试数据
    info('清理测试数据...')
    const { error: deleteError } = await supabase
      .from('base_fees')
      .delete()
      .eq('block_number', testBlock)
      .eq('chain_id', 1)
    
    if (!deleteError) {
      success('测试数据已清理')
    }
    
    return true
  } catch (err) {
    error(`插入/查询测试失败: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

/**
 * 测试 5: 查询函数测试
 */
async function testQueryFunctions() {
  section('测试 5: 所有查询函数')
  
  const tests = [
    {
      name: 'getLatestSyncedBlock',
      fn: async () => {
        const result = await getLatestSyncedBlock(1)
        info(`  最新同步区块: ${result || '无数据'}`)
        return true
      }
    },
    {
      name: 'getBaseFeesByRange',
      fn: async () => {
        const result = await getBaseFeesByRange(1000000, 1000010, 1)
        info(`  范围查询结果: ${result.length} 条记录`)
        return true
      }
    },
  ]
  
  let allPassed = true
  
  for (const test of tests) {
    try {
      info(`测试函数: ${test.name}`)
      await test.fn()
      success(`${test.name} 测试通过`)
    } catch (err) {
      error(`${test.name} 测试失败: ${err instanceof Error ? err.message : String(err)}`)
      allPassed = false
    }
  }
  
  return allPassed
}

/**
 * 测试 6: 性能测试
 */
async function testPerformance() {
  section('测试 6: 基础性能测试')
  
  try {
    const start = Date.now()
    
    // 执行一个简单查询
    await supabase
      .from('base_fees')
      .select('*')
      .limit(10)
    
    const duration = Date.now() - start
    
    if (duration < 1000) {
      success(`查询响应时间: ${duration}ms (优秀)`)
    } else if (duration < 3000) {
      success(`查询响应时间: ${duration}ms (良好)`)
    } else {
      error(`查询响应时间: ${duration}ms (较慢)`)
    }
    
    return true
  } catch (err) {
    error(`性能测试失败: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

/**
 * 主测试函数
 */
async function runAllTests() {
  log('\n🚀 开始 PostgreSQL (Supabase) 配置测试\n', colors.cyan)
  
  const results = {
    connection: false,
    environment: false,
    tableStructure: false,
    insertQuery: false,
    queryFunctions: false,
    performance: false,
  }
  
  // 按顺序执行测试
  results.environment = await testEnvironmentVariables()
  
  if (!results.environment) {
    error('\n❌ 环境变量未配置，请先配置 .env.local 文件')
    process.exit(1)
  }
  
  results.connection = await testConnection()
  
  if (!results.connection) {
    error('\n❌ 数据库连接失败，请检查环境变量和网络')
    process.exit(1)
  }
  
  results.tableStructure = await testTableStructure()
  results.insertQuery = await testInsertAndQuery()
  results.queryFunctions = await testQueryFunctions()
  results.performance = await testPerformance()
  
  // 输出总结
  section('测试总结')
  
  const passed = Object.values(results).filter(Boolean).length
  const total = Object.keys(results).length
  
  log(`\n通过测试: ${passed}/${total}`, passed === total ? colors.green : colors.yellow)
  
  if (passed === total) {
    success('\n🎉 所有测试通过！PostgreSQL 配置正常\n')
    process.exit(0)
  } else {
    error('\n⚠️  部分测试失败，请检查上述错误信息\n')
    process.exit(1)
  }
}

// 执行测试
if (require.main === module) {
  runAllTests().catch((err) => {
    error(`测试执行失败: ${err instanceof Error ? err.message : String(err)}`)
    console.error(err)
    process.exit(1)
  })
}

export { runAllTests }

