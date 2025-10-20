'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleToggle } from '@/components/locale-toggle'
import { WalletButton } from '@/components/web3/wallet-button'
import { TelegramConnect } from '@/components/telegram'
import { Separator } from '@/components/ui/separator'

/**
 * 网站头部组件 - Web3工具箱风格
 * 包含导航菜单、搜索、主题切换、语言切换
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  const { t } = useTranslation()

  // 监听滚动事件
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { 
      id: 'batch-operations',
      href: '/batch-operations', 
      label: t('nav.batchOperations'),
      hasDropdown: true,
      items: [
        { href: '/batch-operations/generate-wallets', label: t('nav.dropdown.batchOps.generateWallets') },
        { href: '/batch-operations/check-balance', label: t('nav.dropdown.batchOps.checkBalance') },
        { href: '/batch-operations/approve', label: t('nav.dropdown.batchOps.approve') },
        { href: '/batch-operations/transfer', label: t('nav.dropdown.batchOps.transfer') },
        { href: '/batch-operations/collect', label: t('nav.dropdown.batchOps.collect') },
      ]
    },
    { 
      id: 'monitoring',
      href: '/monitoring', 
      label: t('nav.monitoring'),
      hasDropdown: true,
      items: [
        { href: '/monitoring/token', label: t('nav.dropdown.monitoring.token') },
      ]
    },
    { 
      id: 'solana',
      href: '/solana', 
      label: t('nav.solana'),
      hasDropdown: true,
      items: [
        { href: '/solana/batch-send', label: t('nav.dropdown.solana.batchSend') },
        { href: '/solana/check-balance', label: t('nav.dropdown.solana.checkBalance') },
        { href: '/solana/collect', label: t('nav.dropdown.solana.collect') },
        { href: '/solana/multi-transfer', label: t('nav.dropdown.solana.multiTransfer') },
      ]
    },
    {
      id: 'gas',
      href: '/gas',
      label: t('nav.gas'),
      hasDropdown: false
    }
  ]

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg border-b shadow-sm'
          : 'bg-background/80 backdrop-blur-md'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-2 sm:gap-8">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <Image
                src="/favicon.jpg"
                alt="0xcafe Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold hidden sm:inline">0xcafe</span>
            </motion.div>
          </Link>

          {/* Mobile Menu Button - Right after Logo on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Desktop Navigation - Left aligned */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link href={item.href}>
                  <Button 
                    variant="ghost" 
                    className="text-base group relative"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className={cn(
                        "ml-1 h-4 w-4 transition-transform",
                        activeDropdown === item.id && "rotate-180"
                      )} />
                    )}
                  </Button>
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.id && item.items && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-56 rounded-lg border bg-background/95 backdrop-blur-lg shadow-lg overflow-hidden"
                    >
                      {item.items.map((subItem, index) => (
                        <Link key={subItem.href} href={subItem.href}>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer border-b last:border-b-0"
                          >
                            <span className="text-sm">{subItem.label}</span>
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Actions - Right side */}
          <div className="flex items-center space-x-1 sm:space-x-2 ml-auto">
            {/* Theme & Language Toggle - Always visible */}
            <ThemeToggle />
            <LocaleToggle />
            
            {/* Separator */}
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            
            {/* Web3 Connection Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <TelegramConnect variant="button" />
              <WalletButton />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="lg:hidden pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Separator className="mb-4" />
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <div key={item.id}>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base"
                      onClick={() => !item.hasDropdown && setIsMenuOpen(false)}
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  </Link>
                  {item.hasDropdown && item.items && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <Link key={subItem.href} href={subItem.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm text-muted-foreground"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
