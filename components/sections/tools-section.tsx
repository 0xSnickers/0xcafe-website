'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Layers, 
  Send, 
  Zap, 
  Database, 
  Bitcoin,
  Eye,
  ChevronRight
} from 'lucide-react'

/**
 * 工具展示区域组件
 * 展示热门Web3工具
 */
export function ToolsSection() {
  const { t } = useTranslation()

  // 基于实际菜单功能的工具展示
  const tools = [
    // 批量操作相关
    {
      icon: Layers,
      titleKey: 'tools.generateWallets.title',
      descKey: 'tools.generateWallets.description',
      href: '/batch-operations/generate-wallets',
    },
    {
      icon: Database,
      titleKey: 'tools.checkBalance.title',
      descKey: 'tools.checkBalance.description',
      href: '/batch-operations/check-balance',
    },
    {
      icon: Send,
      titleKey: 'tools.batchTransfer.title',
      descKey: 'tools.batchTransfer.description',
      href: '/batch-operations/transfer',
    },
    {
      icon: Zap,
      titleKey: 'tools.batchCollect.title',
      descKey: 'tools.batchCollect.description',
      href: '/batch-operations/collect',
    },
    // 监控相关
    {
      icon: Eye,
      titleKey: 'tools.tokenMonitor.title',
      descKey: 'tools.tokenMonitor.description',
      href: '/monitoring/token',
    },
    // Solana相关
    {
      icon: Bitcoin,
      titleKey: 'tools.solanaBatch.title',
      descKey: 'tools.solanaBatch.description',
      href: '/solana/batch-send',
    },
  ]

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              {t('tools.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('tools.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 group"
            >
              {t('tools.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <ToolCard key={tool.href} tool={tool} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface ToolCardProps {
  tool: {
    icon: React.ElementType
    titleKey: string
    descKey: string
    href: string
  }
  index: number
}

function ToolCard({ tool, index }: ToolCardProps) {
  const { t } = useTranslation()

  return (
    <motion.a
      href={tool.href}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative block"
    >
      <div className="relative h-full p-6 rounded-xl border bg-card hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
        {/* Icon */}
        <div className="mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <tool.icon className="h-6 w-6 text-orange-500" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold group-hover:text-orange-500 transition-colors">
              {t(tool.titleKey)}
            </h3>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-sm text-muted-foreground">
            {t(tool.descKey)}
          </p>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-transparent transition-all duration-300" />
      </div>
    </motion.a>
  )
}

