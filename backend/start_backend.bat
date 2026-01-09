@echo off
REM Startup script for Todo App Backend

echo Starting Todo App Backend...

REM Navigate to backend directory
cd /d "C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\backend"

REM Check if venv exists, if not create it
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies if requirements.txt is newer than installed packages
if not exist "requirements_installed.txt" (
    echo Installing dependencies...
    pip install --upgrade pip
    pip install -r requirements.txt
    echo. > requirements_installed.txt
)

REM Start the backend server
echo Starting backend server on port 8000...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000