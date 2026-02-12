"""
FastAPI Todo App Backend

A production-ready FastAPI application with async SQLAlchemy and PostgreSQL.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.api import api_router
from app.core.config import settings
from app.db.session import engine, init_db


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    await init_db()
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS middleware - Allow specific frontend origins only (required when using credentials)
# Note: Cannot use ["*"] with allow_credentials=True due to browser security restrictions
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Standard Next.js development server
        "http://127.0.0.1:3000",  # Alternative localhost format
        # Add other allowed origins as needed for production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Expose authorization header to frontend
    expose_headers=["Access-Control-Allow-Origin", "Authorization"]
)


# Trusted host middleware (security)
if settings.ENVIRONMENT == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
    )

# Include API router with v1 prefix for all other endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

# For task endpoints, we want them at /api/{user_id}/tasks instead of /api/v1/{user_id}/tasks
# So we'll include the tasks router separately with the desired prefix
from app.api.v1.endpoints.tasks import router as tasks_router
app.include_router(tasks_router, prefix="/api")  # This will make endpoints like /api/{user_id}/tasks


@app.get("/")
async def root() -> dict[str, str]:
    """
    Root endpoint - API information.
    """
    return {
        "message": "Todo App API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs",
    }


@app.get("/health")
async def health_check() -> dict[str, str]:
    """
    Health check endpoint for monitoring and load balancers.
    """
    return {"status": "healthy", "environment": settings.ENVIRONMENT}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception) -> JSONResponse:
    """
    Global exception handler for unhandled exceptions.
    """
    print(f"Global exception handler triggered: {exc}")
    import traceback
    traceback.print_exc()
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
                "details": str(exc) if settings.ENVIRONMENT == "development" else None,
            }
        },
    )


# Specific handler for HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException) -> JSONResponse:
    print(f"HTTP Exception Handler triggered: {exc.status_code} - {exc.detail}")
    import traceback
    traceback.print_exc()
    
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
