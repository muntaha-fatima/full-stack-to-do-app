/**
 * Category type definitions.
 */

export interface Category {
  id: number;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
  owner_id: number;
}

export interface CategoryCreate {
  name: string;
  description?: string | null;
  color?: string;
}

export interface CategoryUpdate {
  name?: string;
  description?: string | null;
  color?: string;
}

export interface CategoryListResponse {
  data: Category[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
  owner_id: number;
}