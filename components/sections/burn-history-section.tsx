'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Flame, Crown, Clock } from 'lucide-react'
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
      amount: totalBurned.totalBurnedFormatted,
      rate: totalBurned.burnRateFormatted,
      avgBurnPerBlock: totalBurned.avgBurnPerBlockFormatted,
      avgGasUsedPercent: totalBurned.avgGasUsedPercent,
    }
  }, [totalBurned])

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">{t('burn.history')}</h2>
            
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Burn Total & Recent Blocks */}
          <div className="flex flex-col gap-6" style={{ minHeight: '400px' }}>
            {/* Burn Total Card - 简洁版 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">{t('burn.totalBurned')}</h3>
                <span className="text-sm text-muted-foreground ml-auto">{t('burn.period')} {selectedPeriod}</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-orange-500">
                    {burnTotalData.amount} <span className="text-xl">ETH</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">{t('burn.burnRate')}</div>
                    <div className="font-semibold">{burnTotalData.rate} ETH/min</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{t('burn.avgPerBlock')}</div>
                    <div className="font-semibold">{burnTotalData.avgBurnPerBlock} ETH</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Blocks Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-card border flex flex-col flex-1"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">{t('burn.recentBlocks')}</h3>
                {blocks && blocks.length > 0 && (
                  <span className="text-sm text-muted-foreground ml-auto">
                    {blocks[0].blockAge}
                  </span>
                )}
              </div>

              {blocksLoading ? (
                <div className="text-center py-8 text-muted-foreground flex-1 flex items-center justify-center">{t('burn.loading')}</div>
              ) : blocksError ? (
                <div className="text-center py-8 text-red-500 flex-1 flex items-center justify-center">{t('burn.failed')}</div>
              ) : !blocks || blocks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs flex-1 flex items-center justify-center">
                  {t('burn.noBlocks')}
                </div>
              ) : (
                <div className="overflow-auto flex-1">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-card border-b">
                      <tr className="text-left text-muted-foreground">
                        <th className="pb-2 font-medium">{t('burn.table.block')}</th>
                        <th className="pb-2 font-medium text-right">{t('burn.table.gasFee')}</th>
                        <th className="pb-2 font-medium text-right">{t('burn.table.burnt')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {blocks.map((block) => (
                        <tr key={block.blockNumber} className="hover:bg-muted/50">
                          <td className="py-2 font-mono">
                            #{block.blockNumber.toLocaleString()}
                          </td>
                          <td className="py-2 text-right font-mono">
                            {block.baseFeeGwei}
                          </td>
                          <td className="py-2 text-right font-mono text-orange-500">
                            {block.burntFeesEth}
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
          <div className="flex flex-col h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-card border flex flex-col"
              style={{ height: '100%', minHeight: '400px' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">{t('burn.rankings')}</h3>
              </div>

              {rankingsLoading ? (
                <div className="text-center py-8 text-muted-foreground flex-1 flex items-center justify-center">{t('burn.loading')}</div>
              ) : rankingsError ? (
                <div className="text-center py-8 text-red-500 flex-1 flex items-center justify-center">{t('burn.failed')}</div>
              ) : !rankings || rankings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex-1 flex items-center justify-center">{t('burn.noData')}</div>
              ) : (
                <div className="space-y-2 overflow-auto flex-1">
                  {rankings.map((item) => (
                    <div
                      key={item.address}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                          {item.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate text-sm">{item.name}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="px-1 py-0.5 rounded bg-primary/20 text-primary text-[10px]">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-orange-500 text-sm">{item.totalBurntEth}</div>
                        <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Categories */}
          <div className="flex flex-col h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-card border flex flex-col"
              style={{ height: '100%', minHeight: '400px' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">{t('burn.categories')}</h3>
              </div>

              {categoriesLoading ? (
                <div className="text-center py-8 text-muted-foreground flex-1 flex items-center justify-center">{t('burn.loading')}</div>
              ) : categoriesError ? (
                <div className="text-center py-8 text-red-500 flex-1 flex items-center justify-center">{t('burn.failed')}</div>
              ) : !categories || categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex-1 flex items-center justify-center">{t('burn.noData')}</div>
              ) : (
                <div className="space-y-3 overflow-auto flex-1">
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
                        className={`p-3 rounded-lg bg-gradient-to-br ${colorClass} border`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-sm">{item.category}</div>
                          <div className="text-base font-bold text-orange-500">
                            {item.totalBurntEth}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>{item.transactionCount.toLocaleString()} txs</span>
                          <span>{item.percentage}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1 bg-background/50 rounded-full overflow-hidden">
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

