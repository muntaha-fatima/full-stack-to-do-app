# Docker & Containerization Skill

## Description
Expert in Docker containerization, multi-stage builds, Docker Compose orchestration, and container best practices for full-stack applications.

## Capabilities

### Docker Fundamentals
- **Images**: Building, tagging, and managing Docker images
- **Containers**: Running, stopping, and managing containers
- **Volumes**: Persistent data storage and bind mounts
- **Networks**: Container networking and communication
- **Multi-stage Builds**: Optimized production images
- **Layer Caching**: Efficient build processes

### Docker Compose
- **Service Definition**: Multi-container application setup
- **Networking**: Service discovery and communication
- **Environment Variables**: Configuration management
- **Health Checks**: Container health monitoring
- **Dependencies**: Service startup ordering
- **Volumes**: Shared data between services

### Full-Stack Containerization
- **Frontend**: Next.js containerization with Node.js
- **Backend**: FastAPI with Python and async support
- **Database**: PostgreSQL with persistent volumes
- **Reverse Proxy**: Nginx for routing and SSL
- **Development**: Hot reload and debugging support
- **Production**: Optimized builds and security

### Best Practices
- **Security**: Non-root users, minimal base images
- **Size Optimization**: Multi-stage builds, layer optimization
- **Caching**: Dependency caching for faster builds
- **Health Checks**: Proper health check implementation
- **Logging**: Structured logging to stdout/stderr
- **Secrets**: Secure secret management

## Usage Examples

### Next.js Dockerfile (Multi-stage)

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### FastAPI Dockerfile

```dockerfile
# Stage 1: Builder
FROM python:3.11-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1001 appuser

# Copy Python packages from builder
COPY --from=builder /root/.local /home/appuser/.local

# Copy application code
COPY --chown=appuser:appuser . .

# Set PATH for user-installed packages
ENV PATH=/home/appuser/.local/bin:$PATH

USER appuser

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose (Full Stack)

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    container_name: phas_db
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-phas_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app_network

  # FastAPI Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: phas_backend
    environment:
      DATABASE_URL: postgresql+asyncpg://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@db:5432/${DB_NAME:-phas_db}
      SECRET_KEY: ${SECRET_KEY}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS:-http://localhost:3000}
    volumes:
      - ./backend:/app
      - /app/__pycache__
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - app_network
    restart: unless-stopped

  # Next.js Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:8000}
    container_name: phas_frontend
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:8000}
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - app_network
    restart: unless-stopped

  # Nginx Reverse Proxy (Optional)
  nginx:
    image: nginx:alpine
    container_name: phas_nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    networks:
      - app_network
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local

networks:
  app_network:
    driver: bridge
```

### Development Docker Compose

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: phas_dev
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - dev_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:postgres@db:5432/phas_dev
      DEBUG: "true"
      RELOAD: "true"
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    depends_on:
      - db
    networks:
      - dev_network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
    command: npm run dev
    depends_on:
      - backend
    networks:
      - dev_network

volumes:
  postgres_dev_data:

networks:
  dev_network:
    driver: bridge
```

### .dockerignore

```
# Dependencies
node_modules
__pycache__
*.pyc
*.pyo
*.pyd
.Python
pip-log.txt
pip-delete-this-directory.txt

# Testing
.pytest_cache
.coverage
htmlcov
.tox

# Build outputs
dist
build
*.egg-info
.next
out

# Environment
.env
.env.local
.env.*.local
*.env

# IDE
.vscode
.idea
*.swp
*.swo
*~

# Git
.git
.gitignore
.gitattributes

# Documentation
README.md
docs
*.md

# CI/CD
.github
.gitlab-ci.yml

# Logs
*.log
logs
```

### Nginx Configuration

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:8000;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API
        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API Docs
        location /docs {
            proxy_pass http://backend/docs;
            proxy_set_header Host $host;
        }
    }
}
```

## Best Practices

1. **Multi-stage Builds**: Separate build and runtime stages
2. **Layer Optimization**: Order commands from least to most frequently changing
3. **Non-root User**: Always run containers as non-root
4. **Health Checks**: Implement proper health checks for all services
5. **Secrets Management**: Use Docker secrets or environment variables
6. **Minimal Base Images**: Use Alpine or slim variants
7. **Cache Dependencies**: Copy dependency files before source code
8. **Clean Up**: Remove unnecessary files and clear caches
9. **Version Pinning**: Pin specific versions of base images
10. **Documentation**: Document build arguments and environment variables

## Common Commands

```bash
# Build image
docker build -t myapp:latest .

# Run container
docker run -d -p 8000:8000 --name myapp myapp:latest

# View logs
docker logs -f myapp

# Execute command in container
docker exec -it myapp /bin/sh

# Docker Compose
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose ps

# Clean up
docker system prune -a
docker volume prune
```

## Troubleshooting

### Common Issues
- **Build Cache**: Use `--no-cache` flag to force rebuild
- **Port Conflicts**: Check if ports are already in use
- **Volume Permissions**: Ensure proper file permissions
- **Network Issues**: Check container networking configuration
- **Memory Limits**: Set appropriate memory limits for containers

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
