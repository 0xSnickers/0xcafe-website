# Deployment Guide

This guide covers deploying the 0xcafe website to various platforms.

## 🚀 Quick Deploy

### Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js
   - Click "Deploy"

3. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add your environment variables
   - Redeploy if needed

### Netlify

1. **Build Settings**:
   - Build command: `pnpm build`
   - Publish directory: `.next`
   - Install command: `pnpm install`

2. **netlify.toml** configuration:
```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Docker

1. **Create Dockerfile**:
```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm && pnpm build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Build and run**:
```bash
docker build -t 0xcafe-website .
docker run -p 3000:3000 0xcafe-website
```

## 📋 Pre-deployment Checklist

### Code Quality
- [ ] All tests passing (`pnpm test`)
- [ ] No linting errors (`pnpm lint`)
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] Code formatted (`pnpm format`)

### Performance
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals optimized

### SEO
- [ ] Meta tags configured
- [ ] robots.txt present
- [ ] sitemap.xml generated
- [ ] Open Graph images set

### Security
- [ ] Environment variables secured
- [ ] API keys not exposed
- [ ] HTTPS enabled
- [ ] Security headers configured

### Functionality
- [ ] Theme switching works
- [ ] Language switching works
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] Forms working
- [ ] API routes tested

## 🌍 Environment Variables

### Required Variables

```env
# Production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=0xcafe

# Optional
NEXT_PUBLIC_API_URL=https://api.your-domain.com
ANALYTICS_ID=your-analytics-id
```

### Setting Variables by Platform

**Vercel**:
- Dashboard → Settings → Environment Variables
- Add variables for Production/Preview/Development

**Netlify**:
- Dashboard → Site settings → Build & deploy → Environment

**Docker**:
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=https://your-domain.com \
  0xcafe-website
```

## 🔧 Build Optimization

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Compress responses
  compress: true,
  
  // Minify JS
  swcMinify: true,
  
  // Output standalone
  output: 'standalone',
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}
```

### Image Optimization

```typescript
// next.config.ts
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

## 📊 Monitoring

### Analytics

**Google Analytics**:
```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Error Tracking

**Sentry**:
```bash
pnpm add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

## 🔐 Security

### Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

## 🌐 Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records:
   - Type: A
   - Name: @
   - Value: 76.76.21.21

### Netlify

1. Go to Domain settings
2. Add custom domain
3. Update DNS:
   - Type: CNAME
   - Name: www
   - Value: your-site.netlify.app

## 🔄 CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Performance Optimization

### Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.com --view
```

### Bundle Analysis

```bash
# Analyze bundle
ANALYZE=true pnpm build
```

Add to `next.config.ts`:
```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

## 🚨 Rollback Strategy

### Vercel

1. Go to Deployments
2. Find previous successful deployment
3. Click "..." → Promote to Production

### Docker

```bash
# Tag versions
docker tag 0xcafe-website:latest 0xcafe-website:v1.0.0

# Rollback
docker stop current-container
docker run -p 3000:3000 0xcafe-website:v1.0.0
```

## 📝 Post-deployment

### Verification

- [ ] Site loads correctly
- [ ] SSL certificate active
- [ ] All pages accessible
- [ ] API routes working
- [ ] Theme switching works
- [ ] Language switching works
- [ ] Analytics tracking
- [ ] Error monitoring active

### DNS Propagation

Check DNS propagation:
```bash
# Check DNS
dig your-domain.com

# Check globally
# Use https://dnschecker.org
```

## 🆘 Troubleshooting

### Build Failures

1. **Check build logs**
2. **Verify environment variables**
3. **Test build locally**: `pnpm build`
4. **Clear cache**: Remove `.next` folder

### Runtime Errors

1. **Check error monitoring** (Sentry)
2. **Review server logs**
3. **Verify environment variables**
4. **Test in production mode locally**:
```bash
pnpm build
pnpm start
```

### Performance Issues

1. **Run Lighthouse audit**
2. **Check bundle size**
3. **Analyze network requests**
4. **Review database queries** (if applicable)

## 📞 Support

For deployment issues:
- Check documentation: [Next.js Deployment](https://nextjs.org/docs/deployment)
- Vercel support: [vercel.com/support](https://vercel.com/support)
- GitHub Issues: Create an issue in the repository

---

Last updated: 2025-01-27

