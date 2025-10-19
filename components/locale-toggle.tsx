'use client'

import * as React from 'react'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { localeNames, type Locale } from '@/lib/i18n/config'

/**
 * 语言切换按钮组件
 * 使用 react-i18next 支持中英文切换
 */
export function LocaleToggle() {
  const { i18n } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  // 避免水合错误
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLocale = () => {
    const newLocale = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(newLocale)
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Languages className="h-5 w-5" />
      </Button>
    )
  }

  const currentLocale = i18n.language as Locale

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
