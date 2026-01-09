# API Design & REST Principles Skill

## Description
Expert in RESTful API design, HTTP standards, API versioning, documentation, and best practices for building scalable and maintainable APIs.

## Capabilities

### REST Fundamentals
- **Resource-Based**: URLs represent resources, not actions
- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE semantics
- **Status Codes**: Appropriate HTTP status code usage
- **Stateless**: Each request contains all necessary information
- **HATEOAS**: Hypermedia as the Engine of Application State
- **Content Negotiation**: Multiple representation formats

### API Design Patterns
- **CRUD Operations**: Create, Read, Update, Delete patterns
- **Filtering & Sorting**: Query parameter conventions
- **Pagination**: Offset, cursor, and page-based pagination
- **Search**: Full-text and filtered search endpoints
- **Bulk Operations**: Batch create, update, delete
- **Nested Resources**: Parent-child relationships
- **Versioning**: API version management strategies

### Request/Response Design
- **Request Bodies**: JSON structure and validation
- **Response Formats**: Consistent response structure
- **Error Responses**: Standardized error format
- **Field Selection**: Sparse fieldsets
- **Embedding**: Including related resources
- **Metadata**: Pagination, timestamps, counts

### API Documentation
- **OpenAPI/Swagger**: Interactive API documentation
- **Examples**: Request/response examples
- **Authentication**: Auth flow documentation
- **Rate Limits**: Usage limits and quotas
- **Changelog**: Version history and breaking changes
- **SDKs**: Client library generation

### Security & Performance
- **Authentication**: JWT, OAuth2, API keys
- **Authorization**: Role-based access control
- **Rate Limiting**: Request throttling
- **Caching**: HTTP caching headers
- **Compression**: Response compression
- **CORS**: Cross-origin resource sharing

## Usage Examples

### RESTful Endpoint Design

```python
# Good RESTful API design
from fastapi import APIRouter, Query, Path, status
from typing import Optional

router = APIRouter(prefix="/api/v1", tags=["tasks"])

# GET /api/v1/tasks - List all tasks
@router.get("/tasks", response_model=PaginatedResponse[TaskResponse])
async def list_tasks(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    status: Optional[str] = Query(None, description="Filter by status"),
    sort: str = Query("-created_at", description="Sort field (prefix with - for desc)"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve a paginated list of tasks.

    - **skip**: Pagination offset
    - **limit**: Number of items per page
    - **status**: Filter by task status (pending, completed, archived)
    - **sort**: Sort field (created_at, updated_at, title)
    - **search**: Full-text search query
    """
    query = select(Task)

    # Apply filters
    if status:
        query = query.where(Task.status == status)
    if search:
        query = query.where(
            or_(
                Task.title.ilike(f"%{search}%"),
                Task.description.ilike(f"%{search}%")
            )
        )

    # Apply sorting
    sort_field = sort.lstrip("-")
    sort_order = desc if sort.startswith("-") else asc
    query = query.order_by(sort_order(getattr(Task, sort_field)))

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    # Apply pagination
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    tasks = result.scalars().all()

    return {
        "items": tasks,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total
    }

# GET /api/v1/tasks/{task_id} - Get single task
@router.get(
    "/tasks/{task_id}",
    response_model=TaskResponse,
    responses={
        200: {"description": "Task found"},
        404: {"description": "Task not found"}
    }
)
async def get_task(
    task_id: int = Path(..., description="Task ID"),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve a single task by ID."""
    result = await db.execute(
        select(Task).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task

# POST /api/v1/tasks - Create new task
@router.post(
    "/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Task created successfully"},
        400: {"description": "Invalid request data"},
        422: {"description": "Validation error"}
    }
)
async def create_task(
    task: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new task.

    - **title**: Task title (required, max 200 chars)
    - **description**: Task description (optional)
    - **status**: Task status (default: pending)
    - **priority**: Task priority (low, medium, high)
    - **due_date**: Due date (ISO 8601 format)
    """
    db_task = Task(
        **task.model_dump(),
        user_id=current_user.id
    )
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

# PATCH /api/v1/tasks/{task_id} - Partial update
@router.patch(
    "/tasks/{task_id}",
    response_model=TaskResponse,
    responses={
        200: {"description": "Task updated successfully"},
        404: {"description": "Task not found"},
        403: {"description": "Not authorized to update this task"}
    }
)
async def update_task(
    task_id: int = Path(..., description="Task ID"),
    updates: TaskUpdate = ...,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Partially update a task.

    Only provided fields will be updated.
    """
    result = await db.execute(
        select(Task).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Update only provided fields
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    await db.commit()
    await db.refresh(task)
    return task

# DELETE /api/v1/tasks/{task_id} - Delete task
@router.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        204: {"description": "Task deleted successfully"},
        404: {"description": "Task not found"},
        403: {"description": "Not authorized to delete this task"}
    }
)
async def delete_task(
    task_id: int = Path(..., description="Task ID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a task."""
    result = await db.execute(
        select(Task).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    await db.delete(task)
    await db.commit()
    return None
```

### Nested Resources

```python
# GET /api/v1/users/{user_id}/tasks - Get user's tasks
@router.get("/users/{user_id}/tasks", response_model=list[TaskResponse])
async def get_user_tasks(
    user_id: int = Path(..., description="User ID"),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all tasks for a specific user."""
    result = await db.execute(
        select(Task).where(Task.user_id == user_id)
    )
    return result.scalars().all()

# POST /api/v1/tasks/{task_id}/comments - Add comment to task
@router.post("/tasks/{task_id}/comments", response_model=CommentResponse)
async def create_task_comment(
    task_id: int = Path(..., description="Task ID"),
    comment: CommentCreate = ...,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a comment to a task."""
    # Verify task exists
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_comment = Comment(
        **comment.model_dump(),
        task_id=task_id,
        user_id=current_user.id
    )
    db.add(db_comment)
    await db.commit()
    await db.refresh(db_comment)
    return db_comment
```

### Bulk Operations

```python
# POST /api/v1/tasks/bulk - Bulk create tasks
@router.post("/tasks/bulk", response_model=BulkCreateResponse)
async def bulk_create_tasks(
    tasks: list[TaskCreate],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create multiple tasks in a single request.

    Maximum 100 tasks per request.
    """
    if len(tasks) > 100:
        raise HTTPException(
            status_code=400,
            detail="Maximum 100 tasks per bulk request"
        )

    db_tasks = [
        Task(**task.model_dump(), user_id=current_user.id)
        for task in tasks
    ]
    db.add_all(db_tasks)
    await db.commit()

    return {
        "created": len(db_tasks),
        "tasks": db_tasks
    }

# PATCH /api/v1/tasks/bulk - Bulk update tasks
@router.patch("/tasks/bulk", response_model=BulkUpdateResponse)
async def bulk_update_tasks(
    updates: BulkTaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update multiple tasks in a single request.

    Provide task IDs and fields to update.
    """
    result = await db.execute(
        select(Task).where(
            Task.id.in_(updates.task_ids),
            Task.user_id == current_user.id
        )
    )
    tasks = result.scalars().all()

    if len(tasks) != len(updates.task_ids):
        raise HTTPException(
            status_code=404,
            detail="Some tasks not found or not authorized"
        )

    update_data = updates.updates.model_dump(exclude_unset=True)
    for task in tasks:
        for field, value in update_data.items():
            setattr(task, field, value)

    await db.commit()

    return {
        "updated": len(tasks),
        "tasks": tasks
    }
```

### Standardized Response Format

```python
from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    """Standardized API response wrapper"""
    success: bool
    data: Optional[T] = None
    message: Optional[str] = None
    errors: Optional[list[str]] = None

class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response format"""
    items: list[T]
    total: int
    skip: int
    limit: int
    has_more: bool

class ErrorResponse(BaseModel):
    """Standardized error response"""
    error: str
    message: str
    details: Optional[dict] = None
    timestamp: str
    path: str

# Usage
@router.get("/tasks", response_model=ApiResponse[list[TaskResponse]])
async def list_tasks(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task))
    tasks = result.scalars().all()

    return ApiResponse(
        success=True,
        data=tasks,
        message="Tasks retrieved successfully"
    )
```

### Error Handling

```python
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.status_code,
            "message": exc.detail,
            "timestamp": datetime.utcnow().isoformat(),
            "path": request.url.path
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })

    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "message": "Request validation failed",
            "details": errors,
            "timestamp": datetime.utcnow().isoformat(),
            "path": request.url.path
        }
    )
```

### API Versioning

```python
# URL versioning
app.include_router(v1_router, prefix="/api/v1")
app.include_router(v2_router, prefix="/api/v2")

# Header versioning
@app.middleware("http")
async def version_middleware(request: Request, call_next):
    api_version = request.headers.get("X-API-Version", "v1")
    request.state.api_version = api_version
    response = await call_next(request)
    response.headers["X-API-Version"] = api_version
    return response

# Accept header versioning
@router.get("/tasks")
async def list_tasks(
    request: Request,
    accept: str = Header(default="application/vnd.api.v1+json")
):
    if "v2" in accept:
        # Return v2 format
        pass
    else:
        # Return v1 format
        pass
```

### Rate Limiting

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@router.get("/tasks")
@limiter.limit("100/minute")
async def list_tasks(request: Request):
    """Rate limited to 100 requests per minute"""
    pass

@router.post("/tasks")
@limiter.limit("20/minute")
async def create_task(request: Request):
    """Rate limited to 20 requests per minute"""
    pass
```

## HTTP Status Codes

### Success Codes
- **200 OK**: Successful GET, PATCH, PUT
- **201 Created**: Successful POST with resource creation
- **204 No Content**: Successful DELETE or update with no response body
- **206 Partial Content**: Partial GET response

### Client Error Codes
- **400 Bad Request**: Invalid request format
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource conflict (duplicate)
- **422 Unprocessable Entity**: Validation error
- **429 Too Many Requests**: Rate limit exceeded

### Server Error Codes
- **500 Internal Server Error**: Unexpected server error
- **502 Bad Gateway**: Upstream service error
- **503 Service Unavailable**: Temporary unavailability
- **504 Gateway Timeout**: Upstream timeout

## Best Practices

1. **Use Nouns for Resources**: `/tasks` not `/getTasks`
2. **HTTP Methods for Actions**: Use proper HTTP verbs
3. **Plural Resource Names**: `/tasks` not `/task`
4. **Consistent Naming**: Use kebab-case or snake_case consistently
5. **Version Your API**: Plan for breaking changes
6. **Paginate Collections**: Always paginate list endpoints
7. **Filter & Sort**: Support query parameters for filtering
8. **Proper Status Codes**: Use appropriate HTTP status codes
9. **Error Messages**: Provide clear, actionable error messages
10. **Documentation**: Maintain up-to-date API documentation

## API Design Checklist

- [ ] RESTful resource naming
- [ ] Proper HTTP methods
- [ ] Appropriate status codes
- [ ] Request validation
- [ ] Error handling
- [ ] Pagination for lists
- [ ] Filtering and sorting
- [ ] Authentication
- [ ] Authorization
- [ ] Rate limiting
- [ ] API versioning
- [ ] Documentation (OpenAPI)
- [ ] CORS configuration
- [ ] Caching headers
- [ ] Compression

## Resources

- [REST API Tutorial](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [API Design Patterns](https://www.apiguide.io/)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
