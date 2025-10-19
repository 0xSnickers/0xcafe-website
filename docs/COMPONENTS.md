# Component Documentation

This document provides detailed information about the components used in this project.

## 📦 Component Categories

### 1. UI Components (`components/ui/`)

Base components built with Radix UI and styled with Tailwind CSS.

#### Button

```tsx
import { Button } from '@/components/ui/button'

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

**Props**:
- `variant`: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `asChild`: boolean - Merge props with child component

#### Separator

```tsx
import { Separator } from '@/components/ui/separator'

<Separator />
<Separator orientation="vertical" />
```

**Props**:
- `orientation`: 'horizontal' | 'vertical'
- `decorative`: boolean - Whether it's purely visual

### 2. Layout Components (`components/layout/`)

Components that define the page structure.

#### Header

Navigation header with responsive menu.

```tsx
import { Header } from '@/components/layout/header'

<Header />
```

**Features**:
- Responsive navigation menu
- Mobile hamburger menu
- Theme toggle integration
- Language toggle integration
- Scroll-based background blur

#### Footer

Site footer with links and social media.

```tsx
import { Footer } from '@/components/layout/footer'

<Footer />
```

**Features**:
- Multi-column layout
- Social media links
- Copyright information
- Responsive design

#### MainLayout

Main layout wrapper combining header, content, and footer.

```tsx
import { MainLayout } from '@/components/layout/main-layout'

<MainLayout>
  <YourContent />
</MainLayout>
```

### 3. Feature Components

#### ThemeToggle

Theme switcher button.

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

<ThemeToggle />
```

**Features**:
- Light/Dark mode toggle
- Smooth icon transition
- Persists preference to localStorage
- SSR-safe rendering

#### LocaleToggle

Language switcher button.

```tsx
import { LocaleToggle } from '@/components/locale-toggle'

<LocaleToggle />
```

**Features**:
- English/Chinese toggle
- Persists preference to localStorage
- Updates all translated content

### 4. Section Components (`components/sections/`)

Page section components with animations.

#### HeroSection

Hero/landing section with animated content.

```tsx
import { HeroSection } from '@/components/sections/hero-section'

<HeroSection />
```

**Features**:
- Animated title and subtitle
- CTA button
- Gradient background effects
- Responsive text sizing

#### FeaturesSection

Features showcase section.

```tsx
import { FeaturesSection } from '@/components/sections/features-section'

<FeaturesSection />
```

**Features**:
- Grid layout for features
- Icon integration
- Staggered animations
- Hover effects

### 5. Provider Components (`components/providers/`)

Context providers for global state.

#### ThemeProvider

Wraps the app to provide theme functionality.

```tsx
import { ThemeProvider } from '@/components/providers/theme-provider'

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

#### LocaleProvider

Provides i18n functionality.

```tsx
import { LocaleProvider } from '@/components/providers/locale-provider'

<LocaleProvider>
  {children}
</LocaleProvider>
```

**Usage with hook**:
```tsx
import { useLocale } from '@/components/providers/locale-provider'

function MyComponent() {
  const { locale, setLocale, t } = useLocale()
  
  return <h1>{t.hero.title}</h1>
}
```

## 🎨 Styling Guidelines

### Using cn() Utility

Combine and merge Tailwind classes:

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className // User-provided classes
)} />
```

### Responsive Design

Use Tailwind's responsive prefixes:

```tsx
<div className="
  grid
  grid-cols-1      // Mobile
  md:grid-cols-2   // Tablet
  lg:grid-cols-3   // Desktop
  gap-4
" />
```

### Dark Mode

Use the `dark:` prefix:

```tsx
<div className="
  bg-white
  dark:bg-gray-900
  text-gray-900
  dark:text-white
" />
```

## ✨ Animation Patterns

### Fade In

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Slide Up

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Stagger Children

```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

Where:
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
```

### Scroll Trigger

```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  Content
</motion.div>
```

## 🔧 Component Development

### Creating a New UI Component

1. Create file in `components/ui/`:

```tsx
// components/ui/card.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-border',
        outline: 'border-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}
```

2. Export from `components/ui/index.ts`:

```tsx
export { Card } from './card'
export { Button } from './button'
```

### Creating a Feature Component

```tsx
// components/sections/cta-section.tsx
'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/components/providers/locale-provider'

export function CtaSection() {
  const { t } = useLocale()

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{t.cta.title}</h2>
        <Button size="lg">{t.cta.button}</Button>
      </div>
    </motion.section>
  )
}
```

## 📝 Component Checklist

When creating a new component:

- [ ] Define TypeScript types/interfaces
- [ ] Add JSDoc comments
- [ ] Implement responsive design
- [ ] Add dark mode support
- [ ] Support i18n (if applicable)
- [ ] Add animations (if applicable)
- [ ] Ensure accessibility (ARIA labels, keyboard navigation)
- [ ] Test on mobile and desktop
- [ ] Test light and dark themes
- [ ] Add to documentation

## 🎯 Best Practices

1. **Type Safety**: Always use TypeScript types
2. **Composition**: Prefer composition over inheritance
3. **Single Responsibility**: Each component should do one thing well
4. **Props Interface**: Define clear prop interfaces
5. **Default Props**: Provide sensible defaults
6. **Error Handling**: Handle edge cases gracefully
7. **Performance**: Use React.memo for expensive components
8. **Accessibility**: Follow WCAG guidelines
9. **Testing**: Write tests for complex logic
10. **Documentation**: Document public APIs

## 🔍 Component Testing

```tsx
// __tests__/components/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByText('Outline')
    expect(button).toHaveClass('border')
  })
})
```

## 📚 Resources

- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [CVA Documentation](https://cva.style/docs)
- [Framer Motion API](https://www.framer.com/motion/)
- [React Testing Library](https://testing-library.com/react)

