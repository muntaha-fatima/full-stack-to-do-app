# FastAPI Development Skill

## Description
Expert FastAPI developer specializing in modern Python async web APIs with type safety, automatic documentation, and high performance.

## Capabilities

### Core FastAPI Features
- **Async/Await**: Native async support with asyncio and async database operations
- **Type Hints**: Pydantic models for request/response validation
- **Automatic Docs**: Interactive API documentation (Swagger UI & ReDoc)
- **Dependency Injection**: Powerful DI system for database sessions, auth, etc.
- **Path Operations**: RESTful endpoints with decorators (@app.get, @app.post, etc.)
- **Background Tasks**: Non-blocking background job execution

### Project Setup
- Initialize FastAPI projects with proper structure
- Configure CORS, middleware, and security
- Set up environment variables with pydantic-settings
- Implement proper folder structure (app/, routers/, models/, schemas/)
- Configure logging and error handling

### API Development
- Create RESTful CRUD endpoints
- Implement path parameters, query parameters, and request bodies
- Handle file uploads and downloads
- Set up WebSocket endpoints for real-time communication
- Implement pagination, filtering, and sorting
- Use response models and status codes properly

### Database Integration
- **SQLAlchemy 2.0**: Async ORM with declarative models
- **Alembic**: Database migrations and version control
- **PostgreSQL**: Primary database with async support (asyncpg)
- Connection pooling and session management
- Transaction handling and rollback strategies
- Database health checks and monitoring

### Authentication & Authorization
- JWT token-based authentication
- OAuth2 with Password flow
- Role-based access control (RBAC)
- API key authentication
- Session management
- Password hashing with bcrypt or passlib

### Data Validation
- Pydantic models for request/response schemas
- Custom validators and field constraints
- Nested models and relationships
- Enum types and literal values
- Optional fields and default values
- Error messages and validation responses

### Error Handling
- Custom exception handlers
- HTTP exception classes
- Validation error responses
- Database error handling
- Logging and monitoring errors
- User-friendly error messages

### Testing
- pytest with async support
- Test client for API testing
- Database fixtures and test data
- Mocking external dependencies
- Integration and unit tests
- Test coverage reporting

### Performance Optimization
- Async database queries
- Connection pooling
- Caching strategies (Redis)
- Query optimization and indexing
- Response compression
- Rate limiting and throttling

### Security Best Practices
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Security headers
- Secrets management
- API versioning

## Usage Examples

### Basic CRUD Router
```python
# app/routers/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.task import TaskCreate, TaskResponse
from app.models.task import Task

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskResponse, status_code=201)
async def create_task(
    task: TaskCreate,
    db: AsyncSession = Depends(get_db)
):
    db_task = Task(**task.model_dump())
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
```

### Pydantic Schemas
```python
# app/schemas/task.py
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    completed: Optional[bool] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
```

### SQLAlchemy Models
```python
# app/models/task.py
from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
```

### Database Configuration
```python
# app/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

### Main Application
```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import tasks, users
from app.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(tasks.router, prefix="/api")
app.include_router(users.router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### Authentication Dependency
```python
# app/dependencies/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user
```

## Best Practices

1. **Use Async Everywhere**: Leverage async/await for I/O operations
2. **Type Hints**: Always use type hints for better IDE support and validation
3. **Pydantic Models**: Separate schemas for create, update, and response
4. **Dependency Injection**: Use for database sessions, auth, and shared logic
5. **Error Handling**: Implement custom exception handlers for consistent responses
6. **Documentation**: Add docstrings and use response_model for auto-docs
7. **Security**: Validate all inputs, use parameterized queries, hash passwords
8. **Testing**: Write comprehensive tests with high coverage
9. **Logging**: Implement structured logging for debugging and monitoring
10. **Environment Config**: Use pydantic-settings for configuration management

## Common Patterns

### Pagination
```python
from fastapi import Query

@router.get("/", response_model=list[TaskResponse])
async def list_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).offset(skip).limit(limit)
    )
    return result.scalars().all()
```

### Background Tasks
```python
from fastapi import BackgroundTasks

def send_email(email: str, message: str):
    # Send email logic
    pass

@router.post("/send-notification")
async def send_notification(
    email: str,
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(send_email, email, "Hello!")
    return {"message": "Notification sent"}
```

## Integration Points

- **Frontend**: Next.js, React, Vue.js with typed API clients
- **Database**: PostgreSQL with asyncpg, SQLAlchemy 2.0
- **Cache**: Redis for caching and session storage
- **Queue**: Celery or RQ for background jobs
- **Auth**: JWT, OAuth2, or third-party providers
- **Monitoring**: Prometheus, Grafana, Sentry
- **Deployment**: Docker, Kubernetes, AWS, GCP, or Vercel

## Troubleshooting

### Common Issues
- **Async/Sync Mixing**: Ensure all database operations are async
- **Session Management**: Always use dependency injection for sessions
- **CORS Errors**: Configure CORS middleware properly
- **Validation Errors**: Check Pydantic model definitions
- **Import Errors**: Avoid circular imports with proper structure

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Docs](https://docs.sqlalchemy.org/en/20/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Async Python Guide](https://docs.python.org/3/library/asyncio.html)
