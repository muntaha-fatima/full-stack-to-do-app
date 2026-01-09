---
id: 1
title: "Frontend Troubleshooting Session"
stage: "general"
date: "2026-01-09"
surface: "agent"
model: "Qwen Code"
feature: "none"
branch: "main"
user: "dell"
command: "Troubleshoot frontend not connecting to backend"
labels: ["frontend", "debugging", "connection", "api"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "frontend/app/page.tsx"
  - "frontend/lib/api-client.ts"
  - "backend/app/main.py"
  - "docker-compose.yml"
tests_yaml: []
---

# Frontend Troubleshooting Session

## Summary
User reported that the frontend is not running properly. Investigation revealed that the frontend starts correctly but cannot connect to the backend API, resulting in `net::ERR_CONNECTION_REFUSED` errors when trying to access `http://localhost:8000/api/v1/tasks/`.

## Root Cause
The frontend application is running on port 3000 but the backend API server is not running on port 8000, causing connection failures when the frontend tries to fetch data from the backend.

## Solution Provided
Guidance on how to properly start both backend and frontend services:
1. Ensure Python 3.11+ and Node.js 18+ are installed
2. Start the backend service first: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
3. Then start the frontend in a separate terminal: `npm run dev`
4. Alternative recommended approach: Use Docker with `docker-compose up --build`

## Files Referenced
- frontend/app/page.tsx - Main frontend page that fetches tasks
- frontend/lib/api-client.ts - API client configuration with default backend URL
- backend/app/main.py - Backend FastAPI application
- docker-compose.yml - Service configuration for both frontend and backend

## Outcome
User now understands that both services need to be running for the full-stack application to function properly. Connection refused errors will be resolved once the backend service is started.
