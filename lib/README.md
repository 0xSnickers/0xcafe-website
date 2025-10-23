# 链配置管理

本项目使用统一的链配置管理，所有链相关的配置都集中在 `lib/chains.ts` 中。

## 使用方法

### 1. 导入链配置

```typescript
import { 
  getChainConfig, 
  getAllChains, 
  getAlchemyEndpointURL,
  SupportedChain 
} from '@/lib'
```

### 2. 获取链配置

```typescript
// 根据链类型获取配置
const ethereumConfig = getChainConfig('ethereum')

// 根据链 ID 获取配置
const config = getChainConfigById(1)

// 获取所有链配置
const allChains = getAllChains()
```

### 3. 获取 Alchemy 端点

```typescript
// 根据链类型获取 Alchemy 端点
const alchemyUrl = getAlchemyEndpointURL('ethereum')

// 根据链 ID 获取 Alchemy 端点
const alchemyUrl = getAlchemyEndpointURLById('1')
```

### 4. 链配置属性

每个链配置包含以下属性：

```typescript
interface ChainConfig {
  id: number              // 链 ID
  name: string           // 链名称
  symbol: string         // 代币符号
  rpcUrl: string         // RPC URL
  explorerUrl: string    // 浏览器 URL
  apiKey: string         // API 密钥
  alchemyChainName: string // Alchemy 链名称
  color: string          // 链颜色
  icon: string           // 图标路径
}
```

### 5. 支持的链

- `ethereum` - 以太坊主网
- `polygon` - Polygon 网络
- `bsc` - BSC 网络
- `arbitrum` - Arbitrum 网络
- `base` - Base 网络
- `optimism` - Optimism 网络

### 6. 工具函数

```typescript
// 检查链是否支持
isSupportedChain('ethereum') // true

// 检查链 ID 是否支持
isSupportedChainId(1) // true

// 获取链显示名称
getChainDisplayName('ethereum') // 'Ethereum'

// 获取链符号
getChainSymbol('ethereum') // 'ETH'

// 获取链浏览器 URL
getChainExplorerUrl('ethereum') // 'https://etherscan.io'

// 获取链颜色
getChainColor('ethereum') // '#627EEA'

// 获取链图标
getChainIcon('ethereum') // '/coins/eth.png'
```

## 迁移指南

### 从旧配置迁移

1. 将 `lib/request/types.ts` 中的 `ChainConfig` 和 `SupportedChain` 替换为从 `@/lib` 导入
2. 将 `lib/request/config.ts` 中的 `CHAIN_CONFIGS` 替换为从 `@/lib` 导入
3. 使用 `getChainConfig()` 函数替代直接访问配置对象

### 示例迁移

**之前：**
```typescript
import { SupportedChain } from '@/lib/request/types'
import { CHAIN_CONFIGS } from '@/lib/request/config'

const config = CHAIN_CONFIGS.ethereum
```

**之后：**
```typescript
import { getChainConfig, SupportedChain } from '@/lib'

const config = getChainConfig('ethereum')
```

## 注意事项

1. 所有链配置都从环境变量中读取 API 密钥
2. 新增链时需要在 `CHAIN_CONFIGS` 中添加配置
3. 确保 Alchemy 链名称与 Alchemy 文档中的名称一致
4. 图标路径相对于 `public` 目录
