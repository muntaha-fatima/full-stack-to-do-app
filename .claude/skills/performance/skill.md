# Performance Optimization Skill

## Description
Expert in optimizing full-stack application performance, including frontend rendering, backend queries, caching strategies, and resource optimization.

## Capabilities

### Frontend Performance
- **Code Splitting**: Dynamic imports and lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Responsive images and lazy loading
- **Caching Strategies**: Browser caching and service workers
- **Rendering Optimization**: Virtual DOM and memoization
- **Web Vitals**: Core Web Vitals optimization
- **Asset Optimization**: CSS, JS, font optimization

### Backend Performance
- **Database Optimization**: Query optimization and indexing
- **Connection Pooling**: Database connection management
- **Caching**: Redis, in-memory caching
- **Async Operations**: Non-blocking I/O
- **Query Batching**: N+1 query prevention
- **Response Compression**: Gzip, Brotli compression
- **Rate Limiting**: Request throttling

### Database Performance
- **Query Optimization**: EXPLAIN ANALYZE usage
- **Indexing**: Strategic index creation
- **Query Caching**: Result caching
- **Connection Pooling**: Efficient connection reuse
- **Batch Operations**: Bulk inserts and updates
- **Denormalization**: Strategic data duplication
- **Partitioning**: Table partitioning for large datasets

### Monitoring & Profiling
- **Performance Metrics**: Response times, throughput
- **Profiling Tools**: Python profilers, Chrome DevTools
- **APM Tools**: Application Performance Monitoring
- **Database Monitoring**: Slow query logs
- **Resource Monitoring**: CPU, memory, disk usage
- **User Monitoring**: Real User Monitoring (RUM)

## Usage Examples

### Next.js Performance Optimization

```typescript
// Dynamic imports for code splitting
import dynamic from 'next/dynamic'

// Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Disable SSR for client-only components
})

// Lazy load with suspense
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('@/components/LazyComponent'))

function MyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}

// Image optimization
import Image from 'next/image'

function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority // Load immediately for above-fold images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}

// Font optimization
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### React Performance Optimization

```typescript
import { memo, useMemo, useCallback, useState } from 'react'

// Memoize expensive components
const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
  onUpdate
}: {
  data: Data[]
  onUpdate: (id: number) => void
}) {
  return (
    <div>
      {data.map(item => (
        <div key={item.id} onClick={() => onUpdate(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  )
})

// Memoize expensive calculations
function DataProcessor({ items }: { items: Item[] }) {
  const processedData = useMemo(() => {
    console.log('Processing data...')
    return items
      .filter(item => item.active)
      .map(item => ({
        ...item,
        computed: expensiveCalculation(item),
      }))
      .sort((a, b) => b.score - a.score)
  }, [items]) // Only recompute when items change

  return <div>{/* Render processed data */}</div>
}

// Memoize callbacks
function ParentComponent() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<Item[]>([])

  // Without useCallback, this creates a new function on every render
  const handleUpdate = useCallback((id: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, updated: true } : item
    ))
  }, []) // Empty deps - function never changes

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveComponent data={items} onUpdate={handleUpdate} />
    </div>
  )
}

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window'

function VirtualList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      {items[index].name}
    </div>
  )

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}

// Debounce expensive operations
import { useDebouncedCallback } from 'use-debounce'

function SearchInput() {
  const [query, setQuery] = useState('')

  const debouncedSearch = useDebouncedCallback(
    async (searchQuery: string) => {
      const results = await fetch(`/api/search?q=${searchQuery}`)
      // Handle results
    },
    500 // Wait 500ms after user stops typing
  )

  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value)
        debouncedSearch(e.target.value)
      }}
    />
  )
}
```

### Database Query Optimization

```python
# Bad: N+1 query problem
async def get_users_with_tasks_bad(db: AsyncSession):
    result = await db.execute(select(User))
    users = result.scalars().all()

    for user in users:
        # This executes a separate query for each user!
        tasks_result = await db.execute(
            select(Task).where(Task.user_id == user.id)
        )
        user.tasks = tasks_result.scalars().all()

    return users

# Good: Use eager loading
from sqlalchemy.orm import selectinload

async def get_users_with_tasks_good(db: AsyncSession):
    result = await db.execute(
        select(User).options(selectinload(User.tasks))
    )
    return result.scalars().all()

# Good: Use join for filtering
async def get_users_with_completed_tasks(db: AsyncSession):
    result = await db.execute(
        select(User)
        .join(Task)
        .where(Task.completed == True)
        .options(selectinload(User.tasks))
        .distinct()
    )
    return result.scalars().all()

# Batch operations
async def create_tasks_batch(db: AsyncSession, tasks_data: list[dict]):
    # Bad: Individual inserts
    # for task_data in tasks_data:
    #     task = Task(**task_data)
    #     db.add(task)
    #     await db.commit()

    # Good: Bulk insert
    tasks = [Task(**task_data) for task_data in tasks_data]
    db.add_all(tasks)
    await db.commit()

    return tasks

# Use indexes for common queries
# In migration:
# op.create_index('ix_tasks_user_status', 'tasks', ['user_id', 'status'])
# op.create_index('ix_tasks_created_at', 'tasks', ['created_at'])

# Query with proper indexes
async def get_user_pending_tasks(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Task)
        .where(
            Task.user_id == user_id,
            Task.status == 'pending'
        )
        .order_by(Task.created_at.desc())
        .limit(50)
    )
    return result.scalars().all()

# Use pagination for large result sets
async def get_tasks_paginated(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 20
):
    # Get total count efficiently
    count_query = select(func.count()).select_from(Task)
    total = await db.scalar(count_query)

    # Get paginated results
    result = await db.execute(
        select(Task)
        .order_by(Task.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    tasks = result.scalars().all()

    return {
        'items': tasks,
        'total': total,
        'skip': skip,
        'limit': limit,
        'has_more': skip + limit < total
    }
```

### Caching Strategies

```python
# Redis caching
from redis import asyncio as aioredis
import json
from functools import wraps

redis_client = aioredis.from_url("redis://localhost:6379")

async def cache_get(key: str):
    """Get value from cache"""
    value = await redis_client.get(key)
    if value:
        return json.loads(value)
    return None

async def cache_set(key: str, value: any, ttl: int = 300):
    """Set value in cache with TTL"""
    await redis_client.setex(
        key,
        ttl,
        json.dumps(value, default=str)
    )

async def cache_delete(key: str):
    """Delete value from cache"""
    await redis_client.delete(key)

# Cache decorator
def cached(key_prefix: str, ttl: int = 300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{args}:{kwargs}"

            # Try to get from cache
            cached_value = await cache_get(cache_key)
            if cached_value is not None:
                return cached_value

            # Execute function
            result = await func(*args, **kwargs)

            # Store in cache
            await cache_set(cache_key, result, ttl)

            return result
        return wrapper
    return decorator

# Usage
@cached(key_prefix="user", ttl=600)
async def get_user_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()

# Cache invalidation
async def update_user(db: AsyncSession, user_id: int, updates: dict):
    # Update database
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    for key, value in updates.items():
        setattr(user, key, value)

    await db.commit()

    # Invalidate cache
    await cache_delete(f"user:{user_id}")

    return user

# Response caching middleware
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class CacheMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Only cache GET requests
        if request.method != "GET":
            return await call_next(request)

        cache_key = f"response:{request.url.path}:{request.query_params}"

        # Check cache
        cached_response = await cache_get(cache_key)
        if cached_response:
            return Response(
                content=cached_response["body"],
                status_code=cached_response["status_code"],
                headers={"X-Cache": "HIT"}
            )

        # Get response
        response = await call_next(request)

        # Cache successful responses
        if response.status_code == 200:
            body = b""
            async for chunk in response.body_iterator:
                body += chunk

            await cache_set(
                cache_key,
                {
                    "body": body.decode(),
                    "status_code": response.status_code
                },
                ttl=60
            )

            return Response(
                content=body,
                status_code=response.status_code,
                headers={"X-Cache": "MISS"}
            )

        return response
```

### Response Compression

```python
# FastAPI compression middleware
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Or use Brotli for better compression
from starlette.middleware.base import BaseHTTPMiddleware
import brotli

class BrotliMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Check if client accepts Brotli
        accept_encoding = request.headers.get("accept-encoding", "")
        if "br" not in accept_encoding:
            return response

        # Compress response
        body = b""
        async for chunk in response.body_iterator:
            body += chunk

        if len(body) > 1000:  # Only compress if > 1KB
            compressed = brotli.compress(body)
            return Response(
                content=compressed,
                status_code=response.status_code,
                headers={
                    **dict(response.headers),
                    "Content-Encoding": "br",
                    "Content-Length": str(len(compressed))
                }
            )

        return Response(content=body, status_code=response.status_code)

app.add_middleware(BrotliMiddleware)
```

### Connection Pooling

```python
# SQLAlchemy connection pooling
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_size=20,          # Number of connections to maintain
    max_overflow=10,       # Additional connections when pool is full
    pool_timeout=30,       # Timeout waiting for connection
    pool_recycle=3600,     # Recycle connections after 1 hour
    pool_pre_ping=True,    # Verify connections before using
)

# Monitor connection pool
from sqlalchemy import event

@event.listens_for(engine.sync_engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    logger.info("Database connection established")

@event.listens_for(engine.sync_engine, "checkout")
def receive_checkout(dbapi_conn, connection_record, connection_proxy):
    logger.debug("Connection checked out from pool")

@event.listens_for(engine.sync_engine, "checkin")
def receive_checkin(dbapi_conn, connection_record):
    logger.debug("Connection returned to pool")
```

### Performance Monitoring

```python
# Performance monitoring decorator
import time
from functools import wraps

def monitor_performance(operation_name: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()

            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time

                logger.info(
                    f"Performance: {operation_name}",
                    extra={
                        "operation": operation_name,
                        "duration_ms": round(duration * 1000, 2),
                        "status": "success"
                    }
                )

                # Alert if slow
                if duration > 1.0:  # > 1 second
                    logger.warning(
                        f"Slow operation: {operation_name}",
                        extra={
                            "operation": operation_name,
                            "duration_ms": round(duration * 1000, 2)
                        }
                    )

                return result

            except Exception as e:
                duration = time.time() - start_time
                logger.error(
                    f"Performance: {operation_name} failed",
                    extra={
                        "operation": operation_name,
                        "duration_ms": round(duration * 1000, 2),
                        "status": "error",
                        "error": str(e)
                    }
                )
                raise

        return wrapper
    return decorator

# Usage
@monitor_performance("fetch_user_dashboard")
async def get_user_dashboard(db: AsyncSession, user_id: int):
    # Complex dashboard query
    pass
```

### Web Vitals Monitoring

```typescript
// lib/web-vitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' },
  })
}

export function reportWebVitals() {
  onCLS(sendToAnalytics)  // Cumulative Layout Shift
  onFID(sendToAnalytics)  // First Input Delay
  onFCP(sendToAnalytics)  // First Contentful Paint
  onLCP(sendToAnalytics)  // Largest Contentful Paint
  onTTFB(sendToAnalytics) // Time to First Byte
}

// app/layout.tsx
'use client'

import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/web-vitals'

export default function RootLayout({ children }) {
  useEffect(() => {
    reportWebVitals()
  }, [])

  return <html>{children}</html>
}
```

## Performance Checklist

### Frontend
- [ ] Code splitting implemented
- [ ] Images optimized and lazy loaded
- [ ] Fonts optimized
- [ ] Bundle size analyzed
- [ ] Unnecessary re-renders eliminated
- [ ] Virtual scrolling for long lists
- [ ] Service worker for caching
- [ ] Critical CSS inlined
- [ ] Third-party scripts deferred

### Backend
- [ ] Database queries optimized
- [ ] Indexes created for common queries
- [ ] N+1 queries eliminated
- [ ] Connection pooling configured
- [ ] Response caching implemented
- [ ] Compression enabled
- [ ] Async operations used
- [ ] Rate limiting implemented
- [ ] Slow query logging enabled

### Database
- [ ] Proper indexes created
- [ ] Query plans analyzed
- [ ] Connection pooling configured
- [ ] Batch operations used
- [ ] Pagination implemented
- [ ] Vacuum and analyze scheduled
- [ ] Monitoring enabled

## Best Practices

1. **Measure First**: Profile before optimizing
2. **Optimize Bottlenecks**: Focus on biggest impact
3. **Use Caching**: Cache expensive operations
4. **Lazy Load**: Load resources when needed
5. **Batch Operations**: Reduce round trips
6. **Use Indexes**: Index frequently queried columns
7. **Monitor Performance**: Track metrics over time
8. **Set Budgets**: Performance budgets for assets
9. **Test Performance**: Include performance tests
10. **Document Optimizations**: Explain why and how

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Performance](https://react.dev/learn/render-and-commit)
- [PostgreSQL Performance](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [FastAPI Performance](https://fastapi.tiangolo.com/advanced/performance/)
