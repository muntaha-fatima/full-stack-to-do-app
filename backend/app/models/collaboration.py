"""
Models for task collaboration.
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


def utc_now() -> datetime:
    """Return current UTC time as timezone-aware datetime."""
    from datetime import timezone
    return datetime.now(timezone.utc)


class TaskAssignment(Base):
    """
    Model for assigning tasks to users (collaboration).
    """
    __tablename__ = "task_assignments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    task_id: Mapped[int] = mapped_column(Integer, ForeignKey("tasks.id"), nullable=False, index=True)
    assignee_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    assigned_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)  # pending, accepted, declined
    message: Mapped[str | None] = mapped_column(Text, nullable=True)  # Optional message from assigner

    def __repr__(self) -> str:
        return f"<TaskAssignment(id={self.id}, task_id={self.task_id}, assignee_id={self.assignee_id})>"


class TaskComment(Base):
    """
    Model for comments on tasks (collaboration).
    """
    __tablename__ = "task_comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    task_id: Mapped[int] = mapped_column(Integer, ForeignKey("tasks.id"), nullable=False, index=True)
    author_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    def __repr__(self) -> str:
        return f"<TaskComment(id={self.id}, task_id={self.task_id}, author_id={self.author_id})>"