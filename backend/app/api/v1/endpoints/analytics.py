"""
Analytics API endpoints.
"""

from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.analytics import ProductivityMetric, UserActivity
from app.models.task import Task
from app.models.user import User
from app.schemas.analytics import (
    ProductivityInsightsResponse,
    ProductivityMetricCreate,
    ProductivityMetricListResponse,
    ProductivityMetricResponse,
    TaskCompletionInsight,
    UserActivityCreate,
    UserActivityListResponse,
    UserActivityResponse,
)

router = APIRouter()


@router.get("/insights", response_model=ProductivityInsightsResponse)
async def get_productivity_insights(
    current_user: User = Depends(get_current_user),
    start_date: datetime = Query(default_factory=lambda: datetime.now() - timedelta(days=30), description="Start date for insights"),
    end_date: datetime = Query(default_factory=datetime.now, description="End date for insights"),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get productivity insights for the current user.

    Args:
        current_user: Authenticated user
        start_date: Start date for insights calculation
        end_date: End date for insights calculation
        db: Database session

    Returns:
        Productivity insights for the user
    """
    # Calculate overall completion rate
    total_tasks_result = await db.execute(
        select(func.count(Task.id)).where(
            Task.owner_id == current_user.id,
            Task.created_at.between(start_date, end_date)
        )
    )
    total_tasks = total_tasks_result.scalar_one()

    completed_tasks_result = await db.execute(
        select(func.count(Task.id)).where(
            Task.owner_id == current_user.id,
            Task.completed == True,
            Task.updated_at.between(start_date, end_date)
        )
    )
    completed_tasks = completed_tasks_result.scalar_one()

    overall_completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

    # Calculate weekly insights
    weekly_insights = []
    current_week_start = start_date.replace(hour=0, minute=0, second=0, microsecond=0)

    while current_week_start < end_date:
        week_end = current_week_start + timedelta(days=7)

        week_total_result = await db.execute(
            select(func.count(Task.id)).where(
                Task.owner_id == current_user.id,
                Task.created_at.between(current_week_start, week_end)
            )
        )
        week_total = week_total_result.scalar_one()

        week_completed_result = await db.execute(
            select(func.count(Task.id)).where(
                Task.owner_id == current_user.id,
                Task.completed == True,
                Task.updated_at.between(current_week_start, week_end)
            )
        )
        week_completed = week_completed_result.scalar_one()

        if week_total > 0:
            completion_rate = (week_completed / week_total * 100)
            weekly_insights.append(
                TaskCompletionInsight(
                    completed_count=week_completed,
                    total_count=week_total,
                    completion_rate=completion_rate,
                    period=f"{current_week_start.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}"
                )
            )

        current_week_start = week_end

    # Calculate monthly insights
    monthly_insights = []
    current_month_start = start_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    while current_month_start < end_date:
        if current_month_start.month == 12:
            month_end = current_month_start.replace(year=current_month_start.year + 1, month=1, day=1)
        else:
            month_end = current_month_start.replace(month=current_month_start.month + 1, day=1)

        month_total_result = await db.execute(
            select(func.count(Task.id)).where(
                Task.owner_id == current_user.id,
                Task.created_at.between(current_month_start, month_end)
            )
        )
        month_total = month_total_result.scalar_one()

        month_completed_result = await db.execute(
            select(func.count(Task.id)).where(
                Task.owner_id == current_user.id,
                Task.completed == True,
                Task.updated_at.between(current_month_start, month_end)
            )
        )
        month_completed = month_completed_result.scalar_one()

        if month_total > 0:
            completion_rate = (month_completed / month_total * 100)
            monthly_insights.append(
                TaskCompletionInsight(
                    completed_count=month_completed,
                    total_count=month_total,
                    completion_rate=completion_rate,
                    period=f"{current_month_start.strftime('%Y-%m')} Monthly"
                )
            )

        current_month_start = month_end

    # Placeholder for top categories and average completion time
    # In a real implementation, you would calculate these values
    top_categories = [{"name": "Work", "count": 15}, {"name": "Personal", "count": 10}]
    average_completion_time = 24.5  # hours

    return ProductivityInsightsResponse(
        user_id=current_user.id,
        overall_completion_rate=overall_completion_rate,
        weekly_insights=weekly_insights,
        monthly_insights=monthly_insights,
        top_categories=top_categories,
        average_completion_time=average_completion_time
    )


@router.get("/activities", response_model=UserActivityListResponse)
async def list_user_activities(
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    action: str | None = Query(None, description="Filter by action type"),
    entity_type: str | None = Query(None, description="Filter by entity type"),
    start_date: datetime | None = Query(None, description="Filter activities after this date"),
    end_date: datetime | None = Query(None, description="Filter activities before this date"),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Retrieve a paginated list of user activities.

    Args:
        current_user: Authenticated user
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        action: Optional action filter
        entity_type: Optional entity type filter
        start_date: Optional start date filter
        end_date: Optional end date filter
        db: Database session

    Returns:
        Paginated list of user activities with metadata
    """
    # Build query
    query = select(UserActivity).where(UserActivity.user_id == current_user.id)

    # Apply filters
    if action:
        query = query.where(UserActivity.action == action)
    if entity_type:
        query = query.where(UserActivity.entity_type == entity_type)
    if start_date:
        query = query.where(UserActivity.timestamp >= start_date)
    if end_date:
        query = query.where(UserActivity.timestamp <= end_date)

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination and ordering
    query = query.order_by(UserActivity.timestamp.desc()).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    activities = result.scalars().all()

    # Calculate pagination metadata
    total_pages = (total + limit - 1) // limit if total > 0 else 0
    current_page = (skip // limit) + 1 if limit > 0 else 1

    return {
        "data": activities,
        "meta": {
            "page": current_page,
            "per_page": limit,
            "total": total,
            "total_pages": total_pages,
        },
    }


@router.post("/activities", response_model=UserActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_user_activity(
    activity_in: UserActivityCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create a user activity record.

    Args:
        activity_in: Activity creation data
        current_user: Authenticated user
        db: Database session

    Returns:
        Created activity
    """
    activity_data = activity_in.model_dump()
    # Rename metadata to metadata_json to match the model
    if 'metadata' in activity_data:
        activity_data['metadata_json'] = activity_data.pop('metadata')

    activity = UserActivity(
        **activity_data,
        user_id=current_user.id
    )

    db.add(activity)
    await db.commit()
    await db.refresh(activity)
    return activity


@router.get("/metrics", response_model=ProductivityMetricListResponse)
async def list_productivity_metrics(
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    metric_type: str | None = Query(None, description="Filter by metric type"),
    start_date: datetime | None = Query(None, description="Filter metrics after this date"),
    end_date: datetime | None = Query(None, description="Filter metrics before this date"),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Retrieve a paginated list of productivity metrics.

    Args:
        current_user: Authenticated user
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        metric_type: Optional metric type filter
        start_date: Optional start date filter
        end_date: Optional end date filter
        db: Database session

    Returns:
        Paginated list of productivity metrics with metadata
    """
    # Build query
    query = select(ProductivityMetric).where(ProductivityMetric.user_id == current_user.id)

    # Apply filters
    if metric_type:
        query = query.where(ProductivityMetric.metric_type == metric_type)
    if start_date:
        query = query.where(ProductivityMetric.period_start >= start_date)
    if end_date:
        query = query.where(ProductivityMetric.period_end <= end_date)

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination and ordering
    query = query.order_by(ProductivityMetric.calculated_at.desc()).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    metrics = result.scalars().all()

    # Calculate pagination metadata
    total_pages = (total + limit - 1) // limit if total > 0 else 0
    current_page = (skip // limit) + 1 if limit > 0 else 1

    return {
        "data": metrics,
        "meta": {
            "page": current_page,
            "per_page": limit,
            "total": total,
            "total_pages": total_pages,
        },
    }


@router.post("/metrics", response_model=ProductivityMetricResponse, status_code=status.HTTP_201_CREATED)
async def create_productivity_metric(
    metric_in: ProductivityMetricCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create a productivity metric.

    Args:
        metric_in: Metric creation data
        current_user: Authenticated user
        db: Database session

    Returns:
        Created metric
    """
    # Verify that the period is valid
    if metric_in.period_start > metric_in.period_end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Period start date must be before end date",
        )

    metric = ProductivityMetric(
        **metric_in.model_dump(),
        user_id=current_user.id
    )

    db.add(metric)
    await db.commit()
    await db.refresh(metric)
    return metric