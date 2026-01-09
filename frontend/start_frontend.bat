@echo off
REM Startup script for Todo App Frontend

echo Starting Todo App Frontend...

REM Navigate to frontend directory
cd /d "C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\frontend"

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Create .env.local if it doesn't exist
if not exist ".env.local" (
    echo Creating .env.local from example...
    copy .env.local.example .env.local
)

REM Start the frontend development server
echo Starting frontend server on port 3000...
npm run dev