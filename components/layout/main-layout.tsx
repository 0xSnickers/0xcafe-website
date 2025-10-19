import * as React from 'react'
import { Header } from './header'
import { Footer } from './footer'

/**
 * 主布局组件
 * 包含头部、主体内容和底部
 */
interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}

