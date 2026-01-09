---
id: 002
title: Update Constitution for Next.js Todo Frontend
stage: constitution
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-nextjs-todo-frontend
user: PC
command: /sp.constitution
labels: ["constitution", "frontend", "nextjs", "principles", "governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - None (documentation update)
---

## Prompt

Frontend beautiful Next.js Todo App (Phase II)

You are a Senior Frontend Engineer Agent tasked with building ONLY the Next.js frontend for the full-stack Todo application. Backend already exists (FastAPI + Neon DB).

GOAL: Create a modern, beautiful, highly polished, user-friendly Todo web app that feels like a premium productivity tool (inspired by Todoist, Notion, Linear).

CORE RULES:- 100% AI-generated code – no manual editing
- Spec-driven: All features and design decisions come from spec
- Use modern best practices only
- Focus exclusively on frontend – do not touch backend code

TECHNOLOGY STACK (Fixed):
- Next.js 14+ with App Router
- TypeScript (strict mode)
- Tailwind CSS (mandatory – for rapid, consistent, beautiful styling)
- React Server Components where appropriate
- Client components for interactivity

UI/UX REQUIREMENTS (High Priority – Make It Gorgeous):
- Clean, minimal, modern aesthetic
- Excellent typography and spacing
- Fully responsive (mobile, tablet, desktop)
- Smooth hover/focus states and micro-interactions
- Dark mode support (via Tailwind dark: – strongly preferred)
- Task display:
  → Interactive checkbox for mark complete
  → Priority badges (High = red, Medium = orange, Low = green)
  → Tags as small colored chips
  → Title bold, description subtle
  → Edit/Delete icons on hover
- Beautiful Add/Edit task modal (centered, clean form, validation feedback)
- Empty state with friendly message and illustration suggestion
- Loading skeletons while fetching tasks
- Success/error toasts (use react-hot-toast or simple custom)
- Smooth page transitions (optional but bonus)

REQUIRED PAGES & COMPONENTS:
- / (Home) → Main task list page
- TaskList component
- TaskCard / TaskItem component
- AddTaskButton (floating or fixed)
- TaskModal (for add/edit)
- Header with app name + dark mode toggle (optional profile later)
- Responsive layout (grid on desktop, list on mobile)

API INTEGRATION:
- Base URL: process.env.NEXT_PUBLIC_API_URL
- Endpoints to call:
  → GET /tasks
  → POST /tasks
  → PATCH /tasks/{id}
  → DELETE /tasks/{id}
- Use fetch or tanstack/react-query
- Optimistic updates for instant feedback
- Proper loading and error states

AGENT SKILLS:
- Next.js App Router setup with TypeScript
- Tailwind configuration and global styles
- Beautiful, reusable, accessible component

## Response snapshot

Created comprehensive project constitution (v1.0.0) with 7 core principles tailored for Next.js frontend development:

**Core Principles Established:**
1. Frontend Excellence First - Prioritize UX and visual polish
2. Type Safety Everywhere - TypeScript strict mode mandatory
3. Component-Driven Architecture - Small, reusable, testable components
4. Test-First Development - TDD with Red-Green-Refactor cycle
5. Performance and Accessibility Standards - Lighthouse scores ≥90, WCAG 2.1 AA
6. API Integration Discipline - Proper error handling, loading states, optimistic updates
7. Styling Consistency - Tailwind CSS for 95%+ of styling

**Development Workflow Defined:**
- Specification-Driven Development (spec → plan → tasks)
- Quality gates at pre-commit, pre-merge, and pre-deploy stages
- Code review standards including TypeScript, ESLint, Prettier, accessibility audits

**Governance Structure:**
- Semantic versioning for constitution amendments
- Amendment process requiring ADR documentation
- Quarterly compliance audits
- Constitution supersedes all other practices

Constitution file created at `.specify/memory/constitution.md` with sync impact report documenting all templates aligned with new principles.

## Outcome

- ✅ Impact: Established foundational governance for Next.js Todo frontend project with 7 core principles
- 🧪 Tests: None (documentation artifact)
- 📁 Files: Created .specify/memory/constitution.md (201 lines)
- 🔁 Next prompts: Feature specification creation, planning phase
- 🧠 Reflection: Constitution provides clear guardrails for frontend development with emphasis on UX excellence, type safety, and accessibility. Principles are specific enough to guide decisions but flexible enough to allow implementation creativity.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual review - PASS (all placeholders filled, principles clear and testable)
- Prompt variant (if applicable): Standard constitution creation workflow
- Next experiment (smallest change to try): Validate constitution principles during planning phase to ensure alignment
