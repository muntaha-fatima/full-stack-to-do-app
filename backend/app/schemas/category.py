"""
Category schemas for request/response handling.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.category import Category


class CategoryBase(BaseModel):
    """Base schema for category data."""

    name: str = Field(..., min_length=1, max_length=100, description="Category name")
    description: str | None = Field(None, max_length=500, description="Category description")


class CategoryCreate(CategoryBase):
    """Schema for creating a new category."""

    pass


class CategoryUpdate(BaseModel):
    """Schema for updating an existing category."""

    name: str | None = Field(None, min_length=1, max_length=100, description="Category name")
    description: str | None = Field(None, max_length=500, description="Category description")


class CategoryInDB(CategoryBase):
    """Schema for category as stored in database."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime


class CategoryResponse(CategoryInDB):
    """Schema for category API response."""

    pass


class CategoryListResponse(BaseModel):
    """Schema for paginated category list response."""

    data: list[CategoryResponse]
    meta: dict[str, int] = Field(
        ...,
        description="Pagination metadata",
        examples=[{"page": 1, "per_page": 20, "total": 100, "total_pages": 5}],
    )