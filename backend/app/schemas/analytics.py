"""
Schemas for analytics and insights.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class UserActivityBase(BaseModel):
    """Base schema for user activity."""

    action: str = Field(..., max_length=100, description="Action performed (e.g., task_created)")
    entity_type: str = Field(..., max_length=50, description="Entity type (e.g., task, category)")
    entity_id: int | None = Field(None, description="ID of the entity affected")
    metadata: str | None = Field(None, max_length=500, description="Additional info as JSON string")


class UserActivityCreate(UserActivityBase):
    """Schema for creating a user activity record."""

    pass


class UserActivityInDB(UserActivityBase):
    """Schema for user activity as stored in database."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    timestamp: datetime


class UserActivityResponse(UserActivityInDB):
    """Schema for user activity API response."""

    pass


class ProductivityMetricBase(BaseModel):
    """Base schema for productivity metric."""

    metric_type: str = Field(..., max_length=100, description="Type of metric (e.g., tasks_completed_week)")
    value: float = Field(..., description="Metric value")
    period_start: datetime = Field(..., description="Start of the measurement period")
    period_end: datetime = Field(..., description="End of the measurement period")


class ProductivityMetricCreate(ProductivityMetricBase):
    """Schema for creating a productivity metric."""

    pass


class ProductivityMetricInDB(ProductivityMetricBase):
    """Schema for productivity metric as stored in database."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    calculated_at: datetime


class ProductivityMetricResponse(ProductivityMetricInDB):
    """Schema for productivity metric API response."""

    pass


class TaskCompletionInsight(BaseModel):
    """Schema for task completion insights."""

    completed_count: int = Field(..., description="Number of completed tasks")
    total_count: int = Field(..., description="Total number of tasks")
    completion_rate: float = Field(..., description="Completion rate as percentage")
    period: str = Field(..., description="Period for the insight (e.g., week, month)")


class ProductivityInsightsResponse(BaseModel):
    """Schema for productivity insights response."""

    user_id: int
    overall_completion_rate: float = Field(..., description="Overall task completion rate")
    weekly_insights: List[TaskCompletionInsight] = Field(..., description="Weekly completion insights")
    monthly_insights: List[TaskCompletionInsight] = Field(..., description="Monthly completion insights")
    top_categories: List[dict] = Field(..., description="Top categories by task completion")
    average_completion_time: float = Field(..., description="Average time to complete tasks (in hours)")


class UserActivityListResponse(BaseModel):
    """Schema for paginated user activity list response."""

    data: List[UserActivityResponse]
    meta: dict[str, int] = Field(
        ...,
        description="Pagination metadata",
        examples=[{"page": 1, "per_page": 20, "total": 100, "total_pages": 5}],
    )


class ProductivityMetricListResponse(BaseModel):
    """Schema for paginated productivity metric list response."""

    data: List[ProductivityMetricResponse]
    meta: dict[str, int] = Field(
        ...,
        description="Pagination metadata",
        examples=[{"page": 1, "per_page": 20, "total": 100, "total_pages": 5}],
    )