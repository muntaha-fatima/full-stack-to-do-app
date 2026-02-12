/**
 * Category API functions.
 */

import { CategoryCreate, CategoryUpdate, CategoryListResponse, CategoryResponse } from '@/types/category';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shazsabir-to-do-backend.hf.space';

/**
 * Get all categories for the current user
 */
export async function getCategories(
  page: number = 1,
  limit: number = 20
): Promise<CategoryListResponse> {
  const response = await fetch(
    `${API_URL}/api/v1/categories?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to fetch categories: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a new category
 */
export async function createCategory(
  categoryData: CategoryCreate
): Promise<CategoryResponse> {
  const response = await fetch(`${API_URL}/api/v1/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to create category: ${response.status}`);
  }

  return response.json();
}

/**
 * Update a category
 */
export async function updateCategory(
  id: number,
  categoryData: CategoryUpdate
): Promise<CategoryResponse> {
  const response = await fetch(`${API_URL}/api/v1/categories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to update category: ${response.status}`);
  }

  return response.json();
}

/**
 * Delete a category
 */
export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to delete category: ${response.status}`);
  }
}