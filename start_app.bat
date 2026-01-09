@echo off
REM Startup script for Todo App (Backend and Frontend)

echo Starting Todo App (Backend and Frontend)...

REM Start backend in a new command prompt window
start "Todo App Backend" cmd /k "cd /d \"C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\backend\" && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for the backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in a new command prompt window
start "Todo App Frontend" cmd /k "cd /d \"C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\frontend\" && npm run dev"

echo Both services should now be starting in separate windows.
echo Backend will be available at http://localhost:8000
echo Frontend will be available at http://localhost:3000