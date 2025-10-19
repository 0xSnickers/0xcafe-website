'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Zap, Shield, Globe, Code } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/**
 * 功能特性展示区域
 * 展示核心功能和特点
 */
export function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Zap,
      titleKey: 'features.fast.title',
      descKey: 'features.fast.description',
    },
    {
      icon: Shield,
      titleKey: 'features.secure.title',
      descKey: 'features.secure.description',
    },
    {
      icon: Globe,
      titleKey: 'features.global.title',
      descKey: 'features.global.description',
    },
    {
      icon: Code,
      titleKey: 'features.developer.title',
      descKey: 'features.developer.description',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <feature.icon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
