'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Send, Twitter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'

/**
 * 联系我们页面
 * 展示 Telegram、X(Twitter)、Gmail 联系方式
 */
export default function ContactPage() {
  const { t } = useTranslation()
  const telegramGroupLink = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_LINK || ''
  const twitterContactLink = process.env.NEXT_PUBLIC_TWITTER_CONTACT_LINK || ''
  const gmailContactLink = process.env.NEXT_PUBLIC_GMAIL_CONTACT_LINK || ''
  const contactMethods = [
    {
      id: 'telegram',
      icon: <Send className="h-12 w-12" />,
      name: 'Telegram',
      description: t('contact.telegram.description'),
      value: '@0xcafeLabs',
      link: telegramGroupLink,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      hoverColor: 'hover:border-blue-500/50',
      iconColor: 'text-blue-500',
    },
    {
      id: 'twitter',
      icon: <Twitter className="h-12 w-12" />,
      name: 'X (Twitter)',
      description: t('contact.twitter.description'),
      value: '@0xcafedotfun',
      link: twitterContactLink,
      color: 'from-slate-500/20 to-slate-600/20',
      borderColor: 'border-slate-500/30',
      hoverColor: 'hover:border-slate-500/50',
      iconColor: 'text-slate-400',
    },
    {
      id: 'email',
      icon: <Mail className="h-12 w-12" />,
      name: 'Gmail',
      description: t('contact.email.description'),
      value: gmailContactLink,
      link: `mailto:${gmailContactLink}`,
      color: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-500/30',
      hoverColor: 'hover:border-red-500/50',
      iconColor: 'text-red-500',
    },
  ]

  return (
    <MainLayout>
      <div className="min-h-screen pt-20 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

        <div className="container mx-auto relative z-10 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`relative overflow-hidden border-2 ${method.borderColor} ${method.hoverColor} transition-all duration-300 hover:shadow-2xl group cursor-pointer`}
                  onClick={() => window.open(method.link, '_blank')}
                >
                  <CardContent className="p-8">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    <div className="relative z-10 space-y-6">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className={`${method.iconColor}`}
                      >
                        {method.icon}
                      </motion.div>

                      {/* Name */}
                      <h3 className="text-2xl font-bold">{method.name}</h3>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm">
                        {method.description}
                      </p>

                      {/* Value */}
                      <div className="pt-4 border-t border-border">
                        <p className="font-mono text-sm break-all">{method.value}</p>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(method.link, '_blank')
                        }}
                      >
                        {t('contact.openButton')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>

      
      </div>
    </MainLayout>

  )
}

