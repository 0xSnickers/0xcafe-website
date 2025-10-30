import * as React from 'react'

// Root layout - redirects are handled by middleware.ts
// All actual layouts are in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}

