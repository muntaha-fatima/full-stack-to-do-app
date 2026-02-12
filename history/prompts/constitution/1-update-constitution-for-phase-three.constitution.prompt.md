---
id: 1
title: Update constitution for Phase III AI Chatbot integration
stage: constitution
date_iso: 2026-02-03
surface: agent
model: claude-3-5-sonnet-20241022
feature: todo-ai-chatbot-integration
branch: main
user: dell
command: /sp.constitution
labels:
  - constitution
  - ai-chatbot
  - phase-iii
  - todo-app
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - .specify/memory/constitution.md
tests_yaml: []
---

# Prompt History Record

## User Input

```
/sp.constitution # Hackathon II – Phase III Constitution: Todo AI Chatbot Integration

You are the Product Architect AI Agent for Phase III of Hackathon II: Spec-Driven Development.

Your mission: Integrate an AI-powered conversational chatbot into the existing Phase II full-stack Todo app, allowing users to manage todos via natural language.

CORE RULES (Non-Negotiable):
- No manual coding allowed. All implementation via Claude Code / Spec-Kit Plus.
- Strictly follow Agentic Dev Stack workflow:
  1. Analyze spec → Generate detailed plan
  2. Break into atomic tasks
  3. Implement each task with complete code generation
  4. Review, iterate, refine if needed
- Extend Phase II codebase (Next.js + FastAPI + Neon DB) without regressions.
- Stateless architecture: No server-side memory – all state (tasks, conversations, messages) in Neon DB.
- Specs versioned in specs_history/ (YAML, Spec-Kit Plus compatible).
- Clean, production-ready code with proper error handling, logging, and comments.

PHASE III KEY REQUIREMENTS:
1. Conversational interface for all Basic Todo features (Add, List, Complete, Delete, Update).
2. Use OpenAI Agents SDK for agent logic (Agent + Runner).
3. Build stateless MCP Server using Official MCP SDK – expose 5 tools:
   - add_task
   - list_tasks
   - complete_task
   - delete_task
   - update_task
4. Chat endpoint (POST /api/{user_id}/chat) – stateless, persists conversation to DB.
5. Integrate OpenAI ChatKit into frontend for beautiful chat UI.
6. Use Better Auth for user_id in tools/endpoints.
7. 80%+ test coverage, graceful error handling, action confirmations.

TECHNOLOGY STACK (Exact):
- Frontend: OpenAI ChatKit (integrated into existing Next.js)
- Backend: FastAPI (extend existing)
- AI: OpenAI Agents SDK
- MCP: Official MCP SDK (tools)
- ORM: SQLModel
- DB: Neon Serverless PostgreSQL (add Conversation & Message models)
- Auth: Better Auth

DATABASE MODELS (Extend Existing Task):
- Conversation: user_id (str), id (int PK), created_at, updated_at
- Message: user_id (str), id (int PK), conversation_id (int FK), role ("user"/"assistant"), content (text), created_at

CHAT ENDPOINT:
- POST /api/{user_id}/chat
- Request: { conversation_id?: int, message: string }
- Response: { conversation_id: int, response: string, tool_calls?: array }

MCP TOOLS (Implement Exactly as Specified):
- add_task(user_id: str, title: str, description?: str) → {task_id, status, title}
- list_tasks(user_id: str, status?: "all"|"pending"|"completed") → array of tasks
- complete_task(user_id: str, task_id: int) → {task_id, status, title}
- delete_task(user_id: str, task_id: int) → {task_id, status, title}
- update_task(user_id: str, task_id: int, title?: str, description?: str) → {task_id, status, title}

AGENT BEHAVIOR:
- Natural language understanding: "Add task buy groceries" → add_task, "Show pending tasks" → list_tasks("pending")
- Always confirm actions: "Task 'Buy groceries' added successfully! ✅"
- Chain tools if needed (e.g., list → delete)
- Handle errors gracefully: "Task 999 not found. Please check the ID."

STATLESS FLOW (Every Request):
1. Receive message
2. Fetch conversation history from DB
3. Append user message & store it
4. Run OpenAI Agent with MCP tools
5. Agent invokes tool(s)
6. Store assistant response
7. Return response

DELIVERABLES EXPECTED:
- /frontend: Updated with ChatKit integration
- /backend: Extended with chat router, MCP server, tools, agents, SQLModel models
- Database migrations (SQLModel)
- specs_history/ with Phase III specs
- README: Setup, env vars, domain allowlist instructions

JUDGING FOCUS:
- Process (prompts, iterations, specs)
- Stateless scalability
- Natural, helpful conversation
- Full integration with existing app

You are now active for Phase III.
When given spec_phase3.yaml or instruction, begin by creating the development plan.
Ready to build the AI Chatbot.
```

## Assistant Response

I have successfully updated the project constitution for the Todo AI Chatbot Integration Phase III. Here's the summary:

**New Version**: 1.0.0 (initial version for Phase III)
**Bump Rationale**: This is an initial constitution specifically for Phase III requirements, introducing new principles for AI Chatbot integration.

**Changes Made**:
- Created a new constitution tailored to the AI Chatbot integration requirements
- Defined 6 core principles: No Manual Coding, Agentic Dev Stack Workflow, Stateless Architecture, Spec-Driven Development, Production-Ready Code, and Integration Without Regressions
- Added sections for Technology Stack Compliance and Development Workflow
- Included governance rules specific to Phase III
- Added the Sync Impact Report at the top of the file

**Files Updated**:
- `.specify/memory/constitution.md` - Updated with the new constitution for Phase III

**Files Flagged for Manual Follow-up**:
- README.md - Needs to be reviewed for consistency with the new principles

**Suggested Commit Message**: 
`docs: amend constitution to v1.0.0 for Phase III AI Chatbot integration`

The constitution now properly reflects the requirements for integrating an AI-powered conversational chatbot into the existing Phase II full-stack Todo app, with emphasis on stateless architecture, agentic development workflow, and maintaining production-ready code.

## Outcome

The project constitution has been successfully updated to reflect the requirements for Phase III: Todo AI Chatbot Integration. The new constitution enforces the core principles of no manual coding, agentic development workflow, stateless architecture, and production-ready code while maintaining compatibility with the existing Phase II codebase.