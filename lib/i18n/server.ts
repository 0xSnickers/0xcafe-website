import 'server-only'
import { locales, defaultLocale, localeNames, type Locale } from './shared'

// 重新导出共享配置
export { locales, defaultLocale, localeNames, type Locale }

// 动态导入翻译字典
const dictionaries = {
  en: () => import('./locales/en.json').then(module => module.default),
  zh: () => import('./locales/zh.json').then(module => module.default),
}

// 获取指定语言的翻译字典
export async function getDictionary(locale: Locale = defaultLocale) {
  // 确保 locale 是有效的
  if (!locales.includes(locale)) {
    return dictionaries[defaultLocale]()
  }
  return dictionaries[locale]()
}

// 获取翻译函数（服务端组件使用）
export async function getTranslations(locale: Locale = defaultLocale) {
  const dict = await getDictionary(locale)
  
  return function t(key: string): string {
    const keys = key.split('.')
    let value: any = dict
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return (value as string) || key
  }
}

