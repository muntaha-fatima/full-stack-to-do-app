#!/bin/bash

# Quick Start Script for Full-Stack Todo App
# This script helps you get started quickly with the Todo App

set -e

echo "=========================================="
echo "Full-Stack Todo App - Quick Start"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "  Please install Node.js 18+ from https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 is not installed${NC}"
    echo "  Please install Python 3.11+ from https://www.python.org/"
    exit 1
else
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ Python installed: $PYTHON_VERSION${NC}"
fi

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL client not found${NC}"
    echo "  You may need to install PostgreSQL or use Docker"
else
    PSQL_VERSION=$(psql --version)
    echo -e "${GREEN}✓ PostgreSQL client installed: $PSQL_VERSION${NC}"
fi

# Check Docker (optional)
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker not found (optional)${NC}"
else
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker installed: $DOCKER_VERSION${NC}"
fi

echo ""
echo "=========================================="
echo "Setup Options"
echo "=========================================="
echo ""
echo "Choose your setup method:"
echo "1) Docker Compose (Recommended - includes database)"
echo "2) Local Development (requires PostgreSQL installed)"
echo "3) Exit"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Starting with Docker Compose..."

        # Check if .env exists
        if [ ! -f .env ]; then
            echo "Creating .env file from .env.example..."
            cp .env.example .env
            echo -e "${YELLOW}⚠ Please edit .env file with your configuration${NC}"
        fi

        # Install root dependencies
        echo "Installing root dependencies..."
        npm install

        # Start Docker Compose
        echo "Starting Docker containers..."
        docker-compose up -d

        echo ""
        echo -e "${GREEN}✓ Docker containers started!${NC}"
        echo ""
        echo "Services:"
        echo "  - Frontend: http://localhost:3000"
        echo "  - Backend API: http://localhost:8000"
        echo "  - API Docs: http://localhost:8000/api/v1/docs"
        echo ""
        echo "View logs: docker-compose logs -f"
        echo "Stop services: docker-compose down"
        ;;

    2)
        echo ""
        echo "Setting up for local development..."

        # Check if .env exists
        if [ ! -f .env ]; then
            echo "Creating .env file from .env.example..."
            cp .env.example .env
            echo -e "${YELLOW}⚠ Please edit .env file with your database credentials${NC}"
            read -p "Press Enter to continue after editing .env..."
        fi

        # Install root dependencies
        echo "Installing root dependencies..."
        npm install

        # Setup backend
        echo ""
        echo "Setting up backend..."
        cd backend

        if [ ! -d "venv" ]; then
            echo "Creating Python virtual environment..."
            python3 -m venv venv
        fi

        echo "Activating virtual environment..."
        source venv/bin/activate

        echo "Installing Python dependencies..."
        pip install -r requirements.txt

        echo "Running database migrations..."
        alembic upgrade head

        cd ..

        # Setup frontend
        echo ""
        echo "Setting up frontend..."
        cd frontend

        if [ ! -f .env.local ]; then
            echo "Creating .env.local from .env.local.example..."
            cp .env.local.example .env.local
        fi

        echo "Installing frontend dependencies..."
        npm install

        cd ..

        echo ""
        echo -e "${GREEN}✓ Setup complete!${NC}"
        echo ""
        echo "To start development:"
        echo "  1. Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
        echo "  2. Frontend: cd frontend && npm run dev"
        echo ""
        echo "Or use: npm run dev (starts both)"
        ;;

    3)
        echo "Exiting..."
        exit 0
        ;;

    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""
echo "1. Review the documentation:"
echo "   - README.md (main documentation)"
echo "   - SETUP_CHECKLIST.md (verification steps)"
echo "   - PROJECT_STRUCTURE.md (project overview)"
echo ""
echo "2. Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/api/v1/docs"
echo ""
echo "3. Run tests:"
echo "   - Backend: cd backend && pytest"
echo "   - Frontend: cd frontend && npm test"
echo ""
echo "4. Review project standards:"
echo "   - .specify/memory/constitution.md"
echo ""
echo -e "${GREEN}Happy coding!${NC}"
