/**
 * Categories page - Manage task categories.
 */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/categories';
import { CategoryList } from '@/components/category-list';
import ProtectedRoute from '@/components/protected-route';
import type { Category, CategoryCreate, CategoryUpdate, CategoryListResponse } from '@/types/category';

export default function CategoriesPage() {
  const queryClient = useQueryClient();

  // Fetch categories
  const { data, isLoading, error } = useQuery<CategoryListResponse>({
    queryKey: ['categories'],
    queryFn: () => getCategories(1, 50), // Get first 50 categories
  });

  // Create category mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: createCategory,
    onMutate: async (newCategory) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['categories'] });

      // Snapshot previous value
      const previousCategories = queryClient.getQueryData<CategoryListResponse>(['categories']);

      // Optimistically update
      queryClient.setQueryData<CategoryListResponse>(['categories'], (old) => {
        if (!old) return { data: [], meta: { total: 0 } };
        const optimisticCategory: Category = {
          id: Date.now(), // Temporary ID
          name: newCategory.name,
          description: newCategory.description || null,
          color: newCategory.color || '#3B82F6',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          owner_id: 1, // Will be updated when server responds
        };
        return {
          ...old,
          data: [...old.data, optimisticCategory],
          meta: { ...old.meta, total: (old.meta?.total || 0) + 1 },
        };
      });

      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
    onError: (_error, _newCategory, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories'], context.previousCategories);
      }
      toast.error('Failed to create category. Please try again.');
    },
  });

  // Update category mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) =>
      updateCategory(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });

      const previousCategories = queryClient.getQueryData<CategoryListResponse>(['categories']);

      queryClient.setQueryData<CategoryListResponse>(['categories'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((category: Category) =>
            category.id === id ? { ...category, ...data, updated_at: new Date().toISOString() } : category
          ),
        };
      });

      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully!');
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories'], context.previousCategories);
      }
      toast.error('Failed to update category. Please try again.');
    },
  });

  // Delete category mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });

      const previousCategories = queryClient.getQueryData<CategoryListResponse>(['categories']);

      queryClient.setQueryData<CategoryListResponse>(['categories'], (old) => {
        if (!old) return { data: [], meta: { total: 0 } };
        return {
          ...old,
          data: old.data.filter((category: Category) => category.id !== id),
          meta: { ...old.meta, total: Math.max(0, (old.meta?.total || 0) - 1) },
        };
      });

      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully!');
    },
    onError: (_error, _id, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories'], context.previousCategories);
      }
      toast.error('Failed to delete category. Please try again.');
    },
  });

  const handleCreateCategory = (categoryData: CategoryCreate) => {
    createMutation.mutate(categoryData);
  };

  const handleUpdateCategory = (id: number, data: CategoryUpdate) => {
    updateMutation.mutate({ id, data });
  };

  const handleDeleteCategory = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <main className="lg:pl-64">
          <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Categories</h1>
              <p className="text-muted-foreground">
                Organize your tasks with custom categories
              </p>
            </div>

            {/* Category List */}
            <CategoryList
              data={data}
              isLoading={isLoading}
              error={error as Error | null}
              onCreate={handleCreateCategory}
              onUpdate={handleUpdateCategory}
              onDelete={handleDeleteCategory}
              isCreating={createMutation.isPending}
              isUpdating={updateMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}