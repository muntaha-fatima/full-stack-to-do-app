"""
Collaboration API endpoints.
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.collaboration import TaskAssignment, TaskComment
from app.models.task import Task
from app.models.user import User
from app.schemas.collaboration import (
    TaskAssignmentCreate,
    TaskAssignmentListResponse,
    TaskAssignmentResponse,
    TaskAssignmentUpdate,
    TaskCommentCreate,
    TaskCommentListResponse,
    TaskCommentResponse,
    TaskCommentUpdate,
)

router = APIRouter()


# Task Assignment Endpoints
@router.get("/assignments", response_model=TaskAssignmentListResponse)
async def list_task_assignments(
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    assignment_status: str | None = Query(None, description="Filter by assignment status"),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Retrieve a paginated list of task assignments for the current user.

    Args:
        current_user: Authenticated user
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        assignment_status: Optional status filter
        db: Database session

    Returns:
        Paginated list of task assignments with metadata
    """
    # Build query - show assignments where user is either assigner or assignee
    query = select(TaskAssignment).where(
        (TaskAssignment.assigned_by == current_user.id) | 
        (TaskAssignment.assignee_id == current_user.id)
    )

    # Apply status filter if provided
    if assignment_status:
        query = query.where(TaskAssignment.status == assignment_status)

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination and ordering
    query = query.order_by(TaskAssignment.assigned_at.desc()).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    assignments = result.scalars().all()

    # Calculate pagination metadata
    total_pages = (total + limit - 1) // limit if total > 0 else 0
    current_page = (skip // limit) + 1 if limit > 0 else 1

    return {
        "data": assignments,
        "meta": {
            "page": current_page,
            "per_page": limit,
            "total": total,
            "total_pages": total_pages,
        },
    }


@router.post("/assignments", response_model=TaskAssignmentResponse, status_code=status.HTTP_201_CREATED)
async def create_task_assignment(
    assignment_in: TaskAssignmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Assign a task to another user.

    Args:
        assignment_in: Assignment creation data
        current_user: Authenticated user (assigner)
        db: Database session

    Returns:
        Created assignment
    """
    # Verify the task exists and belongs to the current user
    task_result = await db.execute(
        select(Task).where(Task.id == assignment_in.task_id, Task.owner_id == current_user.id)
    )
    task = task_result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or not owned by user",
        )

    # Create assignment
    assignment = TaskAssignment(
        **assignment_in.model_dump(),
        assigned_by=current_user.id
    )
    
    db.add(assignment)
    await db.commit()
    await db.refresh(assignment)
    return assignment


@router.patch("/assignments/{assignment_id}", response_model=TaskAssignmentResponse)
async def update_task_assignment(
    assignment_id: int,
    assignment_in: TaskAssignmentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Update a task assignment (accept/decline).

    Args:
        assignment_id: Assignment ID
        assignment_in: Assignment update data
        current_user: Authenticated user (assignee)
        db: Database session

    Returns:
        Updated assignment
    """
    # Get the assignment
    result = await db.execute(
        select(TaskAssignment).where(
            TaskAssignment.id == assignment_id,
            TaskAssignment.assignee_id == current_user.id  # Only assignee can update status
        )
    )
    assignment = result.scalar_one_or_none()

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found or not assigned to user",
        )

    # Update only provided fields
    update_data = assignment_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(assignment, field, value)

    await db.commit()
    await db.refresh(assignment)
    return assignment


# Task Comment Endpoints
@router.get("/comments", response_model=TaskCommentListResponse)
async def list_task_comments(
    task_id: int,
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Retrieve a paginated list of comments for a specific task.

    Args:
        task_id: Task ID to get comments for
        current_user: Authenticated user
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        db: Database session

    Returns:
        Paginated list of task comments with metadata
    """
    # Verify the user has access to the task (either owner or assignee)
    task_result = await db.execute(
        select(Task).where(Task.id == task_id).where(
            (Task.owner_id == current_user.id) |
            select(TaskAssignment).where(
                TaskAssignment.task_id == task_id,
                TaskAssignment.assignee_id == current_user.id,
                TaskAssignment.status == "accepted"
            ).exists()
        )
    )
    task = task_result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or access denied",
        )

    # Build query for comments
    query = select(TaskComment).where(TaskComment.task_id == task_id)

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination and ordering
    query = query.order_by(TaskComment.created_at.asc()).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    comments = result.scalars().all()

    # Calculate pagination metadata
    total_pages = (total + limit - 1) // limit if total > 0 else 0
    current_page = (skip // limit) + 1 if limit > 0 else 1

    return {
        "data": comments,
        "meta": {
            "page": current_page,
            "per_page": limit,
            "total": total,
            "total_pages": total_pages,
        },
    }


@router.post("/comments", response_model=TaskCommentResponse, status_code=status.HTTP_201_CREATED)
async def create_task_comment(
    comment_in: TaskCommentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Add a comment to a task.

    Args:
        comment_in: Comment creation data
        current_user: Authenticated user
        db: Database session

    Returns:
        Created comment
    """
    # Verify the user has access to the task (either owner or assignee)
    task_result = await db.execute(
        select(Task).where(Task.id == comment_in.task_id).where(
            (Task.owner_id == current_user.id) |
            select(TaskAssignment).where(
                TaskAssignment.task_id == comment_in.task_id,
                TaskAssignment.assignee_id == current_user.id,
                TaskAssignment.status == "accepted"
            ).exists()
        )
    )
    task = task_result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or access denied",
        )

    # Create comment
    comment = TaskComment(
        **comment_in.model_dump(),
        author_id=current_user.id
    )
    
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment


@router.patch("/comments/{comment_id}", response_model=TaskCommentResponse)
async def update_task_comment(
    comment_id: int,
    comment_in: TaskCommentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Update a task comment.

    Args:
        comment_id: Comment ID
        comment_in: Comment update data
        current_user: Authenticated user (comment author)
        db: Database session

    Returns:
        Updated comment
    """
    # Get the comment
    result = await db.execute(
        select(TaskComment).where(
            TaskComment.id == comment_id,
            TaskComment.author_id == current_user.id  # Only author can update
        )
    )
    comment = result.scalar_one_or_none()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or not authored by user",
        )

    # Update only provided fields
    update_data = comment_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(comment, field, value)

    await db.commit()
    await db.refresh(comment)
    return comment


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a task comment.

    Args:
        comment_id: Comment ID
        current_user: Authenticated user (comment author)
        db: Database session
    """
    # Get the comment
    result = await db.execute(
        select(TaskComment).where(
            TaskComment.id == comment_id,
            TaskComment.author_id == current_user.id  # Only author can delete
        )
    )
    comment = result.scalar_one_or_none()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or not authored by user",
        )

    await db.delete(comment)
    await db.commit()