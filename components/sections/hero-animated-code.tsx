'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

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

interface Coin {
  name: string
  image: string
}

/**
 * 动画代码编辑器组件 - 客户端专用
 * 包含打字动画和浮动币种卡片
 */
export function AnimatedCodeEditor({ coins }: { coins: Coin[] }) {
  const [displayedCode, setDisplayedCode] = React.useState<string[]>([])

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
          currentLine++
          currentChar = 0
        }
      } else {
        setTimeout(() => {
          setDisplayedCode([])
          currentLine = 0
          currentChar = 0
          lines = []
        }, 3000)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [])

  return (
    <div className="relative w-full max-w-lg aspect-square">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Main card with code editor */}
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
                  <span className="text-slate-600 select-none mr-4 w-6 text-right flex-shrink-0">
                    {line ? index + 1 : ''}
                  </span>
                  
                  <span className="text-slate-300 whitespace-pre">
                    {renderCodeLine(line)}
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

        {/* Floating coin cards */}
        {coins.map((coin, index) => {
          const positions = [
            { top: '10%', left: '-5%', delay: 0, color: 'from-orange-500/20 to-yellow-500/20' },
            { top: '20%', right: '-8%', delay: 0.3, color: 'from-blue-500/20 to-cyan-500/20' },
            { top: '55%', left: '-8%', delay: 0.6, color: 'from-purple-500/20 to-pink-500/20' },
            { top: '65%', right: '-5%', delay: 0.9, color: 'from-yellow-500/20 to-orange-500/20' },
            { bottom: '12%', left: '4%', delay: 1.2, color: 'from-blue-500/20 to-indigo-500/20' },
            { top: '33%', left: '-12%', delay: 1.5, color: 'from-orange-500/20 to-yellow-500/20' },
            { bottom: '45%', right: '-12%', delay: 1.8, color: 'from-purple-500/20 to-pink-500/20' },
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
              className={`absolute w-16 h-16 rounded-xl bg-gradient-to-br ${pos.color} backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg overflow-hidden`}
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
  )
}

// 代码高亮渲染函数
function renderCodeLine(line: string) {
  if (line.startsWith('//')) {
    return <span className="text-green-400">{line}</span>
  } else if (line.includes('pragma')) {
    return (
      <>
        <span className="text-purple-400">pragma</span>
        <span className="text-slate-300"> solidity </span>
        <span className="text-orange-400">^0.8.0</span>
        <span className="text-slate-300">;</span>
      </>
    )
  } else if (line.includes('contract')) {
    return (
      <>
        <span className="text-purple-400">contract</span>
        <span className="text-slate-300"> </span>
        <span className="text-yellow-400">Library</span>
        <span className="text-slate-300"> {'{'}</span>
      </>
    )
  } else if (line.trim().startsWith('uint') && line.includes('public')) {
    return (
      <>
        {line.match(/^\s*/)?.[0]}
        <span className="text-cyan-400">uint</span>
        <span className="text-slate-300"> </span>
        <span className="text-purple-400">public</span>
        <span className="text-slate-300"> value;</span>
      </>
    )
  } else if (line.trim().startsWith('function')) {
    return (
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
    )
  } else if (line.includes('value = _value')) {
    return (
      <>
        {line.match(/^\s*/)?.[0]}
        <span className="text-slate-300">value = _value;</span>
      </>
    )
  }
  
  return <span className="text-slate-300">{line}</span>
}

