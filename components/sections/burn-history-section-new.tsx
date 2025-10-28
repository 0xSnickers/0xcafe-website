'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Flame, Crown, RefreshCw, AlertCircle, Clock } from 'lucide-react'
import { useFormattedBurntFees } from '@/hooks/use-burnt-fees-rpc'
import { useBlocks } from '@/hooks/use-blocks'
import { useRanking, useCategories } from '@/hooks/use-ranking'

/**
 * Burn History Section - 燃烧记录展示
 * 展示区块燃烧记录和燃烧排行
 */
export function BurnHistorySection() {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = React.useState<'1h' | '1d' | '7d' | '30d'>('1d')

  const periods = [
    { id: '1h' as const, label: '1h' },
    { id: '1d' as const, label: '1d' },
    { id: '7d' as const, label: '7d' },
    { id: '30d' as const, label: '30d' },
  ]

  // 获取燃烧总量
  const {
    data: totalBurned,
    isLoading: totalLoading,
    error: totalError,
  } = useFormattedBurntFees(1, selectedPeriod)

  // 获取最近30个区块
  const {
    data: blocks,
    isLoading: blocksLoading,
    error: blocksError,
  } = useBlocks(1, 30)

  // 获取燃烧排行榜
  const {
    data: rankings,
    isLoading: rankingsLoading,
    error: rankingsError,
  } = useRanking(1, selectedPeriod, 15)

  // 获取燃烧类别统计
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories(1, selectedPeriod)

  const handlePeriodChange = React.useCallback((period: '1h' | '1d' | '7d' | '30d') => {
    setSelectedPeriod(period)
  }, [])

  const burnTotalData = React.useMemo(() => {
    if (!totalBurned) {
      return { amount: '0.00', rate: '0.00', avgBurnPerBlock: '0.00', avgGasUsedPercent: '0.00' }
    }
    
    return {
      amount: totalBurned.totalBurntedFormatted,
      rate: totalBurned.burnRateFormatted,
      avgBurnPerBlock: totalBurned.avgBurnPerBlockFormatted,
      avgGasUsedPercent: totalBurned.avgGasUsedPercent,
    }
  }, [totalBurned])

  const isLoading = totalLoading || blocksLoading || rankingsLoading || categoriesLoading
  const hasError = totalError || blocksError || rankingsError || categoriesError

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">{t('burn.history')}</h2>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="text-blue-500"
                >
                  <RefreshCw className="h-5 w-5" />
                </motion.div>
              ) : hasError ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
              )}
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => handlePeriodChange(period.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Burn Total & Recent Blocks */}
          <div className="space-y-6">
            {/* Burn Total Card */}
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
                    Current period: {selectedPeriod}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-500/30">
                  <div>
                    <div className="text-sm text-muted-foreground">Burn Rate</div>
                    <div className="text-lg font-semibold">{burnTotalData.rate} ETH/min</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg/Block</div>
                    <div className="text-lg font-semibold">{burnTotalData.avgBurnPerBlock} ETH</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Gas Usage</div>
                    <div className="text-lg font-semibold">{burnTotalData.avgGasUsedPercent}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Blocks</div>
                    <div className="text-lg font-semibold">{totalBurned?.blockCount || 0}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Blocks Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-card border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Latest Blocks</h3>
                {blocks && blocks.length > 0 && (
                  <span className="text-sm text-muted-foreground ml-auto">
                    ({blocks[0].blockAge})
                  </span>
                )}
              </div>

              {blocksLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading blocks...</div>
              ) : blocksError ? (
                <div className="text-center py-8 text-red-500">Failed to load blocks</div>
              ) : !blocks || blocks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No blocks found. Run: pnpm run sync:base-fees
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left text-muted-foreground">
                        <th className="pb-2 font-medium">Block</th>
                        <th className="pb-2 font-medium text-right">Gas Fee</th>
                        <th className="pb-2 font-medium text-right">Burnt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {blocks.slice(0, 10).map((block) => (
                        <tr key={block.blockNumber} className="hover:bg-muted/50">
                          <td className="py-2 font-mono text-xs">
                            #{block.blockNumber.toLocaleString()}
                          </td>
                          <td className="py-2 text-right font-mono text-xs">
                            {block.baseFeeGwei} Gwei
                          </td>
                          <td className="py-2 text-right font-mono text-xs text-orange-500">
                            {block.burntFeesEth} ETH
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>

          {/* Middle Column - Burn Rankings */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-card border h-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">Burn Rankings</h3>
              </div>

              {rankingsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading rankings...</div>
              ) : rankingsError ? (
                <div className="text-center py-8 text-red-500">Failed to load rankings</div>
              ) : !rankings || rankings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No ranking data</div>
              ) : (
                <div className="space-y-3">
                  {rankings.map((item) => (
                    <div
                      key={item.address}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                          {item.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.name}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                              {item.category}
                            </span>
                            <span>{item.transactionCount} txs</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-orange-500">{item.totalBurntEth} ETH</div>
                        <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Categories */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-card border h-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Burn Categories</h3>
              </div>

              {categoriesLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
              ) : categoriesError ? (
                <div className="text-center py-8 text-red-500">Failed to load categories</div>
              ) : !categories || categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No category data</div>
              ) : (
                <div className="space-y-4">
                  {categories.map((item) => {
                    const categoryColors: Record<string, string> = {
                      DEFI: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
                      MEV: 'from-red-500/20 to-red-600/20 border-red-500/50',
                      XEN: 'from-green-500/20 to-green-600/20 border-green-500/50',
                      NFT: 'from-purple-500/20 to-purple-600/20 border-purple-500/50',
                      L2: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50',
                      STABLECOIN: 'from-teal-500/20 to-teal-600/20 border-teal-500/50',
                      OTHER: 'from-gray-500/20 to-gray-600/20 border-gray-500/50',
                    }

                    const colorClass = categoryColors[item.category] || categoryColors.OTHER

                    return (
                      <div
                        key={item.category}
                        className={`p-4 rounded-lg bg-gradient-to-br ${colorClass} border`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">{item.category}</div>
                          <div className="text-lg font-bold text-orange-500">
                            {item.totalBurntEth} ETH
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{item.transactionCount.toLocaleString()} txs</span>
                          <span>{item.percentage}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-2 h-1.5 bg-background/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500/80 transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

