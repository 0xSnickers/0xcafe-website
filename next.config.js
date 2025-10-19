/** @type {import('next').NextConfig} */
const nextConfig = {
  // 忽略 Web3 依赖的构建警告
  webpack: (config, { isServer }) => {
    // 处理 Web3 相关的模块解析问题
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      'pino-pretty': false,
      'lokijs': false,
      'encoding': false,
    }

    // 忽略特定的警告
    config.ignoreWarnings = [
      { module: /node_modules\/@metamask\/sdk/ },
      { module: /node_modules\/pino/ },
      { module: /node_modules\/@walletconnect/ },
    ]

    return config
  },
  
  // 实验性功能
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig

