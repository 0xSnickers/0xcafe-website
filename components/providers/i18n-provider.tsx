'use client'

import * as React from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/shared'

/**
 * i18next Provider 组件
 * 为整个应用提供多语言支持
 * 现在支持服务端 i18n 路由
 */
export function I18nProvider({ 
  children,
  initialLocale = 'en'
}: { 
  children: React.ReactNode
  initialLocale?: Locale
}) {
  // 使用服务端传递的语言设置
  React.useEffect(() => {
    if (initialLocale && i18n.language !== initialLocale) {
      i18n.changeLanguage(initialLocale)
    }
  }, [initialLocale])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

