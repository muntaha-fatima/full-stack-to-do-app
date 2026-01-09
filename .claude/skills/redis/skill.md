# Redis & Caching Skill

## Description
Expert in implementing caching strategies using Redis for improved application performance, session management, and real-time features.

## Capabilities

### Redis Fundamentals
- **Data Structures**: Strings, Lists, Sets, Sorted Sets, Hashes
- **Key-Value Storage**: Fast in-memory data storage
- **Expiration**: TTL (Time To Live) management
- **Persistence**: RDB and AOF persistence options
- **Pub/Sub**: Message broadcasting
- **Transactions**: Atomic operations

### Caching Strategies
- **Cache-Aside**: Application manages cache
- **Write-Through**: Write to cache and database
- **Write-Behind**: Async database writes
- **Read-Through**: Cache loads from database
- **Cache Invalidation**: Strategies for keeping cache fresh
- **Cache Warming**: Pre-loading cache

### Use Cases
- **Session Storage**: User session management
- **API Response Caching**: Reduce database load
- **Rate Limiting**: Request throttling
- **Leaderboards**: Sorted sets for rankings
- **Real-Time Analytics**: Counters and metrics
- **Job Queues**: Background task management

### Python Redis Integration
- **redis-py**: Python Redis client
- **aioredis**: Async Redis client
- **Redis OM**: Object mapping for Redis
- **Connection Pooling**: Efficient connection management
- **Pipeline**: Batch operations
- **Lua Scripts**: Server-side scripting

## Usage Examples

### Redis Setup and Configuration

```python
# app/cache/redis_client.py
from redis import asyncio as aioredis
from typing import Optional, Any
import json
import logging
from app.config import settings

logger = logging.getLogger(__name__)

class RedisClient:
    """Redis client wrapper with common operations"""

    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None

    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis = await aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                max_connections=10
            )
            # Test connection
            await self.redis.ping()
            logger.info("Connected to Redis")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise

    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis:
            await self.redis.close()
            logger.info("Disconnected from Redis")

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            value = await self.redis.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"Error getting key {key}: {e}")
            return None

    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None
    ) -> bool:
        """Set value in cache with optional TTL"""
        try:
            serialized = json.dumps(value, default=str)
            if ttl:
                await self.redis.setex(key, ttl, serialized)
            else:
                await self.redis.set(key, serialized)
            return True
        except Exception as e:
            logger.error(f"Error setting key {key}: {e}")
            return False

    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"Error deleting key {key}: {e}")
            return False

    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        try:
            return await self.redis.exists(key) > 0
        except Exception as e:
            logger.error(f"Error checking key {key}: {e}")
            return False

    async def expire(self, key: str, ttl: int) -> bool:
        """Set expiration on key"""
        try:
            await self.redis.expire(key, ttl)
            return True
        except Exception as e:
            logger.error(f"Error setting expiration on {key}: {e}")
            return False

    async def ttl(self, key: str) -> int:
        """Get TTL of key"""
        try:
            return await self.redis.ttl(key)
        except Exception as e:
            logger.error(f"Error getting TTL for {key}: {e}")
            return -1

    async def increment(self, key: str, amount: int = 1) -> int:
        """Increment counter"""
        try:
            return await self.redis.incrby(key, amount)
        except Exception as e:
            logger.error(f"Error incrementing {key}: {e}")
            return 0

    async def decrement(self, key: str, amount: int = 1) -> int:
        """Decrement counter"""
        try:
            return await self.redis.decrby(key, amount)
        except Exception as e:
            logger.error(f"Error decrementing {key}: {e}")
            return 0

# Create global Redis client
redis_client = RedisClient()

# Startup and shutdown events
from fastapi import FastAPI

app = FastAPI()

@app.on_event("startup")
async def startup():
    await redis_client.connect()

@app.on_event("shutdown")
async def shutdown():
    await redis_client.disconnect()
```

### Cache Decorator

```python
# app/cache/decorators.py
from functools import wraps
from typing import Optional, Callable
import hashlib
import json
from app.cache.redis_client import redis_client

def cache(
    ttl: int = 300,
    key_prefix: str = "",
    key_builder: Optional[Callable] = None
):
    """
    Cache decorator for async functions

    Args:
        ttl: Time to live in seconds
        key_prefix: Prefix for cache key
        key_builder: Custom function to build cache key
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Build cache key
            if key_builder:
                cache_key = key_builder(*args, **kwargs)
            else:
                # Default key builder
                key_parts = [key_prefix or func.__name__]
                key_parts.extend(str(arg) for arg in args)
                key_parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))
                key_string = ":".join(key_parts)
                cache_key = f"cache:{hashlib.md5(key_string.encode()).hexdigest()}"

            # Try to get from cache
            cached_value = await redis_client.get(cache_key)
            if cached_value is not None:
                logger.debug(f"Cache hit for {cache_key}")
                return cached_value

            # Execute function
            logger.debug(f"Cache miss for {cache_key}")
            result = await func(*args, **kwargs)

            # Store in cache
            await redis_client.set(cache_key, result, ttl)

            return result

        # Add cache invalidation method
        async def invalidate(*args, **kwargs):
            if key_builder:
                cache_key = key_builder(*args, **kwargs)
            else:
                key_parts = [key_prefix or func.__name__]
                key_parts.extend(str(arg) for arg in args)
                key_parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))
                key_string = ":".join(key_parts)
                cache_key = f"cache:{hashlib.md5(key_string.encode()).hexdigest()}"

            await redis_client.delete(cache_key)

        wrapper.invalidate = invalidate
        return wrapper

    return decorator

# Usage
@cache(ttl=600, key_prefix="user")
async def get_user_by_id(user_id: int):
    """Get user from database with caching"""
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()

# Invalidate cache
await get_user_by_id.invalidate(user_id=123)
```

### Session Management

```python
# app/cache/session.py
from typing import Optional, Dict, Any
from datetime import timedelta
import uuid
from app.cache.redis_client import redis_client

class SessionManager:
    """Manage user sessions in Redis"""

    def __init__(self, prefix: str = "session"):
        self.prefix = prefix
        self.default_ttl = 3600  # 1 hour

    def _make_key(self, session_id: str) -> str:
        """Create Redis key for session"""
        return f"{self.prefix}:{session_id}"

    async def create(
        self,
        data: Dict[str, Any],
        ttl: Optional[int] = None
    ) -> str:
        """Create new session"""
        session_id = str(uuid.uuid4())
        key = self._make_key(session_id)

        await redis_client.set(
            key,
            data,
            ttl or self.default_ttl
        )

        return session_id

    async def get(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session data"""
        key = self._make_key(session_id)
        return await redis_client.get(key)

    async def update(
        self,
        session_id: str,
        data: Dict[str, Any],
        ttl: Optional[int] = None
    ) -> bool:
        """Update session data"""
        key = self._make_key(session_id)

        # Get existing data
        existing = await self.get(session_id)
        if existing is None:
            return False

        # Merge data
        existing.update(data)

        # Save updated data
        await redis_client.set(
            key,
            existing,
            ttl or self.default_ttl
        )

        return True

    async def delete(self, session_id: str) -> bool:
        """Delete session"""
        key = self._make_key(session_id)
        return await redis_client.delete(key)

    async def refresh(self, session_id: str, ttl: Optional[int] = None) -> bool:
        """Refresh session TTL"""
        key = self._make_key(session_id)
        return await redis_client.expire(key, ttl or self.default_ttl)

    async def exists(self, session_id: str) -> bool:
        """Check if session exists"""
        key = self._make_key(session_id)
        return await redis_client.exists(key)

# Create global session manager
session_manager = SessionManager()

# Usage in routes
from fastapi import Cookie, HTTPException

@router.post("/login")
async def login(credentials: LoginCredentials):
    # Authenticate user
    user = await authenticate(credentials)

    # Create session
    session_id = await session_manager.create({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })

    response = JSONResponse({"message": "Logged in successfully"})
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=True,
        samesite="lax"
    )

    return response

@router.get("/profile")
async def get_profile(session_id: str = Cookie(None)):
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session_data = await session_manager.get(session_id)
    if not session_data:
        raise HTTPException(status_code=401, detail="Invalid session")

    # Refresh session
    await session_manager.refresh(session_id)

    return {"user_id": session_data["user_id"]}
```

### Rate Limiting

```python
# app/cache/rate_limiter.py
from typing import Optional
from datetime import datetime
from app.cache.redis_client import redis_client

class RateLimiter:
    """Rate limiting using Redis"""

    async def check_rate_limit(
        self,
        key: str,
        max_requests: int,
        window_seconds: int
    ) -> tuple[bool, int]:
        """
        Check if request is within rate limit

        Returns:
            (allowed, remaining_requests)
        """
        current_time = int(datetime.utcnow().timestamp())
        window_start = current_time - window_seconds

        # Use sorted set for sliding window
        redis_key = f"rate_limit:{key}"

        # Remove old entries
        await redis_client.redis.zremrangebyscore(
            redis_key,
            0,
            window_start
        )

        # Count requests in window
        request_count = await redis_client.redis.zcard(redis_key)

        if request_count >= max_requests:
            return False, 0

        # Add current request
        await redis_client.redis.zadd(
            redis_key,
            {str(current_time): current_time}
        )

        # Set expiration
        await redis_client.redis.expire(redis_key, window_seconds)

        remaining = max_requests - request_count - 1
        return True, remaining

# Middleware for rate limiting
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.rate_limiter = RateLimiter()
        self.max_requests = max_requests
        self.window_seconds = window_seconds

    async def dispatch(self, request: Request, call_next):
        # Get client identifier (IP or user ID)
        client_id = request.client.host

        # Check rate limit
        allowed, remaining = await self.rate_limiter.check_rate_limit(
            client_id,
            self.max_requests,
            self.window_seconds
        )

        if not allowed:
            return Response(
                content="Rate limit exceeded",
                status_code=429,
                headers={
                    "X-RateLimit-Limit": str(self.max_requests),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(self.window_seconds)
                }
            )

        response = await call_next(request)

        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(self.max_requests)
        response.headers["X-RateLimit-Remaining"] = str(remaining)

        return response

# Add middleware to app
app.add_middleware(
    RateLimitMiddleware,
    max_requests=100,
    window_seconds=60
)
```

### Leaderboard with Sorted Sets

```python
# app/cache/leaderboard.py
from typing import List, Tuple
from app.cache.redis_client import redis_client

class Leaderboard:
    """Leaderboard using Redis sorted sets"""

    def __init__(self, name: str):
        self.key = f"leaderboard:{name}"

    async def add_score(self, user_id: int, score: float):
        """Add or update user score"""
        await redis_client.redis.zadd(
            self.key,
            {str(user_id): score}
        )

    async def increment_score(self, user_id: int, amount: float):
        """Increment user score"""
        await redis_client.redis.zincrby(
            self.key,
            amount,
            str(user_id)
        )

    async def get_score(self, user_id: int) -> Optional[float]:
        """Get user score"""
        score = await redis_client.redis.zscore(self.key, str(user_id))
        return float(score) if score else None

    async def get_rank(self, user_id: int) -> Optional[int]:
        """Get user rank (0-indexed, descending)"""
        rank = await redis_client.redis.zrevrank(self.key, str(user_id))
        return rank if rank is not None else None

    async def get_top(self, limit: int = 10) -> List[Tuple[str, float]]:
        """Get top N users"""
        results = await redis_client.redis.zrevrange(
            self.key,
            0,
            limit - 1,
            withscores=True
        )
        return [(user_id, score) for user_id, score in results]

    async def get_range(
        self,
        start: int,
        end: int
    ) -> List[Tuple[str, float]]:
        """Get users in rank range"""
        results = await redis_client.redis.zrevrange(
            self.key,
            start,
            end,
            withscores=True
        )
        return [(user_id, score) for user_id, score in results]

    async def get_around_user(
        self,
        user_id: int,
        count: int = 5
    ) -> List[Tuple[str, float]]:
        """Get users around a specific user"""
        rank = await self.get_rank(user_id)
        if rank is None:
            return []

        start = max(0, rank - count)
        end = rank + count

        return await self.get_range(start, end)

    async def remove_user(self, user_id: int):
        """Remove user from leaderboard"""
        await redis_client.redis.zrem(self.key, str(user_id))

    async def get_total_users(self) -> int:
        """Get total number of users"""
        return await redis_client.redis.zcard(self.key)

# Usage
leaderboard = Leaderboard("global")

# Add scores
await leaderboard.add_score(user_id=1, score=1000)
await leaderboard.increment_score(user_id=1, amount=50)

# Get rankings
top_10 = await leaderboard.get_top(10)
user_rank = await leaderboard.get_rank(user_id=1)
around_user = await leaderboard.get_around_user(user_id=1, count=5)
```

### Pub/Sub for Real-Time Updates

```python
# app/cache/pubsub.py
import asyncio
from typing import Callable, Dict
from app.cache.redis_client import redis_client

class PubSubManager:
    """Manage Redis pub/sub subscriptions"""

    def __init__(self):
        self.pubsub = None
        self.handlers: Dict[str, Callable] = {}
        self.task = None

    async def subscribe(self, channel: str, handler: Callable):
        """Subscribe to channel with handler"""
        if self.pubsub is None:
            self.pubsub = redis_client.redis.pubsub()

        await self.pubsub.subscribe(channel)
        self.handlers[channel] = handler

        # Start listening task if not already running
        if self.task is None:
            self.task = asyncio.create_task(self._listen())

    async def unsubscribe(self, channel: str):
        """Unsubscribe from channel"""
        if self.pubsub:
            await self.pubsub.unsubscribe(channel)
            self.handlers.pop(channel, None)

    async def publish(self, channel: str, message: str):
        """Publish message to channel"""
        await redis_client.redis.publish(channel, message)

    async def _listen(self):
        """Listen for messages"""
        try:
            async for message in self.pubsub.listen():
                if message["type"] == "message":
                    channel = message["channel"]
                    data = message["data"]

                    handler = self.handlers.get(channel)
                    if handler:
                        await handler(data)
        except asyncio.CancelledError:
            pass

    async def close(self):
        """Close pub/sub connection"""
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass

        if self.pubsub:
            await self.pubsub.close()

# Create global pub/sub manager
pubsub_manager = PubSubManager()

# Usage
async def handle_notification(message: str):
    print(f"Received notification: {message}")

# Subscribe
await pubsub_manager.subscribe("notifications", handle_notification)

# Publish
await pubsub_manager.publish("notifications", "New message!")
```

### Cache Invalidation Patterns

```python
# app/cache/invalidation.py
from typing import List
from app.cache.redis_client import redis_client

class CacheInvalidator:
    """Handle cache invalidation patterns"""

    async def invalidate_pattern(self, pattern: str):
        """Invalidate all keys matching pattern"""
        cursor = 0
        while True:
            cursor, keys = await redis_client.redis.scan(
                cursor,
                match=pattern,
                count=100
            )

            if keys:
                await redis_client.redis.delete(*keys)

            if cursor == 0:
                break

    async def invalidate_tags(self, tags: List[str]):
        """Invalidate all keys with specific tags"""
        for tag in tags:
            # Get all keys with this tag
            tag_key = f"tag:{tag}"
            keys = await redis_client.redis.smembers(tag_key)

            if keys:
                # Delete all keys
                await redis_client.redis.delete(*keys)

                # Delete tag set
                await redis_client.redis.delete(tag_key)

    async def tag_key(self, key: str, tags: List[str]):
        """Associate tags with a cache key"""
        for tag in tags:
            tag_key = f"tag:{tag}"
            await redis_client.redis.sadd(tag_key, key)

# Usage
invalidator = CacheInvalidator()

# Invalidate all user caches
await invalidator.invalidate_pattern("cache:user:*")

# Tag-based invalidation
await invalidator.tag_key("cache:user:123", ["user", "profile"])
await invalidator.invalidate_tags(["user"])
```

## Best Practices

1. **Set Appropriate TTLs**: Balance freshness with performance
2. **Handle Cache Misses**: Always have fallback to database
3. **Avoid Cache Stampede**: Use locking for expensive operations
4. **Monitor Cache Hit Rate**: Track cache effectiveness
5. **Use Connection Pooling**: Reuse Redis connections
6. **Serialize Efficiently**: Use JSON or MessagePack
7. **Namespace Keys**: Use prefixes to organize keys
8. **Set Memory Limits**: Configure maxmemory and eviction policy
9. **Use Pipelines**: Batch multiple operations
10. **Plan for Failures**: Handle Redis unavailability gracefully

## Caching Checklist

- [ ] Redis installed and configured
- [ ] Connection pooling set up
- [ ] TTL strategy defined
- [ ] Cache invalidation strategy
- [ ] Error handling for cache failures
- [ ] Monitoring cache hit rate
- [ ] Memory limits configured
- [ ] Eviction policy set
- [ ] Backup strategy (if needed)
- [ ] Security (password, SSL)

## Common Pitfalls

1. **Cache Stampede**: Multiple requests regenerating same cache
2. **Stale Data**: Not invalidating cache properly
3. **Memory Overflow**: Not setting memory limits
4. **Large Values**: Storing too much data in single key
5. **No Expiration**: Keys without TTL filling memory
6. **Serialization Issues**: Not handling complex objects
7. **Network Latency**: Not using connection pooling
8. **Single Point of Failure**: No Redis redundancy

## Resources

- [Redis Documentation](https://redis.io/documentation)
- [redis-py Documentation](https://redis-py.readthedocs.io/)
- [Redis Best Practices](https://redis.io/topics/best-practices)
- [Caching Strategies](https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/Strategies.html)
