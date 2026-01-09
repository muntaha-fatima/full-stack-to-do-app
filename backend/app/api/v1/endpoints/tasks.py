"""
Task API endpoints.
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.task import Task, TaskPriority, TaskStatus
from app.models.user import User
from app.schemas.task import TaskCreate, TaskListResponse, TaskResponse, TaskUpdate

router = APIRouter()


@router.get("/", response_model=TaskListResponse)
async def list_tasks(
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    status: TaskStatus | None = Query(None, description="Filter by status"),
    priority: TaskPriority | None = Query(None, description="Filter by priority"),
    completed: bool | None = Query(None, description="Filter by completion status"),
    tag: str | None = Query(None, description="Filter by tag"),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Retrieve a paginated list of tasks for the current user.

    Args:
        current_user: Authenticated user
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        status: Optional status filter
        priority: Optional priority filter
        completed: Optional completion status filter
        tag: Optional tag filter (tasks containing this tag)
        db: Database session

    Returns:
        Paginated list of tasks with metadata
    """
    # Build query
    query = select(Task).where(Task.owner_id == current_user.id)

    # Apply filters
    if status is not None:
        query = query.where(Task.status == status)
    if priority is not None:
        query = query.where(Task.priority == priority)
    if completed is not None:
        query = query.where(Task.completed == completed)
    if tag is not None:
        query = query.where(Task.tags.contains([tag]))

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination and ordering
    query = query.order_by(Task.created_at.desc()).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    tasks = result.scalars().all()

    # Calculate pagination metadata
    total_pages = (total + limit - 1) // limit if total > 0 else 0
    current_page = (skip // limit) + 1 if limit > 0 else 1

    return {
        "data": tasks,
        "meta": {
            "page": current_page,
            "per_page": limit,
            "total": total,
            "total_pages": total_pages,
        },
    }


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create a new task for the current user.

    Args:
        task_in: Task creation data
        current_user: Authenticated user
        db: Database session

    Returns:
        Created task
    """
    task = Task(**task_in.model_dump(), owner_id=current_user.id)
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get a specific task by ID for the current user.

    Args:
        task_id: Task ID
        current_user: Authenticated user
        db: Database session

    Returns:
        Task details

    Raises:
        HTTPException: If task not found or not owned by user
    """
    result = await db.execute(select(Task).where(Task.id == task_id).where(Task.owner_id == current_user.id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found or not owned by user",
        )

    return task


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Update a task (partial update) for the current user.

    Args:
        task_id: Task ID
        task_in: Task update data (only provided fields will be updated)
        current_user: Authenticated user
        db: Database session

    Returns:
        Updated task

    Raises:
        HTTPException: If task not found or not owned by user
    """
    result = await db.execute(select(Task).where(Task.id == task_id).where(Task.owner_id == current_user.id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found or not owned by user",
        )

    # Update only provided fields
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    await db.commit()
    await db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a task for the current user.

    Args:
        task_id: Task ID
        current_user: Authenticated user
        db: Database session

    Raises:
        HTTPException: If task not found or not owned by user
    """
    result = await db.execute(select(Task).where(Task.id == task_id).where(Task.owner_id == current_user.id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found or not owned by user",
        )

    await db.delete(task)
    await db.commit()
