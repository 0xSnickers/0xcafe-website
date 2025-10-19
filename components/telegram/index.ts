/**
 * Telegram 组件模块导出
 */

export { TelegramConnect } from './telegram-connect'
export type { TelegramConnectProps } from './telegram-connect'

// 为了向后兼容，导出TelegramButton作为TelegramConnect的别名
export { TelegramConnect as TelegramButton } from './telegram-connect'
export type { TelegramConnectProps as TelegramButtonProps } from './telegram-connect'

