"""
Category API endpoints.
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryListResponse, CategoryResponse, CategoryUpdate

router = APIRouter()


@router.get("/", response_model=CategoryListResponse)
async def list_categories(
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Retrieve a paginated list of categories for the current user.

    Args:
        current_user: Authenticated user
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        db: Database session

    Returns:
        Paginated list of categories with metadata
    """
    # Build query
    query = select(Category).where(Category.owner_id == current_user.id)

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination and ordering
    query = query.order_by(Category.name.asc()).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    categories = result.scalars().all()

    # Calculate pagination metadata
    total_pages = (total + limit - 1) // limit if total > 0 else 0
    current_page = (skip // limit) + 1 if limit > 0 else 1

    return {
        "data": categories,
        "meta": {
            "page": current_page,
            "per_page": limit,
            "total": total,
            "total_pages": total_pages,
        },
    }


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_in: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create a new category for the current user.

    Args:
        category_in: Category creation data
        current_user: Authenticated user
        db: Database session

    Returns:
        Created category
    """
    # Check if category with same name already exists for this user
    result = await db.execute(
        select(Category).where(
            Category.name == category_in.name,
            Category.owner_id == current_user.id
        )
    )
    existing_category = result.scalar_one_or_none()
    
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists",
        )

    category = Category(**category_in.model_dump(), owner_id=current_user.id)
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get a specific category by ID for the current user.

    Args:
        category_id: Category ID
        current_user: Authenticated user
        db: Database session

    Returns:
        Category details

    Raises:
        HTTPException: If category not found or not owned by user
    """
    result = await db.execute(
        select(Category).where(
            Category.id == category_id,
            Category.owner_id == current_user.id
        )
    )
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found or not owned by user",
        )

    return category


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Update a category for the current user.

    Args:
        category_id: Category ID
        category_in: Category update data (only provided fields will be updated)
        current_user: Authenticated user
        db: Database session

    Returns:
        Updated category

    Raises:
        HTTPException: If category not found or not owned by user
    """
    result = await db.execute(
        select(Category).where(
            Category.id == category_id,
            Category.owner_id == current_user.id
        )
    )
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found or not owned by user",
        )

    # Update only provided fields
    update_data = category_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)

    await db.commit()
    await db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a category for the current user.

    Args:
        category_id: Category ID
        current_user: Authenticated user
        db: Database session

    Raises:
        HTTPException: If category not found or not owned by user
    """
    result = await db.execute(
        select(Category).where(
            Category.id == category_id,
            Category.owner_id == current_user.id
        )
    )
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found or not owned by user",
        )

    await db.delete(category)
    await db.commit()