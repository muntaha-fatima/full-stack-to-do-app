# Error Handling & Logging Skill

## Description
Expert in implementing robust error handling, structured logging, error tracking, and monitoring for production applications.

## Capabilities

### Error Handling
- **Exception Handling**: Try-catch patterns and error boundaries
- **Custom Exceptions**: Domain-specific error types
- **Error Responses**: Standardized error formats
- **Validation Errors**: Input validation and error messages
- **Graceful Degradation**: Fallback strategies
- **Error Recovery**: Retry logic and circuit breakers

### Logging
- **Structured Logging**: JSON-formatted logs
- **Log Levels**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Contextual Logging**: Request IDs and correlation
- **Log Aggregation**: Centralized log management
- **Performance Logging**: Request timing and metrics
- **Security Logging**: Audit trails and security events

### Error Tracking
- **Sentry Integration**: Real-time error tracking
- **Error Grouping**: Automatic error categorization
- **Stack Traces**: Detailed error context
- **User Context**: User information with errors
- **Release Tracking**: Error tracking by version
- **Alerts**: Notification on critical errors

### Monitoring
- **Application Metrics**: Performance monitoring
- **Health Checks**: Service availability
- **Uptime Monitoring**: Service reliability
- **Performance Metrics**: Response times, throughput
- **Resource Usage**: CPU, memory, disk usage
- **Custom Metrics**: Business-specific metrics

## Usage Examples

### Python Logging Setup

```python
# app/logging_config.py
import logging
import sys
from datetime import datetime
from typing import Any
import json
from pythonjsonlogger import jsonlogger

class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter with additional fields"""

    def add_fields(self, log_record: dict, record: logging.LogRecord, message_dict: dict):
        super().add_fields(log_record, record, message_dict)

        # Add timestamp
        log_record['timestamp'] = datetime.utcnow().isoformat()

        # Add log level
        log_record['level'] = record.levelname

        # Add logger name
        log_record['logger'] = record.name

        # Add file and line number
        log_record['file'] = record.pathname
        log_record['line'] = record.lineno

        # Add function name
        log_record['function'] = record.funcName

def setup_logging(log_level: str = "INFO", json_logs: bool = True):
    """Configure application logging"""

    # Create logger
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, log_level.upper()))

    # Remove existing handlers
    logger.handlers = []

    # Create console handler
    handler = logging.StreamHandler(sys.stdout)

    if json_logs:
        # Use JSON formatter for production
        formatter = CustomJsonFormatter(
            '%(timestamp)s %(level)s %(name)s %(message)s'
        )
    else:
        # Use standard formatter for development
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )

    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger

# Initialize logger
logger = setup_logging(
    log_level="INFO",
    json_logs=True  # Set to False for development
)
```

### Request Logging Middleware

```python
# app/middleware/logging.py
import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all requests and responses"""

    async def dispatch(self, request: Request, call_next):
        # Generate request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        # Log request
        logger.info(
            "Request started",
            extra={
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url),
                "client_ip": request.client.host,
                "user_agent": request.headers.get("user-agent"),
            }
        )

        # Process request
        start_time = time.time()
        try:
            response = await call_next(request)
            process_time = time.time() - start_time

            # Log response
            logger.info(
                "Request completed",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "url": str(request.url),
                    "status_code": response.status_code,
                    "process_time": round(process_time * 1000, 2),  # ms
                }
            )

            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id

            return response

        except Exception as e:
            process_time = time.time() - start_time

            # Log error
            logger.error(
                "Request failed",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "url": str(request.url),
                    "error": str(e),
                    "error_type": type(e).__name__,
                    "process_time": round(process_time * 1000, 2),
                },
                exc_info=True
            )

            raise

# Add to FastAPI app
app.add_middleware(RequestLoggingMiddleware)
```

### Custom Exception Classes

```python
# app/exceptions.py
from fastapi import HTTPException, status
from typing import Any, Optional

class AppException(Exception):
    """Base exception for application errors"""

    def __init__(
        self,
        message: str,
        code: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[dict] = None
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

class ValidationException(AppException):
    """Validation error exception"""

    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details
        )

class NotFoundException(AppException):
    """Resource not found exception"""

    def __init__(self, resource: str, identifier: Any):
        super().__init__(
            message=f"{resource} not found",
            code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"resource": resource, "identifier": str(identifier)}
        )

class UnauthorizedException(AppException):
    """Authentication required exception"""

    def __init__(self, message: str = "Authentication required"):
        super().__init__(
            message=message,
            code="UNAUTHORIZED",
            status_code=status.HTTP_401_UNAUTHORIZED
        )

class ForbiddenException(AppException):
    """Permission denied exception"""

    def __init__(self, message: str = "Permission denied"):
        super().__init__(
            message=message,
            code="FORBIDDEN",
            status_code=status.HTTP_403_FORBIDDEN
        )

class ConflictException(AppException):
    """Resource conflict exception"""

    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(
            message=message,
            code="CONFLICT",
            status_code=status.HTTP_409_CONFLICT,
            details=details
        )

class DatabaseException(AppException):
    """Database operation error"""

    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(
            message=message,
            code="DATABASE_ERROR",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details
        )

class ExternalServiceException(AppException):
    """External service error"""

    def __init__(self, service: str, message: str):
        super().__init__(
            message=f"{service} service error: {message}",
            code="EXTERNAL_SERVICE_ERROR",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details={"service": service}
        )
```

### Exception Handlers

```python
# app/exception_handlers.py
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import logging
from datetime import datetime
from app.exceptions import AppException

logger = logging.getLogger(__name__)

async def app_exception_handler(request: Request, exc: AppException):
    """Handle custom application exceptions"""
    logger.error(
        f"Application error: {exc.message}",
        extra={
            "request_id": getattr(request.state, "request_id", None),
            "error_code": exc.code,
            "details": exc.details,
        },
        exc_info=True
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.code,
            "message": exc.message,
            "details": exc.details,
            "timestamp": datetime.utcnow().isoformat(),
            "path": request.url.path,
            "request_id": getattr(request.state, "request_id", None),
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })

    logger.warning(
        "Validation error",
        extra={
            "request_id": getattr(request.state, "request_id", None),
            "errors": errors,
        }
    )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "VALIDATION_ERROR",
            "message": "Request validation failed",
            "details": {"errors": errors},
            "timestamp": datetime.utcnow().isoformat(),
            "path": request.url.path,
            "request_id": getattr(request.state, "request_id", None),
        }
    )

async def database_exception_handler(request: Request, exc: SQLAlchemyError):
    """Handle database errors"""
    logger.error(
        "Database error",
        extra={
            "request_id": getattr(request.state, "request_id", None),
            "error": str(exc),
        },
        exc_info=True
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "DATABASE_ERROR",
            "message": "A database error occurred",
            "timestamp": datetime.utcnow().isoformat(),
            "path": request.url.path,
            "request_id": getattr(request.state, "request_id", None),
        }
    )

async def generic_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors"""
    logger.critical(
        "Unexpected error",
        extra={
            "request_id": getattr(request.state, "request_id", None),
            "error": str(exc),
            "error_type": type(exc).__name__,
        },
        exc_info=True
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred",
            "timestamp": datetime.utcnow().isoformat(),
            "path": request.url.path,
            "request_id": getattr(request.state, "request_id", None),
        }
    )

# Register exception handlers
from app.main import app

app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, database_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)
```

### Sentry Integration

```python
# app/sentry_config.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from app.config import settings

def init_sentry():
    """Initialize Sentry error tracking"""
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.ENVIRONMENT,
            release=settings.VERSION,
            traces_sample_rate=0.1,  # 10% of transactions
            profiles_sample_rate=0.1,  # 10% of transactions
            integrations=[
                FastApiIntegration(),
                SqlalchemyIntegration(),
            ],
            before_send=before_send_handler,
        )

def before_send_handler(event, hint):
    """Filter and modify events before sending to Sentry"""
    # Don't send validation errors
    if event.get("exception"):
        exc_type = event["exception"]["values"][0]["type"]
        if exc_type == "ValidationException":
            return None

    # Add custom context
    event.setdefault("tags", {})
    event["tags"]["environment"] = settings.ENVIRONMENT

    return event

# Usage in routes
from sentry_sdk import capture_exception, capture_message

try:
    # Some operation
    pass
except Exception as e:
    capture_exception(e)
    raise

# Capture custom messages
capture_message("Important event occurred", level="info")
```

### Frontend Error Handling - React

```typescript
// lib/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
    }))

    throw new ApiError(
      error.message,
      response.status,
      error.error,
      error.details
    )
  }

  return response.json()
}

// components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import * as Sentry from '@sentry/nextjs'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
    Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
              <p className="text-gray-600 mb-4">
                We're sorry for the inconvenience. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

// hooks/useErrorHandler.ts
import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { ApiError } from '@/lib/errors'

export function useErrorHandler() {
  const handleError = useCallback((error: unknown) => {
    console.error('Error:', error)

    if (error instanceof ApiError) {
      // Handle API errors
      switch (error.statusCode) {
        case 401:
          toast.error('Please log in to continue')
          // Redirect to login
          window.location.href = '/login'
          break
        case 403:
          toast.error('You do not have permission to perform this action')
          break
        case 404:
          toast.error('Resource not found')
          break
        case 422:
          toast.error('Please check your input and try again')
          break
        case 500:
          toast.error('Server error. Please try again later')
          break
        default:
          toast.error(error.message || 'An error occurred')
      }
    } else if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
  }, [])

  return { handleError }
}
```

### Logging Best Practices

```python
# Good logging examples

# 1. Structured logging with context
logger.info(
    "User logged in",
    extra={
        "user_id": user.id,
        "email": user.email,
        "ip_address": request.client.host,
    }
)

# 2. Performance logging
start_time = time.time()
result = await expensive_operation()
duration = time.time() - start_time

logger.info(
    "Operation completed",
    extra={
        "operation": "expensive_operation",
        "duration_ms": round(duration * 1000, 2),
        "result_count": len(result),
    }
)

# 3. Error logging with context
try:
    await process_payment(order_id)
except PaymentException as e:
    logger.error(
        "Payment processing failed",
        extra={
            "order_id": order_id,
            "error_code": e.code,
            "amount": order.total,
        },
        exc_info=True
    )
    raise

# 4. Security logging
logger.warning(
    "Failed login attempt",
    extra={
        "email": email,
        "ip_address": request.client.host,
        "user_agent": request.headers.get("user-agent"),
    }
)

# 5. Business event logging
logger.info(
    "Order placed",
    extra={
        "order_id": order.id,
        "user_id": user.id,
        "total_amount": order.total,
        "item_count": len(order.items),
    }
)
```

## Best Practices

1. **Use Structured Logging**: JSON format for easy parsing
2. **Include Context**: Request IDs, user IDs, timestamps
3. **Appropriate Log Levels**: Use correct severity levels
4. **Don't Log Secrets**: Never log passwords or tokens
5. **Error Tracking**: Use Sentry or similar service
6. **Correlation IDs**: Track requests across services
7. **Performance Logging**: Log slow operations
8. **Security Events**: Log authentication and authorization
9. **Graceful Degradation**: Handle errors without crashing
10. **User-Friendly Messages**: Don't expose internal errors

## Error Handling Checklist

- [ ] Custom exception classes defined
- [ ] Exception handlers registered
- [ ] Validation errors handled
- [ ] Database errors handled
- [ ] External service errors handled
- [ ] Error responses standardized
- [ ] Logging configured
- [ ] Sentry integrated
- [ ] Error boundaries in frontend
- [ ] User-friendly error messages
- [ ] Request IDs tracked
- [ ] Security events logged
- [ ] Performance metrics logged

## Resources

- [Python Logging Documentation](https://docs.python.org/3/library/logging.html)
- [Sentry Documentation](https://docs.sentry.io/)
- [FastAPI Error Handling](https://fastapi.tiangolo.com/tutorial/handling-errors/)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
