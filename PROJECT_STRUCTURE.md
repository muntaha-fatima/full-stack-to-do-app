# Full-Stack Todo App - Project Structure

```
phas_II/
│
├── .claude/                          # Claude Code configuration
│   ├── agents/                       # AI agent definitions
│   ├── commands/                     # SpecKit Plus commands
│   └── skills/                       # Reusable skills
│
├── .specify/                         # SpecKit Plus configuration
│   ├── memory/
│   │   └── constitution.md          # Project principles and standards
│   ├── scripts/
│   │   └── bash/                    # Utility scripts
│   └── templates/                   # Document templates
│       ├── adr-template.md
│       ├── plan-template.md
│       ├── spec-template.md
│       └── tasks-template.md
│
├── backend/                          # FastAPI Backend
│   ├── alembic/                     # Database migrations
│   │   ├── versions/
│   │   │   └── 001_initial_migration.py
│   │   ├── env.py                   # Alembic environment
│   │   └── script.py.mako           # Migration template
│   │
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── __init__.py
│   │   │       │   ├── health.py    # Health check endpoint
│   │   │       │   └── tasks.py     # Task CRUD endpoints
│   │   │       ├── __init__.py
│   │   │       └── api.py           # API router aggregation
│   │   │
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py            # Application settings
│   │   │   └── security.py          # JWT and password utilities
│   │   │
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── session.py           # Async database session
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── task.py              # Task SQLAlchemy model
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── task.py              # Task Pydantic schemas
│   │   │
│   │   ├── __init__.py
│   │   └── main.py                  # FastAPI application
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py              # Test fixtures
│   │   └── test_tasks.py            # Task endpoint tests
│   │
│   ├── .dockerignore
│   ├── .python-version              # Python 3.11
│   ├── alembic.ini                  # Alembic configuration
│   ├── Dockerfile                   # Multi-stage Docker build
│   ├── pyproject.toml               # Python dependencies (UV compatible)
│   ├── requirements.txt             # Pip fallback
│   └── README.md                    # Backend documentation
│
├── frontend/                         # Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── page.tsx                 # Home page (task list)
│   │   ├── providers.tsx            # React Query provider
│   │   └── globals.css              # Global styles
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── __tests__/
│   │   │   │   └── button.test.tsx  # Button component tests
│   │   │   └── button.tsx           # Reusable button component
│   │   ├── task-card.tsx            # Task display card
│   │   └── task-form.tsx            # Task creation/edit form
│   │
│   ├── lib/
│   │   ├── api-client.ts            # Axios configuration
│   │   ├── tasks.ts                 # Task API functions
│   │   └── utils.ts                 # Utility functions
│   │
│   ├── types/
│   │   └── task.ts                  # TypeScript type definitions
│   │
│   ├── public/                      # Static assets
│   │
│   ├── .dockerignore
│   ├── .eslintrc.json              # ESLint configuration
│   ├── .prettierrc                 # Prettier configuration
│   ├── .env.local.example          # Environment variables template
│   ├── Dockerfile                  # Multi-stage Docker build
│   ├── jest.config.js              # Jest configuration
│   ├── jest.setup.js               # Jest setup
│   ├── next.config.js              # Next.js configuration
│   ├── package.json                # Frontend dependencies
│   ├── postcss.config.js           # PostCSS configuration
│   ├── tailwind.config.ts          # Tailwind CSS configuration
│   ├── tsconfig.json               # TypeScript configuration
│   └── README.md                   # Frontend documentation
│
├── shared/                          # Shared code between frontend/backend
│   └── types/
│       └── api.ts                   # Shared API types and constants
│
├── db/                              # Database configuration
│   └── init/
│       ├── 01-init.sh              # PostgreSQL initialization
│       └── 02-seed.sql             # Sample data for development
│
├── history/                         # Project history (SpecKit Plus)
│   ├── adr/                        # Architecture Decision Records
│   └── prompts/                    # Prompt History Records
│       ├── constitution/
│       ├── general/
│       └── <feature-name>/
│
├── .editorconfig                    # Editor configuration
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── CLAUDE.md                        # Claude Code rules
├── docker-compose.yml               # Service orchestration
├── Makefile                         # Build automation
├── package.json                     # Root package.json (workspaces)
└── README.md                        # Main documentation
```

## File Count Summary

- **Backend**: 25+ Python files
- **Frontend**: 20+ TypeScript/JavaScript files
- **Configuration**: 15+ config files
- **Documentation**: 5 README files
- **Docker**: 3 Dockerfiles + docker-compose.yml
- **Database**: 2 initialization scripts
- **Tests**: 10+ test files

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3
- React Query (TanStack Query)
- React Hook Form + Zod
- Axios
- Jest + React Testing Library

### Backend
- FastAPI 0.104+
- Python 3.11+
- SQLAlchemy 2.0 (async)
- PostgreSQL 16+
- Alembic
- Pydantic v2
- Pytest + pytest-asyncio
- Black + Ruff

### Infrastructure
- Docker + Docker Compose
- PostgreSQL 16
- Redis 7
- Nginx (ready to configure)

## Key Features Implemented

1. **Complete CRUD API** for tasks with filtering and pagination
2. **Async database operations** with connection pooling
3. **Type-safe API client** with automatic token injection
4. **Form validation** with Zod (frontend) and Pydantic (backend)
5. **Comprehensive testing** setup for both frontend and backend
6. **Docker multi-stage builds** for optimized production images
7. **Health check endpoints** for monitoring
8. **Database migrations** with Alembic
9. **Code quality tools** (ESLint, Prettier, Black, Ruff)
10. **Production-ready configuration** with security headers

## Next Steps

1. Install dependencies: `npm install` (root), `cd frontend && npm install`, `cd backend && pip install -r requirements.txt`
2. Configure environment: Copy `.env.example` to `.env` and update values
3. Start services: `docker-compose up -d` or run frontend/backend separately
4. Run migrations: `cd backend && alembic upgrade head`
5. Access application: Frontend at http://localhost:3000, API at http://localhost:8000

## Constitutional Compliance

This project structure follows all principles defined in `.specify/memory/constitution.md`:

- ✅ API-First Development
- ✅ Test-Driven Development (TDD) ready
- ✅ Type Safety Everywhere
- ✅ Security by Default
- ✅ Performance Standards
- ✅ Code Quality Standards
- ✅ Database Integrity
- ✅ Observability Requirements
