# Authentication Feature - Implementation Plan

**Feature**: User Authentication and Authorization
**Version**: 1.0.0
**Status**: Draft
**Created**: 2026-01-07
**Last Updated**: 2026-01-07
**Spec Reference**: `specs/authentication/spec.md`

---

## Executive Summary

This plan outlines the implementation strategy for a secure JWT-based authentication system with email verification, password reset, and role-based access control. The implementation follows a layered architecture with clear separation of concerns and adheres to all security requirements defined in the project constitution.

**Key Decisions:**
- JWT for stateless authentication with refresh token rotation
- bcrypt for password hashing (cost factor 12)
- httpOnly cookies for refresh token storage
- Async email sending via Celery
- Rate limiting with Redis
- Comprehensive audit logging

**Estimated Complexity**: Medium-High
**Implementation Phases**: 4 phases over multiple sprints

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Context │  │ Protected    │  │ Login/       │     │
│  │ (Zustand)    │  │ Routes       │  │ Register     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │  API Client    │                       │
│                    │  (Axios)       │                       │
│                    └───────┬────────┘                       │
└────────────────────────────┼──────────────────────────────┘
                             │ HTTPS
                             │
┌────────────────────────────▼──────────────────────────────┐
│                    Backend (FastAPI)                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              API Layer (Routers)                     │ │
│  │  /auth/register  /auth/login  /auth/refresh  etc.   │ │
│  └──────────────────────┬───────────────────────────────┘ │
│                         │                                  │
│  ┌──────────────────────▼───────────────────────────────┐ │
│  │           Authentication Middleware                   │ │
│  │  - JWT Validation                                    │ │
│  │  - Token Extraction                                  │ │
│  │  - User Context Injection                            │ │
│  └──────────────────────┬───────────────────────────────┘ │
│                         │                                  │
│  ┌──────────────────────▼───────────────────────────────┐ │
│  │              Service Layer                            │ │
│  │  - AuthService (login, register, verify)             │ │
│  │  - TokenService (generate, validate, refresh)        │ │
│  │  - PasswordService (hash, verify, reset)             │ │
│  │  - EmailService (send verification, reset)           │ │
│  └──────────────────────┬───────────────────────────────┘ │
│                         │                                  │
│  ┌──────────────────────▼───────────────────────────────┐ │
│  │              Repository Layer                         │ │
│  │  - UserRepository                                     │ │
│  │  - TokenRepository                                    │ │
│  └──────────────────────┬───────────────────────────────┘ │
└─────────────────────────┼─────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼────────┐ ┌─────▼──────┐ ┌───────▼────────┐
│   PostgreSQL   │ │   Redis    │ │    Celery      │
│   (User Data)  │ │ (Rate Limit│ │ (Email Queue)  │
│                │ │  & Cache)  │ │                │
└────────────────┘ └────────────┘ └────────────────┘
```

### Component Responsibilities

**Frontend Components:**
- **AuthContext**: Global authentication state management
- **ProtectedRoute**: Route guard for authenticated pages
- **Login/Register Forms**: User input and validation
- **API Client**: HTTP requests with token management

**Backend Components:**
- **API Layer**: Request handling, validation, response formatting
- **Middleware**: JWT validation, rate limiting, CORS
- **Service Layer**: Business logic, orchestration
- **Repository Layer**: Database operations, data access

**Infrastructure:**
- **PostgreSQL**: Persistent storage for users and tokens
- **Redis**: Rate limiting, session caching (optional)
- **Celery**: Async email sending

---

## Key Architecture Decisions

### ADR-001: JWT for Authentication

**Context**: Need stateless authentication for API

**Decision**: Use JWT (JSON Web Tokens) with refresh token rotation

**Rationale**:
- Stateless: No server-side session storage required
- Scalable: Works across multiple backend instances
- Standard: Well-supported by libraries and tools
- Flexible: Can include custom claims (user ID, role)

**Alternatives Considered**:
1. **Session-based auth**: Requires server-side storage, not stateless
2. **OAuth2 only**: Overkill for simple authentication, adds complexity

**Consequences**:
- ✅ Scalable and stateless
- ✅ Works well with microservices
- ✅ Standard and well-documented
- ⚠️ Token revocation requires additional logic (refresh token rotation)
- ⚠️ Token size larger than session ID

**Implementation**:
- Access token: 15 min expiry, stored in memory
- Refresh token: 7 day expiry, stored in httpOnly cookie
- Token rotation on refresh (one-time use)

---

### ADR-002: bcrypt for Password Hashing

**Context**: Need secure password storage

**Decision**: Use bcrypt with cost factor 12

**Rationale**:
- Industry standard for password hashing
- Adaptive: Cost factor can be increased over time
- Salted: Each password has unique salt
- Slow: Resistant to brute force attacks

**Alternatives Considered**:
1. **Argon2**: More modern, but less widely adopted
2. **PBKDF2**: Older, less resistant to GPU attacks
3. **scrypt**: Good, but bcrypt is more battle-tested

**Consequences**:
- ✅ Secure against rainbow tables and brute force
- ✅ Well-supported by libraries (passlib)
- ✅ Can increase cost factor as hardware improves
- ⚠️ Slower than plain hashing (~200ms per hash)

**Implementation**:
- Use `passlib[bcrypt]` library
- Cost factor: 12 (configurable via environment)
- Verify password on login with constant-time comparison

---

### ADR-003: httpOnly Cookies for Refresh Tokens

**Context**: Need secure storage for refresh tokens

**Decision**: Store refresh tokens in httpOnly, secure, SameSite=Strict cookies

**Rationale**:
- httpOnly: Not accessible via JavaScript (XSS protection)
- Secure: Only sent over HTTPS
- SameSite=Strict: CSRF protection
- Automatic: Browser handles cookie storage and sending

**Alternatives Considered**:
1. **localStorage**: Vulnerable to XSS attacks
2. **sessionStorage**: Vulnerable to XSS, lost on tab close
3. **Memory only**: Lost on page refresh

**Consequences**:
- ✅ Protected from XSS attacks
- ✅ Protected from CSRF attacks
- ✅ Automatic cookie management
- ⚠️ Requires CORS configuration
- ⚠️ Requires HTTPS in production

**Implementation**:
- Set cookie on login/refresh
- Clear cookie on logout
- Cookie attributes: httpOnly=true, secure=true, sameSite=strict

---

### ADR-004: Async Email Sending with Celery

**Context**: Email sending should not block API responses

**Decision**: Use Celery with Redis broker for async email tasks

**Rationale**:
- Non-blocking: API responds immediately
- Reliable: Retry logic for failed emails
- Scalable: Can add more workers as needed
- Monitoring: Flower for task monitoring

**Alternatives Considered**:
1. **FastAPI BackgroundTasks**: Simple but no persistence or retry
2. **RQ (Redis Queue)**: Simpler than Celery but less features
3. **Synchronous**: Blocks API response, poor UX

**Consequences**:
- ✅ Fast API responses
- ✅ Reliable email delivery with retries
- ✅ Scalable with worker processes
- ⚠️ Additional infrastructure (Redis, Celery workers)
- ⚠️ More complex deployment

**Implementation**:
- Celery tasks for: verification email, password reset email
- Redis as message broker
- Retry logic: 3 attempts with exponential backoff
- Email service: SMTP or SendGrid (configurable)

---

### ADR-005: Rate Limiting with Redis

**Context**: Need to prevent brute force attacks

**Decision**: Implement rate limiting using Redis with sliding window

**Rationale**:
- Fast: In-memory storage for counters
- Distributed: Works across multiple backend instances
- Flexible: Can implement various rate limit strategies
- TTL: Automatic expiry of old counters

**Alternatives Considered**:
1. **In-memory (Python dict)**: Doesn't work across instances
2. **Database**: Too slow for rate limiting
3. **Nginx rate limiting**: Less flexible, harder to customize

**Consequences**:
- ✅ Fast and scalable
- ✅ Works across multiple instances
- ✅ Flexible rate limit strategies
- ⚠️ Requires Redis infrastructure
- ⚠️ Counters lost if Redis restarts (acceptable)

**Implementation**:
- Login: 5 attempts per 15 minutes per IP
- Registration: 3 attempts per hour per IP
- Password reset: 3 attempts per hour per email
- Use `slowapi` library for FastAPI integration

---

## Implementation Strategy

### Phase 1: Core Authentication (Sprint 1)

**Goal**: Basic login/logout functionality

**Tasks**:
1. Database models (User, RefreshToken)
2. Alembic migrations
3. Password hashing service
4. JWT token service
5. User registration endpoint (without email verification)
6. Login endpoint
7. Logout endpoint
8. Token refresh endpoint
9. Get current user endpoint
10. Authentication middleware
11. Unit tests for services
12. Integration tests for endpoints

**Deliverables**:
- Users can register and login
- JWT tokens issued and validated
- Refresh token rotation working
- All tests passing

**Acceptance Criteria**:
- [ ] User can register with email/username/password
- [ ] User can login and receive access token
- [ ] Access token validates correctly
- [ ] Refresh token rotates on use
- [ ] User can logout and tokens are invalidated
- [ ] 80%+ test coverage

---

### Phase 2: Email Verification & Password Reset (Sprint 2)

**Goal**: Email-based account verification and password recovery

**Tasks**:
1. Email service setup (SMTP/SendGrid)
2. Celery configuration
3. Email templates (verification, password reset)
4. Verification token model and migration
5. Password reset token model and migration
6. Email verification endpoint
7. Resend verification email endpoint
8. Password reset request endpoint
9. Password reset confirm endpoint
10. Celery tasks for email sending
11. Unit tests for email service
12. Integration tests for email flows

**Deliverables**:
- Email verification working
- Password reset working
- Async email sending via Celery
- Email templates styled

**Acceptance Criteria**:
- [ ] Verification email sent on registration
- [ ] User can verify email via link
- [ ] User can request password reset
- [ ] User can reset password via email link
- [ ] Emails sent asynchronously
- [ ] All tests passing

---

### Phase 3: Security Enhancements (Sprint 3)

**Goal**: Rate limiting, account lockout, audit logging

**Tasks**:
1. Redis setup for rate limiting
2. Rate limiting middleware
3. Account lockout logic
4. Login history model and migration
5. Audit logging service
6. Password change endpoint
7. Profile update endpoint
8. Security tests (rate limiting, lockout)
9. Performance tests
10. Security review

**Deliverables**:
- Rate limiting enforced
- Account lockout after failed attempts
- Comprehensive audit logging
- Password change functionality
- Profile update functionality

**Acceptance Criteria**:
- [ ] Rate limiting prevents brute force
- [ ] Account locks after 5 failed attempts
- [ ] All auth events logged
- [ ] User can change password
- [ ] User can update profile
- [ ] Security tests passing

---

### Phase 4: Frontend Integration (Sprint 4)

**Goal**: Complete frontend authentication flow

**Tasks**:
1. AuthContext with Zustand
2. API client with Axios interceptors
3. Login page
4. Registration page
5. Email verification page
6. Password reset request page
7. Password reset confirm page
8. Profile page
9. Protected route component
10. Token refresh logic
11. E2E tests with Playwright
12. UI/UX polish

**Deliverables**:
- Complete authentication UI
- Protected routes working
- Automatic token refresh
- E2E tests passing

**Acceptance Criteria**:
- [ ] User can register via UI
- [ ] User can login via UI
- [ ] User can verify email via UI
- [ ] User can reset password via UI
- [ ] Protected routes redirect to login
- [ ] Token refreshes automatically
- [ ] E2E tests passing
- [ ] Mobile responsive

---

## Data Flow Diagrams

### Login Flow

```
┌──────────┐                                    ┌──────────┐
│ Frontend │                                    │ Backend  │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │ POST /auth/login                              │
     │ { email, password }                           │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                          ┌────▼────┐
     │                                          │ Validate│
     │                                          │ Input   │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │ Find    │
     │                                          │ User    │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │ Verify  │
     │                                          │Password │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │Generate │
     │                                          │ Tokens  │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │ Store   │
     │                                          │ Refresh │
     │                                          │ Token   │
     │                                          └────┬────┘
     │                                               │
     │ { access_token, user }                        │
     │ Set-Cookie: refresh_token                     │
     │<──────────────────────────────────────────────┤
     │                                               │
┌────▼─────┐                                        │
│ Store    │                                        │
│ Access   │                                        │
│ Token    │                                        │
└──────────┘                                        │
```

### Token Refresh Flow

```
┌──────────┐                                    ┌──────────┐
│ Frontend │                                    │ Backend  │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │ POST /auth/refresh                            │
     │ Cookie: refresh_token                         │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                          ┌────▼────┐
     │                                          │ Extract │
     │                                          │ Token   │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │ Validate│
     │                                          │ Token   │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │Generate │
     │                                          │ New     │
     │                                          │ Tokens  │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │Invalidate│
     │                                          │ Old     │
     │                                          │ Token   │
     │                                          └────┬────┘
     │                                               │
     │ { access_token }                              │
     │ Set-Cookie: new_refresh_token                 │
     │<──────────────────────────────────────────────┤
     │                                               │
┌────▼─────┐                                        │
│ Update   │                                        │
│ Access   │                                        │
│ Token    │                                        │
└──────────┘                                        │
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    failed_login_attempts INTEGER DEFAULT 0 NOT NULL,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login_at TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NULL
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

### Verification Tokens Table
```sql
CREATE TABLE verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL
);

CREATE INDEX idx_verification_tokens_user_id ON verification_tokens(user_id);
CREATE INDEX idx_verification_tokens_token ON verification_tokens(token);
```

### Password Reset Tokens Table
```sql
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
```

### Login History Table
```sql
CREATE TABLE login_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(500) NOT NULL,
    success BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_created_at ON login_history(created_at);
```

---

## Security Implementation

### Password Security
```python
# app/core/security.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash password with bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)
```

### JWT Token Generation
```python
# app/core/security.py
from jose import jwt
from datetime import datetime, timedelta

def create_access_token(user_id: int, role: str) -> str:
    """Create JWT access token"""
    expire = datetime.utcnow() + timedelta(minutes=15)
    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def decode_access_token(token: str) -> dict:
    """Decode and validate JWT token"""
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
```

### Rate Limiting
```python
# app/middleware/rate_limit.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/login")
@limiter.limit("5/15minutes")
async def login(request: Request, ...):
    ...
```

---

## Testing Strategy

### Unit Tests (80%+ Coverage)
- Password hashing and verification
- JWT token generation and validation
- Token expiry logic
- Input validation
- Rate limiting logic
- Account lockout logic

### Integration Tests
- User registration flow
- Login flow (success and failure)
- Token refresh flow
- Logout flow
- Email verification flow
- Password reset flow
- Password change flow
- Profile update flow

### E2E Tests (Playwright)
- Complete registration → verification → login
- Login → access protected resource → logout
- Password reset from email to new login
- Token refresh during active session
- Rate limiting enforcement

### Security Tests
- SQL injection attempts
- XSS attempts in input fields
- CSRF protection verification
- Rate limiting enforcement
- Account lockout enforcement
- Token expiry enforcement
- Password complexity enforcement

### Performance Tests
- Login endpoint: < 200ms (p95)
- Token refresh: < 100ms (p95)
- Registration: < 500ms (p95)
- Concurrent logins: 1000 users

---

## Monitoring and Observability

### Metrics to Track
- Login success/failure rate
- Registration rate
- Token refresh rate
- Password reset requests
- Failed login attempts per IP
- Account lockouts
- Email delivery success rate
- API response times

### Alerts
- High failed login rate (> 10% over 5 min)
- High account lockout rate
- Email delivery failures
- API response time > 1s (p95)
- Database connection pool > 80%

### Logging
- All authentication events (login, logout, password change)
- Failed login attempts with IP and user agent
- Token refresh events
- Email sending events
- Rate limit violations
- Account lockout events

---

## Deployment Considerations

### Environment Variables
```bash
# JWT
SECRET_KEY=<random-secret-key>
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASSWORD=<password>
FROM_EMAIL=noreply@example.com

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Docker Services
- Backend (FastAPI)
- Frontend (Next.js)
- PostgreSQL
- Redis
- Celery Worker
- Celery Beat (for periodic tasks)

### CI/CD Pipeline
1. Run linters (ESLint, Black, Ruff)
2. Run type checkers (TypeScript, mypy)
3. Run unit tests
4. Run integration tests
5. Run E2E tests
6. Build Docker images
7. Deploy to staging
8. Run smoke tests
9. Manual approval for production
10. Deploy to production

---

## Risks and Mitigation

### Technical Risks

**Risk**: Email delivery failures
- **Mitigation**: Use reliable service (SendGrid), retry logic, manual verification option

**Risk**: Token theft
- **Mitigation**: httpOnly cookies, short expiry, token rotation, HTTPS only

**Risk**: Brute force attacks
- **Mitigation**: Rate limiting, account lockout, CAPTCHA (future), monitoring

**Risk**: Database performance under load
- **Mitigation**: Proper indexing, connection pooling, Redis caching

### Operational Risks

**Risk**: Redis downtime affects rate limiting
- **Mitigation**: Graceful degradation, fallback to in-memory rate limiting

**Risk**: Celery worker failures affect email sending
- **Mitigation**: Multiple workers, retry logic, monitoring, manual email resend

**Risk**: Token secret key compromise
- **Mitigation**: Rotate keys regularly, invalidate all tokens on rotation, monitoring

---

## Success Metrics

### Functional Metrics
- 100% of functional requirements implemented
- 80%+ test coverage (backend)
- 70%+ test coverage (frontend)
- All E2E tests passing
- Zero critical security vulnerabilities

### Performance Metrics
- Login response time < 200ms (p95)
- Token refresh < 100ms (p95)
- Registration < 500ms (p95)
- 99.9% uptime for auth endpoints

### Security Metrics
- Zero SQL injection vulnerabilities
- Zero XSS vulnerabilities
- Rate limiting enforced (< 1% bypass rate)
- Account lockout working (100% enforcement)
- All passwords hashed with bcrypt

---

## Next Steps

1. **Review and Approval**: Get spec and plan approved by team
2. **Create Tasks**: Break down plan into detailed tasks in `tasks.md`
3. **Set Up Infrastructure**: Configure Redis, Celery, email service
4. **Phase 1 Implementation**: Start with core authentication
5. **Continuous Testing**: Write tests alongside implementation
6. **Security Review**: Conduct security review after Phase 3
7. **Frontend Integration**: Complete UI after backend is stable
8. **Documentation**: Update API docs and README
9. **Deployment**: Deploy to staging and production

---

**Plan Status**: ✅ Ready for Task Breakdown
**Next Step**: Create `tasks.md` with detailed implementation tasks
**Estimated Timeline**: 4 sprints (8-12 weeks)
