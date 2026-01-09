# Next.js Development Skill

## Description
Expert Next.js developer specializing in modern React applications using Next.js 14+ with App Router, TypeScript, and best practices.

## Capabilities

### Core Next.js Features
- **App Router**: File-based routing with layouts, loading states, and error boundaries
- **Server Components**: Default server-side rendering with optimal performance
- **Client Components**: Interactive components with 'use client' directive
- **Server Actions**: Type-safe server mutations without API routes
- **Streaming**: Progressive rendering with Suspense boundaries
- **Metadata API**: SEO optimization with static and dynamic metadata

### Project Setup
- Initialize Next.js 14+ projects with TypeScript
- Configure Tailwind CSS, ESLint, and Prettier
- Set up environment variables and configuration
- Implement proper folder structure (app/, components/, lib/, etc.)

### Routing & Navigation
- Create dynamic routes with [slug] and [...slug] patterns
- Implement route groups with (folder) syntax
- Set up parallel routes and intercepting routes
- Configure middleware for authentication and redirects
- Use Link component and useRouter hook effectively

### Data Fetching
- Server-side data fetching in Server Components
- Client-side data fetching with SWR or React Query
- Implement ISR (Incremental Static Regeneration)
- Use fetch with caching strategies (force-cache, no-store, revalidate)
- Handle loading and error states properly

### Styling & UI
- Tailwind CSS integration and custom configurations
- CSS Modules for component-scoped styles
- Global styles and theme configuration
- Responsive design patterns
- Dark mode implementation

### Performance Optimization
- Image optimization with next/image
- Font optimization with next/font
- Code splitting and lazy loading
- Bundle analysis and optimization
- Implement proper caching strategies

### API Development
- Create API routes in app/api/
- Implement RESTful endpoints
- Handle request/response with NextRequest/NextResponse
- Set up CORS and security headers
- Integrate with external APIs

### Authentication & Security
- Implement authentication with NextAuth.js or custom solutions
- Protect routes with middleware
- Handle sessions and tokens securely
- Implement CSRF protection
- Set up proper security headers

### Testing & Quality
- Unit testing with Jest and React Testing Library
- E2E testing with Playwright or Cypress
- Type safety with TypeScript
- Linting and formatting standards
- Accessibility best practices

### Deployment & DevOps
- Deploy to Vercel, Netlify, or custom platforms
- Configure environment variables for production
- Set up CI/CD pipelines
- Implement monitoring and analytics
- Handle build optimization

## Usage Examples

### Creating a New Page
```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchData()

  return (
    <div>
      <h1>Dashboard</h1>
      {/* content */}
    </div>
  )
}
```

### Server Actions
```typescript
// app/actions.ts
'use server'

export async function createTask(formData: FormData) {
  const title = formData.get('title')
  // handle server-side logic
  revalidatePath('/tasks')
}
```

### Client Component with State
```typescript
// components/Counter.tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

## Best Practices

1. **Use Server Components by Default**: Only add 'use client' when needed for interactivity
2. **Optimize Images**: Always use next/image for automatic optimization
3. **Type Safety**: Leverage TypeScript for better developer experience
4. **Error Handling**: Implement error.tsx and not-found.tsx for better UX
5. **Loading States**: Use loading.tsx and Suspense for progressive rendering
6. **SEO**: Generate proper metadata for all pages
7. **Performance**: Monitor Core Web Vitals and optimize accordingly
8. **Security**: Validate all inputs and use environment variables for secrets

## Common Patterns

### Layout with Navigation
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### Protected Route
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

## Integration Points

- **Backend APIs**: Connect to FastAPI, Express, or other backends
- **Databases**: Integrate with PostgreSQL, MongoDB, or Prisma ORM
- **Authentication**: NextAuth.js, Auth0, Clerk, or custom solutions
- **State Management**: React Context, Zustand, or Redux Toolkit
- **Styling**: Tailwind CSS, styled-components, or CSS Modules
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Google Analytics, Vercel Analytics, or custom solutions

## Troubleshooting

### Common Issues
- **Hydration Errors**: Ensure server and client render the same content
- **'use client' Boundary**: Place it at the lowest level needed
- **Cache Issues**: Use revalidatePath() or revalidateTag() appropriately
- **Environment Variables**: Prefix with NEXT_PUBLIC_ for client-side access
- **Build Errors**: Check TypeScript errors and missing dependencies

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Vercel Deployment](https://vercel.com/docs)
