---
id: 1
title: Fix Authentication API Endpoints
stage: general
date_iso: 2026-01-18
surface: agent
model: gpt-4o
feature: none
branch: main
user: dell
command: fix-auth-endpoints
labels: ["auth", "api", "frontend", "backend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - c:\Users\dell\full-stack-phase-2\full-stack-to-do-app\frontend\lib\auth.ts
  - c:\Users\dell\full-stack-phase-2\full-stack-to-do-app\frontend\src\lib\api-client.ts
  - c:\Users\dell\full-stack-phase-2\full-stack-to-do-app\frontend\src\lib\better-auth-client.ts
tests:
  - c:\Users\dell\full-stack-phase-2\full-stack-to-do-app\frontend\lib\auth.ts
  - c:\Users\dell\full-stack-phase-2\full-stack-to-do-app\frontend\src\lib\api-client.ts
  - c:\Users\dell\full-stack-phase-2\full-stack-to-do-app\frontend\src\lib\better-auth-client.ts
prompt_text: |
  Fixed authentication API endpoints in the frontend to use the correct /api/v1/auth/ path instead of /api/auth/ to match the backend API structure.
response_text: |
  Fixed all authentication API endpoints in the frontend to use the correct /api/v1/auth/ path. This resolves the 404 errors occurring when the frontend tried to access authentication endpoints. The backend API is configured with a v1 prefix for most endpoints, but tasks API is intentionally without the prefix.
outcome: |
  Authentication endpoints now work correctly, resolving the 404 errors seen in the browser console.
evaluation: |
  Verified that all auth endpoints now use the correct path by searching the codebase for incorrect patterns.
---

# Fix Authentication API Endpoints

## Summary

Fixed authentication API endpoints in the frontend to use the correct `/api/v1/auth/` path instead of `/api/auth/` to match the backend API structure.

## Changes Made

1. Updated all auth API calls in `frontend/lib/auth.ts` to use `/api/v1/auth/` path
2. Updated refresh token endpoint in `frontend/src/lib/api-client.ts`
3. Fixed social sign-in path in `frontend/src/lib/better-auth-client.ts`
4. Updated getProfile function to use correct path

## Result

Authentication endpoints now work correctly, resolving the 404 errors seen in the browser console.