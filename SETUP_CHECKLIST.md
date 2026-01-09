# Setup Verification Checklist

Use this checklist to verify your Full-Stack Todo App is properly initialized and ready for development.

## Initial Setup

### 1. Environment Configuration

- [ ] Copy `.env.example` to `.env` in project root
- [ ] Copy `frontend/.env.local.example` to `frontend/.env.local`
- [ ] Update database credentials in `.env`
- [ ] Update API URL in `frontend/.env.local`
- [ ] Verify SECRET_KEY is at least 32 characters

### 2. Dependencies Installation

#### Root Dependencies
```bash
npm install
```
- [ ] `concurrently` installed successfully
- [ ] No installation errors

#### Frontend Dependencies
```bash
cd frontend
npm install
```
- [ ] Next.js 14+ installed
- [ ] React 18+ installed
- [ ] TypeScript 5+ installed
- [ ] Tailwind CSS 3+ installed
- [ ] React Query installed
- [ ] All dev dependencies installed
- [ ] No peer dependency warnings

#### Backend Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
- [ ] Virtual environment created
- [ ] FastAPI 0.104+ installed
- [ ] SQLAlchemy 2.0+ installed
- [ ] asyncpg installed
- [ ] Alembic installed
- [ ] Pydantic v2 installed
- [ ] All dependencies installed without errors

### 3. Database Setup

#### PostgreSQL Installation
- [ ] PostgreSQL 16+ installed and running
- [ ] Database user created (default: `todoapp`)
- [ ] Database created (default: `todoapp`)
- [ ] Connection successful: `psql -U todoapp -d todoapp`

#### Run Migrations
```bash
cd backend
alembic upgrade head
```
- [ ] Migration executed successfully
- [ ] `tasks` table created
- [ ] Indexes created
- [ ] No migration errors

#### Verify Database Schema
```sql
\dt  -- List tables
\d tasks  -- Describe tasks table
```
- [ ] `tasks` table exists
- [ ] All columns present (id, title, description, status, priority, completed, due_date, created_at, updated_at)
- [ ] Indexes created on id, title, status, priority, completed

### 4. Development Servers

#### Backend Server
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- [ ] Server starts without errors
- [ ] Accessible at http://localhost:8000
- [ ] Health check responds: http://localhost:8000/health
- [ ] API docs accessible: http://localhost:8000/api/v1/docs
- [ ] No import errors
- [ ] Database connection successful

#### Frontend Server
```bash
cd frontend
npm run dev
```
- [ ] Server starts without errors
- [ ] Accessible at http://localhost:3000
- [ ] No compilation errors
- [ ] No TypeScript errors
- [ ] Page loads successfully

### 5. API Integration

#### Test API Endpoints
- [ ] GET http://localhost:8000/api/v1/health returns 200
- [ ] GET http://localhost:8000/api/v1/tasks/ returns task list
- [ ] POST http://localhost:8000/api/v1/tasks/ creates task
- [ ] GET http://localhost:8000/api/v1/tasks/{id} returns task
- [ ] PUT http://localhost:8000/api/v1/tasks/{id} updates task
- [ ] DELETE http://localhost:8000/api/v1/tasks/{id} deletes task

#### Test Frontend Integration
- [ ] Frontend loads at http://localhost:3000
- [ ] Task list displays (may be empty)
- [ ] "New Task" button visible
- [ ] Filter buttons work (All, Todo, In Progress, Completed)
- [ ] Can create new task via form
- [ ] Can view task details
- [ ] Can update task status
- [ ] Can delete task
- [ ] No console errors

### 6. Docker Setup (Optional)

#### Docker Compose
```bash
docker-compose up -d
```
- [ ] All services start successfully
- [ ] PostgreSQL container healthy
- [ ] Redis container healthy
- [ ] Backend container healthy
- [ ] Frontend container healthy
- [ ] Services can communicate

#### Verify Docker Services
```bash
docker-compose ps
docker-compose logs backend
docker-compose logs frontend
```
- [ ] All containers running
- [ ] No error logs
- [ ] Health checks passing

### 7. Testing

#### Backend Tests
```bash
cd backend
pytest
```
- [ ] All tests pass
- [ ] No test failures
- [ ] Coverage report generated

#### Frontend Tests
```bash
cd frontend
npm test
```
- [ ] All tests pass
- [ ] No test failures
- [ ] Jest configured correctly

### 8. Code Quality

#### Linting
```bash
npm run lint
```
- [ ] Frontend linting passes
- [ ] Backend linting passes (ruff)
- [ ] No linting errors

#### Formatting
```bash
npm run format:check
```
- [ ] Code formatting correct
- [ ] No formatting issues

#### Type Checking
```bash
cd frontend && npm run type-check
cd backend && mypy app/
```
- [ ] TypeScript type checking passes
- [ ] Python type checking passes (if mypy installed)

### 9. Documentation

- [ ] Root README.md exists and is complete
- [ ] Frontend README.md exists
- [ ] Backend README.md exists
- [ ] PROJECT_STRUCTURE.md exists
- [ ] API documentation accessible at /api/v1/docs
- [ ] All setup instructions clear

### 10. Security

- [ ] `.env` files not committed to git
- [ ] `.gitignore` properly configured
- [ ] No secrets in code
- [ ] CORS origins configured correctly
- [ ] SECRET_KEY is strong and unique

## Common Issues and Solutions

### Issue: Database Connection Failed
**Solution:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL in `.env`
3. Verify database exists: `psql -l`
4. Check credentials are correct

### Issue: Port Already in Use
**Solution:**
1. Change ports in `.env` or `docker-compose.yml`
2. Kill process using port: `lsof -ti:8000 | xargs kill -9` (Mac/Linux)
3. Use different ports: Frontend (3001), Backend (8001)

### Issue: Module Not Found
**Solution:**
1. Reinstall dependencies: `npm install` or `pip install -r requirements.txt`
2. Clear cache: `npm cache clean --force` or `pip cache purge`
3. Delete and recreate virtual environment (backend)

### Issue: Migration Failed
**Solution:**
1. Drop database and recreate: `dropdb todoapp && createdb todoapp`
2. Run migrations again: `alembic upgrade head`
3. Check alembic.ini configuration

### Issue: CORS Error
**Solution:**
1. Verify CORS_ORIGINS in backend `.env`
2. Include frontend URL: `http://localhost:3000`
3. Restart backend server

### Issue: TypeScript Errors
**Solution:**
1. Run type check: `npm run type-check`
2. Fix type errors in code
3. Restart TypeScript server in IDE

## Success Criteria

Your setup is complete when:

- ✅ All dependencies installed without errors
- ✅ Database migrations applied successfully
- ✅ Backend server running and accessible
- ✅ Frontend server running and accessible
- ✅ API endpoints responding correctly
- ✅ Frontend can communicate with backend
- ✅ All tests passing
- ✅ No linting or type errors
- ✅ Docker containers running (if using Docker)
- ✅ Documentation reviewed and understood

## Next Steps After Verification

1. **Review Constitution**: Read `.specify/memory/constitution.md` for project standards
2. **Explore API Docs**: Visit http://localhost:8000/api/v1/docs
3. **Create First Task**: Use the UI to create a task
4. **Run Tests**: Verify test suite works
5. **Start Development**: Begin implementing new features following TDD

## Getting Help

If you encounter issues:
1. Check the relevant README.md file
2. Review error messages carefully
3. Check Docker logs: `docker-compose logs -f`
4. Verify environment variables
5. Ensure all prerequisites are installed

---

**Last Updated**: 2026-01-07
**Project**: Full-Stack Todo App
**Version**: 1.0.0
