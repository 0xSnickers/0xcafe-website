'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { Rocket, Zap, Activity, Turtle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * Gas Price Section - 实时Gas价格展示
 * 参考MCT设计，展示不同速度档位的Gas价格
 */
export function GasPriceSection() {
  const { t } = useTranslation()
  const [selectedCoin, setSelectedCoin] = React.useState('eth')
  const [eip1559Enabled, setEip1559Enabled] = React.useState(true)
  const [currency, setCurrency] = React.useState('USD')

  // 币种配置列表，包含 chain id
  const coins = [
    { 
      id: 'eth', 
      name: 'Ethereum', 
      symbol: 'ETH',
      image: '/coins/eth.png', 
      chainId: 1,
      chainName: 'Ethereum Mainnet'
    },
    { 
      id: 'bsc', 
      name: 'BSC', 
      symbol: 'BNB',
      image: '/coins/bsc.png', 
      chainId: 56,
      chainName: 'BSC Mainnet'
    },
    { 
      id: 'polygon', 
      name: 'Polygon', 
      symbol: 'MATIC',
      image: '/coins/polygon.png', 
      chainId: 137,
      chainName: 'Polygon Mainnet'
    },
    { 
      id: 'arbitrum', 
      name: 'Arbitrum', 
      symbol: 'ETH',
      image: '/coins/arbitrum.png', 
      chainId: 42161,
      chainName: 'Arbitrum One'
    },
    { 
      id: 'base', 
      name: 'Base', 
      symbol: 'ETH',
      image: '/coins/base.png', 
      chainId: 8453,
      chainName: 'Base Mainnet'
    },
    { 
      id: 'op', 
      name: 'Optimism', 
      symbol: 'ETH',
      image: '/coins/op.png', 
      chainId: 10,
      chainName: 'Optimism Mainnet'
    },
  ]

  const selectedCoinData = coins.find(coin => coin.id === selectedCoin) || coins[0]

  // Mock data - 实际应用中应该从API获取
  const gasPrices = [
    {
      id: 'fastest',
      icon: Rocket,
      iconColor: 'text-green-500',
      bgColor: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/50',
      label: t('gas.speed.fastest'),
      basePrice: '0.01',
      maxPrice: '0.23',
      gwei: '0.13',
      usd: '$0.01',
      time: '≈ 12秒',
    },
    {
      id: 'fast',
      icon: Zap,
      iconColor: 'text-orange-500',
      bgColor: 'from-orange-500/20 to-orange-600/20',
      borderColor: 'border-orange-500',
      label: t('gas.speed.fast'),
      basePrice: '0.01',
      maxPrice: '0.22',
      gwei: '0.13',
      usd: '$0.01',
      time: '≈ 48秒',
      featured: true,
    },
    {
      id: 'normal',
      icon: Activity,
      iconColor: 'text-blue-500',
      bgColor: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/50',
      label: t('gas.speed.normal'),
      basePrice: '0.01',
      maxPrice: '0.21',
      gwei: '0.13',
      usd: '$0.01',
      time: '≈ 2分钟',
    },
    {
      id: 'slow',
      icon: Turtle,
      iconColor: 'text-purple-500',
      bgColor: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/50',
      label: t('gas.speed.slow'),
      basePrice: '0.01',
      maxPrice: '0.21',
      gwei: '0.13',
      usd: '$0.01',
      time: '≈ 3分钟',
    },
  ]


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
                {coins.map((coin) => (
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
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    eip1559Enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm font-medium">货币</span>
            </div>

            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[120px] justify-between">
                  <div className="flex items-center gap-2">
                    <span>{currency === 'USD' ? '$' : '￥'}</span>
                    <span>{currency}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => setCurrency('USD')}
                  className="flex items-center gap-2 p-2"
                >
                  <span>$</span>
                  <span>USD</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrency('CNY')}
                  className="flex items-center gap-2 p-2"
                >
                  <span>￥</span>
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
          </div>
          <p className="text-lg text-muted-foreground">
            {selectedCoinData.chainName} • Chain ID: {selectedCoinData.chainId}
          </p>
        </motion.div>

        {/* Gas Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {gasPrices.map((gas, index) => (
            <motion.div
              key={gas.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div
                className={`relative p-6 rounded-2xl border ${gas.borderColor} bg-gradient-to-br ${gas.bgColor} backdrop-blur-sm ${
                  gas.featured ? 'ring-2 ring-orange-500 shadow-xl shadow-orange-500/20' : ''
                }`}
              >
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                  <gas.icon className={`h-8 w-8 ${gas.iconColor}`} />
                </div>

                {/* Label */}
                <h3 className="text-center text-lg font-semibold mb-4">
                  {gas.label}
                </h3>

                {/* Price */}
                <div className="text-center mb-4">
                  <div className={`text-5xl font-bold mb-2 ${gas.iconColor}`}>
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
                    {currency === 'USD' ? '$' : '￥'}{gas.usd.replace('$', '')}
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
            <span className="mr-2">{selectedCoinData.symbol} Price:</span>
            <span className="font-semibold text-foreground">
              {currency === 'USD' ? '$' : '￥'}3896.64
            </span>
          </div>
          <div>
            <span className="mr-2">{t('gas.baseGasPrice')}:</span>
            <span className="font-semibold text-foreground">0.13 Gwei</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

