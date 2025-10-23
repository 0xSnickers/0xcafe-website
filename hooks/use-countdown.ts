/**
 * 倒计时 Hook
 * 用于显示数据刷新倒计时
 */

import { useState, useEffect, useRef } from 'react'

interface CountdownResult {
  timeLeft: number // 剩余秒数
  progress: number // 进度百分比 (0-100)
  reset: () => void // 重置倒计时
}

/**
 * 创建倒计时 hook
 * @param interval 间隔时间（毫秒）
 * @param enabled 是否启用倒计时
 * @returns 倒计时状态
 */
export function useCountdown(interval: number = 15000, enabled: boolean = true): CountdownResult {
  const intervalSeconds = Math.floor(interval / 1000)
  const [timeLeft, setTimeLeft] = useState(intervalSeconds)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const reset = () => {
    setTimeLeft(intervalSeconds)
  }

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    // 初始化
    setTimeLeft(intervalSeconds)

    // 创建计时器
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return intervalSeconds // 重置
        }
        return prev - 1
      })
    }, 1000)

    // 清理
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [interval, intervalSeconds, enabled])

  // 计算进度百分比
  const progress = ((intervalSeconds - timeLeft) / intervalSeconds) * 100

  return {
    timeLeft,
    progress,
    reset,
  }
}
