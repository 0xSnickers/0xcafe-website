# 修复 GitHub Actions pnpm 版本不匹配 🔧

## 问题描述

GitHub Actions 报错：
```
WARN  Ignoring not compatible lockfile at pnpm-lock.yaml
ERR_PNPM_NO_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is absent
```

## 根本原因

- **本地 pnpm 版本**: 10.17.1
- **GitHub Actions 配置版本**: 8
- **结果**: lockfile 格式不兼容

## 解决方案

### 方式 1: 通过 GitHub Web UI 修改（推荐）

1. **访问文件**: 
   - 打开 https://github.com/0xSnickers/0xcafe-website/blob/main/.github/workflows/sync-base-fees.yml

2. **编辑文件**: 
   - 点击右上角的 **✏️ 编辑** 按钮

3. **修改第 27 行**:
   ```yaml
   # 修改前
   - name: Install pnpm
     uses: pnpm/action-setup@v3
     with:
       version: 8
   
   # 修改后
   - name: Install pnpm
     uses: pnpm/action-setup@v3
     with:
       version: 10
   ```

4. **提交更改**:
   - 点击页面底部的 **"Commit changes..."** 按钮
   - 填写 commit 信息: `fix: update pnpm version to 10 for lockfile compatibility`
   - 选择 **"Commit directly to the main branch"**
   - 点击 **"Commit changes"**

---

### 方式 2: 使用 gh CLI（如果你有安装）

```bash
cd /Users/chuizi/josen/0xSnickers/0xcafe-website
gh workflow run sync-base-fees.yml
```

---

### 方式 3: 等待自动触发

修改完成后，GitHub Actions 会：
- 每 5 分钟自动运行一次
- 或者你可以在 Actions 页面手动触发

---

## 修改后的完整 workflow 配置

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
          version: 10  # ✅ 更新为 10
      
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
        run: pnpm run sync:base-fees:ci
      
      - name: Log sync completion
        run: |
          echo "✅ Base fees sync completed at $(date)"
          echo "📊 Synced 30 blocks to PostgreSQL"
```

---

## 验证修复

修改完成后，在 GitHub Actions 页面查看日志：

**预期成功日志**:
```
✅ Checkout code
✅ Install pnpm (version 10)
✅ Setup Node.js
✅ Install dependencies
   - Using pnpm-lock.yaml (lockfile compatible!)
✅ Run sync script
   - Total blocks synced: 30
✅ Log sync completion
```

---

## 相关说明

### 为什么本地是 pnpm 10？

检查 pnpm 版本：
```bash
pnpm --version
# 输出: 10.17.1
```

### pnpm lockfile 版本对应关系

| pnpm 版本 | lockfile 版本 |
|----------|--------------|
| pnpm 6.x | lockfileVersion: 5.3 |
| pnpm 7.x | lockfileVersion: 5.4 |
| pnpm 8.x | lockfileVersion: 6.0 |
| pnpm 9.x | lockfileVersion: 9.0 |
| pnpm 10.x | lockfileVersion: 10.0 |

### 如果以后需要降级 pnpm

如果需要使用 pnpm 8：
```bash
# 本地降级
pnpm i -g pnpm@8

# 重新生成 lockfile
cd /Users/chuizi/josen/0xSnickers/0xcafe-website
rm pnpm-lock.yaml
pnpm install

# 提交更新后的 lockfile
git add pnpm-lock.yaml
git commit -m "chore: regenerate lockfile for pnpm 8"
git push origin main
```

---

## 总结

- ✅ 已识别问题：pnpm 版本不匹配
- ✅ 已提供解决方案：更新 workflow 到 pnpm 10
- ✅ 本地 lockfile 无需修改
- 📝 请通过 GitHub Web UI 完成最终修改

---

**创建时间**: 2025-10-29  
**相关文件**: `.github/workflows/sync-base-fees.yml`

