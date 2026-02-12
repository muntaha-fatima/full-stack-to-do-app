# Implementation Plan: AI-Powered Todo Chatbot

**Branch**: `005-ai-todo-chatbot` | **Date**: 2026-02-03 | **Spec**: [link to spec](./spec.md)
**Input**: Feature specification from `/specs/005-ai-todo-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan extends the existing Phase II full-stack Todo app (Next.js frontend + FastAPI backend + Neon DB) with a conversational AI chatbot that manages tasks via natural language. The implementation will use MCP tools and OpenAI Agents SDK to provide a stateless chat interface supporting all 5 basic Todo features (add, list, complete, delete, update) through natural language commands.

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript/JavaScript (frontend)
**Primary Dependencies**: FastAPI (backend), Next.js 14 (frontend), OpenAI Agents SDK, Official MCP SDK, SQLModel, Better Auth, OpenAI ChatKit
**Storage**: Neon Serverless PostgreSQL database
**Testing**: pytest (backend), Jest/React Testing Library (frontend)
**Target Platform**: Web application (browser-based)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Respond to user commands within 3 seconds under normal load conditions, 95% accuracy in natural language interpretation
**Constraints**: Stateless server architecture (no in-memory state), 80%+ test coverage, no regressions to existing Phase II features
**Scale/Scope**: Individual user conversations, persistence across sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ No Manual Coding: All implementation will be done via Claude Code / Spec-Kit Plus
- ✅ Agentic Dev Stack Workflow: Following the workflow: Analyze → Generate detailed plan → Break into atomic tasks → Implement each task with complete code generation → Review, iterate, refine
- ✅ Stateless Architecture: All state (tasks, conversations, messages) will be stored in Neon DB with no server-side memory
- ✅ Spec-Driven Development: Following the specification created in spec.md
- ✅ Production-Ready Code: Will maintain 80%+ test coverage with proper error handling and logging
- ✅ Integration Without Regressions: Extending existing Phase II codebase without causing regressions
- ✅ Technology Stack Compliance: Using specified technologies (OpenAI ChatKit, FastAPI, OpenAI Agents SDK, MCP SDK, SQLModel, Neon DB, Better Auth)

## Project Structure

### Documentation (this feature)

```text
specs/005-ai-todo-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py
│   │   ├── conversation.py          # New model for chat conversations
│   │   └── message.py               # New model for chat messages
│   ├── services/
│   │   ├── __init__.py
│   │   ├── task_service.py
│   │   ├── conversation_service.py  # New service for conversation management
│   │   └── message_service.py       # New service for message management
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── tasks.py
│   │   │   │   ├── auth.py
│   │   │   │   └── chat.py          # New endpoint for chat functionality
│   │   │   └── api_router.py
│   │   └── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── security.py
│   │   └── agents.py                # New module for OpenAI agents
│   ├── utils/
│   │   ├── __init__.py
│   │   └── mcp_server.py            # New module for MCP server
│   └── main.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_agents.py               # New tests for agent functionality
│   ├── test_chat.py                 # New tests for chat endpoints
│   ├── test_conversation.py         # New tests for conversation models/services
│   └── test_message.py              # New tests for message models/services
├── alembic/
│   └── versions/                    # New migration files for conversation/message models
├── requirements.txt
├── pyproject.toml
└── Dockerfile

frontend/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── chat/                    # New chat page
│   │       ├── page.tsx
│   │       └── components/
│   │           ├── chat-interface.tsx  # New component for chat UI
│   │           └── chat-message.tsx    # New component for individual messages
│   ├── components/
│   │   ├── ui/
│   │   ├── task-card.tsx
│   │   ├── task-form.tsx
│   │   └── theme-provider.tsx
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── tasks.ts
│   │   └── chat.ts                  # New module for chat API interactions
│   ├── types/
│   │   ├── task.ts
│   │   └── chat.ts                  # New types for chat functionality
│   ├── providers/
│   │   └── theme-provider.tsx
│   └── hooks/
│       └── use-chat.ts              # New hook for chat functionality
├── public/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── Dockerfile

shared/
└── types/
    └── api.ts                       # Shared API types
```

**Structure Decision**: Web application structure with separate frontend and backend components, extending the existing architecture. New models, services, and endpoints will be added to support the chat functionality while maintaining the existing task management features.

## Phase 0: Research Completed
- [X] Researched MCP Server implementation
- [X] Researched OpenAI Agents SDK integration
- [X] Researched stateless architecture with Neon DB
- [X] Researched OpenAI ChatKit for frontend
- [X] Researched SQLModel for new data models
- [X] Researched Better Auth integration

## Phase 1: Design & Contracts Completed
- [X] Created data-model.md with Conversation and Message entities
- [X] Generated API contracts in /contracts/chat-api.yaml
- [X] Created quickstart.md with setup instructions
- [X] Updated agent context for Qwen

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
