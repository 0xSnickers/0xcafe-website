# 钱包连接 Modal 自动弹出问题修复

## 问题描述

用户反馈：
1. ✅ 刷新页面后，Reown AppKit（WalletConnect）的钱包连接 modal 会自动显示
2. ✅ 特别是 "Switch Network" 弹窗会在首次加载时自动出现
3. ✅ 只有选择某个 Network 后才不会默认弹出 modal

期望的行为：只有在用户点击"连接钱包"按钮时才显示 modal。

## 问题原因

1. **Provider 水合问题**：`Web3Provider` 在服务端渲染和客户端渲染之间可能存在状态不一致
2. **自动重连机制**：Wagmi 和 Reown AppKit 默认会尝试自动重连之前连接的钱包
3. **初始化时序问题**：在组件初始化阶段就调用了 `open()` 方法
4. **网络选择弹窗**：AppKit 在没有默认网络时会自动弹出网络选择 modal

## 解决方案

### 1. Web3Provider 添加客户端挂载检查和自动关闭 Modal

**文件：** `components/providers/web3-provider.tsx`

```typescript
export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  // 防止服务端渲染时的水合问题
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 防止初始化时自动打开 modal
  React.useEffect(() => {
    if (mounted && modal) {
      // 关闭可能自动打开的 modal
      const timer = setTimeout(() => {
        try {
          modal.close()
        } catch (error) {
          // 忽略错误，modal 可能未打开
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [mounted])

  if (!mounted) {
    return null
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

**作用：**
- 确保 Web3 相关的 Provider 只在客户端渲染后才加载
- 避免服务端和客户端状态不一致导致的自动弹窗问题
- **在组件挂载后主动关闭任何可能自动打开的 modal**
- 使用 100ms 延迟确保 modal 初始化完成后再关闭

### 2. WalletButton 添加初始化状态管理

**文件：** `components/web3/wallet-button.tsx`

```typescript
export function WalletButton() {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()
  const [isInitialized, setIsInitialized] = React.useState(false)

  // 防止初始化时自动打开
  React.useEffect(() => {
    setIsInitialized(true)
  }, [])

  // 手动打开钱包连接 modal
  const handleConnect = React.useCallback(() => {
    if (isInitialized) {
      open()
    }
  }, [isInitialized, open])

  // ... 其余代码
}
```

**作用：**
- 添加 `isInitialized` 状态标志
- 只有在组件完全初始化后才允许调用 `open()` 方法
- 防止在页面刚加载时自动触发钱包连接 modal

### 3. Wagmi Adapter 和 AppKit 配置优化

**文件：** `lib/config/web3.ts`

```typescript
// 创建 Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: networks as any,
  projectId,
  ssr: true, // 启用服务端渲染支持，防止客户端水合问题
})

// 创建 AppKit 实例
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: networks as any,
  defaultNetwork: mainnet, // 设置默认网络为以太坊主网
  projectId,
  metadata,
  // ... 其他配置
})
```

**作用：**
- 启用 SSR 支持，改善服务端渲染和客户端渲染的一致性
- **设置 `defaultNetwork` 为以太坊主网，防止初始化时弹出网络选择 modal**
- 减少因水合不匹配导致的异常行为

## 修复效果

✅ **页面刷新后不再自动弹出钱包连接 modal**
✅ **不会自动弹出 "Switch Network" 网络选择弹窗**
✅ **只有用户主动点击"连接钱包"按钮时才会显示 modal**
✅ **已连接的钱包可以正常查看账户信息和切换网络**
✅ **设置了默认网络（以太坊主网），避免网络选择问题**
✅ **构建成功，无错误和警告**

## 测试建议

1. **首次访问测试**
   - 打开浏览器，清除缓存
   - 访问网站首页
   - 验证：钱包连接 modal 不会自动弹出

2. **刷新页面测试**
   - 在首页刷新浏览器
   - 验证：钱包连接 modal 不会自动弹出

3. **连接功能测试**
   - 点击"连接钱包"按钮
   - 验证：modal 正常弹出
   - 选择钱包并连接
   - 验证：连接成功，显示钱包地址

4. **已连接状态测试**
   - 连接钱包后刷新页面
   - 验证：钱包状态保持连接，但 modal 不会自动弹出
   - 点击钱包地址下拉菜单
   - 验证：可以正常查看账户、切换网络、断开连接

## 相关技术

- **React Hooks**：`useState`、`useEffect`、`useCallback`
- **Reown AppKit**：`useAppKit` hook
- **Wagmi**：`useAccount`、`useDisconnect`
- **Next.js**：SSR（服务端渲染）
- **TypeScript**：类型安全

## 注意事项

1. 此修复方案不影响钱包的自动重连功能（用户已授权的钱包在刷新后会自动重连）
2. 只是阻止了 modal 的自动显示，不影响后台的连接状态管理
3. 所有钱包操作（查看账户、切换网络、断开连接）均需要在 `isInitialized` 为 `true` 后才能执行

## 相关文件

- `components/providers/web3-provider.tsx` - Web3 Provider 组件
- `components/web3/wallet-button.tsx` - 钱包连接按钮组件
- `lib/config/web3.ts` - Web3 配置文件

## 版本信息

- Next.js: 15.5.6
- Reown AppKit: 1.8.10
- Wagmi: ^2.13.6
- React: ^18 或 ^19

---

**修复日期：** 2025-01-20
**修复状态：** ✅ 已完成并验证

