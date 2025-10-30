import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/server'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.0xcafe.fun'
  
  // 定义页面路径
  const pages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/gas', changeFrequency: 'always' as const, priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.5 },
  ]
  
  // 为每个语言生成 sitemap 条目
  const sitemap: MetadataRoute.Sitemap = []
  
  pages.forEach((page) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${page.path}`])
          ),
        },
      })
    })
  })
  
  return sitemap
}

