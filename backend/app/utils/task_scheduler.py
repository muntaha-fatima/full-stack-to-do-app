"""
Task scheduling utilities for reminders and recurring tasks.
"""

import asyncio
from datetime import datetime, timedelta
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import engine
from app.models.task import Task
from app.core.config import settings


async def check_and_send_reminders():
    """
    Check for tasks that need reminders sent.
    This function should be run periodically by a scheduler.
    """
    async with AsyncSession(engine) as session:
        # Find tasks with reminder times that are due (within the next 5 minutes)
        now = datetime.utcnow()
        future_time = now + timedelta(minutes=5)
        
        result = await session.execute(
            select(Task).where(
                Task.reminder_time.isnot(None),
                Task.reminder_time <= future_time,
                Task.reminder_time >= now,
                Task.completed == False
            )
        )
        
        tasks_to_remind = result.scalars().all()
        
        # In a real implementation, you would send notifications here
        # For now, we'll just print them
        for task in tasks_to_remind:
            print(f"REMINDER: Task '{task.title}' is due soon!")
            
        return tasks_to_remind


async def create_recurring_tasks():
    """
    Create new instances of recurring tasks that should be generated.
    This function should be run periodically by a scheduler.
    """
    async with AsyncSession(engine) as session:
        # Find recurring tasks that need new instances created
        now = datetime.utcnow()
        
        result = await session.execute(
            select(Task).where(
                Task.recurrence_pattern.isnot(None),
                Task.recurrence_end_date.is_(None) | (Task.recurrence_end_date >= now)
            )
        )
        
        recurring_tasks = result.scalars().all()
        
        new_tasks = []
        for task in recurring_tasks:
            # Check if a new instance should be created based on recurrence pattern
            should_create = await _should_create_new_instance(task, now)
            if should_create:
                new_task = await _create_task_instance(session, task, now)
                new_tasks.append(new_task)
        
        await session.commit()
        return new_tasks


async def _should_create_new_instance(task: Task, now: datetime) -> bool:
    """
    Determine if a new instance of a recurring task should be created.
    """
    # This is a simplified implementation
    # In a real app, you'd need more sophisticated logic based on recurrence pattern
    if not task.recurrence_pattern:
        return False
    
    # For now, just check if it's been at least the recurrence interval since last creation
    # This would need more complex logic in a real implementation
    return True


async def _create_task_instance(session: AsyncSession, original_task: Task, now: datetime) -> Task:
    """
    Create a new instance of a recurring task.
    """
    # Create a new task with the same properties as the original
    new_task = Task(
        title=original_task.title,
        description=original_task.description,
        status=original_task.status,
        priority=original_task.priority,
        completed=False,
        tags=original_task.tags,
        due_date=original_task.due_date,
        reminder_time=original_task.reminder_time,
        recurrence_pattern=original_task.recurrence_pattern,
        recurrence_interval=original_task.recurrence_interval,
        recurrence_end_date=original_task.recurrence_end_date,
        parent_task_id=original_task.id,
        owner_id=original_task.owner_id,
        category_id=original_task.category_id
    )
    
    session.add(new_task)
    await session.flush()  # Get the new task ID without committing
    
    return new_task


async def run_scheduler():
    """
    Main scheduler function that runs both reminder checking and recurring task creation.
    """
    try:
        await check_and_send_reminders()
        await create_recurring_tasks()
    except Exception as e:
        print(f"Scheduler error: {e}")