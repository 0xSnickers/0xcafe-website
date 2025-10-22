# Next.js 项目开发规范 Prompt

> 本文档用于指导 AI 助手生成符合团队标准的 Next.js 项目代码和结构

## 项目基础信息

### 技术栈要求

**核心框架**
- Next.js 15+ (使用 App Router)
- React 19+
- TypeScript 5+
- Node.js 18+ (推荐 20.x LTS)

**包管理工具**
- 优先使用 pnpm
- 次选 yarn, npm

**UI 和样式**
- Tailwind CSS 3.4+ (必需)
- Radix UI (推荐用于无障碍组件)
- Lucide React (图标库)
- class-variance-authority (CVA, 用于组件变体)

**开发工具**
- ESLint (代码质量)
- Prettier (代码格式化)
- TypeScript (类型检查)

## 项目结构规范

### 标准目录结构

```
project-root/
├── app/                        # Next.js App Router 页面
│   ├── (routes)/              # 路由组
│   ├── api/                   # API 路由
│   ├── globals.css            # 全局样式
│   ├── layout.tsx             # 根布局
│   └── page.tsx               # 首页
├── components/                # React 组件
│   ├── ui/                    # 基础 UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/                # 布局组件
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── main-layout.tsx
│   └── [feature]/             # 功能模块组件
│       ├── feature-card.tsx
│       ├── feature-filters.tsx
│       └── ...
├── lib/                       # 工具函数和服务
│   ├── utils.ts               # 通用工具函数
│   ├── [service]-api.ts       # API 服务类
│   └── ...
├── public/                    # 静态资源
│   ├── images/
│   ├── fonts/
│   └── ...
├── scripts/                   # 项目 .sh 或 nodejs测试 脚本
├── hooks/                     # hook 功能相关代码
├── docs/                      # 项目文档
│   ├── README.md
│   ├── API.md
│   ├── COMPONENTS.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   └── ARCHITECTURE.md
├── .env.local.example         # 环境变量示例
├── .gitignore                 # Git 忽略文件
├── components.json            # shadcn/ui 配置
├── next.config.ts             # Next.js 配置
├── tailwind.config.js         # Tailwind 配置
├── tsconfig.json              # TypeScript 配置
├── package.json               # 项目依赖
└── README.md                  # 项目说明
```

### 目录组织原则

1. **按功能模块组织**: 组件按业务功能分组
2. **UI 组件独立**: 基础 UI 组件放在 `components/ui/`
3. **服务层分离**: API 和业务逻辑放在 `lib/`
4. **类型定义集中**: 复杂类型可单独创建 `types/` 目录
4. **脚本命令**: 项目 shell 或 nodejs 脚本存放在 `scripts/` 目录
4. **文档存放**: 项目所有说明文档存放到 `docs/` 目录（根据子目录名称区分不同类型文档, 比如 `docs/type/xxx.md`）

## 命名规范

### 文件命名

- **组件文件**: kebab-case (如 `user-profile.tsx`)
- **工具文件**: kebab-case (如 `date-utils.ts`)
- **API 文件**: kebab-case (如 `binance-api.ts`)
- **类型文件**: kebab-case (如 `user-types.ts`)

### 代码命名

- **组件名**: PascalCase (如 `UserProfile`)
- **函数名**: camelCase (如 `getUserData`)
- **常量**: UPPER_SNAKE_CASE (如 `API_BASE_URL`)
- **类型/接口**: PascalCase (如 `UserProfile`, `ApiResponse`)
- **变量**: camelCase (如 `userData`, `isLoading`)

## 组件开发规范

### UI 组件模板

```typescript
// components/ui/example-component.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const exampleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ExampleComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof exampleVariants> {
  // 自定义属性
}

const ExampleComponent = React.forwardRef<HTMLDivElement, ExampleComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(exampleVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

ExampleComponent.displayName = "ExampleComponent"

export { ExampleComponent, exampleVariants }
```

### 业务组件模板

```typescript
// components/[feature]/feature-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface FeatureCardProps {
  title: string
  description: string
  // 其他属性...
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* 内容 */}
      </CardContent>
    </Card>
  )
}
```

### 布局组件模板

```typescript
// components/layout/main-layout.tsx
import { Header } from "./header"
import { Footer } from "./footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

## API 服务规范

### API 类模板

```typescript
// lib/[service]-api.ts

// 接口定义
export interface ServiceData {
  id: string
  name: string
  // 其他字段...
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// API 类
export class ServiceAPI {
  private static readonly BASE_URL = 'https://api.example.com'
  
  // GET 请求
  static async getData(id: string): Promise<ServiceResponse<ServiceData>> {
    try {
      const response = await fetch(`${this.BASE_URL}/data/${id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // POST 请求
  static async createData(payload: Partial<ServiceData>): Promise<ServiceResponse<ServiceData>> {
    try {
      const response = await fetch(`${this.BASE_URL}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Failed to create data:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// 常量导出
export const DEFAULT_CONFIG = {
  timeout: 10000,
  retries: 3,
}
```

### WebSocket 服务模板

```typescript
// lib/[service]-websocket.ts

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(private onMessage: (data: any) => void) {}

  connect(url: string) {
    try {
      this.ws = new WebSocket(url)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.onMessage(this.parseData(data))
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.handleReconnect()
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
    }
  }

  private parseData(data: any) {
    // 数据解析逻辑
    return data
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(this.ws?.url || '')
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// React Hook
import { useState, useEffect } from 'react'

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<any[]>([])
  
  useEffect(() => {
    const service = new WebSocketService((newData) => {
      if (newData) {
        setData((prev) => [...prev.slice(-99), newData])
      }
    })
    
    service.connect(url)
    
    return () => service.disconnect()
  }, [url])
  
  return data
}
```

## 样式规范

### Tailwind CSS 使用原则

1. **响应式优先**: 移动端优先设计
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
   ```

2. **使用 CSS 变量**: 主题颜色使用 CSS 变量
   ```tsx
   <div className="bg-primary text-primary-foreground">
   ```

3. **组合工具类**: 使用 `cn()` 工具函数
   ```tsx
   import { cn } from "@/lib/utils"
   
   <div className={cn("base-classes", conditionalClass && "conditional-classes", className)}>
   ```

4. **悬停和过渡**: 添加交互效果
   ```tsx
   <button className="hover:bg-accent transition-colors duration-200">
   ```

### 全局样式配置

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 224 71.4% 4.1%;
  --primary: 220.9 39.3% 11%;
  --primary-foreground: 210 20% 98%;
  /* 其他 CSS 变量... */
}

.dark {
  --background: 224 71.4% 4.1%;
  --foreground: 210 20% 98%;
  /* 暗色主题变量... */
}

@layer components {
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

## TypeScript 类型规范

### 类型定义原则

1. **优先使用 interface**: 对象结构使用 interface
2. **类型别名用于联合**: 联合类型使用 type
3. **避免 any**: 尽量使用具体类型
4. **导出类型**: 公共类型单独导出

### 类型定义示例

```typescript
// 基础类型
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
}

// 联合类型
export type UserRole = 'admin' | 'instructor' | 'student'

// 泛型接口
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 组件 Props
export interface ComponentProps {
  title: string
  description?: string
  variant?: 'default' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

// 函数类型
export type FetchDataFn = (id: string) => Promise<ApiResponse<User>>

// 扩展类型
export interface ExtendedUser extends User {
  avatar?: string
  bio?: string
}

// 工具类型
export type PartialUser = Partial<User>
export type RequiredUser = Required<User>
export type UserKeys = keyof User
export type UserValues = User[keyof User]
```

## 环境配置规范

### 环境变量命名

- **客户端可访问**: 使用 `NEXT_PUBLIC_` 前缀
- **服务端私密**: 不使用前缀

```env
# .env.local.example

# 应用配置
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Your App Name

# API 配置
API_SECRET_KEY=your_secret_key
NEXT_PUBLIC_API_URL=https://api.example.com

# 第三方服务
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret
BINANCE_API_KEY=your_binance_api_key
NEWS_API_KEY=your_news_api_key

# 数据库 (如果需要)
DATABASE_URL=postgresql://username:password@localhost:5432/dbname

# 其他服务
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id
```

## 代码质量规范

### ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/self-closing-comp': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
  }
}
```

### Prettier 配置

```json
// .prettierrc
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## 性能优化规范

### 图片优化

```tsx
import Image from 'next/image'

// 使用 Next.js Image 组件
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // 关键图片优先加载
  placeholder="blur" // 模糊占位符
  quality={85} // 图片质量 (1-100)
/>
```

### 代码分割

```tsx
import dynamic from 'next/dynamic'

// 动态导入组件
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // 禁用服务端渲染 (可选)
})
```

### 缓存策略

```typescript
// Next.js 15 缓存配置
export const revalidate = 3600 // 1小时重新验证

// API 路由缓存
export async function GET() {
  const data = await fetchData()
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
```

## Git 工作流规范

### 分支命名

- **功能分支**: `feature/feature-name`
- **修复分支**: `fix/bug-description`
- **热修复**: `hotfix/critical-issue`
- **发布分支**: `release/v1.0.0`

### Commit 消息规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链

**示例**:
```
feat(analytics): add real-time chart component

- Implement WebSocket connection
- Add chart rendering logic
- Handle data updates

Closes #123
```

## 文档规范

### 必需文档

1. **README.md**: 项目概述和快速开始
2. **API.md**: API 接口文档
3. **COMPONENTS.md**: 组件开发指南
4. **DEPLOYMENT.md**: 部署指南
5. **DEVELOPMENT.md**: 开发环境设置
6. **ARCHITECTURE.md**: 架构设计文档

### 代码注释规范

```typescript
/**
 * 获取用户数据
 * 
 * @param userId - 用户 ID
 * @param options - 可选配置
 * @returns 用户数据或 null
 * 
 * @example
 * const user = await getUserData('123', { includeProfile: true })
 */
export async function getUserData(
  userId: string,
  options?: { includeProfile?: boolean }
): Promise<User | null> {
  // 实现...
}

// 组件注释
/**
 * 用户卡片组件
 * 
 * 显示用户的基本信息，包括头像、姓名、角色等
 * 支持点击事件和自定义样式
 */
export function UserCard({ user, onClick, className }: UserCardProps) {
  // 实现...
}
```

## 测试规范

### 组件测试模板

```typescript
// __tests__/components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    render(<Button variant="outline">Outline Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### API 测试模板

```typescript
// __tests__/lib/api.test.ts
import { ServiceAPI } from '@/lib/service-api'

describe('ServiceAPI', () => {
  test('should fetch data successfully', async () => {
    const result = await ServiceAPI.getData('123')
    
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
  })

  test('should handle errors gracefully', async () => {
    const result = await ServiceAPI.getData('invalid-id')
    
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})
```

## 安全规范

### 输入验证

```typescript
import { z } from 'zod'

// 使用 Zod 进行数据验证
const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(0).max(150),
})

export function validateUserInput(data: unknown) {
  try {
    return UserSchema.parse(data)
  } catch (error) {
    throw new Error('Invalid user data')
  }
}
```

### API 安全

```typescript
// app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 验证 API Key
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // 处理请求...
  const data = await fetchData()
  
  return NextResponse.json({ data })
}
```

## 无障碍性规范

### 语义化 HTML

```tsx
// 使用正确的 HTML 语义
<main>
  <section aria-labelledby="section-title">
    <h1 id="section-title">页面标题</h1>
    <article>
      <h2>文章标题</h2>
      <p>文章内容</p>
    </article>
  </section>
</main>
```

### ARIA 属性

```tsx
// 添加 ARIA 属性
<button
  aria-label="关闭菜单"
  aria-expanded={isOpen}
  aria-controls="menu"
  onClick={toggleMenu}
>
  <X className="h-5 w-5" />
</button>

<div
  id="menu"
  role="menu"
  aria-hidden={!isOpen}
>
  {/* 菜单内容 */}
</div>
```

## AI 助手使用指南

当使用 AI 助手生成代码时，请提供以下上下文:

### 必需信息

1. **项目类型**: Next.js 15 App Router 项目
2. **技术栈**: React 19, TypeScript 5, Tailwind CSS 3.4
3. **包管理**: pnpm
4. **组件库**: Radix UI + 自定义组件

### 代码生成要求

请 AI 助手:
- ✅ 使用 TypeScript 严格模式
- ✅ 遵循本文档的命名规范
- ✅ 使用 Tailwind CSS 类名
- ✅ 添加适当的类型定义
- ✅ 包含错误处理
- ✅ 添加注释说明
- ✅ 使用 `cn()` 合并类名
- ✅ 实现响应式设计
- ✅ 支持无障碍性
- ❌ 避免使用 `any` 类型
- ❌ 避免内联样式
- ❌ 避免不必要的依赖

### Prompt 示例

```
请帮我创建一个符合以下规范的 Next.js 组件:

项目环境:
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 3.4
- Radix UI

要求:
1. 创建一个 ProductCard 组件
2. 使用 TypeScript 定义清晰的 Props 接口
3. 使用 Tailwind CSS 进行样式设计
4. 支持响应式布局 (移动端/桌面端)
5. 包含悬停效果
6. 使用 CVA 定义变体
7. 添加适当的注释
8. 遵循项目命名规范

组件功能:
- 显示产品图片、标题、价格
- 支持添加到购物车按钮
- 可选的折扣标签
- 评分显示

请生成组件代码和对应的 Props 类型定义。
```

## 配置文件模板

### package.json

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@radix-ui/react-slot": "^1.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.0",
    "lucide-react": "^0.544.0",
    "tailwind-merge": "^3.3.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10",
    "postcss": "^8",
    "eslint": "^8",
    "eslint-config-next": "^15.1.0",
    "prettier": "^3"
  }
}
```

### next.config.ts

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 图片优化
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 压缩
  compress: true,
  
  // SWC 编译器
  swcMinify: true,
  
  // 实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // 更多颜色...
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### .gitignore

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.*

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files
.env*
!.env*.example

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDEs
.vscode/
.idea/
*.swp
*.swo

# docs (如果不想提交文档)
/docs*
```

## 总结

本规范文档涵盖了 Next.js 项目开发的所有关键方面，包括:

✅ 项目结构和组织
✅ 命名规范和代码风格
✅ 组件开发模板
✅ API 服务设计
✅ 样式和 TypeScript 规范
✅ 性能优化和安全措施
✅ 测试和文档要求
✅ Git 工作流
✅ AI 助手使用指南

遵循这些规范可以确保:
- 代码质量和一致性
- 团队协作效率
- 项目可维护性
- 开发体验优化


