'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { Zap, Activity, Turtle, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGasPrice } from '@/hooks/use-gas-data'
import { SupportedChain } from '@/lib/request/types'

// 币种配置
const COINS = [
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', image: '/coins/eth.png', chainId: 1, chainName: 'Ethereum Mainnet' },
  { id: 'bsc', name: 'BSC', symbol: 'BNB', image: '/coins/bsc.png', chainId: 56, chainName: 'BSC Mainnet' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', image: '/coins/polygon.png', chainId: 137, chainName: 'Polygon Mainnet' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ETH', image: '/coins/arbitrum.png', chainId: 42161, chainName: 'Arbitrum One' },
  { id: 'base', name: 'Base', symbol: 'ETH', image: '/coins/base.png', chainId: 8453, chainName: 'Base Mainnet' },
  { id: 'op', name: 'Optimism', symbol: 'ETH', image: '/coins/op.png', chainId: 10, chainName: 'Optimism Mainnet' },
] as const

// Gas 价格档位配置 - 简化为 3 档
const GAS_TIERS = [
  { id: 'low', icon: Turtle, colorClass: 'text-blue-500', bgGradient: 'from-blue-500/20 to-blue-600/20', borderColor: 'border-blue-500/50', timeEst: '≈ 2分钟', featured: false },
  { id: 'average', icon: Activity, colorClass: 'text-orange-500', bgGradient: 'from-orange-500/20 to-orange-600/20', borderColor: 'border-orange-500', timeEst: '≈ 1分钟', featured: true },
  { id: 'high', icon: Zap, colorClass: 'text-green-500', bgGradient: 'from-green-500/20 to-green-600/20', borderColor: 'border-green-500/50', timeEst: '≈ 30秒', featured: false },
] as const

/**
 * Gas Price Section - 实时Gas价格展示
 * 参考MCT设计，展示不同速度档位的Gas价格
 */
export function GasPriceSection() {
  const { t } = useTranslation()
  const [selectedCoin, setSelectedCoin] = React.useState('eth')
  const [eip1559Enabled, setEip1559Enabled] = React.useState(true)
  const [currency, setCurrency] = React.useState('USD')

  // 获取当前选中的链
  const currentChain = React.useMemo((): SupportedChain => {
    const coinMap: Record<string, SupportedChain> = {
      'eth': 'ethereum',
      'bsc': 'bsc',
      'polygon': 'polygon',
      'arbitrum': 'arbitrum',
      'base': 'base',
      'op': 'optimism',
    }
    return coinMap[selectedCoin] || 'ethereum'
  }, [selectedCoin])

  // 获取实时Gas数据
  const {
    data: gasData,
    isLoading: gasLoading,
    error: gasError,
    refetch: refetchGas,
    isFetching: gasFetching
  } = useGasPrice(currentChain, {
    refetchInterval: 15000, // 每15秒刷新
  })

  const selectedCoinData = COINS.find(coin => coin.id === selectedCoin) || COINS[0]

  // 计算Gas价格数据
  const gasPrices = React.useMemo(() => {
    if (!gasData) {
      // 返回默认占位数据
      return GAS_TIERS.map(tier => ({
        ...tier,
        label: t(`gas.speed.${tier.id}`) || tier.id,
        basePrice: '-.--',
        maxPrice: '-.--',
        gwei: '-.--',
        usd: '--',
        time: tier.timeEst,
      }))
    }

    // 简化的价格映射 - 对应 Low、Average、High
    const priceMap = {
      low: gasData.safe,
      average: gasData.propose,
      high: gasData.fast,
    }

    return GAS_TIERS.map(tier => {
      const price = priceMap[tier.id as keyof typeof priceMap]
      const multiplier = tier.id === 'high' ? 1.05 : tier.id === 'average' ? 1.02 : 1.01
      return {
        ...tier,
        label: t(`gas.speed.${tier.id}`) || tier.id.toUpperCase(),
        basePrice: price.toFixed(3),
        maxPrice: (price * multiplier).toFixed(3),
        gwei: price.toFixed(3),
        usd: (price * 0.0001).toFixed(4), // 简化的 USD 换算
        time: tier.timeEst,
      }
    })
  }, [gasData, t])

  // 网络状态
  const networkStatus = React.useMemo(() => {
    if (!gasData || gasData.gasUsedRatio.length === 0) return null
    const utilization = gasData.gasUsedRatio[0]
    if (utilization > 0.8) return { label: '拥堵', color: 'text-red-500' }
    if (utilization > 0.6) return { label: '繁忙', color: 'text-yellow-500' }
    return { label: '正常', color: 'text-green-500' }
  }, [gasData])

  return (
    <section className="py-24 px-4 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          {/* Coin Selector */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[200px] justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={selectedCoinData.image}
                      alt={selectedCoinData.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span>{selectedCoinData.name}</span>
                    <span className="text-muted-foreground">({selectedCoinData.symbol})</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {COINS.map((coin) => (
                  <DropdownMenuItem
                    key={coin.id}
                    onClick={() => setSelectedCoin(coin.id)}
                    className="flex items-center gap-3 p-3"
                  >
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{coin.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {coin.symbol} • Chain ID: {coin.chainId}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* EIP-1559 Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">EIP-1559</span>
              <button
                onClick={() => setEip1559Enabled(!eip1559Enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  eip1559Enabled ? 'bg-orange-500' : 'bg-gray-600'
                }`}
                aria-label="Toggle EIP-1559"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    eip1559Enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[120px] justify-between">
                  <div className="flex items-center gap-2">
                    <span>{currency === 'USD' ? '$' : '¥'}</span>
                    <span>{currency}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setCurrency('USD')} className="flex items-center gap-2 p-2">
                  <span>$</span>
                  <span>USD</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency('CNY')} className="flex items-center gap-2 p-2">
                  <span>¥</span>
                  <span>CNY</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src={selectedCoinData.image}
              alt={selectedCoinData.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-4xl md:text-5xl font-bold">
              {selectedCoinData.name} {t('gas.title')}
            </h1>

            {/* 实时状态指示器 */}
            <div className="flex items-center gap-2">
              {gasLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="text-blue-500"
                >
                  <RefreshCw className="h-5 w-5" />
                </motion.div>
              ) : gasError ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
              )}

              {/* 手动刷新按钮 - 只显示图标 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetchGas()}
                disabled={gasFetching}
                className="w-8 h-8 p-0"
                title="刷新Gas数据"
              >
                <RefreshCw className={`h-4 w-4 ${gasFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <p className="text-lg text-muted-foreground">
            {selectedCoinData.chainName} • Chain ID: {selectedCoinData.chainId}
          </p>

          {/* 实时数据状态 */}
          {gasData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-muted-foreground"
            >
              <span>最后更新: {new Date(gasData.timestamp).toLocaleTimeString()}</span>
              <span className="mx-2">•</span>
              <span>区块: #{gasData.lastBlock.toLocaleString()}</span>
            </motion.div>
          )}

          {/* 错误提示 */}
          {gasError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500"
            >
              <div className="flex items-center gap-2 justify-center">
                <AlertCircle className="h-5 w-5" />
                <span>加载 Gas 数据失败，请稍后重试</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Gas Price Cards - 3列布局 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {gasPrices.map((gas, index) => (
            <motion.div
              key={gas.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div
                className={`relative p-6 rounded-2xl border ${gas.borderColor} bg-gradient-to-br ${gas.bgGradient} backdrop-blur-sm ${
                  gas.featured ? 'ring-2 ring-orange-500 shadow-xl shadow-orange-500/20' : ''
                }`}
              >
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                  <gas.icon className={`h-8 w-8 ${gas.colorClass}`} />
                </div>

                {/* Label */}
                <h3 className="text-center text-lg font-semibold mb-4">
                  {gas.label}
                </h3>

                {/* Price */}
                <div className="text-center mb-4">
                  <div className={`text-5xl font-bold mb-2 ${gas.colorClass}`}>
                    {gas.gwei}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      {t('gas.basePrice')}: <span className="text-foreground">{gas.basePrice}</span>
                    </div>
                    <div>
                      {t('gas.maxPrice')}: <span className="text-foreground">{gas.maxPrice}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Details */}
                <div className="text-center space-y-2">
                  <div className="text-xl font-semibold">
                    {currency === 'USD' ? '$' : '¥'}{gas.usd}
                  </div>
                  <div className="text-sm text-muted-foreground">{gas.time}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chain Price Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div>
            <span className="mr-2">{t('gas.baseGasPrice')}:</span>
            <span className="font-semibold text-foreground">
              {gasData ? `${gasData.baseFee.toFixed(2)} Gwei` : '-.-- Gwei'}
            </span>
          </div>
          {gasData && gasData.gasUsedRatio.length > 0 && (
            <>
              <div>
                <span className="mr-2">Gas使用率:</span>
                <span className="font-semibold text-foreground">
                  {(gasData.gasUsedRatio[0] * 100).toFixed(1)}%
                </span>
              </div>
              {networkStatus && (
                <div>
                  <span className="mr-2">网络状态:</span>
                  <span className={`font-semibold ${networkStatus.color}`}>
                    {networkStatus.label}
                  </span>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
