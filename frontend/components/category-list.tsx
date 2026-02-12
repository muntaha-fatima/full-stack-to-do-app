/**
 * Category list component.
 */

import { Category, CategoryListResponse, CategoryCreate, CategoryUpdate } from '@/types/category';
import { CategoryForm } from './category-form';
import { Button } from './ui/button';
import { Modal } from './modal';
import { useState } from 'react';
import { TrashIcon, PencilIcon } from 'lucide-react';

interface CategoryListProps {
  data: CategoryListResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  onCreate: (categoryData: CategoryCreate) => void;
  onUpdate: (id: number, categoryData: CategoryUpdate) => void;
  onDelete: (id: number) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function CategoryList({
  data,
  isLoading,
  error,
  onCreate,
  onUpdate,
  onDelete,
  isCreating = false,
  isUpdating = false,
  isDeleting = false,
}: CategoryListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreateCategory = (categoryData: CategoryCreate | CategoryUpdate) => {
    // Type guard to ensure it's CategoryCreate
    if ('name' in categoryData && typeof categoryData.name === 'string') {
      onCreate(categoryData as CategoryCreate);
      setIsCreateModalOpen(false);
    }
  };

  const handleUpdateCategory = (categoryData: CategoryCreate | CategoryUpdate) => {
    if (editingCategory && 'name' in categoryData) {
      // Type guard to ensure it's CategoryUpdate
      onUpdate(editingCategory.id, categoryData as CategoryUpdate);
      setEditingCategory(null);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      onDelete(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
        <p className="text-destructive">Error loading categories. Please try again.</p>
      </div>
    );
  }

  if (data && (data.data?.length || 0) === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No categories yet</h3>
        <p className="text-muted-foreground mb-4">Create your first category to get started</p>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create Category
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data?.map((category) => (
          <div 
            key={category.id} 
            className="border rounded-lg p-4 flex justify-between items-center"
            style={{ borderLeft: `4px solid ${category.color}` }}
          >
            <div>
              <h3 className="font-medium">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(category)}
                disabled={isUpdating}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteClick(category.id)}
                disabled={isDeleting}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Category"
        size="md"
      >
        <CategoryForm
          onSubmit={handleCreateCategory}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={isCreating}
        />
      </Modal>

      {/* Edit Category Modal */}
      {editingCategory && (
        <Modal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          title="Edit Category"
          size="md"
        >
          <CategoryForm
            onSubmit={handleUpdateCategory}
            onCancel={() => setEditingCategory(null)}
            isSubmitting={isUpdating}
            defaultValues={editingCategory}
            isUpdate={true}
          />
        </Modal>
      )}
    </div>
  );
}