# Environment Configuration & Deployment Skill

## Description
Expert in managing environment variables, configuration management, and deploying full-stack applications to various platforms (Vercel, Railway, AWS, Docker).

## Capabilities

### Environment Management
- **Environment Variables**: Secure configuration management
- **Multi-Environment**: Development, staging, production configs
- **Secret Management**: Secure storage of sensitive data
- **Configuration Files**: .env, config.py, next.config.js
- **Environment Validation**: Type-safe configuration with Pydantic
- **12-Factor App**: Following best practices

### Deployment Platforms
- **Vercel**: Next.js deployment and serverless functions
- **Railway**: Full-stack deployment with databases
- **AWS**: EC2, ECS, Lambda, RDS deployment
- **Docker**: Containerized deployment
- **Heroku**: Platform-as-a-Service deployment
- **DigitalOcean**: VPS and App Platform

### CI/CD Integration
- **GitHub Actions**: Automated testing and deployment
- **GitLab CI**: Pipeline configuration
- **Docker Compose**: Multi-container orchestration
- **Health Checks**: Application monitoring
- **Rollback Strategies**: Safe deployment practices

## Usage Examples

### Environment Variables - Backend

```python
# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    """Application settings with environment variable validation"""

    # Application
    PROJECT_NAME: str = "PHAS API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = False

    # Database
    DATABASE_URL: str
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    # Authentication
    SECRET_KEY: str
    REFRESH_SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # Email (optional)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None

    # External Services
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: Optional[str] = None
    S3_BUCKET: Optional[str] = None

    # Redis (optional)
    REDIS_URL: Optional[str] = None

    # Sentry (optional)
    SENTRY_DSN: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"

# Create global settings instance
settings = Settings()

# Validate required settings on startup
def validate_settings():
    """Validate critical settings"""
    if not settings.SECRET_KEY:
        raise ValueError("SECRET_KEY must be set")
    if not settings.DATABASE_URL:
        raise ValueError("DATABASE_URL must be set")
    if settings.is_production and settings.DEBUG:
        raise ValueError("DEBUG must be False in production")

validate_settings()
```

### Environment Files

```bash
# .env.example (template for developers)
# Application
PROJECT_NAME=PHAS API
VERSION=1.0.0
DEBUG=false
ENVIRONMENT=development

# Server
HOST=0.0.0.0
PORT=8000
RELOAD=true

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/dbname

# Authentication
SECRET_KEY=your-secret-key-here-change-in-production
REFRESH_SECRET_KEY=your-refresh-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:3001"]

# Optional: Email
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password

# Optional: AWS
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_REGION=us-east-1
# S3_BUCKET=

# Optional: Redis
# REDIS_URL=redis://localhost:6379

# Optional: Sentry
# SENTRY_DSN=
```

```bash
# .env.development
DEBUG=true
ENVIRONMENT=development
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/phas_dev
ALLOWED_ORIGINS=["http://localhost:3000"]
```

```bash
# .env.production
DEBUG=false
ENVIRONMENT=production
DATABASE_URL=postgresql+asyncpg://user:password@prod-db:5432/phas_prod
ALLOWED_ORIGINS=["https://yourdomain.com"]
```

### Next.js Environment Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Docker deployment

  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  },

  // Server-side environment variables
  serverRuntimeConfig: {
    apiSecret: process.env.API_SECRET,
  },

  // Public environment variables (exposed to browser)
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },

  // Image optimization
  images: {
    domains: ['yourdomain.com', 's3.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
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
      }
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

```bash
# .env.local (Frontend)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=PHAS
NEXT_PUBLIC_APP_VERSION=1.0.0

# Server-side only (not exposed to browser)
API_SECRET=your-api-secret
```

### Docker Deployment

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql+asyncpg://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      SECRET_KEY: ${SECRET_KEY}
      REFRESH_SECRET_KEY: ${REFRESH_SECRET_KEY}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
      ENVIRONMENT: production
      DEBUG: "false"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    depends_on:
      - backend
    networks:
      - app_network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - frontend
      - backend
    networks:
      - app_network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  app_network:
    driver: bridge
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test-backend:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        working-directory: ./backend
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-asyncio pytest-cov

      - name: Run tests
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql+asyncpg://test:test@localhost:5432/test_db
          SECRET_KEY: test-secret-key
          REFRESH_SECRET_KEY: test-refresh-key
        run: |
          pytest --cov=app --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml

  test-frontend:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: ./frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run linter
        working-directory: ./frontend
        run: npm run lint

      - name: Run tests
        working-directory: ./frontend
        run: npm test -- --coverage

      - name: Build
        working-directory: ./frontend
        env:
          NEXT_PUBLIC_API_URL: https://api.example.com
        run: npm run build

  deploy:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:latest
          build-args: |
            NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /app
            docker-compose pull
            docker-compose up -d
            docker system prune -af
```

### Vercel Deployment

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "@api-url"
    }
  }
}
```

### Railway Deployment

```toml
# railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[[services]]
name = "backend"
source = "./backend"

[[services]]
name = "frontend"
source = "./frontend"

[[services]]
name = "postgres"
image = "postgres:16"
```

### Health Check Endpoint

```python
# app/routers/health.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db
import time

router = APIRouter(tags=["health"])

@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Health check endpoint for monitoring and load balancers
    """
    start_time = time.time()

    # Check database connection
    try:
        await db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    response_time = time.time() - start_time

    return {
        "status": "healthy" if db_status == "healthy" else "unhealthy",
        "database": db_status,
        "response_time_ms": round(response_time * 1000, 2),
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION
    }

@router.get("/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """
    Readiness check for Kubernetes/container orchestration
    """
    try:
        await db.execute(text("SELECT 1"))
        return {"ready": True}
    except Exception:
        return {"ready": False}, 503
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Static files built
- [ ] Security headers configured
- [ ] CORS settings verified
- [ ] SSL/TLS certificates ready
- [ ] Backup strategy in place

### Production Settings
- [ ] DEBUG=false
- [ ] Strong SECRET_KEY
- [ ] Database connection pooling
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Error tracking (Sentry)
- [ ] Health checks implemented
- [ ] Monitoring setup

### Post-Deployment
- [ ] Health check passing
- [ ] Database accessible
- [ ] API endpoints responding
- [ ] Frontend loading correctly
- [ ] Authentication working
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify backups running

## Best Practices

1. **Never Commit Secrets**: Use .env files and .gitignore
2. **Environment Validation**: Validate config on startup
3. **Separate Configs**: Different configs for dev/staging/prod
4. **Use Secrets Management**: AWS Secrets Manager, HashiCorp Vault
5. **Health Checks**: Implement proper health endpoints
6. **Graceful Shutdown**: Handle SIGTERM properly
7. **Zero-Downtime Deploys**: Use rolling updates
8. **Rollback Plan**: Always have a rollback strategy
9. **Monitor Everything**: Logs, metrics, errors
10. **Document Deployment**: Clear deployment procedures

## Resources

- [12-Factor App](https://12factor.net/)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions](https://docs.github.com/en/actions)
