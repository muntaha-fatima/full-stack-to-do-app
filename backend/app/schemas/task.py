"""
Pydantic schemas for task validation and serialization.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.task import TaskPriority, TaskStatus


class TaskBase(BaseModel):
    """Base task schema with common fields."""

    title: str = Field(..., min_length=1, max_length=255, description="Task title")
    description: str | None = Field(None, description="Task description")
    status: TaskStatus = Field(default=TaskStatus.TODO, description="Task status")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Task priority")
    tags: list[str] | None = Field(default=None, description="Task tags")
    due_date: datetime | None = Field(None, description="Task due date")


class TaskCreate(TaskBase):
    """Schema for creating a new task."""

    pass


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""

    title: str | None = Field(None, min_length=1, max_length=255, description="Task title")
    description: str | None = Field(None, description="Task description")
    status: TaskStatus | None = Field(None, description="Task status")
    priority: TaskPriority | None = Field(None, description="Task priority")
    completed: bool | None = Field(None, description="Task completion status")
    tags: list[str] | None = Field(None, description="Task tags")
    due_date: datetime | None = Field(None, description="Task due date")


class TaskInDB(TaskBase):
    """Schema for task as stored in database."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime


class TaskResponse(TaskInDB):
    """Schema for task API response."""

    pass


class TaskListResponse(BaseModel):
    """Schema for paginated task list response."""

    data: list[TaskResponse]
    meta: dict[str, int] = Field(
        ...,
        description="Pagination metadata",
        examples=[{"page": 1, "per_page": 20, "total": 100, "total_pages": 5}],
    )


class ErrorDetail(BaseModel):
    """Schema for error detail."""

    field: str | None = Field(None, description="Field that caused the error")
    message: str = Field(..., description="Error message")


class ErrorResponse(BaseModel):
    """Schema for error response."""

    error: dict[str, str | list[ErrorDetail] | None] = Field(
        ...,
        description="Error information",
        examples=[
            {
                "code": "VALIDATION_ERROR",
                "message": "Invalid input data",
                "details": [{"field": "title", "message": "Title is required"}],
            }
        ],
    )
