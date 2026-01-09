# Full-Stack Todo App

A production-ready Todo application built with Next.js 14, FastAPI, PostgreSQL, and Docker. This monorepo demonstrates modern full-stack development practices with comprehensive testing, type safety, and deployment-ready configuration.

## Features

- **Modern Tech Stack**: Next.js 14 (App Router), FastAPI, PostgreSQL 16, Redis
- **Type Safety**: TypeScript (strict mode) and Python type hints throughout
- **Async Everything**: Async SQLAlchemy 2.0, React Query for data fetching
- **Production Ready**: Docker multi-stage builds, health checks, monitoring hooks
- **Comprehensive Testing**: Pytest (backend), Jest (frontend) with 80%+ coverage target
- **Code Quality**: ESLint, Prettier, Black, Ruff with pre-commit hooks
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Database Migrations**: Alembic for version-controlled schema changes
- **Security**: CORS, input validation, JWT-ready authentication

## Project Structure

```
phas_II/
├── frontend/                   # Next.js application
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and API clients
│   ├── types/                 # TypeScript type definitions
│   ├── public/                # Static assets
│   ├── Dockerfile             # Multi-stage Docker build
│   └── package.json           # Frontend dependencies
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── api/v1/           # API routes
│   │   ├── core/             # Configuration and security
│   │   ├── db/               # Database session management
│   │   ├── models/           # SQLAlchemy models
│   │   └── schemas/          # Pydantic schemas
│   ├── alembic/              # Database migrations
│   ├── tests/                # Pytest test suite
│   ├── Dockerfile            # Multi-stage Docker build
│   └── pyproject.toml        # Backend dependencies
├── shared/                     # Shared types and utilities
│   └── types/                # Shared TypeScript types
├── db/                        # Database initialization
│   └── init/                 # PostgreSQL init scripts
├── .specify/                  # SpecKit Plus configuration
├── docker-compose.yml         # Service orchestration
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Prerequisites

- **Node.js** 18+ and npm 9+
- **Python** 3.11+
- **PostgreSQL** 16+
- **Redis** 7+ (optional, for caching)
- **Docker** and Docker Compose (for containerized development)

## Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone and setup environment**:
   ```bash
   git clone <repository-url>
   cd phas_II
   cp .env.example .env
   ```

2. **Start all services**:
   ```bash
   npm install  # Install root dependencies
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/api/v1/docs

4. **View logs**:
   ```bash
   docker-compose logs -f
   ```

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**:
   ```bash
   cp ../.env.example .env
   # Edit .env with your database credentials
   ```

5. **Run migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Start development server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Running Tests

**Backend**:
```bash
cd backend
pytest                          # Run all tests
pytest --cov=app               # With coverage
pytest tests/test_tasks.py -v  # Specific test file
```

**Frontend**:
```bash
cd frontend
npm test                        # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # With coverage
```

### Code Quality

**Format code**:
```bash
npm run format                  # Format all code
npm run format:frontend         # Frontend only
npm run format:backend          # Backend only
```

**Lint code**:
```bash
npm run lint                    # Lint all code
npm run lint:frontend           # Frontend only
npm run lint:backend            # Backend only
```

**Type checking**:
```bash
cd frontend && npm run type-check  # TypeScript
cd backend && mypy app/            # Python
```

### Database Migrations

**Create new migration**:
```bash
cd backend
alembic revision --autogenerate -m "description"
```

**Apply migrations**:
```bash
alembic upgrade head
```

**Rollback migration**:
```bash
alembic downgrade -1
```

## API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/api/v1/docs
- **ReDoc**: http://localhost:8000/api/v1/redoc
- **OpenAPI JSON**: http://localhost:8000/api/v1/openapi.json

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql+asyncpg://todoapp:password@localhost:5432/todoapp

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-min-32-characters
ENVIRONMENT=development

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild images
docker-compose build

# View logs
docker-compose logs -f [service-name]

# Restart specific service
docker-compose restart [service-name]

# Execute command in container
docker-compose exec backend bash
docker-compose exec frontend sh
```

## Architecture Decisions

This project follows several key architectural principles:

1. **API-First Development**: All features start with API contract definition
2. **Test-Driven Development**: Tests written before implementation (Red-Green-Refactor)
3. **Type Safety Everywhere**: TypeScript strict mode and Python type hints
4. **Security by Default**: Input validation, CORS, prepared statements
5. **Performance Standards**: Response time budgets, connection pooling, caching

For detailed architectural decisions, see `.specify/memory/constitution.md`.

## Performance Targets

- **Frontend**: FCP < 1.5s, LCP < 2.5s, TTI < 3.5s
- **Backend**: p95 < 200ms (simple queries), p95 < 500ms (complex queries)
- **Database**: Query time < 100ms for indexed queries

## Security Features

- **Input Validation**: Pydantic (backend) and Zod (frontend)
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries
- **XSS Prevention**: React's built-in escaping, Content Security Policy
- **CORS**: Strict origin validation
- **Authentication Ready**: JWT token infrastructure in place

## Monitoring and Observability

- **Health Checks**: `/health` endpoints for load balancers
- **Structured Logging**: JSON logs with correlation IDs (ready to implement)
- **Metrics**: Prometheus-compatible metrics (ready to implement)
- **Tracing**: OpenTelemetry support (ready to implement)

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U todoapp -d todoapp
```

### Port Conflicts

If ports 3000, 8000, 5432, or 6379 are already in use, edit `docker-compose.yml` or `.env` to use different ports.

### Module Not Found Errors

```bash
# Backend
cd backend && pip install -r requirements.txt

# Frontend
cd frontend && npm install
```

## Contributing

1. Follow the code style (Black, Ruff, Prettier, ESLint)
2. Write tests for new features (minimum 80% coverage)
3. Update documentation
4. Run all tests before committing
5. Follow conventional commit messages

## License

MIT

## Support

For issues and questions:
- Check the documentation in `frontend/README.md` and `backend/README.md`
- Review the constitution at `.specify/memory/constitution.md`
- Open an issue on GitHub

---

**Built with**: Next.js 14, FastAPI, PostgreSQL, Redis, Docker, TypeScript, Python 3.11+
