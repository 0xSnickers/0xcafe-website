/**
 * HTTP 请求工具
 * 使用 axios 进行网络请求，支持代理配置和自动重试
 */

import axios, { AxiosError } from 'axios'
import https from 'https'
import { HttpsProxyAgent } from 'https-proxy-agent'

// 请求配置常量
const REQUEST_TIMEOUT = 30000 // 30秒
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1秒

/**
 * 获取代理配置
 * 优先级: HTTPS_PROXY > https_proxy > HTTP_PROXY > http_proxy
 */
function getProxyAgent(): HttpsProxyAgent<string> | https.Agent {
  const proxy =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy

  if (proxy) {
    // 隐藏密码部分，仅在开发环境输出
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Using proxy:', proxy.replace(/:[^:]*@/, ':***@'))
    }
    return new HttpsProxyAgent(proxy)
  }

  // 默认 agent，禁用证书验证以解决某些网络环境的 SSL 问题
  return new https.Agent({
    rejectUnauthorized: false,
  })
}

/**
 * 延迟函数
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 发起 HTTP 请求，支持自动重试
 * @param url 请求的 URL
 * @returns 返回响应数据
 */
export async function makeHttpsRequest(url: string): Promise<any> {
  const agent = getProxyAgent()

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // 仅在开发环境输出详细日志
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`Request attempt ${attempt}/${MAX_RETRIES}`)
      }

      const response = await axios.get(url, {
        timeout: REQUEST_TIMEOUT,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        httpsAgent: agent,
        proxy: false, // 禁用 axios 内置代理，使用 httpsAgent
      })

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const isLastAttempt = attempt === MAX_RETRIES

      // 输出错误日志
      console.error(`Request failed (attempt ${attempt}/${MAX_RETRIES}):`, {
        message: axiosError.message,
        code: axiosError.code,
      })

      // 如果是最后一次尝试，抛出错误
      if (isLastAttempt) {
        throw new Error(
          `Request failed after ${MAX_RETRIES} attempts. Last error: ${axiosError.message}`
        )
      }

      // 等待后重试
      await delay(RETRY_DELAY)
    }
  }

  // 理论上不会执行到这里，但 TypeScript 需要返回值
  throw new Error('Request failed after all retries')
}
