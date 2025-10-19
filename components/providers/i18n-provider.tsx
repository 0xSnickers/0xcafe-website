'use client'

import * as React from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n/config'

/**
 * i18next Provider 组件
 * 为整个应用提供多语言支持
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  // 从 localStorage 读取保存的语言设置
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale')
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
        i18n.changeLanguage(savedLocale)
      }
    }
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

