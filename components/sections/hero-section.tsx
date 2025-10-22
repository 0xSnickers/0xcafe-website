'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

/**
 * 首页英雄区域组件 - Web3工具箱风格
 * 强调100%免费工具，融入主流币种图标
 */
export function HeroSection() {
  const { t } = useTranslation()

  // 代码动画状态
  const [displayedCode, setDisplayedCode] = React.useState<string[]>([])
  
  // Solidity 代码内容
  const codeLines = [
    '// SPDX-License-Identifier: GPL-3.0',
    'pragma solidity ^0.8.0;',
    '',
    'contract Library {',
    '    uint public value;',
    '',
    '    function setValue(uint _value) public {',
    '        value = _value;',
    '    }',
    '}',
  ]

  // 代码打字动画效果
  React.useEffect(() => {
    let currentLine = 0
    let currentChar = 0
    let lines: string[] = []
    
    const typeInterval = setInterval(() => {
      if (currentLine < codeLines.length) {
        const fullLine = codeLines[currentLine]
        
        if (currentChar <= fullLine.length) {
          lines[currentLine] = fullLine.substring(0, currentChar)
          setDisplayedCode([...lines])
          currentChar++
        } else {
          // 当前行完成，移到下一行
          currentLine++
          currentChar = 0
        }
      } else {
        // 所有代码打完后，等待2秒重新开始
        setTimeout(() => {
          setDisplayedCode([])
          currentLine = 0
          currentChar = 0
          lines = []
        }, 3000)
      }
    }, 50) // 打字速度

    return () => clearInterval(typeInterval)
  }, [])

  // 主流币种配置 - 统一管理所有浮动卡片
  const coins = [
    { name: 'Ethereum', image: '/coins/eth.png', color: 'from-orange-500/30 to-yellow-500/30' },
    { name: 'Optimism', image: '/coins/op.png', color: 'from-blue-500/30 to-cyan-500/30' },
    { name: 'Polygon', image: '/coins/polygon.png', color: 'from-purple-500/30 to-pink-500/30' },
    { name: 'BSC', image: '/coins/bsc.png', color: 'from-yellow-500/30 to-orange-500/30' },
    { name: 'Base', image: '/coins/base.png', color: 'from-blue-500/30 to-indigo-500/30' },
    { name: 'Bitcoin', image: '/coins/btc.png', color: 'from-orange-500/30 to-yellow-500/30' },
    { name: 'Solana', image: '/coins/solana.png', color: 'from-purple-500/30 to-pink-500/30' },
  ]

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden px-4 pt-24 pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
            {/* Free Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 shadow-lg"
            >
              <Sparkles className="h-5 w-5 text-green-500" />
              <span className="text-base font-bold text-green-500">{t('hero.freeBadge')}</span>
            </motion.div>

            {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
          >
            {t('hero.title')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            {t('hero.subtitle')}
          </motion.p>

            {/* Highlight Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              {['free', 'secure', 'professional'].map((key) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 backdrop-blur-sm"
                >
                  <span className="text-2xl">{t(`hero.features.${key}.icon`)}</span>
                  <span className="text-sm font-medium">{t(`hero.features.${key}.label`)}</span>
                </div>
              ))}
            </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="h-12 px-8 text-base font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all"
              >
              {t('hero.cta')}
            </Button>
          </motion.div>
        </motion.div>

          {/* Right side - Enhanced Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Central animated card */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Main card with depth - Code Editor Style */}
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotateY: [0, 3, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-[340px] h-[400px] rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Code Editor Header */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-slate-800/80 border-b border-slate-700/50 flex items-center px-4 gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-slate-400 font-mono">Library.sol</span>
                    </div>
                  </div>

                  {/* Code Content Area */}
                  <div className="absolute inset-0 top-10 p-4 overflow-hidden">
                    <div className="font-mono text-xs leading-relaxed">
                      {displayedCode.map((line, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex"
                        >
                          {/* Line number */}
                          <span className="text-slate-600 select-none mr-4 w-6 text-right flex-shrink-0">
                            {line ? index + 1 : ''}
                          </span>
                          
                          {/* Code line with syntax highlighting */}
                          <span className="text-slate-300 whitespace-pre">
                            {line.startsWith('//') ? (
                              // 注释行 - 全绿色
                              <span className="text-green-400">{line}</span>
                            ) : line.includes('pragma') ? (
                              // pragma 行
                              <>
                                <span className="text-purple-400">pragma</span>
                                <span className="text-slate-300"> solidity </span>
                                <span className="text-orange-400">^0.8.0</span>
                                <span className="text-slate-300">;</span>
                              </>
                            ) : line.includes('contract') ? (
                              // contract 行
                              <>
                                <span className="text-purple-400">contract</span>
                                <span className="text-slate-300"> </span>
                                <span className="text-yellow-400">Library</span>
                                <span className="text-slate-300"> {'{'}</span>
                              </>
                            ) : line.trim().startsWith('uint') && line.includes('public') ? (
                              // uint public value 行 - 保留前导空格
                              <>
                                {line.match(/^\s*/)?.[0]}
                                <span className="text-cyan-400">uint</span>
                                <span className="text-slate-300"> </span>
                                <span className="text-purple-400">public</span>
                                <span className="text-slate-300"> value;</span>
                                {line.includes('//') && (
                                  <span className="text-green-400">  {line.split('//')[1]}</span>
                                )}
                              </>
                            ) : line.trim().startsWith('function') ? (
                              // function 行 - 保留前导空格
                              <>
                                {line.match(/^\s*/)?.[0]}
                                <span className="text-purple-400">function</span>
                                <span className="text-slate-300"> </span>
                                <span className="text-yellow-400">setValue</span>
                                <span className="text-slate-300">(</span>
                                <span className="text-cyan-400">uint</span>
                                <span className="text-slate-300"> _value) </span>
                                <span className="text-purple-400">public</span>
                                <span className="text-slate-300"> {'{'}</span>
                              </>
                            ) : line.includes('value = _value') ? (
                              // value = _value 行 - 保留前导空格
                              <>
                                {line.match(/^\s*/)?.[0]}
                                <span className="text-slate-300">value = _value;</span>
                                {line.includes('//') && (
                                  <span className="text-green-400">  {line.split('//')[1]}</span>
                                )}
                              </>
                            ) : line.trim() === '}' ? (
                              // 闭合括号 - 保留前导空格
                              <span className="text-slate-300">{line}</span>
                            ) : (
                              // 其他行（包括空行）
                              <span className="text-slate-300">{line}</span>
                            )}
                          </span>
                          
                          {/* Cursor effect on last line */}
                          {index === displayedCode.length - 1 && line && (
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="inline-block w-2 h-4 bg-orange-500 ml-0.5"
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-blue-500/10 pointer-events-none" />
                </motion.div>

                {/* Floating coin cards - 统一管理的浮动币种卡片 */}
                {coins.map((coin, index) => {
                  // 定义所有卡片的位置和动画参数
                  const positions = [
                    { top: '10%', left: '-5%', delay: 0 },       // ETH - 左上
                    { top: '20%', right: '-8%', delay: 0.3 },    // OP - 右上
                    { top: '55%', left: '-8%', delay: 0.6 },     // Polygon - 左中
                    { top: '65%', right: '-5%', delay: 0.9 },    // BSC - 右中下
                    { bottom: '12%', left: '4%', delay: 1.2 },  // Base - 左下
                    { top: '33%', left: '-12%', delay: 1.5 },    // BTC - 左侧
                    { bottom: '45%', right: '-12%', delay: 1.8 },// Solana - 右侧
                  ]
                  
                  const pos = positions[index] || positions[0]
                  
                  return (
                    <motion.div
                      key={coin.name}
                      animate={{
                        y: [0, -15, 0],
                        rotate: [0, index % 2 === 0 ? 5 : -5, 0],
                      }}
                      transition={{
                        duration: 2.5 + index * 0.3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: pos.delay,
                      }}
                      className={`absolute w-16 h-16 rounded-xl bg-gradient-to-br ${coin.color} backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg overflow-hidden`}
                      style={{
                        top: pos.top,
                        left: pos.left,
                        right: pos.right,
                        bottom: pos.bottom,
                      }}
                      whileHover={{ scale: 1.15 }}
                    >
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </motion.div>
                  )
                })}

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -30, 0],
                      x: [0, Math.sin(i) * 20, 0],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.2,
                    }}
                    className="absolute w-2 h-2 rounded-full bg-orange-500/50"
                    style={{
                      top: `${20 + i * 10}%`,
                      left: `${10 + i * 12}%`,
                    }}
                  />
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Enhanced Background gradient orbs */}
        <motion.div
        className="absolute top-1/4 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
          x: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
          duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
          x: [0, -50, 0],
            scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
          }}
          transition={{
          duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
    </section>
  )
}
