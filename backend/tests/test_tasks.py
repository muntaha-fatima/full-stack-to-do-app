"""
Tests for task API endpoints.
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task, TaskPriority, TaskStatus


@pytest.mark.asyncio
async def test_create_task(client: AsyncClient) -> None:
    """
    Test creating a new task.
    """
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "status": "todo",
        "priority": "high",
    }

    response = await client.post("/api/v1/tasks/", json=task_data)
    assert response.status_code == 201

    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert data["status"] == task_data["status"]
    assert data["priority"] == task_data["priority"]
    assert data["completed"] is False
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


@pytest.mark.asyncio
async def test_list_tasks(client: AsyncClient, db_session: AsyncSession) -> None:
    """
    Test listing tasks with pagination.
    """
    # Create test tasks
    tasks = [
        Task(title=f"Task {i}", status=TaskStatus.TODO, priority=TaskPriority.MEDIUM)
        for i in range(5)
    ]
    db_session.add_all(tasks)
    await db_session.commit()

    # Test list endpoint
    response = await client.get("/api/v1/tasks/")
    assert response.status_code == 200

    data = response.json()
    assert "data" in data
    assert "meta" in data
    assert len(data["data"]) == 5
    assert data["meta"]["total"] == 5
    assert data["meta"]["page"] == 1
    assert data["meta"]["per_page"] == 20


@pytest.mark.asyncio
async def test_list_tasks_with_filters(client: AsyncClient, db_session: AsyncSession) -> None:
    """
    Test listing tasks with status filter.
    """
    # Create test tasks with different statuses
    tasks = [
        Task(title="Task 1", status=TaskStatus.TODO, priority=TaskPriority.MEDIUM),
        Task(title="Task 2", status=TaskStatus.IN_PROGRESS, priority=TaskPriority.HIGH),
        Task(title="Task 3", status=TaskStatus.COMPLETED, priority=TaskPriority.LOW, completed=True),
    ]
    db_session.add_all(tasks)
    await db_session.commit()

    # Test filter by status
    response = await client.get("/api/v1/tasks/?status=todo")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 1
    assert data["data"][0]["status"] == "todo"

    # Test filter by completed
    response = await client.get("/api/v1/tasks/?completed=true")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 1
    assert data["data"][0]["completed"] is True


@pytest.mark.asyncio
async def test_get_task(client: AsyncClient, db_session: AsyncSession) -> None:
    """
    Test getting a specific task by ID.
    """
    # Create a test task
    task = Task(title="Test Task", status=TaskStatus.TODO, priority=TaskPriority.MEDIUM)
    db_session.add(task)
    await db_session.commit()
    await db_session.refresh(task)

    # Test get endpoint
    response = await client.get(f"/api/v1/tasks/{task.id}")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == task.id
    assert data["title"] == task.title


@pytest.mark.asyncio
async def test_get_task_not_found(client: AsyncClient) -> None:
    """
    Test getting a non-existent task returns 404.
    """
    response = await client.get("/api/v1/tasks/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_task(client: AsyncClient, db_session: AsyncSession) -> None:
    """
    Test updating a task.
    """
    # Create a test task
    task = Task(title="Original Title", status=TaskStatus.TODO, priority=TaskPriority.MEDIUM)
    db_session.add(task)
    await db_session.commit()
    await db_session.refresh(task)

    # Update the task
    update_data = {
        "title": "Updated Title",
        "status": "in_progress",
        "completed": False,
    }

    response = await client.put(f"/api/v1/tasks/{task.id}", json=update_data)
    assert response.status_code == 200

    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["status"] == update_data["status"]


@pytest.mark.asyncio
async def test_update_task_partial(client: AsyncClient, db_session: AsyncSession) -> None:
    """
    Test partial update of a task.
    """
    # Create a test task
    task = Task(
        title="Original Title",
        description="Original Description",
        status=TaskStatus.TODO,
        priority=TaskPriority.MEDIUM,
    )
    db_session.add(task)
    await db_session.commit()
    await db_session.refresh(task)

    # Partial update (only title)
    update_data = {"title": "Updated Title"}

    response = await client.put(f"/api/v1/tasks/{task.id}", json=update_data)
    assert response.status_code == 200

    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["description"] == "Original Description"  # Should remain unchanged


@pytest.mark.asyncio
async def test_delete_task(client: AsyncClient, db_session: AsyncSession) -> None:
    """
    Test deleting a task.
    """
    # Create a test task
    task = Task(title="Task to Delete", status=TaskStatus.TODO, priority=TaskPriority.MEDIUM)
    db_session.add(task)
    await db_session.commit()
    await db_session.refresh(task)

    # Delete the task
    response = await client.delete(f"/api/v1/tasks/{task.id}")
    assert response.status_code == 204

    # Verify task is deleted
    response = await client.get(f"/api/v1/tasks/{task.id}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_task_not_found(client: AsyncClient) -> None:
    """
    Test deleting a non-existent task returns 404.
    """
    response = await client.delete("/api/v1/tasks/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_task_validation(client: AsyncClient) -> None:
    """
    Test task creation with invalid data.
    """
    # Missing required field (title)
    task_data = {
        "description": "Task without title",
        "status": "todo",
    }

    response = await client.post("/api/v1/tasks/", json=task_data)
    assert response.status_code == 422  # Validation error
