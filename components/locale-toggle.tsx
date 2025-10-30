'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { localeNames, type Locale } from '@/lib/i18n/shared'

/**
 * 语言切换按钮组件
 * 使用路由切换支持中英文切换
 */
export function LocaleToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)

  // 避免水合错误
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 从路径中提取当前语言
  const currentLocale = React.useMemo(() => {
    const segments = pathname.split('/')
    return (segments[1] === 'en' || segments[1] === 'zh' ? segments[1] : 'en') as Locale
  }, [pathname])

  const toggleLocale = () => {
    const newLocale = currentLocale === 'en' ? 'zh' : 'en'
    
    // 构建新路径：替换第一个路径段（语言代码）
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    // 设置 cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`
    
    // 导航到新路径
    router.push(newPath)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Languages className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLocale}
      aria-label="Toggle language"
      title={localeNames[currentLocale] || 'English'}
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">Toggle language</span>
    </Button>
  )
}
