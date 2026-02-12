"""
Task model for database.
"""

from datetime import datetime, timezone
from enum import Enum as PyEnum

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Interval, String, Text
from sqlalchemy.types import TypeDecorator, String as SqlString
import json
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def utc_now() -> datetime:
    """Return current UTC time as timezone-aware datetime."""
    return datetime.now(timezone.utc)


class JsonEncodedList(TypeDecorator):
    """Custom type to store a list as JSON string in the database."""

    impl = SqlString

    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            if isinstance(value, list):
                return json.dumps(value)
            return value
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            try:
                return json.loads(value)
            except (ValueError, TypeError):
                # If JSON parsing fails, return the raw value
                return value
        return []


class TaskStatus(str, PyEnum):
    """Task status enumeration."""

    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class TaskPriority(str, PyEnum):
    """Task priority enumeration."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RecurrencePattern(str, PyEnum):
    """Recurrence pattern enumeration."""

    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"


class Task(Base):
    """
    Task model representing a todo item.
    """

    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus), default=TaskStatus.TODO, nullable=False, index=True
    )
    priority: Mapped[TaskPriority] = mapped_column(
        Enum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False, index=True
    )
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    tags: Mapped[list[str] | None] = mapped_column(JsonEncodedList, nullable=True, default=list)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    reminder_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    recurrence_pattern: Mapped[RecurrencePattern | None] = mapped_column(Enum(RecurrencePattern), nullable=True)
    recurrence_interval: Mapped[int | None] = mapped_column(Integer, nullable=True)  # e.g., every 2 weeks
    recurrence_end_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    parent_task_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("tasks.id"), nullable=True, index=True)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("categories.id"), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    # Relationship to category
    category = relationship("Category", back_populates="tasks")
    # Relationship for recurring tasks
    child_tasks = relationship("Task", back_populates="parent_task")
    parent_task = relationship("Task", remote_side=[id], back_populates="child_tasks")

    def __repr__(self) -> str:
        return f"<Task(id={self.id}, title='{self.title}', status='{self.status}')>"