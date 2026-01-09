# State Management Skill

## Description
Expert in managing application state using various state management solutions including React Context, Zustand, Redux Toolkit, and state management patterns.

## Capabilities

### State Management Solutions
- **React Context**: Built-in state management
- **Zustand**: Lightweight state management
- **Redux Toolkit**: Predictable state container
- **Jotai**: Atomic state management
- **Recoil**: Facebook's state management
- **TanStack Query**: Server state management

### State Patterns
- **Global State**: Application-wide state
- **Local State**: Component-specific state
- **Server State**: API data caching
- **URL State**: Router-based state
- **Form State**: Form data management
- **Derived State**: Computed values

### Advanced Concepts
- **State Normalization**: Flat state structure
- **Optimistic Updates**: Instant UI feedback
- **State Persistence**: LocalStorage, SessionStorage
- **State Hydration**: SSR state initialization
- **State Selectors**: Efficient state access
- **State Middleware**: Side effects and logging

## Usage Examples

### React Context API

```typescript
// contexts/ThemeContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      return newTheme
    })
  }

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Usage
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

### Zustand - Simple State Management

```typescript
// stores/taskStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface Task {
  id: number
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

interface TaskState {
  tasks: Task[]
  filter: 'all' | 'active' | 'completed'

  // Actions
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  toggleTask: (id: number) => void
  setFilter: (filter: TaskState['filter']) => void
  clearCompleted: () => void

  // Selectors
  filteredTasks: () => Task[]
  completedCount: () => number
  activeCount: () => number
}

export const useTaskStore = create<TaskState>()(
  persist(
    immer((set, get) => ({
      tasks: [],
      filter: 'all',

      addTask: (task) => set((state) => {
        state.tasks.push({
          ...task,
          id: Date.now(),
        })
      }),

      updateTask: (id, updates) => set((state) => {
        const task = state.tasks.find(t => t.id === id)
        if (task) {
          Object.assign(task, updates)
        }
      }),

      deleteTask: (id) => set((state) => {
        state.tasks = state.tasks.filter(t => t.id !== id)
      }),

      toggleTask: (id) => set((state) => {
        const task = state.tasks.find(t => t.id === id)
        if (task) {
          task.completed = !task.completed
        }
      }),

      setFilter: (filter) => set({ filter }),

      clearCompleted: () => set((state) => {
        state.tasks = state.tasks.filter(t => !t.completed)
      }),

      filteredTasks: () => {
        const { tasks, filter } = get()
        switch (filter) {
          case 'active':
            return tasks.filter(t => !t.completed)
          case 'completed':
            return tasks.filter(t => t.completed)
          default:
            return tasks
        }
      },

      completedCount: () => get().tasks.filter(t => t.completed).length,
      activeCount: () => get().tasks.filter(t => !t.completed).length,
    })),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Usage in components
function TaskList() {
  const tasks = useTaskStore(state => state.filteredTasks())
  const toggleTask = useTaskStore(state => state.toggleTask)
  const deleteTask = useTaskStore(state => state.deleteTask)

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          <span>{task.title}</span>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

function TaskFilters() {
  const filter = useTaskStore(state => state.filter)
  const setFilter = useTaskStore(state => state.setFilter)
  const activeCount = useTaskStore(state => state.activeCount())
  const completedCount = useTaskStore(state => state.completedCount())

  return (
    <div>
      <button onClick={() => setFilter('all')}>
        All ({activeCount + completedCount})
      </button>
      <button onClick={() => setFilter('active')}>
        Active ({activeCount})
      </button>
      <button onClick={() => setFilter('completed')}>
        Completed ({completedCount})
      </button>
    </div>
  )
}
```

### Redux Toolkit

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import tasksReducer from './slices/tasksSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['tasks/addTask'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// store/slices/tasksSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface Task {
  id: number
  title: string
  completed: boolean
}

interface TasksState {
  items: Task[]
  loading: boolean
  error: string | null
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
}

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await fetch('/api/tasks')
    if (!response.ok) throw new Error('Failed to fetch tasks')
    return response.json()
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Omit<Task, 'id'>) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
    if (!response.ok) throw new Error('Failed to create task')
    return response.json()
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error('Failed to update task')
    return response.json()
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: number) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete task')
    return id
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    toggleTask: (state, action: PayloadAction<number>) => {
      const task = state.items.find(t => t.id === action.payload)
      if (task) {
        task.completed = !task.completed
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch tasks'
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload)
      })
  },
})

export const { toggleTask, clearError } = tasksSlice.actions
export default tasksSlice.reducer

// Selectors
export const selectAllTasks = (state: RootState) => state.tasks.items
export const selectTasksLoading = (state: RootState) => state.tasks.loading
export const selectTasksError = (state: RootState) => state.tasks.error
export const selectCompletedTasks = (state: RootState) =>
  state.tasks.items.filter(t => t.completed)
export const selectActiveTasks = (state: RootState) =>
  state.tasks.items.filter(t => !t.completed)

// Usage in components
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchTasks, toggleTask, selectAllTasks } from '@/store/slices/tasksSlice'

function TaskList() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectAllTasks)
  const loading = useAppSelector(state => state.tasks.loading)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => dispatch(toggleTask(task.id))}
          />
          <span>{task.title}</span>
        </div>
      ))}
    </div>
  )
}
```

### Jotai - Atomic State Management

```typescript
// atoms/taskAtoms.ts
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

interface Task {
  id: number
  title: string
  completed: boolean
}

// Primitive atoms
export const tasksAtom = atomWithStorage<Task[]>('tasks', [])
export const filterAtom = atom<'all' | 'active' | 'completed'>('all')

// Derived atoms
export const filteredTasksAtom = atom((get) => {
  const tasks = get(tasksAtom)
  const filter = get(filterAtom)

  switch (filter) {
    case 'active':
      return tasks.filter(t => !t.completed)
    case 'completed':
      return tasks.filter(t => t.completed)
    default:
      return tasks
  }
})

export const completedCountAtom = atom((get) => {
  const tasks = get(tasksAtom)
  return tasks.filter(t => t.completed).length
})

export const activeCountAtom = atom((get) => {
  const tasks = get(tasksAtom)
  return tasks.filter(t => !t.completed).length
})

// Write-only atoms (actions)
export const addTaskAtom = atom(
  null,
  (get, set, task: Omit<Task, 'id'>) => {
    const tasks = get(tasksAtom)
    set(tasksAtom, [...tasks, { ...task, id: Date.now() }])
  }
)

export const toggleTaskAtom = atom(
  null,
  (get, set, id: number) => {
    const tasks = get(tasksAtom)
    set(tasksAtom, tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }
)

export const deleteTaskAtom = atom(
  null,
  (get, set, id: number) => {
    const tasks = get(tasksAtom)
    set(tasksAtom, tasks.filter(t => t.id !== id))
  }
)

// Usage in components
import { useAtom, useAtomValue, useSetAtom } from 'jotai'

function TaskList() {
  const tasks = useAtomValue(filteredTasksAtom)
  const toggleTask = useSetAtom(toggleTaskAtom)
  const deleteTask = useSetAtom(deleteTaskAtom)

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          <span>{task.title}</span>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

function TaskStats() {
  const activeCount = useAtomValue(activeCountAtom)
  const completedCount = useAtomValue(completedCountAtom)

  return (
    <div>
      <p>Active: {activeCount}</p>
      <p>Completed: {completedCount}</p>
    </div>
  )
}
```

### State Persistence

```typescript
// utils/statePersistence.ts
export function saveState<T>(key: string, state: T): void {
  try {
    const serialized = JSON.stringify(state)
    localStorage.setItem(key, serialized)
  } catch (error) {
    console.error('Error saving state:', error)
  }
}

export function loadState<T>(key: string): T | undefined {
  try {
    const serialized = localStorage.getItem(key)
    if (serialized === null) return undefined
    return JSON.parse(serialized)
  } catch (error) {
    console.error('Error loading state:', error)
    return undefined
  }
}

export function clearState(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error clearing state:', error)
  }
}

// Debounced state persistence
import { debounce } from 'lodash'

export function createDebouncedSave<T>(key: string, delay: number = 1000) {
  return debounce((state: T) => {
    saveState(key, state)
  }, delay)
}

// Usage with Zustand
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      // state and actions
    }),
    {
      name: 'app-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)
```

### Optimistic Updates

```typescript
// hooks/useOptimisticUpdate.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Task {
  id: number
  title: string
  completed: boolean
}

export function useToggleTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: number) => {
      const response = await fetch(`/api/tasks/${taskId}/toggle`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to toggle task')
      return response.json()
    },
    onMutate: async (taskId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

      // Optimistically update
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map(task =>
          task.id === taskId
            ? { ...task, completed: !task.completed }
            : task
        )
      )

      return { previousTasks }
    },
    onError: (err, taskId, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

// Usage
function TaskItem({ task }: { task: Task }) {
  const toggleTask = useToggleTask()

  return (
    <div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask.mutate(task.id)}
        disabled={toggleTask.isPending}
      />
      <span>{task.title}</span>
    </div>
  )
}
```

## Best Practices

1. **Choose the Right Tool**: Context for simple state, Zustand/Redux for complex
2. **Normalize State**: Flat structure for easier updates
3. **Derive State**: Compute values instead of storing
4. **Immutable Updates**: Never mutate state directly
5. **Selective Subscriptions**: Only subscribe to needed state
6. **Persist Wisely**: Only persist necessary state
7. **Type Safety**: Use TypeScript for state
8. **Separate Concerns**: UI state vs server state
9. **Optimistic Updates**: Better UX with instant feedback
10. **Test State Logic**: Unit test reducers and actions

## State Management Decision Tree

```
Do you need global state?
├─ No → Use local state (useState)
└─ Yes
   ├─ Is it server data?
   │  └─ Yes → Use TanStack Query
   └─ No (client state)
      ├─ Simple state (theme, user prefs)?
      │  └─ Yes → Use Context API
      └─ Complex state (many actions, middleware)?
         ├─ Need DevTools and ecosystem?
         │  └─ Yes → Use Redux Toolkit
         └─ Want simplicity?
            └─ Yes → Use Zustand or Jotai
```

## Resources

- [React Context Documentation](https://react.dev/reference/react/useContext)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Jotai Documentation](https://jotai.org/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
