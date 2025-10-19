#!/usr/bin/env node
/**
 * 环境变量配置助手
 * 自动创建 .env.local 文件
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ENV_LOCAL_PATH = path.join(__dirname, '.env.local');
const ENV_EXAMPLE_PATH = path.join(__dirname, '.env.example');

console.log('\n🚀 0xcafe Web3 环境配置助手\n');
console.log('本助手将帮助您配置环境变量\n');

// 检查是否已存在 .env.local
if (fs.existsSync(ENV_LOCAL_PATH)) {
  console.log('⚠️  检测到已存在 .env.local 文件');
  rl.question('是否覆盖? (y/N): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('\n✅ 保留现有配置，退出设置');
      rl.close();
      process.exit(0);
    } else {
      startSetup();
    }
  });
} else {
  startSetup();
}

function startSetup() {
  const config = {
    NEXT_PUBLIC_APP_NAME: '0xcafe',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    NEXT_PUBLIC_REOWN_PROJECT_ID: '',
    NEXT_PUBLIC_SUPPORTED_CHAINS: '1,56,137,42161,8453',
    NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: '',
    NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: '',
    NODE_ENV: 'development'
  };

  console.log('\n📝 开始配置...\n');

  // 询问 Reown Project ID
  rl.question('Reown Project ID (从 https://cloud.reown.com/ 获取): ', (projectId) => {
    config.NEXT_PUBLIC_REOWN_PROJECT_ID = projectId.trim();

    // 询问 Telegram Bot Token
    rl.question('\nTelegram Bot Token (从 @BotFather 获取，可选): ', (botToken) => {
      config.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN = botToken.trim();

      // 询问 Telegram Bot Username
      rl.question('Telegram Bot Username (不含@，可选): ', (botUsername) => {
        config.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME = botUsername.trim();

        // 询问支持的链
        rl.question('\n支持的链ID (逗号分隔，默认: 1,56,137,42161,8453): ', (chains) => {
          if (chains.trim()) {
            config.NEXT_PUBLIC_SUPPORTED_CHAINS = chains.trim();
          }

          // 创建 .env.local 文件
          createEnvFile(config);
          createEnvExample();
          rl.close();
        });
      });
    });
  });
}

function createEnvFile(config) {
  const content = `# App Configuration
NEXT_PUBLIC_APP_NAME=${config.NEXT_PUBLIC_APP_NAME}
NEXT_PUBLIC_APP_URL=${config.NEXT_PUBLIC_APP_URL}

# Reown AppKit Configuration
NEXT_PUBLIC_REOWN_PROJECT_ID=${config.NEXT_PUBLIC_REOWN_PROJECT_ID}

# Supported Chain IDs
NEXT_PUBLIC_SUPPORTED_CHAINS=${config.NEXT_PUBLIC_SUPPORTED_CHAINS}

# Telegram Bot Configuration
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=${config.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=${config.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}

# Environment
NODE_ENV=${config.NODE_ENV}
`;

  try {
    fs.writeFileSync(ENV_LOCAL_PATH, content, 'utf8');
    console.log('\n✅ .env.local 文件创建成功!');
    
    // 验证配置
    console.log('\n📋 当前配置:');
    console.log('─'.repeat(50));
    console.log(`App Name: ${config.NEXT_PUBLIC_APP_NAME}`);
    console.log(`App URL: ${config.NEXT_PUBLIC_APP_URL}`);
    console.log(`Reown Project ID: ${config.NEXT_PUBLIC_REOWN_PROJECT_ID ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`Telegram Bot: ${config.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN ? '✅ 已配置' : '⚠️  未配置（可选）'}`);
    console.log(`支持的链: ${config.NEXT_PUBLIC_SUPPORTED_CHAINS}`);
    console.log('─'.repeat(50));
    
    if (!config.NEXT_PUBLIC_REOWN_PROJECT_ID) {
      console.log('\n⚠️  警告: Reown Project ID 未配置，钱包连接功能将无法使用');
      console.log('   请访问 https://cloud.reown.com/ 获取 Project ID');
    }
    
    console.log('\n🎉 配置完成！');
    console.log('\n📖 接下来的步骤:');
    console.log('   1. 如果未配置 Reown Project ID，请先获取并填入 .env.local');
    console.log('   2. 重启开发服务器: pnpm dev');
    console.log('   3. 访问 http://localhost:3000 查看效果');
    console.log('\n📚 详细文档请查看: INTEGRATION_GUIDE.md\n');
  } catch (error) {
    console.error('\n❌ 创建 .env.local 失败:', error.message);
    process.exit(1);
  }
}

function createEnvExample() {
  const exampleContent = `# App Configuration
NEXT_PUBLIC_APP_NAME=0xcafe
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Reown AppKit Configuration
# Get your project ID from: https://cloud.reown.com/
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id_here

# Supported Chain IDs (comma separated)
# Ethereum: 1, BSC: 56, Polygon: 137, Arbitrum: 42161, Base: 8453
NEXT_PUBLIC_SUPPORTED_CHAINS=1,56,137,42161,8453

# Telegram Bot Configuration
# Get your bot token from @BotFather on Telegram
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username

# Environment
NODE_ENV=development
`;

  try {
    if (!fs.existsSync(ENV_EXAMPLE_PATH)) {
      fs.writeFileSync(ENV_EXAMPLE_PATH, exampleContent, 'utf8');
      console.log('✅ .env.example 文件创建成功!');
    }
  } catch (error) {
    console.warn('⚠️  创建 .env.example 失败:', error.message);
  }
}

rl.on('close', () => {
  process.exit(0);
});

