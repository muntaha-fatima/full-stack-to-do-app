# Skills Library

A comprehensive collection of skill prompts for full-stack development with Next.js, FastAPI, PostgreSQL, and modern web technologies.

## Overview

This skills library contains 25+ detailed skill documents covering all aspects of modern full-stack web development. Each skill document provides:

- **Capabilities**: What the skill covers
- **Usage Examples**: Practical code examples
- **Best Practices**: Industry-standard recommendations
- **Checklists**: Implementation verification
- **Resources**: Links to official documentation

## Available Skills

### Frontend Development

#### **Next.js** (`nextjs/skill.md`)
Modern React framework with App Router, Server Components, and SSR/SSG capabilities.
- App Router architecture
- Server and Client Components
- Data fetching strategies
- Image and font optimization
- Deployment to Vercel

#### **React** (`react/skill.md`)
Modern React patterns, hooks, and React Query for data fetching.
- Functional components and hooks
- React Query (TanStack Query)
- Performance optimization
- Custom hooks
- Context API

#### **TypeScript** (`typescript/skill.md`)
Type-safe JavaScript development with advanced type system features.
- Type annotations and inference
- Generics and utility types
- Advanced type patterns
- React with TypeScript
- API client types

#### **Tailwind CSS** (`tailwind/skill.md`)
Utility-first CSS framework for rapid UI development.
- Utility classes
- Responsive design
- Dark mode
- Custom theming
- Component patterns

#### **State Management** (`state-management/skill.md`)
Application state management with Context, Zustand, Redux Toolkit, and Jotai.
- React Context API
- Zustand (lightweight)
- Redux Toolkit
- Jotai (atomic)
- State persistence

#### **Forms** (`forms/skill.md`)
Form handling and validation with React Hook Form and Zod.
- React Hook Form
- Zod validation
- Dynamic field arrays
- File uploads
- Multi-step forms

#### **Accessibility** (`accessibility/skill.md`)
WCAG compliance and accessible web development.
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support
- WCAG 2.1 guidelines

#### **SEO** (`seo/skill.md`)
Search engine optimization and meta tags.
- Next.js Metadata API
- Structured data (JSON-LD)
- Sitemap generation
- Open Graph tags
- Google Analytics

### Backend Development

#### **FastAPI** (`fastapi/skill.md`)
Modern Python async web framework with automatic API documentation.
- Async/await patterns
- Pydantic validation
- Dependency injection
- API documentation
- WebSocket support

#### **PostgreSQL** (`postgresql/skill.md`)
Relational database design and SQLAlchemy 2.0 ORM.
- Schema design
- SQLAlchemy 2.0 models
- Query optimization
- Indexing strategies
- Async operations

#### **Alembic** (`alembic/skill.md`)
Database migration management for SQLAlchemy.
- Migration creation
- Auto-generation
- Version control
- Rollback strategies
- Zero-downtime migrations

#### **API Design** (`api-design/skill.md`)
RESTful API design principles and best practices.
- REST principles
- HTTP methods and status codes
- Pagination and filtering
- Error handling
- API versioning

#### **Authentication** (`authentication/skill.md`)
Secure authentication and authorization systems.
- JWT tokens
- OAuth2
- Password hashing
- Role-based access control
- Session management

### Infrastructure & DevOps

#### **Docker** (`docker/skill.md`)
Containerization and multi-container orchestration.
- Dockerfile best practices
- Multi-stage builds
- Docker Compose
- Container networking
- Production deployment

#### **Deployment** (`deployment/skill.md`)
Environment configuration and deployment strategies.
- Environment variables
- Vercel deployment
- Railway deployment
- Docker deployment
- CI/CD with GitHub Actions

#### **Git** (`git/skill.md`)
Version control and collaboration workflows.
- Git fundamentals
- Branching strategies
- Pull requests
- GitHub CLI
- Commit conventions

### Data & Caching

#### **Redis** (`redis/skill.md`)
In-memory data store for caching and real-time features.
- Caching strategies
- Session storage
- Rate limiting
- Leaderboards
- Pub/Sub messaging

#### **Background Jobs** (`background-jobs/skill.md`)
Asynchronous task processing with Celery and RQ.
- Celery task queue
- Redis Queue (RQ)
- Periodic tasks
- Task monitoring
- Retry logic

### Features & Integrations

#### **File Upload** (`file-upload/skill.md`)
File upload and cloud storage integration.
- Multipart uploads
- AWS S3 integration
- Cloudinary integration
- File validation
- Image optimization

#### **Email & Notifications** (`email-notifications/skill.md`)
Email delivery and notification systems.
- SMTP email sending
- SendGrid integration
- Email templates
- In-app notifications
- Push notifications

#### **WebSockets** (`websockets/skill.md`)
Real-time bidirectional communication.
- FastAPI WebSockets
- React WebSocket client
- Connection management
- Pub/Sub patterns
- Presence detection

### Quality & Monitoring

#### **Testing** (`testing/skill.md`)
Comprehensive testing strategies for full-stack applications.
- Jest and React Testing Library
- Pytest for Python
- E2E testing with Playwright
- API testing
- Coverage reporting

#### **Error Handling** (`error-handling/skill.md`)
Robust error handling and logging.
- Custom exceptions
- Error tracking with Sentry
- Structured logging
- Error boundaries
- Monitoring

#### **Performance** (`performance/skill.md`)
Application performance optimization.
- Frontend optimization
- Database query optimization
- Caching strategies
- Code splitting
- Web Vitals

#### **Monitoring** (`monitoring/skill.md`)
Application monitoring and observability.
- Prometheus metrics
- Grafana dashboards
- OpenTelemetry tracing
- Sentry error tracking
- Health checks

## How to Use These Skills

### 1. Reference During Development
Use these skills as reference guides when implementing specific features:

```bash
# Example: Need to implement authentication?
cat .claude/skills/authentication/skill.md
```

### 2. Copy Code Examples
Each skill contains production-ready code examples that you can adapt:

```typescript
// From react/skill.md
import { useQuery } from '@tanstack/react-query'

function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks')
      return response.json()
    }
  })
}
```

### 3. Follow Best Practices
Each skill includes a "Best Practices" section with industry-standard recommendations.

### 4. Use Checklists
Verify your implementation with the provided checklists:

- [ ] Authentication implemented
- [ ] Error handling in place
- [ ] Tests written
- [ ] Documentation updated

### 5. Explore Resources
Each skill links to official documentation and learning resources.

## Skill Categories

### Essential Skills (Start Here)
1. **Next.js** - Frontend framework
2. **FastAPI** - Backend framework
3. **PostgreSQL** - Database
4. **TypeScript** - Type safety
5. **Authentication** - Security

### Core Development Skills
6. **React** - UI components
7. **Tailwind CSS** - Styling
8. **API Design** - REST principles
9. **Forms** - User input
10. **State Management** - Application state

### Advanced Features
11. **WebSockets** - Real-time features
12. **File Upload** - File handling
13. **Email & Notifications** - Communication
14. **Background Jobs** - Async processing
15. **Redis** - Caching

### Quality & Operations
16. **Testing** - Quality assurance
17. **Error Handling** - Reliability
18. **Performance** - Optimization
19. **Monitoring** - Observability
20. **Accessibility** - Inclusive design

### Infrastructure
21. **Docker** - Containerization
22. **Deployment** - Production deployment
23. **Git** - Version control
24. **Alembic** - Database migrations
25. **SEO** - Search optimization

## Technology Stack

This skills library is designed for the following stack:

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Query, Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic

### Infrastructure
- **Containerization**: Docker
- **Caching**: Redis
- **Queue**: Celery
- **Storage**: AWS S3 / Cloudinary
- **Monitoring**: Prometheus, Grafana, Sentry

## Quick Start Guide

### 1. Frontend Setup
```bash
# Create Next.js app
npx create-next-app@latest my-app --typescript --tailwind --app

# Install dependencies
npm install @tanstack/react-query zustand react-hook-form zod
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install fastapi uvicorn sqlalchemy alembic asyncpg redis celery
```

### 3. Database Setup
```bash
# Start PostgreSQL with Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine
```

### 4. Development Workflow
1. Read relevant skill documents
2. Copy and adapt code examples
3. Follow best practices
4. Use checklists to verify implementation
5. Refer to linked resources for deep dives

## Contributing

To add a new skill:

1. Create a new directory: `.claude/skills/skill-name/`
2. Create `skill.md` with the following structure:
   - Description
   - Capabilities
   - Usage Examples
   - Best Practices
   - Checklist
   - Resources

## Skill Template

```markdown
# Skill Name

## Description
Brief description of what this skill covers.

## Capabilities
- Feature 1
- Feature 2
- Feature 3

## Usage Examples
### Example 1
\`\`\`typescript
// Code example
\`\`\`

## Best Practices
1. Practice 1
2. Practice 2

## Checklist
- [ ] Item 1
- [ ] Item 2

## Resources
- [Link 1](url)
- [Link 2](url)
```

## Maintenance

These skills are designed to be:
- **Up-to-date**: Following latest framework versions
- **Production-ready**: Battle-tested patterns
- **Comprehensive**: Covering common use cases
- **Practical**: Real-world code examples

## License

These skills are provided as educational resources for the PHAS II project.

## Support

For questions or issues:
1. Check the relevant skill document
2. Review the linked resources
3. Consult official documentation
4. Ask in project discussions

---

**Last Updated**: January 2026
**Total Skills**: 25
**Coverage**: Full-stack web development with Next.js, FastAPI, and PostgreSQL
