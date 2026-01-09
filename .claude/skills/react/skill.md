# React & React Query Skill

## Description
Expert React developer specializing in modern React patterns, hooks, component architecture, and data fetching with React Query (TanStack Query).

## Capabilities

### Core React Concepts
- **Components**: Functional components with hooks
- **Props & State**: Component data management
- **Hooks**: useState, useEffect, useContext, custom hooks
- **Context API**: Global state management
- **Refs**: DOM access and mutable values
- **Portals**: Rendering outside component hierarchy
- **Error Boundaries**: Error handling in component trees
- **Suspense**: Lazy loading and async rendering

### React Query (TanStack Query)
- **Data Fetching**: Automatic caching and background updates
- **Mutations**: Server state mutations with optimistic updates
- **Cache Management**: Intelligent cache invalidation
- **Pagination**: Infinite scroll and paginated queries
- **Prefetching**: Preloading data for better UX
- **Optimistic Updates**: Instant UI feedback
- **Error Handling**: Retry logic and error states
- **DevTools**: Query debugging and inspection

### Modern React Patterns
- **Composition**: Component composition over inheritance
- **Render Props**: Flexible component APIs
- **Higher-Order Components**: Component enhancement
- **Custom Hooks**: Reusable stateful logic
- **Compound Components**: Related component groups
- **Controlled Components**: Form input management
- **Memoization**: Performance optimization

### Performance Optimization
- **React.memo**: Prevent unnecessary re-renders
- **useMemo**: Memoize expensive calculations
- **useCallback**: Memoize callback functions
- **Code Splitting**: Dynamic imports with lazy()
- **Virtual Lists**: Efficient large list rendering
- **Debouncing**: Input optimization
- **Web Workers**: Offload heavy computations

## Usage Examples

### Basic React Hooks

```typescript
import { useState, useEffect, useCallback, useMemo } from 'react'

interface User {
  id: number
  name: string
  email: string
}

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${userId}`)
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>User not found</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### React Query - Basic Usage

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Task {
  id: number
  title: string
  completed: boolean
}

// Query hook
function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Failed to fetch tasks')
      return response.json() as Promise<Task[]>
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

// Single task query
function useTask(taskId: number) {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${taskId}`)
      if (!response.ok) throw new Error('Failed to fetch task')
      return response.json() as Promise<Task>
    },
    enabled: !!taskId, // Only run if taskId exists
  })
}

// Component using the query
function TaskList() {
  const { data: tasks, isLoading, error } = useTasks()

  if (isLoading) return <div>Loading tasks...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {tasks?.map(task => (
        <li key={task.id}>
          <TaskItem task={task} />
        </li>
      ))}
    </ul>
  )
}
```

### React Query - Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface TaskCreate {
  title: string
  completed: boolean
}

function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newTask: TaskCreate) => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
      if (!response.ok) throw new Error('Failed to create task')
      return response.json() as Promise<Task>
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update task')
      return response.json() as Promise<Task>
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', id] })

      // Snapshot previous value
      const previousTask = queryClient.getQueryData<Task>(['tasks', id])

      // Optimistically update
      queryClient.setQueryData<Task>(['tasks', id], old => ({
        ...old!,
        ...updates,
      }))

      return { previousTask }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(['tasks', variables.id], context.previousTask)
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] })
    },
  })
}

// Component using mutations
function CreateTaskForm() {
  const [title, setTitle] = useState('')
  const createTask = useCreateTask()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTask.mutate(
      { title, completed: false },
      {
        onSuccess: () => {
          setTitle('')
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title"
      />
      <button type="submit" disabled={createTask.isPending}>
        {createTask.isPending ? 'Creating...' : 'Create Task'}
      </button>
      {createTask.isError && (
        <div>Error: {createTask.error.message}</div>
      )}
    </form>
  )
}
```

### Custom Hooks

```typescript
// Custom hook for form handling
function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  return { values, errors, setErrors, handleChange, reset }
}

// Custom hook for local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Custom hook for debounced value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

### Context API for Global State

```typescript
import { createContext, useContext, ReactNode } from 'react'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    setUser(data.user)
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### Performance Optimization

```typescript
import { memo, useMemo, useCallback } from 'react'

// Memoized component
const TaskItem = memo(function TaskItem({ task, onToggle }: {
  task: Task
  onToggle: (id: number) => void
}) {
  return (
    <div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <span>{task.title}</span>
    </div>
  )
})

// Parent component with optimizations
function TaskList() {
  const { data: tasks } = useTasks()
  const updateTask = useUpdateTask()

  // Memoize callback to prevent re-renders
  const handleToggle = useCallback((id: number) => {
    const task = tasks?.find(t => t.id === id)
    if (task) {
      updateTask.mutate({
        id,
        updates: { completed: !task.completed },
      })
    }
  }, [tasks, updateTask])

  // Memoize expensive computation
  const completedCount = useMemo(() => {
    return tasks?.filter(t => t.completed).length ?? 0
  }, [tasks])

  return (
    <div>
      <p>Completed: {completedCount}</p>
      {tasks?.map(task => (
        <TaskItem key={task.id} task={task} onToggle={handleToggle} />
      ))}
    </div>
  )
}
```

### React Query Provider Setup

```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## Best Practices

1. **Use Functional Components**: Prefer hooks over class components
2. **Keep Components Small**: Single responsibility principle
3. **Extract Custom Hooks**: Reuse stateful logic
4. **Memoize Appropriately**: Use memo, useMemo, useCallback wisely
5. **Handle Loading States**: Always show loading indicators
6. **Error Boundaries**: Catch and handle errors gracefully
7. **Type Safety**: Use TypeScript for all components
8. **Avoid Prop Drilling**: Use Context or state management
9. **Optimize Re-renders**: Prevent unnecessary re-renders
10. **Test Components**: Write unit and integration tests

## Common Patterns

### Compound Components
```typescript
interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

function Tabs({ children, defaultTab }: {
  children: ReactNode
  defaultTab: string
}) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return <div className="tabs-list">{children}</div>
}

Tabs.Tab = function Tab({ value, children }: {
  value: string
  children: ReactNode
}) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab must be used within Tabs')

  return (
    <button
      className={context.activeTab === value ? 'active' : ''}
      onClick={() => context.setActiveTab(value)}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function TabPanel({ value, children }: {
  value: string
  children: ReactNode
}) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabPanel must be used within Tabs')

  if (context.activeTab !== value) return null
  return <div className="tab-panel">{children}</div>
}
```

## Resources

- [React Documentation](https://react.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Hooks Guide](https://react.dev/reference/react)
- [React Patterns](https://reactpatterns.com/)
