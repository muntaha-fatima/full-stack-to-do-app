# Frontend - Next.js Todo App

Modern Next.js 14 frontend with TypeScript, Tailwind CSS, and React Query for the Todo App.

## Features

- **Next.js 14** with App Router and React Server Components
- **TypeScript 5+** with strict mode enabled
- **Tailwind CSS 3+** for utility-first styling
- **React Query (TanStack Query)** for server state management
- **Zustand** for client state management (ready to implement)
- **React Hook Form + Zod** for form validation
- **Axios** for API requests with interceptors
- **ESLint + Prettier** for code quality
- **Jest + React Testing Library** for testing
- **Docker** support with multi-stage builds

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home page (task list)
│   ├── providers.tsx         # React Query provider
│   └── globals.css           # Global styles
├── components/
│   ├── ui/
│   │   └── button.tsx        # Reusable button component
│   ├── task-card.tsx         # Task display card
│   └── task-form.tsx         # Task creation/edit form
├── lib/
│   ├── api-client.ts         # Axios configuration
│   ├── tasks.ts              # Task API functions
│   └── utils.ts              # Utility functions
├── types/
│   └── task.ts               # TypeScript type definitions
├── public/                   # Static assets
├── styles/                   # Additional styles
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── Dockerfile               # Multi-stage Docker build
└── package.json             # Dependencies and scripts
```

## Prerequisites

- Node.js 18+ and npm 9+
- Backend API running on https://shazsabir-to-do-backend.hf.space/ (or configured URL)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://shazsabir-to-do-backend.hf.space
NODE_ENV=development
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check formatting
npm run type-check   # TypeScript type checking
```

### Testing

```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Key Features

### Task Management

- **List Tasks**: View all tasks with filtering by status
- **Create Task**: Add new tasks with title, description, priority, and due date
- **Update Task**: Edit task details and change status
- **Delete Task**: Remove tasks with confirmation
- **Toggle Complete**: Mark tasks as complete/incomplete

### Filtering

- Filter by status: All, Todo, In Progress, Completed
- Real-time updates with React Query

### Form Validation

- Client-side validation with Zod schemas
- Server-side validation error handling
- User-friendly error messages

## API Integration

The frontend communicates with the FastAPI backend through the API client:

```typescript
// Example: Fetching tasks
import { getTasks } from '@/lib/tasks';

const tasks = await getTasks({ status: 'todo', limit: 20 });
```

### API Client Features

- Automatic token injection (when authentication is implemented)
- Request/response interceptors
- Error handling and retry logic
- Type-safe API calls

## Styling

### Tailwind CSS

The project uses Tailwind CSS for styling with a custom configuration:

- Custom color palette
- Responsive design utilities
- Dark mode support (ready to implement)

### Component Library

Reusable UI components in `components/ui/`:

- Button with variants (primary, secondary, destructive, outline, ghost)
- More components can be added as needed

## Type Safety

All API responses and data structures are fully typed:

```typescript
interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  completed: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
```

## Performance Optimization

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Bundle Size**: Monitored and optimized
- **Caching**: React Query with stale-while-revalidate strategy

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## Docker

### Build Image

```bash
docker build -t todo-frontend .
```

### Run Container

```bash
docker run -p 3000:3000 --env-file .env.local todo-frontend
```

### Using Docker Compose

From the project root:

```bash
docker-compose up frontend
```

## Environment Variables

### Required

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: https://shazsabir-to-do-backend.hf.space)

### Optional

- `NODE_ENV` - Environment (development, production)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Authentication Issues

If you're experiencing issues with authentication or being redirected unexpectedly:

1. **Force logout**: Visit [http://localhost:3000/api/force-logout](http://localhost:3000/api/force-logout) to clear all authentication cookies
2. **Clear browser cookies**: Manually clear cookies for localhost:3000 in your browser settings
3. **Private browsing**: Use an incognito/private browsing window to test authentication

### API Connection Issues

1. Verify backend is running: https://shazsabir-to-do-backend.hf.space/health
2. Check CORS configuration in backend
3. Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Type Errors

```bash
# Run type checking
npm run type-check
```

## Contributing

1. Follow the code style (ESLint + Prettier)
2. Write tests for new components
3. Update documentation
4. Run all checks before committing:
   ```bash
   npm run lint && npm run type-check && npm test
   ```

## Next Steps

- [ ] Implement authentication (login/register pages)
- [ ] Add user profile management
- [ ] Implement real-time updates with WebSockets
- [ ] Add task categories/tags
- [ ] Implement task search
- [ ] Add dark mode toggle
- [ ] Implement task sharing
- [ ] Add notifications

## License

MIT
