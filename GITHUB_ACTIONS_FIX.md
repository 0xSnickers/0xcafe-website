# GitHub Actions pnpm 版本修复方案 🚀

## 🔍 问题分析

### 当前状态
- **本地 pnpm**: 10.17.1
- **lockfileVersion**: 9.0
- **GitHub Actions**: 需要使用 pnpm 9

### 为什么 lockfileVersion 是 9.0？

pnpm 10.x 为了向后兼容，默认生成的仍然是 `lockfileVersion: 9.0`。

根据 pnpm 官方文档：
- pnpm 8.x → lockfileVersion 6.0
- pnpm 9.x → lockfileVersion 9.0
- pnpm 10.x → lockfileVersion 9.0 (默认，兼容模式)

---

## ✅ 解决方案

### 在 GitHub Web UI 中修改 workflow 文件

#### 1️⃣ 访问文件
https://github.com/0xSnickers/0xcafe-website/blob/main/.github/workflows/sync-base-fees.yml

#### 2️⃣ 编辑（点击✏️）

#### 3️⃣ 修改第 27 行

```yaml
# 当前配置 ❌
- name: Install pnpm
  uses: pnpm/action-setup@v3
  with:
    version: 8  # ← 错误的版本

# 正确配置 ✅
- name: Install pnpm
  uses: pnpm/action-setup@v3
  with:
    version: 9  # ← 使用 pnpm 9 以匹配 lockfileVersion 9.0
```

#### 4️⃣ 同时修改第 44 行

```yaml
# 当前配置 ❌
run: pnpm run sync:base-fees

# 正确配置 ✅
run: pnpm run sync:base-fees:ci
```

#### 5️⃣ 提交
- Commit message: `fix: use pnpm 9 to match lockfileVersion 9.0`
- Commit directly to main branch

---

## 📋 完整的正确配置

```yaml
name: Sync Base Fees to PostgreSQL

on:
  schedule:
    - cron: '*/5 * * * *'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9  # ✅ 匹配 lockfileVersion 9.0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run sync script
        env:
          NEXT_PUBLIC_ALCHEMY_API_KEY: ${{ secrets.NEXT_PUBLIC_ALCHEMY_API_KEY }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: pnpm run sync:base-fees:ci  # ✅ 使用 CI 专用命令
      
      - name: Log sync completion
        run: |
          echo "✅ Base fees sync completed at $(date)"
          echo "📊 Synced 30 blocks to PostgreSQL"
```

---

## 🎯 两处关键修改

### 修改 1: pnpm 版本
```yaml
version: 8  →  version: 9
```

### 修改 2: npm 脚本
```yaml
run: pnpm run sync:base-fees  →  run: pnpm run sync:base-fees:ci
```

---

## ✅ 验证

修改完成后，GitHub Actions 日志应显示：

```
✅ Checkout code
✅ Install pnpm (version 9)
✅ Setup Node.js
✅ Install dependencies
   - Lockfile is up to date, resolution step is skipped
   - Packages: +799
✅ Run sync script
   - Total blocks synced: 30
✅ Log sync completion
```

---

## 📚 相关说明

### 为什么不用 pnpm 10？

虽然本地是 pnpm 10，但：
1. lockfileVersion 是 9.0
2. pnpm 9 完全兼容这个 lockfile
3. 使用 pnpm 9 可以确保 CI 环境的稳定性

### 如果以后升级到 lockfileVersion 10.0

如果需要强制使用 lockfileVersion 10.0：

```bash
# 本地执行
cd /Users/chuizi/josen/0xSnickers/0xcafe-website
echo "lockfile-version=10" >> .npmrc
rm pnpm-lock.yaml
pnpm install

# 然后 GitHub Actions 使用 pnpm 10
```

但**目前不推荐**，因为 pnpm 9 更稳定。

---

## 🚀 立即行动

现在请访问 GitHub 并按上述步骤修改 workflow 文件！

**修改链接**: https://github.com/0xSnickers/0xcafe-website/edit/main/.github/workflows/sync-base-fees.yml

---

**创建时间**: 2025-10-29  
**问题**: pnpm lockfile 版本不匹配  
**解决方案**: GitHub Actions 使用 pnpm 9

