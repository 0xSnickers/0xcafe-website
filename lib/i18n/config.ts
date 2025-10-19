import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zh from './locales/zh.json'

/**
 * i18next 配置
 * 
 * 支持的语言：
 * - en: English
 * - zh: 中文
 */

export const defaultLocale = 'en'
export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]

// 语言显示名称
export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
}

// 初始化 i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      zh: {
        translation: zh,
      },
    },
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },
    react: {
      useSuspense: false, // 禁用 Suspense 以避免水合问题
    },
  })

export default i18n

