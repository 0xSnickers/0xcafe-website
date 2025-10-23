# HTTP 请求模块

基于 axios 的简洁请求封装，提供统一的 API 调用接口。

## 特性

- 🚀 基于 axios，性能优异
- 🔄 自动重试机制
- 📝 请求/响应拦截器
- 🎯 统一的错误处理
- 📍 集中的端点管理
- 🔧 灵活的配置选项

## 快速开始

### 1. 基本使用

```typescript
import { httpClient } from '@/lib/request'

// GET 请求
const response = await httpClient.get('/api/users')

// POST 请求
const response = await httpClient.post('/api/users', { name: 'John' })

// 带配置的请求
const response = await httpClient.get('/api/data', {
  timeout: 5000,
  headers: { 'Custom-Header': 'value' }
})
```

### 2. 使用端点管理

```typescript
import { httpClient, getGasEndpoint, getBurnHistoryEndpoint } from '@/lib/request'

// 使用预定义的端点
const gasEndpoint = getGasEndpoint('1') // /api/gas?chainid=1
const response = await httpClient.get(gasEndpoint)

// 燃烧历史端点
const historyEndpoint = getBurnHistoryEndpoint('1', 100, '1d')
const history = await httpClient.get(historyEndpoint)
```

### 3. 创建自定义客户端

```typescript
import { HttpClient } from '@/lib/request'

const customClient = new HttpClient('https://api.example.com', {
  timeout: 15000,
  retries: 5,
  retryDelay: 2000,
  headers: {
    'Authorization': 'Bearer token'
  }
})

const response = await customClient.get('/data')
```

## API 端点管理

### 内部 API 端点

```typescript
import { 
  getGasEndpoint,
  getBurnHistoryEndpoint,
  getBurnRankingEndpoint,
  getTotalBurnedEndpoint,
  getBurnCategoriesEndpoint,
  getLatestBlockEndpoint
} from '@/lib/request'

// Gas 价格
const gasEndpoint = getGasEndpoint('1') // /api/gas?chainid=1

// 燃烧历史
const historyEndpoint = getBurnHistoryEndpoint('1', 100, '1d')
// /api/burn-history?chainid=1&limit=100&period=1d

// 燃烧排行
const rankingEndpoint = getBurnRankingEndpoint('1', 50, '3h')
// /api/burn-ranking?chainid=1&limit=50&period=3h

// 燃烧总量
const totalEndpoint = getTotalBurnedEndpoint('1', '1d')
// /api/total-burned?chainid=1&period=1d

// 燃烧类别
const categoriesEndpoint = getBurnCategoriesEndpoint('1', 50)
// /api/burn-categories?chainid=1&limit=50

// 最新区块
const blockEndpoint = getLatestBlockEndpoint('1')
// /api/blocks/latest?chainid=1
```

### 外部 API 端点

```typescript
import { getExternalEndpoint } from '@/lib/request'

// Alchemy API
const alchemyUrl = getExternalEndpoint('ALCHEMY', 'ethereum')
// https://eth-mainnet.g.alchemy.com/v2

// Etherscan API
const etherscanUrl = getExternalEndpoint('ETHERSCAN', 'ethereum')
// https://api.etherscan.io/v2/api
```

## 配置选项

### 默认配置

```typescript
const DEFAULT_REQUEST_CONFIG = {
  timeout: 10000,        // 10秒超时
  retries: 3,            // 重试3次
  retryDelay: 1000,      // 重试延迟1秒
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': '0xcafe-website/1.0.0',
  },
  validateStatus: (status) => status < 500, // 只对 5xx 状态码抛出错误
  maxRedirects: 5,
  withCredentials: false,
}
```

### 自定义配置

```typescript
// 更新全局配置
httpClient.updateConfig({
  timeout: 15000,
  retries: 5,
  retryDelay: 2000
})

// 设置基础 URL
httpClient.setBaseURL('https://api.example.com')
```

## 错误处理

### 自动重试

- 5xx 服务器错误
- 网络超时错误
- 可配置重试次数和延迟

### 错误类型

```typescript
import { RequestError } from '@/lib/request'

try {
  const response = await httpClient.get('/api/data')
} catch (error) {
  if (error instanceof RequestError) {
    console.error('Status:', error.status)
    console.error('Message:', error.message)
    console.error('Data:', error.data)
  }
}
```

## 拦截器

### 请求拦截器

自动添加请求日志和通用头部。

### 响应拦截器

- 自动检查 API 响应状态
- 统一错误处理
- 自动重试逻辑

## 服务集成

### Gas API 服务

```typescript
import { GasApiService } from '@/services/gas-api'

const gasService = new GasApiService()

// 获取 Gas 价格
const gasPrice = await gasService.getGasPrice('ethereum')

// 获取燃烧历史
const burnHistory = await gasService.getBurnHistory('ethereum', 100, '1d')
```

## 最佳实践

1. **使用端点管理函数**：不要硬编码 API 路径
2. **统一错误处理**：使用 try-catch 处理请求错误
3. **合理设置超时**：根据接口特性设置合适的超时时间
4. **利用重试机制**：对不稳定的接口启用重试
5. **使用类型安全**：充分利用 TypeScript 类型检查

## 迁移指南

### 从 fetch 迁移

**之前：**
```typescript
const response = await fetch('/api/gas?chainid=1')
const data = await response.json()
```

**之后：**
```typescript
import { httpClient, getGasEndpoint } from '@/lib/request'

const endpoint = getGasEndpoint('1')
const data = await httpClient.get(endpoint)
```

### 从旧请求客户端迁移

**之前：**
```typescript
import { HttpClient } from '@/lib/request/client'

const client = new HttpClient()
const response = await client.get('/api/data', { param: 'value' })
```

**之后：**
```typescript
import { httpClient } from '@/lib/request'

const response = await httpClient.get('/api/data', { params: { param: 'value' } })
```
