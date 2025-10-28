# Backend Directory

这个目录包含所有后端相关的代码，包括 HTTP 客户端、数据库操作、服务层等。

## 📁 目录结构

```
backend/
├── http/              # HTTP 客户端和 API 封装
│   ├── apis.ts       # API 接口定义
│   ├── client.ts     # HTTP 客户端配置
│   ├── config.ts     # 配置文件
│   └── README.md     # HTTP 模块文档
│
├── postgresql/        # PostgreSQL/Supabase 数据库集成
│   ├── client.ts     # 数据库客户端
│   ├── queries.ts    # 查询函数
│   ├── types.ts      # 数据库类型定义
│   ├── utils.ts      # 工具函数
│   ├── README.md     # 数据库文档
│   └── README_ZH.md  # 中文文档
│
└── services/          # 业务服务层
    └── (待添加)
```

## 🎯 模块说明

### 1. HTTP 模块 (`http/`)

负责处理所有 HTTP 请求，包括：
- Etherscan API 调用
- Alchemy API 调用
- 其他第三方 API 集成
- 请求/响应拦截和处理

**文档**: [backend/http/README.md](./http/README.md)

**使用示例**:
```typescript
import { etherscanClient } from '@/backend/http'

const blockData = await etherscanClient.getBlockByNumber(123456)
```

### 2. PostgreSQL 模块 (`postgresql/`)

提供 Supabase PostgreSQL 数据库的完整集成：
- 数据库连接和配置
- 类型安全的查询函数
- 燃烧历史数据管理
- Gas 价格追踪
- 工具函数和缓存

**文档**: 
- 英文：[backend/postgresql/README.md](./postgresql/README.md)
- 中文：[backend/postgresql/README_ZH.md](./postgresql/README_ZH.md)
- 快速开始：[backend/postgresql/QUICKSTART.md](./postgresql/QUICKSTART.md)

**使用示例**:
```typescript
import { getBurnHistory, getLatestGasPrice } from '@/backend/postgresql'

// 查询燃烧历史
const { data } = await getBurnHistory({ chain_id: 1, limit: 20 })

// 获取最新 Gas 价格
const gasPrice = await getLatestGasPrice(1)
```

### 3. Services 模块 (`services/`)

业务逻辑层，用于：
- 数据聚合和处理
- 复杂业务逻辑
- 多数据源整合
- 缓存策略

**状态**: 待开发

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

在 `.env.local` 中配置：

```env
# Etherscan API
NEXT_PUBLIC_ETHERSCAN_API_KEY=your-key

# Alchemy API
NEXT_PUBLIC_ALCHEMY_API_KEY=your-key

# Supabase PostgreSQL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 使用后端模块

```typescript
// HTTP 客户端
import { etherscanClient, alchemyClient } from '@/backend/http'

// 数据库操作
import { getBurnHistory, getLatestGasPrice } from '@/backend/postgresql'

// 工具函数
import { weiToEther, getDateRange } from '@/backend/postgresql/utils'
```

## 📖 设计原则

### 1. 职责分离
- **HTTP**: 只负责数据获取和 API 调用
- **PostgreSQL**: 只负责数据存储和查询
- **Services**: 负责业务逻辑和数据整合

### 2. 类型安全
- 所有模块都使用 TypeScript
- 完整的类型定义
- 编译时错误检查

### 3. 错误处理
- 统一的错误处理机制
- 自动重试（HTTP 和数据库）
- 详细的错误日志

### 4. 性能优化
- 请求缓存
- 数据库查询优化
- 批量操作支持

## 🔧 开发指南

### 添加新的 API 集成

1. 在 `backend/http/` 创建新的客户端文件
2. 定义 API 接口和类型
3. 实现请求函数
4. 导出到 `backend/http/index.ts`
5. 更新文档

### 添加新的数据库表

1. 在 Supabase 创建表结构
2. 更新 `backend/postgresql/types.ts`
3. 在 `backend/postgresql/queries.ts` 添加查询函数
4. 更新 `backend/postgresql/index.ts` 导出
5. 添加使用示例到 `examples.ts`

### 添加新的服务

1. 在 `backend/services/` 创建服务文件
2. 实现业务逻辑
3. 集成 HTTP 和数据库模块
4. 编写单元测试
5. 更新文档

## 🧪 测试

```bash
# 测试数据库连接
pnpm db:check

# 运行类型检查
pnpm type-check

# 运行所有测试
pnpm test
```

## 📚 相关文档

- [HTTP 模块文档](./http/README.md)
- [PostgreSQL 模块文档](./postgresql/README.md)
- [PostgreSQL 中文文档](./postgresql/README_ZH.md)
- [项目主文档](../README.md)

## 🔐 安全注意事项

1. **API 密钥管理**
   - 使用环境变量存储密钥
   - 不要提交 `.env.local` 到 Git
   - 客户端只使用 `NEXT_PUBLIC_` 前缀的变量

2. **数据库安全**
   - 启用 Row Level Security (RLS)
   - 使用最小权限原则
   - 定期审计访问日志

3. **输入验证**
   - 验证所有外部输入
   - 使用 TypeScript 类型检查
   - 防止注入攻击

## 🐛 故障排除

### HTTP 请求失败
- 检查 API 密钥是否正确
- 确认网络连接
- 查看 API 限流状态

### 数据库连接失败
- 运行 `pnpm db:check` 诊断
- 检查 Supabase 凭据
- 确认项目状态

更多问题，请查看各模块的文档或提交 Issue。

---

**维护者**: 0xcafe Team  
**最后更新**: 2024-10-28

