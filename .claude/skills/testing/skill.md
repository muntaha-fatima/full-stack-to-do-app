# Testing & Quality Assurance Skill

## Description
Expert in comprehensive testing strategies including unit tests, integration tests, E2E tests, and test-driven development (TDD) for full-stack applications.

## Capabilities

### Frontend Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing
- **Vitest**: Fast Vite-native test runner
- **Playwright**: End-to-end browser testing
- **Cypress**: E2E testing alternative
- **MSW**: API mocking for tests
- **Testing Library**: User-centric testing utilities

### Backend Testing
- **Pytest**: Python testing framework
- **FastAPI TestClient**: API endpoint testing
- **Fixtures**: Test data management
- **Mocking**: Database and external service mocks
- **Coverage**: Code coverage reporting
- **Async Testing**: Testing async functions

### Testing Strategies
- **Unit Tests**: Individual function/component testing
- **Integration Tests**: Module interaction testing
- **E2E Tests**: Full user flow testing
- **API Tests**: Endpoint testing
- **Snapshot Tests**: UI regression testing
- **Visual Regression**: Screenshot comparison
- **Performance Tests**: Load and stress testing

### Test-Driven Development
- **Red-Green-Refactor**: TDD cycle
- **Test First**: Write tests before code
- **Behavior-Driven**: BDD with Gherkin syntax
- **Acceptance Tests**: User story validation

## Usage Examples

### Jest & React Testing Library

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })

  it('applies correct variant classes', () => {
    const { container } = render(<Button variant="primary">Click me</Button>)
    expect(container.firstChild).toHaveClass('btn-primary')
  })
})
```

### Testing Custom Hooks

```typescript
// useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('stores value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => {
      result.current[1]('new value')
    })

    expect(result.current[0]).toBe('new value')
    expect(localStorage.getItem('key')).toBe(JSON.stringify('new value'))
  })

  it('retrieves stored value on mount', () => {
    localStorage.setItem('key', JSON.stringify('stored'))

    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('stored')
  })
})
```

### Testing with React Query

```typescript
// useTasks.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTasks } from './useTasks'
import { server } from '../mocks/server'
import { rest } from 'msw'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useTasks', () => {
  it('fetches tasks successfully', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true },
    ])
  })

  it('handles error state', async () => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )

    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })
})
```

### MSW (Mock Service Worker) Setup

```typescript
// mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true },
      ])
    )
  }),

  rest.post('/api/tasks', async (req, res, ctx) => {
    const body = await req.json()
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        ...body,
      })
    )
  }),

  rest.patch('/api/tasks/:id', async (req, res, ctx) => {
    const { id } = req.params
    const body = await req.json()
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(id),
        ...body,
      })
    )
  }),
]

// mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// setupTests.ts
import '@testing-library/jest-dom'
import { server } from './mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Pytest - FastAPI Testing

```python
# tests/test_tasks.py
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.main import app
from app.models.task import Task
from app.database import get_db

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def db_session():
    # Setup test database session
    async with AsyncSessionLocal() as session:
        yield session
        await session.rollback()

@pytest.mark.asyncio
async def test_create_task(client: AsyncClient):
    response = await client.post(
        "/api/tasks",
        json={"title": "Test Task", "completed": False}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["completed"] is False
    assert "id" in data

@pytest.mark.asyncio
async def test_get_tasks(client: AsyncClient, db_session: AsyncSession):
    # Create test data
    task1 = Task(title="Task 1", completed=False)
    task2 = Task(title="Task 2", completed=True)
    db_session.add_all([task1, task2])
    await db_session.commit()

    # Test endpoint
    response = await client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Task 1"

@pytest.mark.asyncio
async def test_get_task_not_found(client: AsyncClient):
    response = await client.get("/api/tasks/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

@pytest.mark.asyncio
async def test_update_task(client: AsyncClient, db_session: AsyncSession):
    # Create test task
    task = Task(title="Original", completed=False)
    db_session.add(task)
    await db_session.commit()
    await db_session.refresh(task)

    # Update task
    response = await client.patch(
        f"/api/tasks/{task.id}",
        json={"title": "Updated", "completed": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated"
    assert data["completed"] is True

@pytest.mark.asyncio
async def test_delete_task(client: AsyncClient, db_session: AsyncSession):
    # Create test task
    task = Task(title="To Delete", completed=False)
    db_session.add(task)
    await db_session.commit()
    await db_session.refresh(task)

    # Delete task
    response = await client.delete(f"/api/tasks/{task.id}")
    assert response.status_code == 204

    # Verify deletion
    response = await client.get(f"/api/tasks/{task.id}")
    assert response.status_code == 404
```

### Pytest Fixtures

```python
# tests/conftest.py
import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.main import app
from app.database import Base, get_db
from app.config import settings

# Test database URL
TEST_DATABASE_URL = "postgresql+asyncpg://test:test@localhost:5432/test_db"

# Create test engine
test_engine = create_async_engine(TEST_DATABASE_URL, echo=True)
TestSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create test database session"""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as session:
        yield session
        await session.rollback()

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create test client with database override"""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()

@pytest.fixture
def sample_task_data():
    """Sample task data for tests"""
    return {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }
```

### Playwright E2E Tests

```typescript
// e2e/tasks.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should display task list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Tasks')
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(3)
  })

  test('should create new task', async ({ page }) => {
    await page.fill('[data-testid="task-input"]', 'New Task')
    await page.click('[data-testid="create-button"]')

    await expect(page.locator('text=New Task')).toBeVisible()
  })

  test('should toggle task completion', async ({ page }) => {
    const checkbox = page.locator('[data-testid="task-checkbox"]').first()
    await checkbox.check()

    await expect(checkbox).toBeChecked()
  })

  test('should delete task', async ({ page }) => {
    const taskCount = await page.locator('[data-testid="task-item"]').count()

    await page.click('[data-testid="delete-button"]').first()
    await page.click('[data-testid="confirm-delete"]')

    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(taskCount - 1)
  })

  test('should filter completed tasks', async ({ page }) => {
    await page.click('[data-testid="filter-completed"]')

    const tasks = page.locator('[data-testid="task-item"]')
    const count = await tasks.count()

    for (let i = 0; i < count; i++) {
      const checkbox = tasks.nth(i).locator('input[type="checkbox"]')
      await expect(checkbox).toBeChecked()
    }
  })
})
```

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/main.tsx',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
```

```toml
# pytest.ini or pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = [
    "--cov=app",
    "--cov-report=html",
    "--cov-report=term-missing",
    "--cov-fail-under=80",
    "-v",
]
asyncio_mode = "auto"
```

## Best Practices

1. **Test Pyramid**: More unit tests, fewer E2E tests
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Test Behavior**: Test what users see, not implementation
4. **Isolation**: Each test should be independent
5. **Fast Tests**: Keep unit tests fast
6. **Descriptive Names**: Clear test descriptions
7. **Mock External**: Mock external dependencies
8. **Coverage Goals**: Aim for 80%+ coverage
9. **CI Integration**: Run tests in CI/CD pipeline
10. **Test Data**: Use factories and fixtures

## Testing Checklist

### Unit Tests
- [ ] All utility functions tested
- [ ] All custom hooks tested
- [ ] All components tested
- [ ] Edge cases covered
- [ ] Error handling tested

### Integration Tests
- [ ] API endpoints tested
- [ ] Database operations tested
- [ ] Authentication flow tested
- [ ] Authorization tested
- [ ] Error responses tested

### E2E Tests
- [ ] Critical user flows tested
- [ ] Form submissions tested
- [ ] Navigation tested
- [ ] Error states tested
- [ ] Mobile responsive tested

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
