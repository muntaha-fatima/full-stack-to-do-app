"""
Task repository for database operations.
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload

from app.models.task import Task


class TaskRepository:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_tasks_by_owner(self, owner_id: int, status: Optional[str] = None) -> List[Task]:
        """
        Retrieve all tasks for a specific owner.

        Args:
            owner_id: The ID of the task owner
            status: Optional status filter (todo, in_progress, completed)

        Returns:
            List of Task objects
        """
        stmt = select(Task).where(Task.owner_id == owner_id)

        # Add status filter if provided
        if status:
            stmt = stmt.where(Task.status == status)

        stmt = stmt.order_by(Task.created_at.desc())
        result = await self.db_session.execute(stmt)
        return result.scalars().all()

    async def get_task_by_id_and_owner(self, task_id: int, owner_id: int) -> Optional[Task]:
        """
        Retrieve a specific task by its ID and owner ID.

        Args:
            task_id: The ID of the task
            owner_id: The ID of the task owner

        Returns:
            Task object if found, None otherwise
        """
        stmt = select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
        result = await self.db_session.execute(stmt)
        return result.scalar_one_or_none()

    async def create_task(self, task_data: Dict[str, Any]) -> Task:
        """
        Create a new task.

        Args:
            task_data: Dictionary containing task attributes

        Returns:
            Created Task object
        """
        task = Task(**task_data)
        self.db_session.add(task)
        await self.db_session.commit()
        await self.db_session.refresh(task)
        return task

    async def update_task(self, task_id: int, update_data: Dict[str, Any]) -> Optional[Task]:
        """
        Update a task with the provided data.

        Args:
            task_id: The ID of the task to update
            update_data: Dictionary containing attributes to update

        Returns:
            Updated Task object if successful, None if task not found
        """
        # First get the existing task
        stmt = select(Task).where(Task.id == task_id)
        result = await self.db_session.execute(stmt)
        task = result.scalar_one_or_none()
        
        if not task:
            return None
        
        # Update the task attributes
        for key, value in update_data.items():
            setattr(task, key, value)
        
        # Commit the changes
        await self.db_session.commit()
        await self.db_session.refresh(task)
        return task

    async def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by its ID.

        Args:
            task_id: The ID of the task to delete

        Returns:
            True if deletion was successful, False otherwise
        """
        stmt = delete(Task).where(Task.id == task_id)
        result = await self.db_session.execute(stmt)

        if result.rowcount > 0:
            await self.db_session.commit()
            return True

        await self.db_session.rollback()
        return False

    async def toggle_task_completion(self, task_id: int) -> Optional[Task]:
        """
        Toggle the completion status of a task.

        Args:
            task_id: The ID of the task to update

        Returns:
            Updated Task object if successful, None if task not found
        """
        # First, get the current task to check its completion status
        stmt = select(Task).where(Task.id == task_id)
        result = await self.db_session.execute(stmt)
        task = result.scalar_one_or_none()

        if not task:
            return None

        # Toggle the completion status
        task.completed = not task.completed
        await self.db_session.commit()
        await self.db_session.refresh(task)
        return task