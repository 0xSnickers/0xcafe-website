# Architecture Documentation

This document describes the architecture and design decisions for the 0xcafe website.

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Light/Dark  │  │  EN/ZH Lang  │  │   Framer     │ │
│  │    Theme     │  │    Switch    │  │   Motion     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Next.js Server                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │              App Router (Next.js 15)              │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐ │  │
│  │  │ Pages  │  │  API   │  │ Static │  │ Server │ │  │
│  │  │  SSR   │  │ Routes │  │  Gen   │  │  Comp  │ │  │
│  │  └────────┘  └────────┘  └────────┘  └────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    External Services                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   CDN/Edge   │  │   Analytics  │  │     APIs     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
0xcafe-website/
├── app/                        # Next.js App Router
│   ├── (routes)/              # Route groups
│   │   └── [locale]/          # Locale-based routes
│   ├── api/                   # API routes
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
│
├── components/                # React components
│   ├── ui/                    # Base UI components
│   │   ├── button.tsx
│   │   ├── separator.tsx
│   │   └── ...
│   ├── layout/                # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── main-layout.tsx
│   ├── sections/              # Page sections
│   │   ├── hero-section.tsx
│   │   └── features-section.tsx
│   ├── providers/             # Context providers
│   │   ├── theme-provider.tsx
│   │   └── locale-provider.tsx
│   ├── theme-toggle.tsx
│   └── locale-toggle.tsx
│
├── lib/                       # Utility functions
│   ├── utils.ts               # General utilities
│   └── i18n.ts                # Internationalization
│
├── public/                    # Static assets
│   ├── images/
│   ├── fonts/
│   └── ...
│
├── docs/                      # Documentation
│   ├── README.md
│   ├── DEVELOPMENT.md
│   ├── COMPONENTS.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
└── scripts/                   # Build scripts
```

## 🎯 Design Patterns

### 1. Component Architecture

**Atomic Design Pattern**:
- **Atoms**: Basic UI components (Button, Separator)
- **Molecules**: Simple component groups (ThemeToggle, LocaleToggle)
- **Organisms**: Complex components (Header, Footer)
- **Templates**: Page layouts (MainLayout)
- **Pages**: Complete pages (Home, About)

### 2. State Management

**Context API for Global State**:
```tsx
// Theme State
ThemeProvider (next-themes)
  └── useTheme() hook

// Locale State
LocaleProvider (custom)
  └── useLocale() hook
```

### 3. Rendering Strategies

**Hybrid Rendering**:
- **Static Generation (SSG)**: Marketing pages
- **Server-Side Rendering (SSR)**: Dynamic content
- **Client-Side Rendering (CSR)**: Interactive components
- **Incremental Static Regeneration (ISR)**: Updated content

## 🔧 Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15+ | React framework |
| React | 19+ | UI library |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3.4+ | Styling |
| Framer Motion | 12+ | Animations |

### UI Components

| Library | Purpose |
|---------|---------|
| Radix UI | Unstyled primitives |
| Lucide React | Icons |
| CVA | Component variants |
| next-themes | Theme switching |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code quality |
| Prettier | Code formatting |
| TypeScript | Type checking |
| pnpm | Package management |

## 🌐 Internationalization (i18n)

### Architecture

```
┌─────────────────────────────────────────┐
│         LocaleProvider Context          │
│  ┌───────────────────────────────────┐  │
│  │  Locale State (en/zh)             │  │
│  │  Translation Dictionary           │  │
│  │  setLocale Function               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│   English    │        │   Chinese    │
│ Translations │        │ Translations │
└──────────────┘        └──────────────┘
```

### Translation Structure

```typescript
interface Translations {
  nav: { ... }
  hero: { ... }
  footer: { ... }
  // ... more sections
}
```

## 🎨 Theme System

### Architecture

```
┌─────────────────────────────────────────┐
│         ThemeProvider (next-themes)     │
│  ┌───────────────────────────────────┐  │
│  │  Theme State (light/dark/system)  │  │
│  │  localStorage Persistence         │  │
│  │  setTheme Function                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│  Light Mode  │        │  Dark Mode   │
│  CSS Vars    │        │  CSS Vars    │
└──────────────┘        └──────────────┘
```

### CSS Variables

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71.4% 4.1%;
  /* ... */
}

.dark {
  --background: 224 71.4% 4.1%;
  --foreground: 210 20% 98%;
  /* ... */
}
```

## ✨ Animation System

### Framer Motion Integration

```
Component Tree
    │
    ├── Initial State (hidden)
    │   └── opacity: 0, y: 20
    │
    ├── Animate State (visible)
    │   └── opacity: 1, y: 0
    │
    └── Exit State (hidden)
        └── opacity: 0, y: -20
```

### Animation Patterns

1. **Page Transitions**: Fade in/out
2. **Scroll Animations**: Reveal on scroll
3. **Hover Effects**: Scale and color changes
4. **Stagger Effects**: Sequential animations

## 🔐 Security Architecture

### Security Layers

```
┌─────────────────────────────────────────┐
│          Application Security            │
│  ┌───────────────────────────────────┐  │
│  │  1. HTTPS/TLS Encryption          │  │
│  │  2. Security Headers               │  │
│  │  3. Input Validation               │  │
│  │  4. XSS Protection                 │  │
│  │  5. CSRF Protection                │  │
│  │  6. Content Security Policy        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Environment Variables

- **Server-side**: No prefix (secure)
- **Client-side**: `NEXT_PUBLIC_` prefix (exposed)

## 📊 Performance Optimization

### Optimization Strategies

1. **Code Splitting**:
   - Dynamic imports for heavy components
   - Route-based splitting by default

2. **Image Optimization**:
   - Next.js Image component
   - WebP/AVIF formats
   - Lazy loading

3. **Bundle Optimization**:
   - Tree shaking
   - SWC minification
   - Package optimization

4. **Caching**:
   - Static assets cached at CDN
   - API responses cached
   - ISR for dynamic content

### Performance Metrics

Target Core Web Vitals:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🔄 Data Flow

### Component Data Flow

```
┌─────────────────────────────────────────┐
│           Root Layout                    │
│  ┌───────────────────────────────────┐  │
│  │  ThemeProvider                    │  │
│  │    └── LocaleProvider             │  │
│  │         └── MainLayout            │  │
│  │              ├── Header           │  │
│  │              │   ├── useTheme()   │  │
│  │              │   └── useLocale()  │  │
│  │              ├── Content          │  │
│  │              │   └── useLocale()  │  │
│  │              └── Footer           │  │
│  │                  └── useLocale()  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────┐
│              Vercel Edge                 │
│  ┌───────────────────────────────────┐  │
│  │  Global CDN                       │  │
│  │  ├── Static Assets                │  │
│  │  ├── Image Optimization           │  │
│  │  └── Edge Functions               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Next.js Application              │
│  ┌───────────────────────────────────┐  │
│  │  Server Components                │  │
│  │  Client Components                │  │
│  │  API Routes                       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 📱 Responsive Design

### Breakpoints

```typescript
// Tailwind breakpoints
{
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px'  // Extra large
}
```

### Mobile-First Approach

```tsx
<div className="
  w-full           // Mobile
  md:w-1/2        // Tablet
  lg:w-1/3        // Desktop
" />
```

## 🧪 Testing Strategy

### Test Pyramid

```
        ┌─────────────┐
        │   E2E Tests │ (Few)
        └─────────────┘
      ┌─────────────────┐
      │ Integration Tests│ (Some)
      └─────────────────┘
    ┌─────────────────────┐
    │    Unit Tests       │ (Many)
    └─────────────────────┘
```

### Testing Tools

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright (future)
- **Component Tests**: Storybook (future)

## 📈 Scalability

### Horizontal Scaling

```
Load Balancer
    │
    ├── Instance 1
    ├── Instance 2
    └── Instance N
```

### Caching Strategy

```
Browser Cache
    └── CDN Cache
        └── Server Cache
            └── Database
```

## 🔍 Monitoring & Analytics

### Monitoring Stack

- **Performance**: Vercel Analytics
- **Errors**: Sentry (future)
- **User Analytics**: Google Analytics (future)
- **Uptime**: Vercel Status

## 🎯 Future Enhancements

### Planned Features

1. **Backend Integration**:
   - API routes for dynamic content
   - Database integration
   - Authentication system

2. **Advanced Features**:
   - Blog/CMS integration
   - Search functionality
   - User accounts
   - Newsletter subscription

3. **Performance**:
   - Service Worker for offline support
   - Advanced caching strategies
   - Further bundle optimization

4. **Analytics**:
   - Custom analytics dashboard
   - A/B testing framework
   - User behavior tracking

## 📚 References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel Platform](https://vercel.com/docs)

---

Last updated: 2025-01-27  
Version: 1.0.0

