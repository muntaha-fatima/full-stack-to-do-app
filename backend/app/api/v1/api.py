"""
API v1 router aggregation.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import analytics, auth, categories, collaboration, health, tasks

api_router = APIRouter()

api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(collaboration.router, prefix="/collaboration", tags=["collaboration"])
api_router.include_router(health.router, tags=["health"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

# Directly include the chat endpoint without a prefix since it has its own path structure
from app.api.v1.endpoints import chat
api_router.include_router(chat.router)

# Include test endpoint for CORS verification
from app.api.v1.endpoints import test_cors
api_router.include_router(test_cors.router, prefix="/test", tags=["test"])
