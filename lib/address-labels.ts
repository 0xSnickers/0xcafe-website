/**
 * 地址标签映射
 * 用于将合约地址映射到名称和类别
 */

export interface AddressLabel {
  name: string
  category: string
}

/**
 * 常见地址标签映射
 * 从知名项目和合约收集
 */
export const ADDRESS_LABELS: Record<string, AddressLabel> = {
  // === DeFi 协议 ===
  // Uniswap
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': {
    name: 'Uniswap V2 Router',
    category: 'DEFI',
  },
  '0xe592427a0aece92de3edee1f18e0157c05861564': {
    name: 'Uniswap V3 Router',
    category: 'DEFI',
  },
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': {
    name: 'Uniswap V3 Router 2',
    category: 'DEFI',
  },
  
  // 1inch
  '0x1111111254eeb25477b68fb85ed929f73a960582': {
    name: '1inch V5 Router',
    category: 'DEFI',
  },
  '0x1111111254760f7ab3f16433eea9304126dcd199': {
    name: '1inch V4 Router',
    category: 'DEFI',
  },
  
  // 0x Protocol
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff': {
    name: '0x Exchange Proxy',
    category: 'DEFI',
  },
  
  // Curve
  '0x99a58482bd75cbab83b27ec03ca68ff489b5788f': {
    name: 'Curve Router',
    category: 'DEFI',
  },
  
  // Balancer
  '0xba12222222228d8ba445958a75a0704d566bf2c8': {
    name: 'Balancer Vault',
    category: 'DEFI',
  },
  
  // Sushiswap
  '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f': {
    name: 'Sushiswap Router',
    category: 'DEFI',
  },

  // === 稳定币 ===
  '0xdac17f958d2ee523a2206206994597c13d831ec7': {
    name: 'Tether USDT',
    category: 'STABLECOIN',
  },
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
    name: 'USD Coin',
    category: 'STABLECOIN',
  },
  '0x6b175474e89094c44da98b954eedeac495271d0f': {
    name: 'Dai Stablecoin',
    category: 'STABLECOIN',
  },
  '0x4fabb145d64652a948d72533023f6e7a623c7c53': {
    name: 'Binance USD',
    category: 'STABLECOIN',
  },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': {
    name: 'Wrapped BTC',
    category: 'STABLECOIN',
  },

  // === MEV ===
  '0xbeef690d32f15e8d0ad5e2817c8c0f5c62b26df4': {
    name: 'MEV Bot 1',
    category: 'MEV',
  },
  '0x0000000000071821e8033345a7be174647be0706': {
    name: 'MEV Bot 2',
    category: 'MEV',
  },
  '0xa69babef1ca67a37ffaf7a485dfff3382056e78c': {
    name: 'MEV Bot 3',
    category: 'MEV',
  },

  // === XEN ===
  '0x06450dee7fd2fb8e39061434babcfc05599a6fb8': {
    name: 'XEN Crypto',
    category: 'XEN',
  },

  // === NFT 市场 ===
  '0x00000000006c3852cbef3e08e8df289169ede581': {
    name: 'OpenSea Seaport',
    category: 'NFT',
  },
  '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b': {
    name: 'Blur',
    category: 'NFT',
  },
  '0x7f268357a8c2552623316e2562d90e642bb538e5': {
    name: 'OpenSea Registry',
    category: 'NFT',
  },
  '0x1e0049783f008a0085193e00003d00cd54003c71': {
    name: 'OpenSea Conduit',
    category: 'NFT',
  },

  // === Layer 2 桥接 ===
  '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f': {
    name: 'Arbitrum One Gateway',
    category: 'L2',
  },
  '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1': {
    name: 'Optimism Gateway',
    category: 'L2',
  },
  '0x735adbbe72226bd52e818e7181953f42e3b0ff21': {
    name: 'Base Bridge',
    category: 'L2',
  },
  '0xa3a7b6f88361f48403514059f1f16c8e78d60eec': {
    name: 'Arbitrum Nova Bridge',
    category: 'L2',
  },
  '0x3154cf16ccdb4c6c922834f2589f5db27b1b5c12': {
    name: 'Optimism Bridge 2',
    category: 'L2',
  },

  // === 中心化交易所 ===
  '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be': {
    name: 'Binance',
    category: 'EXCHANGE',
  },
  '0x28c6c06298d514db089934071355e5743bf21d60': {
    name: 'Binance 2',
    category: 'EXCHANGE',
  },
  '0x21a31ee1afc51d94c2efccaa2092ad1028285549': {
    name: 'Binance 3',
    category: 'EXCHANGE',
  },
  '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503': {
    name: 'Coinbase',
    category: 'EXCHANGE',
  },
  '0x503828976d22510aad0201ac7ec88293211d23da': {
    name: 'Kraken',
    category: 'EXCHANGE',
  },

  // === 其他 ===
  '0x00000000000c2e074ec69a0dfb2707bef5e0e1c5': {
    name: 'ENS Registry',
    category: 'OTHER',
  },
  '0x0000000000000000000000000000000000000000': {
    name: 'Native Transfer',
    category: 'OTHER',
  },
}

/**
 * 类别定义（包含图标和颜色）
 */
export const CATEGORIES = {
  DEFI: { 
    name: 'DeFi', 
    icon: '🏦', 
    color: '#3B82F6',
    description: '去中心化金融协议'
  },
  STABLECOIN: { 
    name: 'Stablecoin', 
    icon: '💵', 
    color: '#10B981',
    description: '稳定币合约'
  },
  MEV: { 
    name: 'MEV', 
    icon: '🤖', 
    color: '#F59E0B',
    description: 'MEV 机器人'
  },
  XEN: { 
    name: 'XEN', 
    icon: '💎', 
    color: '#8B5CF6',
    description: 'XEN Crypto'
  },
  NFT: { 
    name: 'NFT', 
    icon: '🎨', 
    color: '#EC4899',
    description: 'NFT 市场和交易'
  },
  L2: { 
    name: 'Layer 2', 
    icon: '🌉', 
    color: '#6366F1',
    description: 'Layer 2 桥接'
  },
  EXCHANGE: { 
    name: 'Exchange', 
    icon: '🏢', 
    color: '#EF4444',
    description: '中心化交易所'
  },
  OTHER: { 
    name: 'Other', 
    icon: '📦', 
    color: '#6B7280',
    description: '其他合约'
  },
} as const

export type CategoryKey = keyof typeof CATEGORIES

/**
 * 根据地址获取标签
 */
export function getAddressLabel(address: string): AddressLabel {
  const normalizedAddress = address.toLowerCase()
  return (
    ADDRESS_LABELS[normalizedAddress] || {
      name: address.slice(0, 10) + '...',
      category: 'OTHER',
    }
  )
}

/**
 * 批量获取标签
 */
export function getAddressLabels(addresses: string[]): Map<string, AddressLabel> {
  const labels = new Map<string, AddressLabel>()
  addresses.forEach((address) => {
    labels.set(address, getAddressLabel(address))
  })
  return labels
}

