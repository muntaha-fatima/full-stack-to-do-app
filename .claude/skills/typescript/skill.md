# TypeScript Development Skill

## Description
Expert TypeScript developer specializing in type-safe JavaScript development with advanced type system features, modern patterns, and best practices.

## Capabilities

### Core TypeScript Features
- **Type Annotations**: Explicit type declarations for variables, functions, and objects
- **Type Inference**: Leveraging TypeScript's type inference capabilities
- **Interfaces & Types**: Defining contracts and type aliases
- **Generics**: Reusable, type-safe components and functions
- **Union & Intersection Types**: Combining types for flexibility
- **Literal Types**: Exact value types for precision
- **Type Guards**: Runtime type checking with type narrowing
- **Utility Types**: Built-in type transformations (Partial, Pick, Omit, etc.)

### Advanced Type System
- **Conditional Types**: Type-level logic and branching
- **Mapped Types**: Transforming existing types
- **Template Literal Types**: String manipulation at type level
- **Discriminated Unions**: Type-safe state machines
- **Type Predicates**: Custom type guards
- **Index Signatures**: Dynamic property types
- **Const Assertions**: Immutable literal types
- **Satisfies Operator**: Type checking without widening

### Modern JavaScript Features
- **ES2020+ Syntax**: Optional chaining, nullish coalescing, etc.
- **Async/Await**: Promise-based asynchronous code
- **Destructuring**: Object and array destructuring
- **Spread/Rest**: Spread operators and rest parameters
- **Modules**: ES6 import/export syntax
- **Classes**: Object-oriented programming with TypeScript
- **Decorators**: Metadata and code transformation

### Configuration & Tooling
- **tsconfig.json**: Compiler options and project configuration
- **Strict Mode**: Enabling all strict type-checking options
- **Path Mapping**: Module resolution and aliases
- **Declaration Files**: .d.ts files for type definitions
- **ESLint**: Linting with @typescript-eslint
- **Prettier**: Code formatting integration
- **Build Tools**: Integration with Webpack, Vite, esbuild

### Type Safety Patterns
- **Branded Types**: Nominal typing in structural type system
- **Builder Pattern**: Type-safe object construction
- **Factory Pattern**: Generic factory functions
- **Repository Pattern**: Type-safe data access
- **DTO Pattern**: Data transfer objects with validation
- **Error Handling**: Type-safe error types

## Usage Examples

### Basic Types and Interfaces

```typescript
// Primitive types
const name: string = "John"
const age: number = 30
const isActive: boolean = true

// Arrays
const numbers: number[] = [1, 2, 3]
const strings: Array<string> = ["a", "b", "c"]

// Objects with interface
interface User {
  id: number
  email: string
  username: string
  role: "admin" | "user" | "guest"
  metadata?: Record<string, unknown>
}

const user: User = {
  id: 1,
  email: "user@example.com",
  username: "johndoe",
  role: "user"
}

// Type alias
type ID = string | number

type Task = {
  id: ID
  title: string
  completed: boolean
  tags: string[]
}
```

### Functions and Generics

```typescript
// Function with type annotations
function createUser(email: string, username: string): User {
  return {
    id: Date.now(),
    email,
    username,
    role: "user"
  }
}

// Arrow function with generics
const findById = <T extends { id: number }>(
  items: T[],
  id: number
): T | undefined => {
  return items.find(item => item.id === id)
}

// Generic constraints
interface HasTimestamp {
  createdAt: Date
  updatedAt: Date
}

function sortByDate<T extends HasTimestamp>(items: T[]): T[] {
  return items.sort((a, b) =>
    b.createdAt.getTime() - a.createdAt.getTime()
  )
}

// Async function
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }
  return response.json()
}
```

### Advanced Type Patterns

```typescript
// Discriminated unions
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

function handleResult<T>(result: Result<T>): T {
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}

// Utility types
interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: Date
}

type TaskCreate = Omit<Task, "id" | "createdAt">
type TaskUpdate = Partial<TaskCreate>
type TaskResponse = Pick<Task, "id" | "title" | "completed">

// Mapped types
type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

type ReadonlyDeep<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? ReadonlyDeep<T[K]>
    : T[K]
}

// Conditional types
type Unwrap<T> = T extends Promise<infer U> ? U : T
type ArrayElement<T> = T extends (infer U)[] ? U : never

// Template literal types
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE"
type Endpoint = `/api/${string}`
type Route = `${HTTPMethod} ${Endpoint}`

const route: Route = "GET /api/users"
```

### Type Guards and Narrowing

```typescript
// Type predicate
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "email" in obj &&
    "username" in obj
  )
}

// Discriminated union with type guard
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "square"; size: number }

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2
    case "rectangle":
      return shape.width * shape.height
    case "square":
      return shape.size ** 2
  }
}

// Assertion functions
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string")
  }
}
```

### React with TypeScript

```typescript
import { FC, ReactNode, useState, useEffect } from "react"

// Component props
interface ButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "danger"
  onClick?: () => void
  disabled?: boolean
}

const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  onClick,
  disabled = false
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Generic component
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
  keyExtractor: (item: T) => string | number
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}

// Custom hook
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
```

### API Client Types

```typescript
// API response types
interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// API client with generics
class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  }

  async post<T, D = unknown>(
    endpoint: string,
    data: D
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  }
}

// Usage
const api = new ApiClient("/api")
const users = await api.get<User[]>("/users")
const newUser = await api.post<User, TaskCreate>("/users", {
  title: "New task",
  description: "Description",
  completed: false
})
```

## Best Practices

1. **Enable Strict Mode**: Always use `"strict": true` in tsconfig.json
2. **Avoid `any`**: Use `unknown` or proper types instead
3. **Use Type Inference**: Let TypeScript infer types when obvious
4. **Prefer Interfaces**: Use interfaces for object shapes, types for unions
5. **Generic Constraints**: Add constraints to generics for type safety
6. **Discriminated Unions**: Use for state machines and variants
7. **Readonly by Default**: Make properties readonly when possible
8. **Type Guards**: Use type predicates for runtime checks
9. **Utility Types**: Leverage built-in utility types
10. **Consistent Naming**: Use PascalCase for types/interfaces

## Common Patterns

### Error Handling
```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = "AppError"
  }
}

type ErrorResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: AppError }

async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<ErrorResult<T>> {
  try {
    const value = await fn()
    return { ok: true, value }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof AppError
        ? error
        : new AppError("Unknown error", "UNKNOWN")
    }
  }
}
```

### Builder Pattern
```typescript
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = []
  private sortFn?: (a: T, b: T) => number
  private limitValue?: number

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate)
    return this
  }

  orderBy(fn: (a: T, b: T) => number): this {
    this.sortFn = fn
    return this
  }

  limit(n: number): this {
    this.limitValue = n
    return this
  }

  execute(items: T[]): T[] {
    let result = items.filter(item =>
      this.filters.every(filter => filter(item))
    )

    if (this.sortFn) {
      result = result.sort(this.sortFn)
    }

    if (this.limitValue) {
      result = result.slice(0, this.limitValue)
    }

    return result
  }
}
```

## tsconfig.json Example

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "jsx": "preserve",
    "incremental": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  },
  "include": ["src/**/*", "next-env.d.ts"],
  "exclude": ["node_modules", "dist", "build"]
}
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
