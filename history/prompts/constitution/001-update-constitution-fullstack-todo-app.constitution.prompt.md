---
id: 001
title: Update Constitution for Full-Stack Todo App
stage: constitution
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5
feature: none
branch: master
user: PC
command: /sp.constitution
labels: ["constitution", "project-setup", "standards", "full-stack", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none (constitution is documentation)
---

## Prompt

/sp.constitution

Update the project constitution for a Full-Stack Todo App with the following requirements:

**Technology Stack:**
- Frontend: Next.js 14+ with App Router, TypeScript, Tailwind CSS, React Query, Zustand
- Backend: FastAPI (Python 3.11+), PostgreSQL 16+, SQLAlchemy 2.0, Alembic
- Infrastructure: Docker, Redis, Celery, Nginx, GitHub Actions
- Monitoring: Prometheus, Grafana, Sentry

**Core Principles Required:**
1. API-First Development with OpenAPI/Swagger
2. Test-Driven Development (TDD) - mandatory Red-Green-Refactor cycle
3. Type Safety Everywhere (TypeScript strict mode, Python type hints)
4. Security by Default (JWT, RBAC, input validation, CORS)
5. Performance Standards (Core Web Vitals, API response times)
6. Code Quality Standards (linting, formatting, complexity limits)
7. Database Integrity (migrations, constraints, transactions, audit trails)

**Additional Requirements:**
- RESTful API design standards with proper status codes
- WCAG 2.1 Level AA accessibility compliance
- Observability (structured logging, metrics, tracing, alerting)
- Security requirements (authentication, authorization, data protection)
- Development workflow (feature branches, conventional commits, code review)
- Governance (amendment process, quality gates, complexity justification)

## Response snapshot

Successfully updated the constitution file at `.specify/memory/constitution.md` with comprehensive principles for the Full-Stack Todo App project.

**Constitution Structure Created:**

1. **Core Principles (7 principles)**:
   - I. API-First Development
   - II. Test-Driven Development (NON-NEGOTIABLE)
   - III. Type Safety Everywhere
   - IV. Security by Default
   - V. Performance Standards
   - VI. Code Quality Standards
   - VII. Database Integrity

2. **Technology Stack**:
   - Frontend: Next.js 14+, TypeScript 5+, Tailwind CSS 3+, React Query, Zustand
   - Backend: FastAPI 0.100+, Python 3.11+, PostgreSQL 16+, SQLAlchemy 2.0, Alembic
   - Infrastructure: Docker, Redis 7+, Celery, Nginx, Prometheus, Grafana, Sentry

3. **Development Workflow**:
   - Feature development process (8 steps from spec to deployment)
   - Git workflow (branching, commits, PRs, CI checks)
   - Code review requirements (10-point checklist)

4. **API Design Standards**:
   - RESTful principles with proper HTTP methods and status codes
   - Error response format (JSON with code, message, details, request_id)
   - Success response format (data + meta with pagination)

5. **Accessibility Standards**:
   - WCAG 2.1 Level AA compliance requirements
   - Keyboard navigation, screen reader support, color contrast
   - Form labels, error messages, heading hierarchy

6. **Observability Requirements**:
   - Structured JSON logging with correlation IDs
   - Application, business, infrastructure, and database metrics
   - Distributed tracing with OpenTelemetry
   - Alerting thresholds for error rate, response time, availability

7. **Security Requirements**:
   - Authentication & authorization (JWT, RBAC, rate limiting)
   - Data protection (encryption, PII handling, audit logs)

8. **Governance**:
   - Constitution authority and amendment process
   - Complexity justification and quality gates

**Performance Budgets Defined:**
- Frontend: FCP < 1.5s, LCP < 2.5s, TTI < 3.5s, CLS < 0.1, Bundle < 200KB
- Backend: API p95 < 200ms (simple), < 500ms (complex), DB queries < 100ms
- Coverage: 80% backend, 70% frontend

**Code Quality Standards:**
- Linting: ESLint (frontend), Ruff/Black (backend) - zero warnings
- Complexity: < 10 per function
- Function length: < 50 lines
- File length: < 300 lines

## Outcome

- ✅ Impact: Comprehensive constitution established for Full-Stack Todo App with 7 core principles, complete technology stack definition, and detailed standards for development, security, performance, and governance
- 🧪 Tests: N/A (constitution is documentation, not code)
- 📁 Files: Updated 1 file (.specify/memory/constitution.md) - 275 lines
- 🔁 Next prompts: Create initial project structure, set up frontend/backend scaffolding, configure linting and formatting tools, establish CI/CD pipeline
- 🧠 Reflection: Constitution provides clear, measurable standards that align with the comprehensive skills library created earlier. All principles are actionable and verifiable through code review checklists and automated CI checks.

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution successfully created with all required sections
- Graders run and results (PASS/FAIL): PASS - All template sections filled, principles are clear and measurable, standards are specific and actionable
- Prompt variant (if applicable): Standard /sp.constitution command
- Next experiment (smallest change to try): Validate constitution against actual project setup by creating a feature spec and verifying all constitutional requirements can be met
