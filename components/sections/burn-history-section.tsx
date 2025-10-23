'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Flame, Crown, RefreshCw, AlertCircle } from 'lucide-react'
import { useBurnHistory, useBurnRanking, useTotalBurned, useBurnCategories } from '@/hooks/use-gas-data'

/**
 * Burn History Section - 燃烧记录展示
 * 展示区块燃烧记录和燃烧排行
 */
export function BurnHistorySection() {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = React.useState('1h')
  // const [selectedChain, setSelectedChain] = React.useState<SupportedChain>('ethereum')

  const periods = [
    { id: '1h', label: '1h' },
    { id: '1d', label: '1d' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
  ]

  // 获取燃烧历史数据 - 手动刷新
  const {
    data: burnHistory,
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchHistory
  } = useBurnHistory('ethereum', 6, selectedPeriod, {
    refetchInterval: 0, // 禁用自动刷新
    enabled: false, // 默认不自动加载
  })

  // 获取燃烧排行榜 - 手动刷新
  const {
    data: burnRankings,
    isLoading: rankingLoading,
    error: rankingError,
    refetch: refetchRanking
  } = useBurnRanking('ethereum', 8, selectedPeriod, {
    refetchInterval: 0, // 禁用自动刷新
    enabled: false, // 默认不自动加载
  })

  // 获取燃烧总量 - 手动刷新
  const {
    data: totalBurned,
    isLoading: totalLoading,
    error: totalError,
    refetch: refetchTotal
  } = useTotalBurned('ethereum', selectedPeriod, {
    refetchInterval: 0, // 禁用自动刷新
    enabled: false, // 默认不自动加载
  })

  // 获取燃烧类别数据 - 手动刷新
  const {
    data: burnCategories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories
  } = useBurnCategories('ethereum', 7, {
    refetchInterval: 0, // 禁用自动刷新
    enabled: false, // 默认不自动加载
  })

  // 当时间段改变时，重新获取数据
  React.useEffect(() => {
    refetchHistory()
    refetchRanking()
    refetchTotal()
    refetchCategories()
  }, [selectedPeriod, refetchHistory, refetchRanking, refetchTotal, refetchCategories])

  // 计算燃烧总量数据
  const burnTotalData = React.useMemo(() => {
    if (!totalBurned) {
      return { amount: '0.076', rate: '0.152', avgBurnPerBlock: '0.005', avgGasUsedPercent: '85.2' }
    }
    
    return {
      amount: totalBurned.totalBurnedFormatted,
      rate: totalBurned.burnRateFormatted,
      avgBurnPerBlock: totalBurned.avgBurnPerBlock.toFixed(6),
      avgGasUsedPercent: totalBurned.avgGasUsedPercent.toFixed(2),
    }
  }, [totalBurned])

  // 格式化燃烧历史数据 - 简化版本
  const formattedBlocks = React.useMemo(() => {
    if (!burnHistory || !Array.isArray(burnHistory)) {
      return [
        { number: '#23,603,056', gas: '12.5', burned: '0.005' },
        { number: '#23,603,055', gas: '12.2', burned: '0.004' },
        { number: '#23,603,054', gas: '12.4', burned: '0.003' },
        { number: '#23,603,053', gas: '12.1', burned: '0.004' },
        { number: '#23,603,052', gas: '12.8', burned: '0.002' },
        { number: '#23,603,051', gas: '12.9', burned: '0.003' },
      ]
    }

    return burnHistory.slice(0, 6).map((block) => ({
      number: `#${block.blockNumber.toLocaleString()}`,
      gas: block.baseFeePerGas.toFixed(1),
      burned: block.burned,
    }))
  }, [burnHistory])

  // 格式化燃烧排行榜数据 - 优化版本
  const formattedRankings = React.useMemo(() => {
    if (!burnRankings || !Array.isArray(burnRankings)) {
      return [
        { name: 'Uniswap V2', burnedETH: '0.006', burnedUSD: '15.00', percentage: '12.5%', tag: 'DEFI' },
        { name: 'Tether USDT', burnedETH: '0.005', burnedUSD: '12.50', percentage: '10.4%', tag: 'STABLECOIN' },
        { name: 'Binance', burnedETH: '0.004', burnedUSD: '10.00', percentage: '8.3%', tag: 'EXCHANGE' },
        { name: 'USDC', burnedETH: '0.003', burnedUSD: '7.50', percentage: '6.3%', tag: 'STABLECOIN' },
        { name: 'OpenSea', burnedETH: '0.002', burnedUSD: '5.00', percentage: '4.2%', tag: 'NFT' },
        { name: '1inch', burnedETH: '0.002', burnedUSD: '5.00', percentage: '4.2%', tag: 'DEFI' },
        { name: 'SushiSwap', burnedETH: '0.001', burnedUSD: '2.50', percentage: '2.1%', tag: 'DEFI' },
        { name: 'CoW Protocol', burnedETH: '0.001', burnedUSD: '2.50', percentage: '2.1%', tag: 'MEV' },
      ]
    }

    return burnRankings.slice(0, 8).map((ranking) => ({
      name: ranking.name,
      burnedETH: ranking.burnedETH,
      burnedUSD: ranking.burnedUSD,
      percentage: `${ranking.percentage}%`,
      tag: ranking.category,
    }))
  }, [burnRankings])

  // 格式化燃烧类别数据 - 简化版本
  const formattedCategories = React.useMemo(() => {
    if (!burnCategories || !Array.isArray(burnCategories)) {
      return [
        { name: 'DEFI', burned: '0.021', percentage: '27.6%', transactionCount: 45, uniqueAddresses: 12 },
        { name: 'STABLECOIN', burned: '0.015', percentage: '19.7%', transactionCount: 32, uniqueAddresses: 8 },
        { name: 'EXCHANGE', burned: '0.012', percentage: '15.8%', transactionCount: 28, uniqueAddresses: 6 },
        { name: 'MEV', burned: '0.008', percentage: '10.5%', transactionCount: 18, uniqueAddresses: 4 },
        { name: 'NFT', burned: '0.005', percentage: '6.6%', transactionCount: 12, uniqueAddresses: 3 },
        { name: 'L2', burned: '0.003', percentage: '3.9%', transactionCount: 8, uniqueAddresses: 2 },
        { name: 'OTHER', burned: '0.012', percentage: '15.8%', transactionCount: 25, uniqueAddresses: 15 },
      ]
    }

    return burnCategories.map(category => ({
      name: category.category,
      burned: category.burned,
      percentage: `${category.percentage}%`,
      transactionCount: category.transactionCount,
      uniqueAddresses: category.uniqueAddresses,
    }))
  }, [burnCategories])

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t('burn.title')}</h2>
          
          {/* 控制区域 */}
          <div className="flex items-center gap-4">
            {/* 时间间隔选择器 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{t('burn.period')}:</span>
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {/* 实时状态指示器 */}
            <div className="flex items-center gap-2">
              {/* 状态指示 */}
              {historyLoading || rankingLoading || totalLoading || categoriesLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="text-blue-500"
                >
                  <RefreshCw className="h-5 w-5" />
                </motion.div>
              ) : historyError || rankingError || totalError || categoriesError ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
              )}

              {/* 手动刷新按钮 - 只显示图标 */}
              <button
                onClick={() => {
                  refetchHistory()
                  refetchRanking()
                  refetchTotal()
                  refetchCategories()
                }}
                disabled={historyLoading || rankingLoading || totalLoading || categoriesLoading}
                className="flex items-center justify-center w-8 h-8 bg-background hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                title="刷新数据"
              >
                <RefreshCw className={`h-4 w-4 ${(historyLoading || rankingLoading || totalLoading || categoriesLoading) ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Burn Total & Blocks */}
          <div className="space-y-6">
            {/* Burn Total */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/50"
            >
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">{t('burn.totalBurned')}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold text-orange-500">
                    {burnTotalData.amount} <span className="text-2xl">ETH</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {t('burn.currentPeriod')} {selectedPeriod}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {t('burn.burnRate')}
                  </div>
                  <div className="text-2xl font-semibold">
                    {burnTotalData.rate} <span className="text-base">ETH/min</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Blocks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-card border"
            >
              <h3 className="font-semibold mb-4">{t('burn.recentBlocks')}</h3>
              <div className="space-y-3">
                {formattedBlocks.map((block) => (
                  <div
                    key={block.number}
                    className="flex items-center justify-between text-sm pb-3 border-b last:border-b-0"
                  >
                    <div className="space-y-1">
                      <div className="font-mono text-primary">{block.number}</div>
                      <div className="text-xs text-muted-foreground">
                        {t('burn.gas')}: {block.gas} Gwei
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{block.burned} ETH</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-center text-muted-foreground mt-4">
                LATEST BLOCK 68 SECONDS OLD
              </div>
            </motion.div>

            {/* Recent Burns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-card border"
            >
              <h3 className="font-semibold mb-4">{t('burn.recentBurns')}</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {index === 0 ? (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                      <div>
                        <div className="font-semibold">0.005 ETH</div>
                        <div className="text-xs text-muted-foreground">
                          #{23603056 - index}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {index + 1}分钟前
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Middle Column - Burn Rankings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-card border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">{t('burn.rankings')}</h3>
              <span className="text-sm text-muted-foreground">
                {t('burn.period')}: {selectedPeriod}
              </span>
            </div>

            <div className="space-y-3">
              {formattedRankings.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {index === 0 ? (
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-sm">🔄</span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                          <span className="text-sm">🔥</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      {item.tag && (
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {item.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-sm">{item.burnedETH} ETH</div>
                    <div className="text-xs text-muted-foreground">${item.burnedUSD}</div>
                    <div className="text-xs text-blue-500">{item.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-card border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">{t('burn.categories')}</h3>
              <span className="text-sm text-muted-foreground">
                {t('burn.period')}: {selectedPeriod}
              </span>
            </div>

            <div className="space-y-4">
              {formattedCategories.map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span className="font-semibold">{category.burned} ETH</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: category.percentage }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{category.transactionCount} 笔交易</span>
                    <span>{category.uniqueAddresses} 个地址</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

