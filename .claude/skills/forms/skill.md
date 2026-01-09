# Form Handling & Validation Skill

## Description
Expert in building robust forms with validation, error handling, and user experience best practices using React Hook Form, Zod, and Pydantic.

## Capabilities

### Frontend Form Handling
- **React Hook Form**: Performant form library with minimal re-renders
- **Validation**: Client-side validation with Zod
- **Error Handling**: Field-level and form-level errors
- **Form State**: Dirty, touched, submitted states
- **Field Arrays**: Dynamic form fields
- **File Uploads**: File input handling
- **Multi-step Forms**: Wizard-style forms
- **Form Reset**: Clear and reset functionality

### Backend Validation
- **Pydantic**: Type-safe request validation
- **Custom Validators**: Domain-specific validation rules
- **Error Messages**: Clear, actionable error messages
- **Nested Validation**: Complex object validation
- **Conditional Validation**: Context-dependent rules
- **Sanitization**: Input cleaning and normalization

### Form Patterns
- **Controlled Components**: React controlled inputs
- **Uncontrolled Components**: Ref-based inputs
- **Debounced Validation**: Async validation with debouncing
- **Optimistic Updates**: Instant UI feedback
- **Auto-save**: Periodic form saving
- **Confirmation Dialogs**: Unsaved changes warnings

## Usage Examples

### React Hook Form with Zod

```typescript
// schemas/taskSchema.ts
import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select a priority' })
  }),
  dueDate: z.string()
    .datetime('Invalid date format')
    .optional(),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
  assigneeId: z.number().int().positive().optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>

// components/TaskForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, TaskFormData } from '@/schemas/taskSchema'

export function TaskForm({ onSubmit, defaultValues }: {
  onSubmit: (data: TaskFormData) => Promise<void>
  defaultValues?: Partial<TaskFormData>
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues || {
      priority: 'medium',
      tags: [],
    },
  })

  const onSubmitHandler = async (data: TaskFormData) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title *
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter task description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium mb-2">
          Priority *
        </label>
        <select
          id="priority"
          {...register('priority')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.priority && (
          <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
          Due Date
        </label>
        <input
          id="dueDate"
          type="datetime-local"
          {...register('dueDate')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Task'}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          disabled={!isDirty}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </form>
  )
}
```

### Dynamic Field Arrays

```typescript
import { useFieldArray } from 'react-hook-form'

const checklistSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.object({
    text: z.string().min(1, 'Item text is required'),
    completed: z.boolean(),
  })).min(1, 'At least one item is required'),
})

type ChecklistFormData = z.infer<typeof checklistSchema>

export function ChecklistForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      items: [{ text: '', completed: false }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Checklist title" />

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`items.${index}.text`)}
              placeholder="Item text"
              className="flex-1"
            />
            <input
              type="checkbox"
              {...register(`items.${index}.completed`)}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        {errors.items && (
          <p className="text-red-600">{errors.items.message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => append({ text: '', completed: false })}
        className="mt-2 text-blue-600"
      >
        Add Item
      </button>

      <button type="submit" className="mt-4">Submit</button>
    </form>
  )
}
```

### File Upload Form

```typescript
const fileUploadSchema = z.object({
  title: z.string().min(1),
  file: z.instanceof(FileList)
    .refine((files) => files.length > 0, 'File is required')
    .refine((files) => files[0]?.size <= 5000000, 'Max file size is 5MB')
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type),
      'Only .jpg, .png, and .webp formats are supported'
    ),
})

type FileUploadFormData = z.infer<typeof fileUploadSchema>

export function FileUploadForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FileUploadFormData>({
    resolver: zodResolver(fileUploadSchema),
  })

  const fileList = watch('file')
  const file = fileList?.[0]

  const onSubmit = async (data: FileUploadFormData) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('file', data.file[0])

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('Upload failed')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Title</label>
        <input {...register('title')} />
        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label>File</label>
        <input type="file" {...register('file')} accept="image/*" />
        {errors.file && <p className="text-red-600">{errors.file.message}</p>}

        {file && (
          <div className="mt-2">
            <p>Selected: {file.name}</p>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="mt-2 max-w-xs"
            />
          </div>
        )}
      </div>

      <button type="submit">Upload</button>
    </form>
  )
}
```

### Multi-Step Form

```typescript
import { useState } from 'react'

const step1Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const step2Schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

const step3Schema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

export function MultiStepForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({})

  const handleStep1Submit = (data: Step1Data) => {
    setFormData({ ...formData, ...data })
    setStep(2)
  }

  const handleStep2Submit = (data: Step2Data) => {
    setFormData({ ...formData, ...data })
    setStep(3)
  }

  const handleStep3Submit = async (data: Step3Data) => {
    const finalData = { ...formData, ...data }
    await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(finalData),
    })
  }

  return (
    <div>
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {step === 1 && <Step1Form onSubmit={handleStep1Submit} defaultValues={formData} />}
      {step === 2 && <Step2Form onSubmit={handleStep2Submit} defaultValues={formData} onBack={() => setStep(1)} />}
      {step === 3 && <Step3Form onSubmit={handleStep3Submit} defaultValues={formData} onBack={() => setStep(2)} />}
    </div>
  )
}
```

### Backend Validation with Pydantic

```python
# app/schemas/task.py
from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime
from typing import Optional, List
from enum import Enum

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Priority = Priority.MEDIUM
    due_date: Optional[datetime] = None
    tags: List[str] = Field(default_factory=list, max_length=5)
    assignee_id: Optional[int] = None

    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace')
        return v.strip()

    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v: List[str]) -> List[str]:
        if len(v) > 5:
            raise ValueError('Maximum 5 tags allowed')
        # Remove duplicates and empty strings
        return list(set(tag.strip() for tag in v if tag.strip()))

    @field_validator('due_date')
    @classmethod
    def due_date_must_be_future(cls, v: Optional[datetime]) -> Optional[datetime]:
        if v and v < datetime.now():
            raise ValueError('Due date must be in the future')
        return v

    @model_validator(mode='after')
    def validate_high_priority_has_due_date(self):
        if self.priority == Priority.HIGH and not self.due_date:
            raise ValueError('High priority tasks must have a due date')
        return self

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    tags: Optional[List[str]] = None
    assignee_id: Optional[int] = None
    completed: Optional[bool] = None

    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError('Title cannot be empty or whitespace')
        return v.strip() if v else None

# Custom validators
from pydantic import EmailStr

class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_-]+$')
    password: str = Field(..., min_length=8)
    confirm_password: str

    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

    @model_validator(mode='after')
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')
        return self
```

### Async Validation

```typescript
// Async validation with debouncing
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'

const usernameSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
})

export function UsernameForm() {
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)

  const { register, formState: { errors }, watch } = useForm({
    resolver: zodResolver(usernameSchema),
  })

  const username = watch('username')

  const checkUsername = useDebouncedCallback(async (value: string) => {
    if (!value || value.length < 3) return

    setChecking(true)
    try {
      const response = await fetch(`/api/check-username?username=${value}`)
      const data = await response.json()
      setUsernameAvailable(data.available)
    } catch (error) {
      console.error('Error checking username:', error)
    } finally {
      setChecking(false)
    }
  }, 500)

  return (
    <div>
      <label>Username</label>
      <input
        {...register('username', {
          onChange: (e) => checkUsername(e.target.value),
        })}
        placeholder="Enter username"
      />

      {errors.username && (
        <p className="text-red-600">{errors.username.message}</p>
      )}

      {checking && <p className="text-gray-500">Checking availability...</p>}

      {!checking && usernameAvailable === true && (
        <p className="text-green-600">✓ Username is available</p>
      )}

      {!checking && usernameAvailable === false && (
        <p className="text-red-600">✗ Username is already taken</p>
      )}
    </div>
  )
}
```

### Form with Unsaved Changes Warning

```typescript
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export function FormWithWarning() {
  const { register, handleSubmit, formState: { isDirty } } = useForm()

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      {isDirty && (
        <div className="bg-yellow-100 p-4 rounded">
          You have unsaved changes
        </div>
      )}
    </form>
  )
}
```

## Best Practices

1. **Client-Side Validation**: Validate early for better UX
2. **Server-Side Validation**: Always validate on server
3. **Clear Error Messages**: Actionable, user-friendly messages
4. **Accessible Forms**: Proper labels, ARIA attributes
5. **Loading States**: Show feedback during submission
6. **Disable on Submit**: Prevent double submissions
7. **Reset After Success**: Clear form after successful submission
8. **Preserve Data**: Don't lose data on errors
9. **Debounce Async**: Debounce async validation
10. **Type Safety**: Use TypeScript and Zod/Pydantic

## Form Validation Checklist

- [ ] Client-side validation with Zod
- [ ] Server-side validation with Pydantic
- [ ] Clear error messages
- [ ] Field-level errors displayed
- [ ] Form-level errors displayed
- [ ] Loading states during submission
- [ ] Disable submit button when invalid
- [ ] Reset functionality
- [ ] Unsaved changes warning
- [ ] Accessible form labels
- [ ] Keyboard navigation support
- [ ] Mobile-friendly inputs

## Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Form Accessibility](https://www.w3.org/WAI/tutorials/forms/)
