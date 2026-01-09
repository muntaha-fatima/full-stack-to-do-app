# SEO & Meta Tags Skill

## Description
Expert in implementing Search Engine Optimization (SEO) best practices, meta tags, Open Graph, structured data, and improving website discoverability.

## Capabilities

### Next.js SEO
- **Metadata API**: Next.js 13+ metadata configuration
- **Dynamic Meta Tags**: Page-specific metadata
- **Sitemap Generation**: XML sitemap creation
- **Robots.txt**: Search engine directives
- **Canonical URLs**: Duplicate content handling
- **Open Graph**: Social media previews
- **Twitter Cards**: Twitter-specific metadata

### Technical SEO
- **Page Speed**: Performance optimization
- **Mobile-Friendly**: Responsive design
- **HTTPS**: Secure connections
- **Structured Data**: Schema.org markup
- **XML Sitemaps**: Site structure for crawlers
- **URL Structure**: SEO-friendly URLs
- **Internal Linking**: Site navigation

### Content SEO
- **Title Tags**: Optimized page titles
- **Meta Descriptions**: Compelling descriptions
- **Heading Hierarchy**: Proper H1-H6 usage
- **Alt Text**: Image descriptions
- **Keyword Optimization**: Strategic keyword placement
- **Content Quality**: Valuable, original content
- **URL Slugs**: Readable, descriptive URLs

### Analytics & Tracking
- **Google Analytics**: Traffic tracking
- **Google Search Console**: Search performance
- **Core Web Vitals**: Performance metrics
- **Conversion Tracking**: Goal tracking
- **Event Tracking**: User interaction tracking
- **A/B Testing**: Optimization testing

## Usage Examples

### Next.js 13+ Metadata API

```typescript
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'My App - Best Solution for Your Needs',
    template: '%s | My App',
  },
  description: 'Comprehensive solution for managing your tasks efficiently. Join thousands of satisfied users.',
  keywords: ['task management', 'productivity', 'organization', 'todo app'],
  authors: [{ name: 'Your Company' }],
  creator: 'Your Company',
  publisher: 'Your Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourdomain.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
    },
  },
  openGraph: {
    title: 'My App - Best Solution for Your Needs',
    description: 'Comprehensive solution for managing your tasks efficiently.',
    url: 'https://yourdomain.com',
    siteName: 'My App',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My App Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App - Best Solution for Your Needs',
    description: 'Comprehensive solution for managing your tasks efficiently.',
    creator: '@yourusername',
    images: ['https://yourdomain.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/blog/[slug]/page.tsx - Dynamic metadata
import { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch post data
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default function BlogPost({ params }: Props) {
  return <article>{/* Post content */}</article>
}
```

### Structured Data (JSON-LD)

```typescript
// components/StructuredData.tsx
interface Article {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: {
    name: string
    url: string
  }
}

export function ArticleStructuredData({ article }: { article: Article }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Organization structured data
export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Your Company',
    url: 'https://yourdomain.com',
    logo: 'https://yourdomain.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-555-5555',
      contactType: 'Customer Service',
      areaServed: 'US',
      availableLanguage: ['English', 'Spanish'],
    },
    sameAs: [
      'https://www.facebook.com/yourcompany',
      'https://twitter.com/yourcompany',
      'https://www.linkedin.com/company/yourcompany',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Product structured data
export function ProductStructuredData({ product }: { product: Product }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://yourdomain.com/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Your Company',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Breadcrumb structured data
export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

### Sitemap Generation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourdomain.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Dynamic pages (blog posts)
  const posts = await getAllPosts()
  const postPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Dynamic pages (products)
  const products = await getAllProducts()
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...postPages, ...productPages]
}

// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/private/'],
      },
    ],
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

### SEO Component

```typescript
// components/SEO.tsx
import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  noindex?: boolean
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = '/og-default.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
}: SEOProps) {
  const siteUrl = 'https://yourdomain.com'
  const fullTitle = `${title} | My App`
  const canonicalUrl = canonical || siteUrl

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="My App" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:creator" content="@yourusername" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#000000" />
    </Head>
  )
}

// Usage
export default function BlogPost({ post }: { post: Post }) {
  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`https://yourdomain.com/blog/${post.slug}`}
        ogImage={post.coverImage}
        ogType="article"
      />
      <article>{/* Post content */}</article>
    </>
  )
}
```

### Google Analytics Integration

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// app/layout.tsx
import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/gtag'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}

// Track page views
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import * as gtag from '@/lib/gtag'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    gtag.pageview(url)
  }, [pathname, searchParams])

  return null
}

// Track events
import * as gtag from '@/lib/gtag'

function handleButtonClick() {
  gtag.event({
    action: 'click',
    category: 'Button',
    label: 'Sign Up Button',
    value: 1,
  })
}
```

### Image Optimization for SEO

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    />
  )
}

// Usage
<OptimizedImage
  src="/hero-image.jpg"
  alt="Comprehensive task management solution"
  width={1200}
  height={630}
  priority
/>
```

### URL Slug Generation

```typescript
// utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '')          // Trim - from end of text
}

// Usage
const slug = slugify('My Awesome Blog Post!') // 'my-awesome-blog-post'
```

### Backend SEO Support

```python
# app/routers/seo.py
from fastapi import APIRouter, Response
from datetime import datetime
from app.database import get_db
from app.models import Post, Product

router = APIRouter()

@router.get("/sitemap.xml")
async def sitemap():
    """Generate XML sitemap"""
    base_url = "https://yourdomain.com"

    # Static pages
    urls = [
        {"loc": base_url, "changefreq": "daily", "priority": "1.0"},
        {"loc": f"{base_url}/about", "changefreq": "monthly", "priority": "0.8"},
        {"loc": f"{base_url}/contact", "changefreq": "monthly", "priority": "0.5"},
    ]

    # Dynamic pages
    db = next(get_db())

    posts = db.query(Post).filter(Post.published == True).all()
    for post in posts:
        urls.append({
            "loc": f"{base_url}/blog/{post.slug}",
            "lastmod": post.updated_at.strftime("%Y-%m-%d"),
            "changefreq": "weekly",
            "priority": "0.7"
        })

    products = db.query(Product).filter(Product.active == True).all()
    for product in products:
        urls.append({
            "loc": f"{base_url}/products/{product.slug}",
            "lastmod": product.updated_at.strftime("%Y-%m-%d"),
            "changefreq": "daily",
            "priority": "0.9"
        })

    # Generate XML
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for url in urls:
        xml += '  <url>\n'
        xml += f'    <loc>{url["loc"]}</loc>\n'
        if "lastmod" in url:
            xml += f'    <lastmod>{url["lastmod"]}</lastmod>\n'
        xml += f'    <changefreq>{url["changefreq"]}</changefreq>\n'
        xml += f'    <priority>{url["priority"]}</priority>\n'
        xml += '  </url>\n'

    xml += '</urlset>'

    return Response(content=xml, media_type="application/xml")

@router.get("/robots.txt")
async def robots():
    """Generate robots.txt"""
    content = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: https://yourdomain.com/sitemap.xml
"""
    return Response(content=content, media_type="text/plain")
```

## SEO Best Practices

1. **Unique Titles**: Each page should have a unique, descriptive title
2. **Meta Descriptions**: Compelling descriptions under 160 characters
3. **Heading Hierarchy**: Use H1-H6 properly, one H1 per page
4. **Alt Text**: Descriptive alt text for all images
5. **Mobile-Friendly**: Responsive design for all devices
6. **Fast Loading**: Optimize performance (Core Web Vitals)
7. **HTTPS**: Secure connections
8. **Structured Data**: Schema.org markup for rich snippets
9. **Internal Linking**: Link to related content
10. **Quality Content**: Original, valuable content

## SEO Checklist

- [ ] Unique title tags (50-60 characters)
- [ ] Meta descriptions (150-160 characters)
- [ ] Proper heading hierarchy (H1-H6)
- [ ] Alt text for all images
- [ ] Mobile-responsive design
- [ ] Fast page load times
- [ ] HTTPS enabled
- [ ] XML sitemap generated
- [ ] Robots.txt configured
- [ ] Structured data implemented
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] Internal linking strategy
- [ ] Google Analytics installed
- [ ] Google Search Console setup

## Common SEO Mistakes

1. **Duplicate Content**: Same content on multiple URLs
2. **Missing Alt Text**: Images without descriptions
3. **Slow Page Speed**: Poor performance
4. **Not Mobile-Friendly**: Non-responsive design
5. **Broken Links**: 404 errors
6. **Thin Content**: Low-quality or minimal content
7. **Missing Meta Tags**: No title or description
8. **Poor URL Structure**: Non-descriptive URLs
9. **No Sitemap**: Missing XML sitemap
10. **Ignoring Analytics**: Not tracking performance

## Tools & Resources

- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Ahrefs](https://ahrefs.com/)
- [SEMrush](https://www.semrush.com/)
- [Moz](https://moz.com/)
