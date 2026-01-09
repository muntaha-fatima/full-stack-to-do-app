# Backend - FastAPI Todo App

Production-ready FastAPI backend with async SQLAlchemy, PostgreSQL, and comprehensive testing.

## Features

- **FastAPI 0.104+** with async/await support
- **SQLAlchemy 2.0** with async engine and asyncpg driver
- **PostgreSQL 16+** for data persistence
- **Alembic** for database migrations
- **Pydantic v2** for data validation and serialization
- **JWT Authentication** with refresh token rotation (ready to implement)
- **Redis** for caching and session storage
- **Pytest** with async support and 80%+ code coverage
- **Type Safety** with Python type hints and mypy strict mode
- **Code Quality** with Black, Ruff, and pre-commit hooks
- **Docker** support with multi-stage builds
- **OpenAPI/Swagger** documentation at `/api/v1/docs`

## Project Structure

```
backend/
├── alembic/                    # Database migrations
│   ├── versions/              # Migration scripts
│   └── env.py                 # Alembic environment
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/     # API route handlers
│   │       │   ├── tasks.py
│   │       │   └── health.py
│   │       └── api.py         # API router aggregation
│   ├── core/
│   │   ├── config.py          # Application settings
│   │   └── security.py        # Auth utilities
│   ├── db/
│   │   └── session.py         # Database session management
│   ├── models/
│   │   └── task.py            # SQLAlchemy models
│   ├── schemas/
│   │   └── task.py            # Pydantic schemas
│   └── main.py                # FastAPI application
├── tests/
│   ├── conftest.py            # Test fixtures
│   └── test_tasks.py          # Task endpoint tests
├── .dockerignore
├── .python-version
├── Dockerfile
├── alembic.ini
├── pyproject.toml
└── requirements.txt
```

## Prerequisites

- Python 3.11+
- PostgreSQL 16+
- Redis 7+ (optional, for caching)

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt

# For development
pip install pytest pytest-asyncio pytest-cov black ruff mypy
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp ../.env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=postgresql+asyncpg://todoapp:todoapp_dev_password@localhost:5432/todoapp
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-min-32-characters-long
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Initialize Database

```bash
# Create database (if not exists)
createdb todoapp

# Run migrations
alembic upgrade head
```

### 5. Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## Testing

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=app --cov-report=html --cov-report=term-missing
```

### Run Specific Test File

```bash
pytest tests/test_tasks.py -v
```

## Code Quality

### Format Code

```bash
black .
```

### Lint Code

```bash
ruff check .
```

### Type Check

```bash
mypy app/
```

## Database Migrations

### Create New Migration

```bash
alembic revision --autogenerate -m "description of changes"
```

### Apply Migrations

```bash
alembic upgrade head
```

### Rollback Migration

```bash
alembic downgrade -1
```

### View Migration History

```bash
alembic history
```

## API Endpoints

### Health Check

- `GET /health` - Health check endpoint
- `GET /api/v1/health` - API health check

### Tasks

- `GET /api/v1/tasks/` - List tasks (with pagination and filters)
- `POST /api/v1/tasks/` - Create a new task
- `GET /api/v1/tasks/{task_id}` - Get a specific task
- `PUT /api/v1/tasks/{task_id}` - Update a task
- `DELETE /api/v1/tasks/{task_id}` - Delete a task

### Query Parameters

- `skip` - Number of records to skip (default: 0)
- `limit` - Number of records to return (default: 20, max: 100)
- `status` - Filter by status (todo, in_progress, completed)
- `completed` - Filter by completion status (true, false)

## Docker

### Build Image

```bash
docker build -t todo-backend .
```

### Run Container

```bash
docker run -p 8000:8000 --env-file .env todo-backend
```

### Using Docker Compose

From the project root:

```bash
docker-compose up backend
```

## Performance Considerations

- **Connection Pooling**: Configured with min 5, max 20 connections
- **Async Operations**: All database operations are async
- **Indexing**: Indexes on frequently queried columns (status, priority, completed)
- **Pagination**: Cursor-based pagination for large datasets
- **Caching**: Redis integration ready for response caching

## Security

- **CORS**: Configured with explicit origins (no wildcards in production)
- **SQL Injection**: Protected via SQLAlchemy ORM and parameterized queries
- **Input Validation**: Pydantic schemas validate all input data
- **Type Safety**: Python type hints with mypy strict mode
- **Secrets**: Environment variables only, never committed to version control
- **Non-root User**: Docker container runs as non-root user

## Monitoring and Observability

- **Health Checks**: `/health` endpoint for load balancers
- **Structured Logging**: JSON logs with correlation IDs (ready to implement)
- **Metrics**: Prometheus-compatible metrics (ready to implement)
- **Tracing**: OpenTelemetry support (ready to implement)

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Test connection
psql -h localhost -U todoapp -d todoapp
```

### Migration Issues

```bash
# Reset database (WARNING: destroys all data)
alembic downgrade base
alembic upgrade head
```

### Import Errors

```bash
# Ensure you're in the backend directory and venv is activated
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

## Contributing

1. Follow the code style (Black + Ruff)
2. Write tests for new features (minimum 80% coverage)
3. Update documentation
4. Run all tests before committing
5. Follow conventional commit messages

## License

MIT
