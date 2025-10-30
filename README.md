# 0xcafe Website

A Free Blockchain Tools Website, Make web3 on-chain operations simpler and faster.

## ✨ Features

- 🌐 **Multi-language Support** - English and Chinese with i18next
- 🌓 **Theme Switching** - Light/Dark mode with next-themes
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- ✨ **Smooth Animations** - Powered by Framer Motion
- ⚡ **Fast Performance** - Optimized with Next.js 15 App Router
- 🎨 **Modern UI** - Built with Radix UI components
- 🔧 **TypeScript** - Full type safety
- 📦 **pnpm** - Fast, disk space efficient package manager

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended 20.x LTS)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 0xcafe-website
```

2. Install dependencies:
```bash
pnpm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
.
├── app/                      # Next.js App Router pages
├── components/              # React components
├── backend/                 # Backend code
│   ├── http/                # HTTP client and APIs
│   ├── postgresql/          # PostgreSQL/Supabase integration
│   └── services/            # Backend services
├── lib/                     # Utility functions
│   ├── utils.ts             # General utilities
│   └── i18n/                # i18n configuration
├── subgraph/                # The Graph subgraph code
├── public/                  # Static assets
├── docs/                    # Documentation
└── scripts/                 # Build scripts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15+
- **React**: 19+
- **TypeScript**: 5+
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Theme**: next-themes
- **i18n**: i18next + react-i18next
- **Icons**: Lucide React
- **Database**: PostgreSQL (Supabase)
- **Blockchain**: The Graph, Wagmi, Viem

---

Made with ❤️ by 0xcafe Team

