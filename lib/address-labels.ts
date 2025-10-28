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
  // DeFi 协议
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': {
    name: 'Uniswap V2 Router',
    category: 'DEFI',
  },
  '0xE592427A0AEce92De3Edee1F18E0157C05861564': {
    name: 'Uniswap V3 Router',
    category: 'DEFI',
  },
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
    name: 'Tether USDT',
    category: 'STABLECOIN',
  },
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
    name: 'USD Coin',
    category: 'STABLECOIN',
  },
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': {
    name: 'Wrapped BTC',
    category: 'STABLECOIN',
  },

  // 中心化交易所
  '0x2678D7DD0B2f9cC88C6B7dEC4F6B3A5f3D5B5D5E': {
    name: 'Binance Hot Wallet',
    category: 'EXCHANGE',
  },
  '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE': {
    name: 'Binance',
    category: 'EXCHANGE',
  },
  '0x00000000000C2E074eC69A0dFb2707BEf5e0E1C5': {
    name: 'ENS Registry',
    category: 'OTHER',
  },

  // MEV
  '0xBEeF690d32F15E8d0Ad5e2817c8c0F5c62b26Df4': {
    name: 'MEV Bot',
    category: 'MEV',
  },

  // L2 桥接
  '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f': {
    name: 'Arbitrum Bridge',
    category: 'L2',
  },
  '0x3154Cf16ccdb4c6C922834f2589f5DB27B1b5C12': {
    name: 'Optimism Bridge',
    category: 'L2',
  },
  '0x4200000000000000000000000000000000000010': {
    name: 'Base L2',
    category: 'L2',
  },

  // NFT 市场
  '0x00000000006C3852cbEf3e08E8dF289169EdE581': {
    name: 'OpenSea',
    category: 'NFT',
  },
  '0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b': {
    name: 'Blur',
    category: 'NFT',
  },
}

/**
 * 类别定义
 */
export const CATEGORIES = {
  DEFI: 'DeFi 协议',
  STABLECOIN: '稳定币',
  EXCHANGE: '交易所',
  MEV: 'MEV 机器人',
  NFT: 'NFT 市场',
  L2: 'Layer 2',
  OTHER: '其他',
} as const

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

