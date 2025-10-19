'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Flame, Crown } from 'lucide-react'

/**
 * Burn History Section - 燃烧记录展示
 * 展示区块燃烧记录和燃烧排行
 */
export function BurnHistorySection() {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = React.useState('5m')

  const periods = [
    { id: '30s', label: '30s' },
    { id: '1m', label: '1m' },
    { id: '5m', label: '5m' },
    { id: '1h', label: '1h' },
    { id: '1d', label: '1d' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
  ]

  // Mock data
  const burnTotalData = {
    amount: '0.076',
    rate: '0.152',
  }

  const blocks = [
    { number: '#23,603,056', gas: '0.116', burned: '0.005' },
    { number: '#23,603,055', gas: '0.122', burned: '0.002' },
    { number: '#23,603,054', gas: '0.124', burned: '0.002' },
    { number: '#23,603,053', gas: '0.124', burned: '0.003' },
    { number: '#23,603,052', gas: '0.128', burned: '0.002' },
    { number: '#23,603,051', gas: '0.129', burned: '0.003' },
  ]

  const burnRankings = [
    { name: 'Native Transfer', burned: '0.006', time: '5m' },
    { name: 'Tether: USDT Stablecoin', tag: 'DEFI', burned: '0.005', time: '5m' },
    { name: 'XEN Batch Minter', tag: 'XEN', burned: '0.004', time: '5m' },
    { name: 'Uniswap V2: Router 2', tag: 'DEFI', burned: '0.003', time: '5m' },
    { name: 'USDC', tag: 'DEFI', burned: '0.002', time: '5m' },
    { name: 'Okex: Dex Router', tag: 'DEFI', burned: '0.001', time: '5m' },
    { name: 'Binance: Dex Router', tag: 'DEFI', burned: '0.001', time: '5m' },
    { name: 'New Contract', burned: '0.001', time: '5m' },
  ]

  const burnCategories = [
    { name: 'DEFI', burned: '0.021' },
    { name: 'XEN', burned: '0.005' },
    { name: 'MEV', burned: '0.003' },
    { name: 'NFT', burned: '0.001' },
    { name: 'L2', burned: '0' },
  ]

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Period Selector */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-sm font-medium mr-2">{t('burn.period')}:</span>
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-8">{t('burn.title')}</h2>

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
                {blocks.map((block) => (
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
              {burnRankings.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {item.name === 'Native Transfer' ? (
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
                    <div className="font-semibold text-sm">{item.burned} ETH</div>
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
              {burnCategories.map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span className="font-semibold">{category.burned} ETH</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(parseFloat(category.burned) / 0.03) * 100}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                    />
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

