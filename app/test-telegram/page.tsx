'use client'

import { TelegramConnect } from '@/components/telegram'

export default function TestTelegramPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Telegram 连接测试</h1>
      <p className="text-muted-foreground mb-8">
        Bot Username: {process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '0xcafe_bot (默认)'}
      </p>
      
      {/* 卡片模式测试 */}
      {/* <div className="max-w-md mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">卡片模式 (Card)</h2>
        <TelegramConnect 
          variant="card"
          onConnectionChange={(_connected) => {
          }}
        />
      </div> */}

      {/* 内联模式测试 */}
      {/* <div className="max-w-md mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">内联模式 (Inline)</h2>
        <TelegramConnect 
          variant="inline"
          onConnectionChange={(_connected) => {
          }}
        />
      </div> */}

      {/* 按钮模式测试 */}
      <div className="max-w-md mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">按钮模式 (Button) - Header样式</h2>
        <div className="flex items-center space-x-2 p-4 border rounded-lg">
          <TelegramConnect 
            variant="button"
            onConnectionChange={(_connected) => {
              // console.log('Telegram 按钮模式连接状态:', _connected)
            }}
          />
        </div>
      </div>
    </div>
  )
}
