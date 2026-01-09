"""
Models for analytics and insights.
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


def utc_now() -> datetime:
    """Return current UTC time as timezone-aware datetime."""
    from datetime import timezone
    return datetime.now(timezone.utc)


class UserActivity(Base):
    """
    Model for tracking user activity for analytics.
    """
    __tablename__ = "user_activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., "task_created", "task_completed"
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., "task", "category"
    entity_id: Mapped[int] = mapped_column(Integer, nullable=True)  # ID of the entity affected
    metadata: Mapped[str | None] = mapped_column(String(500), nullable=True)  # Additional info as JSON string
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )

    def __repr__(self) -> str:
        return f"<UserActivity(id={self.id}, user_id={self.user_id}, action='{self.action}')>"


class ProductivityMetric(Base):
    """
    Model for storing calculated productivity metrics.
    """
    __tablename__ = "productivity_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    metric_type: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., "tasks_completed_week", "avg_completion_time"
    value: Mapped[float] = mapped_column(Numeric(precision=10, scale=2), nullable=False)
    period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    calculated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )

    def __repr__(self) -> str:
        return f"<ProductivityMetric(id={self.id}, user_id={self.user_id}, type='{self.metric_type}')>"