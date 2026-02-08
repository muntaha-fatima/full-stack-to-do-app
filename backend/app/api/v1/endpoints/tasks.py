"""
Task API endpoints following the specified RESTful design.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.task import Task
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskListResponse,
    ErrorResponse
)
from app.repositories.task_repository import TaskRepository
from app.core.security import verify_token

router = APIRouter()


@router.get("/{user_id}/tasks", response_model=TaskListResponse)
async def list_tasks(
    user_id: int,
    status: Optional[str] = Query(None, description="Filter tasks by status (todo, in_progress, completed)"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TaskListResponse:
    """
    List all tasks for a specific user.

    Args:
        user_id: The ID of the user whose tasks to retrieve
        status: Optional status filter (todo, in_progress, completed)
        current_user: The authenticated user making the request
        db: Database session

    Returns:
        TaskListResponse: Paginated list of tasks
    """
    # Verify that the requesting user is the same as the user_id in the path
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user"
        )

    task_repo = TaskRepository(db)
    tasks = await task_repo.get_tasks_by_owner(user_id, status)

    # Convert to response format
    task_responses = [TaskResponse.from_orm(task) for task in tasks]

    return TaskListResponse(
        data=task_responses,
        meta={
            "page": 1,
            "per_page": len(tasks),
            "total": len(tasks),
            "total_pages": 1
        }
    )


@router.post("/{user_id}/tasks", response_model=TaskResponse)
async def create_task(
    user_id: int,
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TaskResponse:
    """
    Create a new task for a specific user.

    Args:
        user_id: The ID of the user who owns the task
        task_in: Task creation data
        current_user: The authenticated user making the request
        db: Database session

    Returns:
        TaskResponse: The created task
    """
    import logging
    logger = logging.getLogger(__name__)

    # Log incoming request for debugging
    logger.info(f"Creating task for user_id: {user_id}, current_user.id: {current_user.id}")
    logger.info(f"Task data received: {task_in.model_dump()}")

    # Verify that the requesting user is the same as the user_id in the path
    if current_user.id != user_id:
        logger.warning(f"User ID mismatch: path user_id={user_id}, authenticated user_id={current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Not authorized to create tasks for this user. Path user_id: {user_id}, authenticated user_id: {current_user.id}"
        )

    task_repo = TaskRepository(db)
    task_data = task_in.model_dump()
    task_data['owner_id'] = user_id

    # Log the final data being saved
    logger.info(f"Final task data to save: {task_data}")

    try:
        created_task = await task_repo.create_task(task_data)
        logger.info(f"Task created successfully with ID: {created_task.id}")
        return TaskResponse.from_orm(created_task)
    except Exception as e:
        logger.error(f"Error creating task: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Error creating task: {str(e)}"
        )


@router.get("/{user_id}/tasks/{id}", response_model=TaskResponse)
async def get_task(
    user_id: int,
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TaskResponse:
    """
    Get details of a specific task.

    Args:
        user_id: The ID of the user who owns the task
        id: The ID of the task to retrieve
        current_user: The authenticated user making the request
        db: Database session

    Returns:
        TaskResponse: The requested task
    """
    # Verify that the requesting user is the same as the user_id in the path
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user"
        )

    task_repo = TaskRepository(db)
    task = await task_repo.get_task_by_id_and_owner(id, user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse.from_orm(task)


@router.put("/{user_id}/tasks/{id}", response_model=TaskResponse)
async def update_task(
    user_id: int,
    id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TaskResponse:
    """
    Update a specific task.

    Args:
        user_id: The ID of the user who owns the task
        id: The ID of the task to update
        task_in: Task update data
        current_user: The authenticated user making the request
        db: Database session

    Returns:
        TaskResponse: The updated task
    """
    # Verify that the requesting user is the same as the user_id in the path
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    task_repo = TaskRepository(db)
    task = await task_repo.get_task_by_id_and_owner(id, user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update the task with the provided data
    update_data = task_in.model_dump(exclude_unset=True)
    updated_task = await task_repo.update_task(task.id, update_data)

    return TaskResponse.from_orm(updated_task)


@router.delete("/{user_id}/tasks/{id}")
async def delete_task(
    user_id: int,
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Delete a specific task.

    Args:
        user_id: The ID of the user who owns the task
        id: The ID of the task to delete
        current_user: The authenticated user making the request
        db: Database session

    Returns:
        dict: Success message
    """
    # Verify that the requesting user is the same as the user_id in the path
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete tasks for this user"
        )

    task_repo = TaskRepository(db)
    task = await task_repo.get_task_by_id_and_owner(id, user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    await task_repo.delete_task(task.id)

    return {"message": "Task deleted successfully"}


@router.patch("/{user_id}/tasks/{id}/complete")
async def toggle_task_completion(
    user_id: int,
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TaskResponse:
    """
    Toggle completion status of a specific task.

    Args:
        user_id: The ID of the user who owns the task
        id: The ID of the task to update
        current_user: The authenticated user making the request
        db: Database session

    Returns:
        TaskResponse: The updated task with toggled completion status
    """
    # Verify that the requesting user is the same as the user_id in the path
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    task_repo = TaskRepository(db)
    task = await task_repo.get_task_by_id_and_owner(id, user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Toggle the completion status
    updated_task = await task_repo.toggle_task_completion(task.id)

    return TaskResponse.from_orm(updated_task)