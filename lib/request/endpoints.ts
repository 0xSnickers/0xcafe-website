/**
 * API 端点管理
 * 统一管理所有 API 接口地址
 */

/**
 * 内部 API 端点配置
 */
const INTERNAL_ENDPOINTS = {
  GAS: '/api/gas',
  BURN_HISTORY: '/api/burn-history',
  BURN_RANKING: '/api/burn-ranking',
  BURN_TOTAL: '/api/total-burned',
  BURN_CATEGORIES: '/api/burn-categories',
  BLOCKS_LATEST: '/api/blocks/latest',
} as const

/**
 * 获取内部 API 端点
 * @param path - 端点路径
 * @returns 完整的内部 API 端点
 */
export function getInternalEndpoint(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * 构建带参数的端点
 * @param baseEndpoint - 基础端点
 * @param params - 查询参数
 * @returns 带参数的端点
 */
export function buildEndpointWithParams(baseEndpoint: string, params: Record<string, string | number>): string {
  const url = new URL(baseEndpoint, window.location.origin)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })
  
  return url.pathname + url.search
}

/**
 * 获取 Gas API 端点
 * @param chainId - 链 ID
 * @returns Gas API 端点
 */
export function getGasEndpoint(chainId: string): string {
  return buildEndpointWithParams(INTERNAL_ENDPOINTS.GAS, { chainid: chainId })
}

/**
 * 获取燃烧历史 API 端点
 * @param chainId - 链 ID
 * @param limit - 限制数量
 * @param period - 时间段
 * @returns 燃烧历史 API 端点
 */
export function getBurnHistoryEndpoint(chainId: string, limit: number, period: string): string {
  return buildEndpointWithParams(INTERNAL_ENDPOINTS.BURN_HISTORY, { 
    chainid: chainId, 
    limit: limit.toString(), 
    period 
  })
}

/**
 * 获取燃烧排行 API 端点
 * @param chainId - 链 ID
 * @param limit - 限制数量
 * @param period - 时间段
 * @returns 燃烧排行 API 端点
 */
export function getBurnRankingEndpoint(chainId: string, limit: number, period: string): string {
  return buildEndpointWithParams(INTERNAL_ENDPOINTS.BURN_RANKING, { 
    chainid: chainId, 
    limit: limit.toString(), 
    period 
  })
}

/**
 * 获取燃烧总量 API 端点
 * @param chainId - 链 ID
 * @param period - 时间段
 * @returns 燃烧总量 API 端点
 */
export function getTotalBurnedEndpoint(chainId: string, period: string): string {
  return buildEndpointWithParams(INTERNAL_ENDPOINTS.BURN_TOTAL, { 
    chainid: chainId, 
    period 
  })
}

/**
 * 获取燃烧类别 API 端点
 * @param chainId - 链 ID
 * @param limit - 限制数量
 * @returns 燃烧类别 API 端点
 */
export function getBurnCategoriesEndpoint(chainId: string, limit: number): string {
  return buildEndpointWithParams(INTERNAL_ENDPOINTS.BURN_CATEGORIES, { 
    chainid: chainId, 
    limit: limit.toString() 
  })
}

/**
 * 获取最新区块 API 端点
 * @param chainId - 链 ID
 * @returns 最新区块 API 端点
 */
export function getLatestBlockEndpoint(chainId: string): string {
  return buildEndpointWithParams(INTERNAL_ENDPOINTS.BLOCKS_LATEST, { chainid: chainId })
}
