# Authentication & Security Skill

## Description
Expert in implementing secure authentication and authorization systems, including JWT tokens, OAuth2, password hashing, and security best practices.

## Capabilities

### Authentication Methods
- **JWT (JSON Web Tokens)**: Stateless token-based authentication
- **OAuth2**: Third-party authentication (Google, GitHub, etc.)
- **Session-Based**: Server-side session management
- **API Keys**: Service-to-service authentication
- **Multi-Factor Authentication**: 2FA/MFA implementation
- **Passwordless**: Magic links and OTP authentication

### Authorization
- **Role-Based Access Control (RBAC)**: User roles and permissions
- **Attribute-Based Access Control (ABAC)**: Fine-grained permissions
- **Resource-Based**: Ownership and access rules
- **Scope-Based**: OAuth2 scopes
- **Policy-Based**: Complex authorization rules

### Security Best Practices
- **Password Hashing**: bcrypt, Argon2, PBKDF2
- **HTTPS/TLS**: Encrypted communication
- **CORS**: Cross-origin resource sharing
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Prevention**: Cross-site scripting protection
- **SQL Injection**: Parameterized queries
- **Rate Limiting**: Brute force protection
- **Input Validation**: Sanitization and validation

### Token Management
- **Access Tokens**: Short-lived authentication tokens
- **Refresh Tokens**: Long-lived token renewal
- **Token Rotation**: Security through rotation
- **Token Revocation**: Blacklisting and invalidation
- **Token Storage**: Secure client-side storage

## Usage Examples

### JWT Authentication - FastAPI

```python
# app/auth/jwt.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.database import get_db
from app.models.user import User

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Create a JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.REFRESH_SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Ensure user is active"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
```

### Authentication Routes

```python
# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.auth.jwt import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    get_current_user
)
from app.schemas.auth import (
    UserRegister,
    UserResponse,
    Token,
    TokenRefresh
)
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user"""
    # Check if user exists
    result = await db.execute(
        select(User).where(User.email == user_data.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    return db_user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Login and get access token"""
    # Find user
    result = await db.execute(
        select(User).where(User.email == form_data.username)
    )
    user = result.scalar_one_or_none()

    # Verify credentials
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    # Create tokens
    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_data: TokenRefresh,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token"""
    try:
        payload = jwt.decode(
            token_data.refresh_token,
            settings.REFRESH_SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: int = payload.get("sub")
        token_type: str = payload.get("type")

        if token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    # Create new tokens
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout (client should discard tokens)"""
    # In a production app, you might want to blacklist the token
    return {"message": "Successfully logged out"}
```

### Role-Based Access Control

```python
# app/auth/permissions.py
from enum import Enum
from fastapi import Depends, HTTPException, status
from app.auth.jwt import get_current_user
from app.models.user import User

class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

class Permission(str, Enum):
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    ADMIN = "admin"

# Role permissions mapping
ROLE_PERMISSIONS = {
    Role.ADMIN: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.ADMIN],
    Role.USER: [Permission.READ, Permission.WRITE],
    Role.GUEST: [Permission.READ],
}

def require_role(*allowed_roles: Role):
    """Dependency to require specific roles"""
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {current_user.role} not authorized"
            )
        return current_user
    return role_checker

def require_permission(*required_permissions: Permission):
    """Dependency to require specific permissions"""
    async def permission_checker(current_user: User = Depends(get_current_user)):
        user_permissions = ROLE_PERMISSIONS.get(current_user.role, [])

        for permission in required_permissions:
            if permission not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission {permission} required"
                )
        return current_user
    return permission_checker

# Usage in routes
@router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: int,
    current_user: User = Depends(require_permission(Permission.DELETE))
):
    """Only users with DELETE permission can access"""
    pass

@router.get("/admin/users")
async def list_all_users(
    current_user: User = Depends(require_role(Role.ADMIN))
):
    """Only admins can access"""
    pass
```

### Frontend Authentication - Next.js

```typescript
// lib/auth.ts
import { jwtDecode } from 'jwt-decode'

interface TokenPayload {
  sub: number
  exp: number
  iat: number
}

export class AuthService {
  private static ACCESS_TOKEN_KEY = 'access_token'
  private static REFRESH_TOKEN_KEY = 'refresh_token'

  static setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  static clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<TokenPayload>(token)
      return decoded.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        this.clearTokens()
        return null
      }

      const data = await response.json()
      this.setTokens(data.access_token, data.refresh_token)
      return data.access_token
    } catch {
      this.clearTokens()
      return null
    }
  }

  static async getValidAccessToken(): Promise<string | null> {
    let accessToken = this.getAccessToken()

    if (!accessToken) return null

    if (this.isTokenExpired(accessToken)) {
      accessToken = await this.refreshAccessToken()
    }

    return accessToken
  }
}

// API client with auth
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await AuthService.getValidAccessToken()

  if (!token) {
    throw new Error('Not authenticated')
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  const response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    // Token invalid, try to refresh
    const newToken = await AuthService.refreshAccessToken()
    if (newToken) {
      // Retry with new token
      headers.Authorization = `Bearer ${newToken}`
      return fetch(url, { ...options, headers })
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login'
      throw new Error('Authentication failed')
    }
  }

  return response
}
```

### Auth Context Provider

```typescript
// contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthService } from '@/lib/auth'

interface User {
  id: number
  email: string
  username: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      const token = await AuthService.getValidAccessToken()
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          }
        } catch (error) {
          console.error('Auth check failed:', error)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    AuthService.setTokens(data.access_token, data.refresh_token)

    // Fetch user data
    const userResponse = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    })
    const userData = await userResponse.json()
    setUser(userData)
  }

  const logout = () => {
    AuthService.clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### Protected Route Component

```typescript
// components/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

// Usage
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
```

## Security Best Practices

1. **Never Store Passwords in Plain Text**: Always hash with bcrypt or Argon2
2. **Use HTTPS**: Encrypt all communication
3. **Secure Token Storage**: HttpOnly cookies or secure localStorage
4. **Short-Lived Access Tokens**: 15-30 minutes expiration
5. **Refresh Token Rotation**: Issue new refresh token on each use
6. **Rate Limiting**: Prevent brute force attacks
7. **Input Validation**: Validate and sanitize all inputs
8. **CORS Configuration**: Restrict allowed origins
9. **CSRF Protection**: Use CSRF tokens for state-changing operations
10. **Security Headers**: Set appropriate security headers

## Security Checklist

- [ ] Passwords hashed with bcrypt/Argon2
- [ ] JWT tokens with expiration
- [ ] Refresh token rotation
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Security headers set
- [ ] Secrets in environment variables
- [ ] Token blacklisting for logout
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT.io](https://jwt.io/)
- [OAuth 2.0](https://oauth.net/2/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
