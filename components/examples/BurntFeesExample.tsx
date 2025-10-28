/**
 * Burnt Fees 组件示例
 * 
 * 展示如何使用多链 Burnt Fees Hooks
 */

'use client'

import { useState } from 'react'
import { 
  useBurntFees, 
  useMultiChainSummary,
  useAllEnabledChains,
  type SupportedChainId,
  type Period 
} from '@/hooks/use-burnt-fees-multi-chain'

/**
 * 示例 1: 单链查询
 * 
 * 查询指定链的燃烧费用统计
 */
export function SingleChainExample() {
  const [period, setPeriod] = useState<Period>('1d')
  const { data, isLoading, error } = useBurntFees(1, period) // Ethereum
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return null
  
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        {data.chainName} Burnt Fees
      </h2>
      
      {/* 时间段选择 */}
      <div className="mb-4">
        <label className="mr-2">Period:</label>
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="border rounded px-2 py-1"
        >
          <option value="1h">1 Hour</option>
          <option value="1d">24 Hours</option>
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
        </select>
      </div>
      
      {/* 统计数据 */}
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Total Burnt:</span>
          <span className="ml-2 text-xl text-orange-600">
            {parseFloat(data.totalBurntEth).toFixed(4)} {data.chainSymbol}
          </span>
        </div>
        
        <div>
          <span className="font-semibold">Avg BaseFee:</span>
          <span className="ml-2">
            {parseFloat(data.avgBaseFeeGwei).toFixed(2)} Gwei
          </span>
        </div>
        
        <div>
          <span className="font-semibold">Blocks Processed:</span>
          <span className="ml-2">{data.blockCount.toLocaleString()}</span>
        </div>
        
        <div>
          <span className="font-semibold">Data Coverage:</span>
          <span className="ml-2">
            {(parseFloat(data.coverage) * 100).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * 示例 2: 多链切换
 * 
 * 在不同链之间切换查询
 */
export function MultiChainSwitcher() {
  const [chainId, setChainId] = useState<SupportedChainId>(1)
  const { data, isLoading } = useBurntFees(chainId, '1d')
  
  // 目前只有 Ethereum 启用，未来可以添加更多链
  const availableChains = [
    { id: 1, name: 'Ethereum' },
    // { id: 137, name: 'Polygon' },  // 未来启用
    // { id: 8453, name: 'Base' },    // 未来启用
  ]
  
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Multi-Chain Selector</h2>
      
      {/* 链选择器 */}
      <div className="mb-4 flex gap-2">
        {availableChains.map(chain => (
          <button
            key={chain.id}
            onClick={() => setChainId(chain.id as SupportedChainId)}
            className={`px-4 py-2 rounded ${
              chainId === chain.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {chain.name}
          </button>
        ))}
      </div>
      
      {/* 数据显示 */}
      {isLoading ? (
        <div>Loading {availableChains.find(c => c.id === chainId)?.name} data...</div>
      ) : data ? (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">{data.chainName} - 24 Hours</h3>
          <p className="text-3xl font-bold text-orange-600">
            {parseFloat(data.totalBurntEth).toFixed(4)} {data.chainSymbol}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Avg BaseFee: {parseFloat(data.avgBaseFeeGwei).toFixed(2)} Gwei
          </p>
          <p className="text-sm text-gray-600">
            {data.blockCount.toLocaleString()} blocks processed
          </p>
        </div>
      ) : null}
    </div>
  )
}

/**
 * 示例 3: 多链汇总
 * 
 * 同时查询多个链并汇总统计
 */
export function MultiChainSummary() {
  const { data, isLoading } = useMultiChainSummary([1], '1d') // 目前只有 Ethereum
  
  if (isLoading) return <div>Loading multi-chain data...</div>
  if (!data) return null
  
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Multi-Chain Summary</h2>
      
      {/* 总览 */}
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <p className="text-lg">
          <span className="font-semibold">Total Burnt (All Chains):</span>
          <span className="ml-2 text-2xl text-blue-600">
            {data.totalBurnt.toFixed(4)} ETH equiv
          </span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Across {data.chainCount} chain{data.chainCount > 1 ? 's' : ''}
        </p>
      </div>
      
      {/* 各链详情 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.chains.map(chain => (
          <div key={chain.chainId} className="p-4 border rounded">
            <h3 className="font-semibold mb-2">{chain.chainName}</h3>
            <p className="text-xl font-bold text-orange-600">
              {parseFloat(chain.totalBurntEth).toFixed(4)} {chain.chainSymbol}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {chain.blockCount.toLocaleString()} blocks
            </p>
            <p className="text-sm text-gray-600">
              {parseFloat(chain.avgBaseFeeGwei).toFixed(2)} Gwei avg
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 示例 4: 所有已启用链的汇总
 * 
 * 自动查询所有已启用的链
 */
export function AllEnabledChainsExample() {
  const { data, isLoading } = useAllEnabledChains('1d')
  
  if (isLoading) return <div>Loading all chains...</div>
  if (!data) return null
  
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">All Enabled Chains</h2>
      
      <div className="space-y-4">
        {data.chains.map(chain => (
          <div key={chain.chainId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-semibold">{chain.chainName}</p>
              <p className="text-sm text-gray-600">
                {chain.blockCount.toLocaleString()} blocks
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">
                {parseFloat(chain.totalBurntEth).toFixed(4)} {chain.chainSymbol}
              </p>
              <p className="text-sm text-gray-600">
                {parseFloat(chain.avgBaseFeeGwei).toFixed(2)} Gwei
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-orange-100 rounded text-center">
        <p className="text-2xl font-bold">
          Total: {data.totalBurnt.toFixed(4)} ETH
        </p>
      </div>
    </div>
  )
}

/**
 * 示例 5: 完整的仪表板
 * 
 * 组合多个功能的完整示例
 */
export function BurntFeesDashboard() {
  const [period, setPeriod] = useState<Period>('1d')
  const { data: ethereumData } = useBurntFees(1, period)
  
  return (
    <div className="space-y-6">
      {/* 标题和时间段选择 */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Burnt Fees Dashboard</h1>
        
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="border rounded px-3 py-2"
        >
          <option value="1h">Last Hour</option>
          <option value="1d">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>
      
      {/* 主要统计卡片 */}
      {ethereumData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm font-semibold text-gray-600 mb-1">Total Burnt</p>
            <p className="text-3xl font-bold text-orange-600">
              {parseFloat(ethereumData.totalBurntEth).toFixed(4)}
            </p>
            <p className="text-sm text-gray-600 mt-1">{ethereumData.chainSymbol}</p>
          </div>
          
          <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm font-semibold text-gray-600 mb-1">Avg BaseFee</p>
            <p className="text-3xl font-bold text-blue-600">
              {parseFloat(ethereumData.avgBaseFeeGwei).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Gwei</p>
          </div>
          
          <div className="p-6 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm font-semibold text-gray-600 mb-1">Blocks</p>
            <p className="text-3xl font-bold text-green-600">
              {ethereumData.blockCount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Processed</p>
          </div>
        </div>
      )}
      
      {/* 多链汇总 */}
      <MultiChainSummary />
    </div>
  )
}

