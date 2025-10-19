'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Send, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTelegramAuth } from '@/hooks/use-telegram-auth'
import { cn } from '@/lib/utils'

/**
 * Telegram 连接组件属性
 */
export interface TelegramConnectProps {
  /**
   * Telegram Bot 用户名（不含 @）
   */
  botUsername?: string
  
  /**
   * 组件类名
   */
  className?: string
  
  /**
   * 连接状态变化回调
   * @param _connected - 连接状态
   */
  onConnectionChange?: (_connected: boolean) => void
  
  /**
   * 显示模式：card（卡片）、inline（内联）或 button（按钮）
   */
  variant?: 'card' | 'inline' | 'button'
}

/**
 * Telegram 连接组件
 * 
 * 提供 Telegram 账号连接功能，使用官方 Widget 实现安全认证
 * 
 * @example
 * ```tsx
 * <TelegramConnect 
 *   botUsername="your_bot_username"
 *   onConnectionChange={(isConnected) => console.log(isConnected)}
 * />
 * ```
 */
export function TelegramConnect({
  botUsername,
  className,
  onConnectionChange,
  variant = 'card',
}: TelegramConnectProps) {
  const widgetContainerRef = React.useRef<HTMLDivElement>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [containerReady, setContainerReady] = React.useState(false)
  
  const {
    connection,
    isLoading,
    message,
    widgetLoaded,
    disconnect,
    clearMessage,
  } = useTelegramAuth({
    botUsername: botUsername || process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '0xcafe_bot',
    requestAccess: 'write',
    size: 'large',
  })

  // 渲染 Widget
  React.useEffect(() => {
    // 检查渲染条件
    if (!widgetLoaded || !containerReady || !widgetContainerRef.current) {
      return
    }
    
    if (connection?.status === 'connected') {
      return // 已连接时不渲染Widget
    }
    
    if (variant === 'button' && !isDialogOpen) {
      return // button模式只在dialog打开时渲染
    }
    
    // 渲染 Telegram Widget
    const container = widgetContainerRef.current
    container.innerHTML = ''

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botUsername || process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '0xcafe_bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')

    container.appendChild(script)
  }, [widgetLoaded, botUsername, connection, variant, isDialogOpen, containerReady])

  // 通知连接状态变化
  React.useEffect(() => {
    onConnectionChange?.(connection?.status === 'connected')
  }, [connection?.status, onConnectionChange])

  /**
   * 获取状态徽章样式
   */
  const getStatusBadge = () => {
    if (connection?.status === 'connected') {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          已连接
        </Badge>
      )
    }
    
    return (
      <Badge variant="secondary">
        <XCircle className="mr-1 h-3 w-3" />
        未连接
      </Badge>
    )
  }

  /**
   * 渲染连接信息
   */
  const renderConnectionInfo = () => {
    if (connection?.status !== 'connected' || !connection.user) return null

    return (
      <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">用户名</span>
          <span className="font-medium">
            {connection.user.username || connection.user.first_name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">用户 ID</span>
          <span className="font-mono text-xs">{connection.user.id}</span>
        </div>
        {connection.connectedAt && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">连接时间</span>
            <span className="text-xs">
              {new Date(connection.connectedAt).toLocaleString('zh-CN')}
            </span>
          </div>
        )}
      </div>
    )
  }

  /**
   * 渲染消息提示
   */
  const renderMessage = () => {
    if (!message) return null

    return (
      <Alert 
        variant={message.type === 'error' ? 'destructive' : 'default'}
        className={cn(
          message.type === 'success' && 'border-green-500 text-green-700',
          message.type === 'info' && 'border-blue-500 text-blue-700'
        )}
      >
        <AlertDescription className="flex items-center justify-between">
          <span>{message.text}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessage}
            className="h-6 px-2"
          >
            ✕
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  /**
   * 渲染 Widget 容器
   */
  const renderWidget = () => {
    if (connection?.status === 'connected') {
      return (
        <Button 
          onClick={disconnect} 
          variant="destructive" 
          className="w-full"
        >
          断开连接
        </Button>
      )
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-6">
          <div className="text-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">验证中...</p>
          </div>
        </div>
      )
    }

    const finalBotUsername = botUsername || process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ''
    
    if (!finalBotUsername) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            ⚠️ 请配置 NEXT_PUBLIC_TELEGRAM_BOT_USERNAME 环境变量
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <div className="space-y-3">
        <div
          ref={widgetContainerRef}
          className="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-6 min-h-[60px]"
        />
        <p className="text-xs text-center text-muted-foreground">
          点击上方按钮使用 Telegram 官方登录
        </p>
      </div>
    )
  }

  /**
   * 按钮模式渲染 - 用于Header
   */
  if (variant === 'button') {
    const handleDisconnect = () => {
      disconnect()
      setIsDialogOpen(false)
    }

    // 未连接状态
    if (connection?.status !== 'connected') {
      return (
        <>
          <Button
            variant="ghost"
            onClick={() => setIsDialogOpen(true)}
            className={cn('gap-2', className)}
          >
            <Send className="h-4 w-4" />
            <span className="hidden md:inline">Telegram</span>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setContainerReady(false)
            }
          }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-500" />
                  连接 Telegram
                </DialogTitle>
              
              </DialogHeader>

              <div className="space-y-4 py-4">
                
                {isLoading ? (
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-8">
                    <div className="text-center space-y-2">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">验证中...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      ref={(el) => {
                        widgetContainerRef.current = el
                        setContainerReady(!!el)
                      }}
                      className="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-2 min-h-[60px]"
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      点击上方按钮使用 Telegram 官方登录
                    </p>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )
    }

    // 已连接状态 - 显示下拉菜单
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn('gap-2', className)}>
            {/* <CheckCircle2 className="h-4 w-4 text-green-500" /> */}
            <Send className="h-4 w-4" />

            <span className="hidden md:inline">
              {connection.user?.first_name || 'Telegram'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Telegram Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-3 text-sm">
            <div className="space-y-1">
              <p className="font-medium">
                {connection.user?.first_name} {connection.user?.last_name}
              </p>
              {connection.user?.username && (
                <p className="text-xs text-muted-foreground">
                  @{connection.user.username}
                </p>
              )}
              {/* <p className="text-xs text-muted-foreground">
                ID: {connection.user?.id}
              </p> */}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDisconnect}
            className="text-red-600 focus:text-red-600 cursor-pointer"
          >
            断开连接
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  /**
   * 内联模式渲染
   */
  if (variant === 'inline') {
    return (
      <div className={cn('space-y-4', className)}>
        {renderMessage()}
        {renderConnectionInfo()}
        {renderWidget()}
      </div>
    )
  }

  /**
   * 卡片模式渲染（默认）
   */
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Send className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle>Telegram</CardTitle>
              <CardDescription>连接 Telegram 账号接收通知</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {renderMessage()}
        {renderConnectionInfo()}
        {renderWidget()}
      </CardContent>
    </Card>
  )
}

