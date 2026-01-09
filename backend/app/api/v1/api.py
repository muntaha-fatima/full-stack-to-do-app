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
