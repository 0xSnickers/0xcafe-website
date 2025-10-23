# HTTP 模块使用指南

这个模块提供了统一的 HTTP 请求封装，简化了 API 路由的开发。

## 特性

- 🚀 基于 axios 的高性能请求客户端
- 🔄 自动重试机制
- 🌐 代理支持
- 📝 统一的错误处理
- 🎯 类型安全
- 🔧 简洁的 API 设计

## 快速开始

### 1. 基础使用

```typescript
import { GasApiService, successResponse, errorResponse } from '@/backend/http'

export async function GET(request: NextRequest) {
  try {
    const gasData = await GasApiService.getGasPrice('1')
    return successResponse(gasData)
  } catch (error) {
    return errorResponse('Failed to fetch gas data')
  }
}
```

### 2. 可用的 API 服务

#### Gas API 服务
```typescript
import { GasApiService } from '@/backend/http'

// 获取 Gas 价格（自动选择最佳提供商）
const gasData = await GasApiService.getGasPrice('1')

// 使用特定提供商
const alchemyGas = await GasApiService.getGasPriceFromAlchemy('1')
const infuraGas = await GasApiService.getGasPriceFromInfura('1')
```

#### 区块 API 服务
```typescript
import { BlockApiService } from '@/backend/http'

// 获取最新区块
const blocks = await BlockApiService.getLatestBlocks('1', 10)

// 使用特定提供商
const alchemyBlocks = await BlockApiService.getLatestBlocksFromAlchemy('1', 10)
const etherscanBlocks = await BlockApiService.getLatestBlocksFromEtherscan('1', 10)
```

#### 燃烧数据 API 服务
```typescript
import { BurnDataApiService } from '@/backend/http'

// 获取燃烧历史
const history = await BurnDataApiService.getBurnHistory('1', 10, '5m')

// 获取燃烧排名
const ranking = await BurnDataApiService.getBurnRanking('1', 50, '3h')

// 获取总燃烧量
const total = await BurnDataApiService.getTotalBurned('1', '5m')

// 获取燃烧类别
const categories = await BurnDataApiService.getBurnCategories('1', 50)
```

### 3. 响应处理

```typescript
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse,
  handleApiError 
} from '@/backend/http'

// 成功响应
return successResponse(data, 'OK')

// 错误响应
return errorResponse('Something went wrong', 'Error details')

// 验证错误
return validationErrorResponse('Invalid parameters')

// 自动错误处理
try {
  const data = await someApiCall()
  return successResponse(data)
} catch (error) {
  return handleApiError(error)
}
```

### 4. 参数验证

```typescript
import { 
  validateChainId, 
  validatePeriod, 
  validateLimit,
  SUPPORTED_CHAIN_IDS,
  PERIODS 
} from '@/backend/http'

// 验证链 ID
if (!validateChainId(chainId, SUPPORTED_CHAIN_IDS)) {
  return validationErrorResponse('Invalid chain ID')
}

// 验证时间段
if (!validatePeriod(period, PERIODS)) {
  return validationErrorResponse('Invalid period')
}

// 验证限制参数
if (!validateLimit(limit, 1, 100)) {
  return validationErrorResponse('Invalid limit')
}
```

## 配置

### 环境变量

```bash
# Alchemy API
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# Etherscan API
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key

# Infura API
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key

# 代理配置（可选）
HTTPS_PROXY=http://proxy:port
HTTP_PROXY=http://proxy:port
```

### 支持的链

- Ethereum (1)
- BSC (56)
- Polygon (137)
- Arbitrum (42161)
- Base (8453)
- Optimism (10)

### 支持的时间段

- 30s, 1m, 5m, 1h, 1d, 7d, 30d

## 错误处理

所有 API 服务都会抛出 `ApiRequestError` 异常，包含以下信息：

- `message`: 错误消息
- `status`: HTTP 状态码
- `statusText`: HTTP 状态文本
- `response`: 响应数据
- `code`: 错误代码

## 最佳实践

1. **使用统一的响应格式**：始终使用 `successResponse` 和 `errorResponse`
2. **参数验证**：使用提供的验证函数
3. **错误处理**：使用 `handleApiError` 进行统一错误处理
4. **CORS 支持**：使用 `handleOptionsRequest` 处理预检请求
5. **类型安全**：利用 TypeScript 类型定义

## 示例：完整的 API 路由

```typescript
import { NextRequest } from 'next/server'
import { 
  GasApiService, 
  successResponse, 
  handleApiError,
  handleOptionsRequest,
  validateChainId,
  SUPPORTED_CHAIN_IDS 
} from '@/backend/http'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainid') || '1'

    if (!validateChainId(chainId, SUPPORTED_CHAIN_IDS)) {
      return errorResponse(
        `Invalid chain ID. Must be one of: ${SUPPORTED_CHAIN_IDS.join(', ')}`,
        'Validation Error',
        400
      )
    }

    const gasData = await GasApiService.getGasPrice(chainId)
    return successResponse(gasData)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS() {
  return handleOptionsRequest()
}
```

这个模块大大简化了 API 开发，提供了统一的接口和错误处理机制。
