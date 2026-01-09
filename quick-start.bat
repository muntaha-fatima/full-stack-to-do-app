@echo off
REM Quick Start Script for Full-Stack Todo App (Windows)
REM This script helps you get started quickly with the Todo App

echo ==========================================
echo Full-Stack Todo App - Quick Start
echo ==========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    exit /b 1
) else (
    echo [OK] Node.js installed
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    exit /b 1
) else (
    echo [OK] npm installed
)

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed
    echo Please install Python 3.11+ from https://www.python.org/
    exit /b 1
) else (
    echo [OK] Python installed
)

REM Check Docker (optional)
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Docker not found (optional)
) else (
    echo [OK] Docker installed
)

echo.
echo ==========================================
echo Setup Options
echo ==========================================
echo.
echo Choose your setup method:
echo 1) Docker Compose (Recommended - includes database)
echo 2) Local Development (requires PostgreSQL installed)
echo 3) Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto docker_setup
if "%choice%"=="2" goto local_setup
if "%choice%"=="3" goto exit_script
echo Invalid choice
exit /b 1

:docker_setup
echo.
echo Starting with Docker Compose...

REM Check if .env exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo [WARNING] Please edit .env file with your configuration
)

REM Install root dependencies
echo Installing root dependencies...
call npm install

REM Start Docker Compose
echo Starting Docker containers...
docker-compose up -d

echo.
echo [OK] Docker containers started!
echo.
echo Services:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:8000
echo   - API Docs: http://localhost:8000/api/v1/docs
echo.
echo View logs: docker-compose logs -f
echo Stop services: docker-compose down
goto end

:local_setup
echo.
echo Setting up for local development...

REM Check if .env exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo [WARNING] Please edit .env file with your database credentials
    pause
)

REM Install root dependencies
echo Installing root dependencies...
call npm install

REM Setup backend
echo.
echo Setting up backend...
cd backend

if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo Running database migrations...
alembic upgrade head

cd ..

REM Setup frontend
echo.
echo Setting up frontend...
cd frontend

if not exist .env.local (
    echo Creating .env.local from .env.local.example...
    copy .env.local.example .env.local
)

echo Installing frontend dependencies...
call npm install

cd ..

echo.
echo [OK] Setup complete!
echo.
echo To start development:
echo   1. Backend: cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload
echo   2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Or use: npm run dev (starts both)
goto end

:exit_script
echo Exiting...
exit /b 0

:end
echo.
echo ==========================================
echo Next Steps
echo ==========================================
echo.
echo 1. Review the documentation:
echo    - README.md (main documentation)
echo    - SETUP_CHECKLIST.md (verification steps)
echo    - PROJECT_STRUCTURE.md (project overview)
echo.
echo 2. Access the application:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000
echo    - API Docs: http://localhost:8000/api/v1/docs
echo.
echo 3. Run tests:
echo    - Backend: cd backend ^&^& pytest
echo    - Frontend: cd frontend ^&^& npm test
echo.
echo 4. Review project standards:
echo    - .specify/memory/constitution.md
echo.
echo Happy coding!
pause
