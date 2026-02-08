/**
 * Category form component.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoryCreate, CategoryUpdate } from '@/types/category';

interface CategoryFormProps {
  onSubmit: (data: CategoryCreate | CategoryUpdate) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CategoryUpdate>;
  isUpdate?: boolean;
}

export function CategoryForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues = {},
  isUpdate = false,
}: CategoryFormProps) {
  const [name, setName] = useState(defaultValues.name || '');
  const [description, setDescription] = useState(defaultValues.description || '');
  const [color, setColor] = useState(defaultValues.color || '#3B82F6'); // Default to blue

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: CategoryCreate | CategoryUpdate = {
      name,
      description: description || null,
      color,
    };

    if (isUpdate) {
      const updateData: CategoryUpdate = {};
      if (name !== (defaultValues.name || '')) updateData.name = name;
      if (description !== (defaultValues.description || '')) updateData.description = description;
      if (color !== (defaultValues.color || '')) updateData.color = color;
      
      onSubmit(updateData);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category description"
          disabled={isSubmitting}
          rows={3}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={isSubmitting}
            className="w-16 h-10 p-1"
          />
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={isSubmitting}
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            isUpdate ? 'Updating...' : 'Creating...'
          ) : (
            isUpdate ? 'Update Category' : 'Create Category'
          )}
        </Button>
      </div>
    </form>
  );
}