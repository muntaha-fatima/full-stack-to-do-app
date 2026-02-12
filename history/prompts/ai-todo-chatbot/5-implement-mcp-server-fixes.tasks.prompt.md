---
id: 5
title: Implement mcp server fixes
stage: tasks
date_iso: 2026-02-03
surface: agent
model: claude-3-5-sonnet-20241022
feature: ai-todo-chatbot
branch: 005-ai-todo-chatbot
user: dell
command: /sp.implement
labels:
  - ai-chatbot
  - todo-app
  - mcp
  - openai-agents
links:
  spec: specs/005-ai-todo-chatbot/spec.md
  plan: specs/005-ai-todo-chatbot/plan.md
  tasks: specs/005-ai-todo-chatbot/tasks.md
  ticket: null
  adr: null
  pr: null
files_yaml:
  - backend/app/utils/mcp_server.py
tests_yaml: []
---

# Prompt History Record

## User Input

```
/sp.implement I am getting multiple errors in my MCP server due to incorrect handling of a generator-based
database session dependency.

Context:
- get_session() is a generator that yields a SQLAlchemy DB session and closes it in finally
- I am NOT using FastAPI dependency injection here
- I need to manually consume the generator safely

Task:
1. Fix generator usage so the DB session is always closed properly
2. Avoid calling .close() on the session directly
3. Prevent circular imports
4. Make the code production-safe and type-correct
5. Do NOT refactor the architecture or change function signatures unnecessarily

Important:
- Use next(generator) + generator.close() correctly
- If creating a helper, keep it minimal and clean
- Return the FULL corrected file, not snippets
```

## Assistant Response

I have successfully fixed the MCP server implementation to address the generator-based database session dependency issues. The key changes made were:

1. Moved all imports inside the functions (lazy imports) to prevent circular imports
2. Properly handled the generator lifecycle by using:
   - `db_session_gen = get_session()` to get the generator
   - `db_session = next(db_session_gen)` to get the session
   - `db_session_gen.close()` in the finally block to ensure proper cleanup
3. Ensured that the database session is always properly closed by using try/finally blocks
4. Maintained the original function signatures and architecture

The implementation now correctly handles the generator-based session dependency without causing circular imports or leaving database connections open.

## Outcome

The MCP server now properly handles database sessions with correct generator usage, preventing resource leaks and circular import issues.