import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './lib/i18n/shared'

// 从请求中获取首选语言
function getLocale(request: NextRequest): string {
  // 1. 检查 cookie 中的语言设置
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  if (localeCookie && locales.includes(localeCookie as any)) {
    return localeCookie
  }

  // 2. 检查 Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // 解析 Accept-Language header (例如: "zh-CN,zh;q=0.9,en;q=0.8")
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const parts = lang.trim().split(';')
        const code = parts[0].split('-')[0] // 提取语言代码 (zh-CN -> zh)
        const quality = parts[1] ? parseFloat(parts[1].split('=')[1]) : 1
        return { code, quality }
      })
      .sort((a, b) => b.quality - a.quality)

    for (const { code } of languages) {
      if (locales.includes(code as any)) {
        return code
      }
    }
  }

  // 3. 返回默认语言
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 检查路径中是否已包含语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // 重定向到带语言前缀的路径
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  
  const response = NextResponse.redirect(request.nextUrl)
  
  // 设置 cookie 记住用户的语言偏好
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })
  
  return response
}

export const config = {
  matcher: [
    // 匹配所有路径，除了：
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /favicon.ico, /robots.txt, /sitemap.xml (静态文件)
    // - /*.png, /*.jpg, /*.jpeg, /*.gif, /*.webp, /*.svg (图片)
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)',
  ],
}

