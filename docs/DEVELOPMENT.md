# Development Guide

This guide will help you set up your development environment and understand the development workflow.

## 🔧 Setup

### System Requirements

- **Node.js**: 18.x or higher (20.x LTS recommended)
- **pnpm**: 8.x or higher
- **Git**: Latest version

### Initial Setup

1. **Clone the repository**:
```bash
git clone <repository-url>
cd 0xcafe-website
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=0xcafe
```

4. **Start development server**:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

### Directory Organization

```
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   └── providers/        # Context providers
├── lib/                  # Utility functions
│   ├── utils.ts         # General utilities
│   └── i18n.ts          # Internationalization
├── public/              # Static assets
│   ├── images/
│   └── fonts/
├── docs/                # Documentation
└── scripts/             # Build scripts
```

## 🎨 Styling

### Tailwind CSS

We use Tailwind CSS for styling. Key concepts:

1. **Utility-first approach**:
```tsx
<div className="flex items-center justify-between p-4 bg-primary text-white">
```

2. **Responsive design**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

3. **Dark mode**:
```tsx
<div className="bg-white dark:bg-gray-900">
```

### Custom Styles

For complex styles, use the `@layer` directive in `globals.css`:

```css
@layer components {
  .custom-class {
    @apply flex items-center space-x-2;
  }
}
```

## 🧩 Component Development

### Creating a New Component

1. **UI Component** (in `components/ui/`):

```tsx
// components/ui/card.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        variant === 'outline' && 'border-2',
        className
      )}
      {...props}
    />
  )
}
```

2. **Feature Component** (in `components/[feature]/`):

```tsx
// components/sections/about-section.tsx
'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useLocale } from '@/components/providers/locale-provider'

export function AboutSection() {
  const { t } = useLocale()

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-20"
    >
      {/* Content */}
    </motion.section>
  )
}
```

## 🌐 Internationalization

### Adding New Translations

1. Update `lib/i18n.ts`:

```typescript
export interface Translations {
  // ... existing translations
  newSection: {
    title: string
    description: string
  }
}

export const en: Translations = {
  // ... existing
  newSection: {
    title: 'New Section',
    description: 'Description here',
  },
}

export const zh: Translations = {
  // ... existing
  newSection: {
    title: '新章节',
    description: '描述内容',
  },
}
```

2. Use in components:

```tsx
const { t } = useLocale()
return <h1>{t.newSection.title}</h1>
```

## ✨ Animations

### Using Framer Motion

1. **Basic animation**:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

2. **Scroll-triggered animation**:

```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  Content
</motion.div>
```

3. **Hover effects**:

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Writing Tests

```typescript
// __tests__/components/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## 🔍 Code Quality

### Linting

```bash
# Run ESLint
pnpm lint

# Fix auto-fixable issues
pnpm lint --fix
```

### Type Checking

```bash
pnpm type-check
```

### Formatting

```bash
# Format all files
pnpm format
```

## 🚀 Building for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## 🐛 Debugging

### VS Code Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev"
    }
  ]
}
```

### Browser DevTools

- Use React DevTools extension
- Check Next.js DevTools in browser console
- Monitor network requests
- Inspect component props and state

## 📊 Performance

### Monitoring

1. **Lighthouse**: Run audits in Chrome DevTools
2. **Web Vitals**: Check Core Web Vitals metrics
3. **Bundle Analysis**: Analyze bundle size

```bash
# Analyze bundle
pnpm build --analyze
```

### Optimization Tips

1. Use Next.js Image component for images
2. Implement code splitting with dynamic imports
3. Use React.memo for expensive components
4. Optimize fonts with next/font

## 🔐 Environment Variables

### Client-side Variables

Prefix with `NEXT_PUBLIC_`:
```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Server-side Variables

No prefix needed:
```env
API_SECRET_KEY=your-secret-key
```

## 🤝 Git Workflow

### Branch Naming

- Feature: `feature/feature-name`
- Fix: `fix/bug-description`
- Hotfix: `hotfix/critical-issue`

### Commit Messages

Follow conventional commits:
```
feat(component): add new button variant
fix(api): handle error responses
docs(readme): update installation steps
```

## 📝 Best Practices

1. **Components**:
   - Keep components small and focused
   - Use TypeScript for all components
   - Add prop types and JSDoc comments
   - Implement proper error boundaries

2. **State Management**:
   - Use React Context for global state
   - Keep state as local as possible
   - Use proper memoization

3. **Performance**:
   - Lazy load heavy components
   - Optimize images
   - Minimize re-renders
   - Use proper caching strategies

4. **Accessibility**:
   - Use semantic HTML
   - Add ARIA labels
   - Ensure keyboard navigation
   - Test with screen readers

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**:
```bash
# Kill process on port 3000
npx kill-port 3000
```

2. **Module not found**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

3. **Type errors**:
```bash
# Regenerate types
pnpm type-check
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

