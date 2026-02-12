from typing import Dict, Any, List


class TaskService:
    """Simple task service to handle task operations without MCP."""

    async def add_task(self, user_id: str, title: str, description: str = "") -> Dict[str, Any]:
        """Add a new task for a user."""
        # Lazy import to avoid circular imports
        from app.db.session import AsyncSessionLocal
        from app.repositories.task_repository import TaskRepository

        async with AsyncSessionLocal() as db_session:
            task_repo = TaskRepository(db_session)
            task_data = {
                "owner_id": int(user_id),
                "title": title,
                "description": description,
                "status": "TODO"  # Changed to uppercase to match database enum
            }
            task = await task_repo.create_task(task_data)

            return {
                "task_id": task.id,
                "status": task.status,
                "title": task.title
            }

    async def list_tasks(self, user_id: str, status: str = "all") -> List[Dict[str, Any]]:
        """List tasks for a user, optionally filtered by status."""
        # Lazy import to avoid circular imports
        from app.db.session import AsyncSessionLocal
        from app.repositories.task_repository import TaskRepository

        async with AsyncSessionLocal() as db_session:
            task_repo = TaskRepository(db_session)
            tasks = await task_repo.get_tasks_by_owner(int(user_id), status if status != "all" else None)

            # Format the tasks for the response
            formatted_tasks = [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "status": task.status
                }
                for task in tasks
            ]

            return formatted_tasks

    async def complete_task(self, user_id: str, task_id: int) -> Dict[str, Any]:
        """Mark a task as complete."""
        # Lazy import to avoid circular imports
        from app.db.session import AsyncSessionLocal
        from app.repositories.task_repository import TaskRepository

        async with AsyncSessionLocal() as db_session:
            task_repo = TaskRepository(db_session)

            # First, get the task to verify ownership
            task = await task_repo.get_task_by_id_and_owner(task_id, int(user_id))
            if not task:
                raise ValueError(f"Task with id {task_id} not found for user {user_id}")

            # Update the task status
            update_data = {"status": "COMPLETED"}
            updated_task = await task_repo.update_task(task_id, update_data)

            if not updated_task:
                raise ValueError(f"Failed to update task with id {task_id}")

            return {
                "task_id": updated_task.id,
                "status": updated_task.status,
                "title": updated_task.title
            }

    async def delete_task(self, user_id: str, task_id: int) -> Dict[str, Any]:
        """Delete a task."""
        # Lazy import to avoid circular imports
        from app.db.session import AsyncSessionLocal
        from app.repositories.task_repository import TaskRepository

        async with AsyncSessionLocal() as db_session:
            task_repo = TaskRepository(db_session)

            # First, get the task to verify ownership
            task = await task_repo.get_task_by_id_and_owner(task_id, int(user_id))
            if not task:
                raise ValueError(f"Task with id {task_id} not found for user {user_id}")

            # Delete the task
            success = await task_repo.delete_task(task_id)

            if not success:
                raise ValueError(f"Failed to delete task with id {task_id}")

            return {
                "task_id": task.id,
                "status": task.status,
                "title": task.title
            }

    async def update_task(self, user_id: str, task_id: int, title: str = None, description: str = None) -> Dict[str, Any]:
        """Update a task's title or description."""
        # Lazy import to avoid circular imports
        from app.db.session import AsyncSessionLocal
        from app.repositories.task_repository import TaskRepository

        async with AsyncSessionLocal() as db_session:
            task_repo = TaskRepository(db_session)

            # First, get the task to verify ownership
            task = await task_repo.get_task_by_id_and_owner(task_id, int(user_id))
            if not task:
                raise ValueError(f"Task with id {task_id} not found for user {user_id}")

            # Prepare update data
            update_data = {}
            if title is not None:
                update_data["title"] = title
            if description is not None:
                update_data["description"] = description

            # Update the task
            updated_task = await task_repo.update_task(task_id, update_data)

            if not updated_task:
                raise ValueError(f"Failed to update task with id {task_id}")

            return {
                "task_id": updated_task.id,
                "status": updated_task.status,
                "title": updated_task.title
            }


# Initialize the service instance
task_service = TaskService()

def get_task_service():
    """Return the task service instance."""
    return task_service