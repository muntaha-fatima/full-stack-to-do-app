---
id: 1
title: fix-backend-startup-issues
stage: general
date: 2026-01-12
surface: agent
model: Qwen
feature: none
branch: main
user: dell
command: /sp.implement
labels: ["backend", "configuration", "database", "sqlalchemy"]
spec: null
ticket: null
adr: null
pr: null
files:
  - C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\backend\app\core\config.py
  - C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\backend\app\models\analytics.py
  - C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\backend\app\schemas\analytics.py
  - C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\backend\app\api\v1\endpoints\analytics.py
  - C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\backend\requirements.txt
tests: []
links: {}
---

# Fix Backend Startup Issues

## Summary

Fixed two critical issues that were preventing the backend application from starting:

1. Database configuration issue: Changed DATABASE_URL type from PostgresDsn to str to allow both SQLite and PostgreSQL URLs
2. SQLAlchemy model issue: Renamed the 'metadata' field in UserActivity model to 'metadata_json' to avoid conflict with SQLAlchemy's reserved attribute name
3. Updated related schemas and endpoints to use the new field name

## Problem

The backend application was failing to start with the following errors:
- ValidationError: DATABASE_URL had to be PostgreSQL format but SQLite was provided
- InvalidRequestError: Attribute name 'metadata' is reserved when using the Declarative API

## Solution

1. Modified `app/core/config.py` to accept both SQLite and PostgreSQL URLs by changing DATABASE_URL type to str
2. Added aiosqlite to requirements.txt for SQLite support
3. Renamed the 'metadata' field to 'metadata_json' in the UserActivity model to avoid SQLAlchemy conflict
4. Updated the corresponding schema and endpoint to use the new field name

## Outcome

The backend application now starts successfully with the SQLite database configuration.

## Files Modified

- `app/core/config.py` - Changed DATABASE_URL type to str to accept both SQLite and PostgreSQL URLs
- `app/models/analytics.py` - Renamed 'metadata' field to 'metadata_json' in UserActivity model
- `app/schemas/analytics.py` - Updated schema to use 'metadata_json' field name
- `app/api/v1/endpoints/analytics.py` - Updated endpoint to map 'metadata' to 'metadata_json'
- `requirements.txt` - Added aiosqlite dependency

## Verification

- Successfully imported all modules without errors
- Application starts without throwing exceptions