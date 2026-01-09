"""
Schemas for collaboration features.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TaskAssignmentBase(BaseModel):
    """Base schema for task assignment."""

    task_id: int = Field(..., description="ID of the task to assign")
    assignee_id: int = Field(..., description="ID of the user to assign the task to")
    message: str | None = Field(None, max_length=1000, description="Optional message for the assignee")


class TaskAssignmentCreate(TaskAssignmentBase):
    """Schema for creating a task assignment."""

    pass


class TaskAssignmentUpdate(BaseModel):
    """Schema for updating a task assignment."""

    status: str | None = Field(None, description="Assignment status: pending, accepted, declined")


class TaskAssignmentInDB(TaskAssignmentBase):
    """Schema for task assignment as stored in database."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    assigned_by: int
    assigned_at: datetime
    status: str


class TaskAssignmentResponse(TaskAssignmentInDB):
    """Schema for task assignment API response."""

    pass


class TaskCommentBase(BaseModel):
    """Base schema for task comment."""

    task_id: int = Field(..., description="ID of the task to comment on")
    content: str = Field(..., min_length=1, max_length=1000, description="Comment content")


class TaskCommentCreate(TaskCommentBase):
    """Schema for creating a task comment."""

    pass


class TaskCommentUpdate(BaseModel):
    """Schema for updating a task comment."""

    content: str | None = Field(None, min_length=1, max_length=1000, description="Updated comment content")


class TaskCommentInDB(TaskCommentBase):
    """Schema for task comment as stored in database."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime


class TaskCommentResponse(TaskCommentInDB):
    """Schema for task comment API response."""

    pass


class TaskAssignmentListResponse(BaseModel):
    """Schema for paginated task assignment list response."""

    data: list[TaskAssignmentResponse]
    meta: dict[str, int] = Field(
        ...,
        description="Pagination metadata",
        examples=[{"page": 1, "per_page": 20, "total": 100, "total_pages": 5}],
    )


class TaskCommentListResponse(BaseModel):
    """Schema for paginated task comment list response."""

    data: list[TaskCommentResponse]
    meta: dict[str, int] = Field(
        ...,
        description="Pagination metadata",
        examples=[{"page": 1, "per_page": 20, "total": 100, "total_pages": 5}],
    )