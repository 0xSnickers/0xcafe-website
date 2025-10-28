# 0xcafe Website

A modern, responsive website built with Next.js 15, featuring multi-language support, theme switching, and smooth animations.

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
│   ├── api/                 # API routes
│   │   ├── gas/            # Gas price API
│   │   └── database/       # Database API endpoints
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── layout/              # Layout components
│   ├── sections/            # Page sections
│   ├── providers/           # Context providers
│   ├── theme-toggle.tsx     # Theme switcher
│   └── locale-toggle.tsx    # Language switcher
├── backend/                 # Backend code
│   ├── http/                # HTTP client and APIs
│   ├── postgresql/          # PostgreSQL/Supabase integration
│   │   ├── client.ts        # Database client
│   │   ├── queries.ts       # Database queries
│   │   ├── types.ts         # Database types
│   │   └── README.md        # Database documentation
│   └── services/            # Backend services
├── lib/                     # Utility functions
│   ├── utils.ts             # General utilities
│   └── i18n/                # i18n configuration
│       ├── config.ts        # i18next setup
│       └── locales/         # Translation files
│           ├── en.json      # English
│           └── zh.json      # Chinese
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

## 📚 Documentation

- [Development Guide](./docs/DEVELOPMENT.md)
- [Component Documentation](./docs/COMPONENTS.md)
- [Internationalization (i18n)](./docs/I18N.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture](./docs/ARCHITECTURE.md)

## 🧪 Available Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
pnpm format       # Format code with Prettier

# Testing
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Run tests with coverage
```

## 🎨 Features Implementation

### Theme Switching
The website supports light/dark theme switching using `next-themes`. The theme preference is automatically saved to localStorage.

### Multi-language Support
Professional i18n implementation using i18next and react-i18next. Supports English and Chinese with easy extensibility for additional languages. Language preference is automatically saved to localStorage.

### Responsive Design
Mobile-first responsive design using Tailwind CSS breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Animations
Smooth page transitions and component animations using Framer Motion, including:
- Page enter/exit animations
- Scroll-triggered animations
- Hover effects
- Custom motion components

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please contact us at [your-email@example.com](mailto:your-email@example.com)

---

Made with ❤️ by 0xcafe Team

