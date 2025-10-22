/**
 * HTTP 请求工具
 * 使用 axios 进行网络请求
 */

import axios from 'axios'

export async function makeHttpsRequest(url: string): Promise<any> {
  const response = await axios.get(url, {
    timeout: 15000,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  })
  
  return response.data
}
