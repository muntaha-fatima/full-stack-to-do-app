# Quickstart Guide: AI-Powered Todo Chatbot

## Overview
This guide provides instructions for setting up and running the AI-Powered Todo Chatbot feature locally.

## Prerequisites
- Node.js 18+ and npm 9+
- Python 3.11+
- PostgreSQL 16+ (or Neon Serverless PostgreSQL)
- Redis 7+ (optional, for caching)
- Docker and Docker Compose (for containerized development)
- OpenAI API key
- Better Auth configuration

## Environment Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp ../.env.example .env
   # Edit .env with your database credentials and OpenAI API key
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the development server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL and OpenAI domain key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- Chat endpoint: `POST /api/{user_id}/chat`
- Existing task endpoints remain unchanged

## OpenAI Configuration
1. Set your OpenAI API key in the backend `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

2. Configure the MCP server in the backend settings

## Better Auth Setup
1. Ensure Better Auth is properly configured in both frontend and backend
2. The user_id from Better Auth will be used in all chat endpoints and MCP tools

## Running Tests
Backend tests:
```bash
cd backend
pytest                          # Run all tests
pytest --cov=app               # With coverage
pytest tests/test_chat.py -v   # Chat-specific tests
```

Frontend tests:
```bash
cd frontend
npm test                        # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # With coverage
```

## Key Components
- MCP Server: Exposes 5 tools (add_task, list_tasks, complete_task, delete_task, update_task)
- OpenAI Agent: Interprets natural language and calls appropriate tools
- Chat Endpoint: Stateless endpoint that persists conversation state in DB
- OpenAI ChatKit: Frontend UI for the chat interface