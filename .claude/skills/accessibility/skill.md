# Accessibility (a11y) Skill

## Description
Expert in building accessible web applications following WCAG guidelines, ensuring applications are usable by everyone including people with disabilities.

## Capabilities

### WCAG Compliance
- **WCAG 2.1 Guidelines**: Level A, AA, AAA compliance
- **Semantic HTML**: Proper HTML structure and elements
- **ARIA Attributes**: Accessible Rich Internet Applications
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Compatible with assistive technologies
- **Color Contrast**: Sufficient contrast ratios
- **Focus Management**: Visible focus indicators

### Accessibility Features
- **Alt Text**: Descriptive image alternatives
- **Form Labels**: Proper form labeling
- **Headings**: Logical heading hierarchy
- **Skip Links**: Navigation shortcuts
- **Live Regions**: Dynamic content announcements
- **Error Messages**: Clear, accessible errors
- **Responsive Text**: Scalable text sizes

### Testing & Tools
- **Automated Testing**: axe, Lighthouse, WAVE
- **Manual Testing**: Keyboard and screen reader testing
- **Browser Extensions**: Accessibility DevTools
- **Color Contrast Checkers**: Contrast ratio validation
- **Screen Readers**: NVDA, JAWS, VoiceOver

## Usage Examples

### Semantic HTML Structure

```tsx
// Good: Semantic HTML
export function ArticlePage() {
  return (
    <article>
      <header>
        <h1>Article Title</h1>
        <p>Published on <time dateTime="2024-01-07">January 7, 2024</time></p>
      </header>

      <nav aria-label="Table of contents">
        <h2>Contents</h2>
        <ul>
          <li><a href="#section1">Section 1</a></li>
          <li><a href="#section2">Section 2</a></li>
        </ul>
      </nav>

      <main>
        <section id="section1">
          <h2>Section 1</h2>
          <p>Content here...</p>
        </section>

        <section id="section2">
          <h2>Section 2</h2>
          <p>More content...</p>
        </section>
      </main>

      <footer>
        <p>Author: John Doe</p>
      </footer>
    </article>
  )
}

// Bad: Non-semantic HTML
export function BadArticlePage() {
  return (
    <div>
      <div>
        <div className="title">Article Title</div>
        <div>Published on January 7, 2024</div>
      </div>
      <div>Content here...</div>
    </div>
  )
}
```

### Accessible Forms

```tsx
export function AccessibleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Text input with proper labeling */}
      <div>
        <label htmlFor="email" className="block mb-2">
          Email Address <span aria-label="required">*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Radio buttons with fieldset */}
      <fieldset>
        <legend className="font-medium mb-2">
          Preferred Contact Method <span aria-label="required">*</span>
        </legend>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="contact"
              value="email"
              required
              aria-required="true"
            />
            <span className="ml-2">Email</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="contact"
              value="phone"
              required
              aria-required="true"
            />
            <span className="ml-2">Phone</span>
          </label>
        </div>
      </fieldset>

      {/* Checkbox with description */}
      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            name="terms"
            required
            aria-required="true"
            aria-describedby="terms-description"
          />
          <span className="ml-2">
            I agree to the terms and conditions
          </span>
        </label>
        <p id="terms-description" className="mt-1 text-sm text-gray-600">
          By checking this box, you agree to our privacy policy and terms of service.
        </p>
      </div>

      {/* Submit button with loading state */}
      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        {isSubmitting ? (
          <>
            <span className="sr-only">Submitting form...</span>
            <span aria-hidden="true">Submitting...</span>
          </>
        ) : (
          'Submit'
        )}
      </button>
    </form>
  )
}
```

### Accessible Buttons and Links

```tsx
// Icon-only button with accessible label
export function IconButton({ onClick, label }: {
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="p-2 rounded hover:bg-gray-100"
    >
      <TrashIcon aria-hidden="true" className="w-5 h-5" />
    </button>
  )
}

// Link that opens in new tab
export function ExternalLink({ href, children }: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      {children}
      <span className="sr-only"> (opens in new tab)</span>
      <ExternalLinkIcon aria-hidden="true" className="inline w-4 h-4 ml-1" />
    </a>
  )
}

// Disabled button with explanation
export function DisabledButton() {
  return (
    <div>
      <button
        disabled
        aria-disabled="true"
        aria-describedby="button-disabled-reason"
        className="px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
      >
        Submit
      </button>
      <p id="button-disabled-reason" className="mt-1 text-sm text-gray-600">
        Please fill in all required fields to enable submission.
      </p>
    </div>
  )
}
```

### Accessible Modal Dialog

```tsx
import { useEffect, useRef } from 'react'
import FocusTrap from 'focus-trap-react'

export function AccessibleModal({ isOpen, onClose, title, children }: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Focus close button when modal opens
      closeButtonRef.current?.focus()

      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content with focus trap */}
      <FocusTrap>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-semibold">
              {title}
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1 rounded hover:bg-gray-100"
            >
              <XIcon aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div>{children}</div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </FocusTrap>
    </div>
  )
}
```

### Accessible Navigation

```tsx
export function AccessibleNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav aria-label="Main navigation">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
      >
        Skip to main content
      </a>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
        className="md:hidden p-2"
      >
        {isMenuOpen ? (
          <XIcon aria-hidden="true" className="w-6 h-6" />
        ) : (
          <MenuIcon aria-hidden="true" className="w-6 h-6" />
        )}
      </button>

      {/* Navigation links */}
      <ul
        id="mobile-menu"
        className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:gap-4`}
      >
        <li>
          <a
            href="/"
            aria-current="page"
            className="block py-2 px-4 bg-blue-100"
          >
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="block py-2 px-4 hover:bg-gray-100">
            About
          </a>
        </li>
        <li>
          <a href="/contact" className="block py-2 px-4 hover:bg-gray-100">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  )
}
```

### Live Regions for Dynamic Content

```tsx
export function LiveRegionExample() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'success' | 'error' | null>(null)

  const handleSave = async () => {
    try {
      await saveData()
      setStatus('success')
      setMessage('Data saved successfully!')
    } catch (error) {
      setStatus('error')
      setMessage('Failed to save data. Please try again.')
    }
  }

  return (
    <div>
      <button onClick={handleSave}>Save</button>

      {/* Polite live region for non-critical updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {status === 'success' && message}
      </div>

      {/* Assertive live region for errors */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {status === 'error' && message}
      </div>

      {/* Visual feedback */}
      {message && (
        <div
          className={`mt-4 p-4 rounded ${
            status === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
```

### Accessible Data Table

```tsx
export function AccessibleTable({ data }: { data: User[] }) {
  const [sortColumn, setSortColumn] = useState<keyof User>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  return (
    <table className="w-full border-collapse">
      <caption className="text-left font-semibold mb-2">
        User List
        <span className="block text-sm font-normal text-gray-600">
          {data.length} users total
        </span>
      </caption>

      <thead>
        <tr>
          <th scope="col" className="text-left p-2 border-b">
            <button
              onClick={() => handleSort('name')}
              aria-sort={
                sortColumn === 'name'
                  ? sortDirection === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
              className="flex items-center gap-2"
            >
              Name
              {sortColumn === 'name' && (
                <span aria-hidden="true">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </th>
          <th scope="col" className="text-left p-2 border-b">
            Email
          </th>
          <th scope="col" className="text-left p-2 border-b">
            Role
          </th>
          <th scope="col" className="text-left p-2 border-b">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>

      <tbody>
        {data.map((user) => (
          <tr key={user.id}>
            <th scope="row" className="p-2 border-b font-normal">
              {user.name}
            </th>
            <td className="p-2 border-b">{user.email}</td>
            <td className="p-2 border-b">{user.role}</td>
            <td className="p-2 border-b">
              <button
                aria-label={`Edit ${user.name}`}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Color Contrast and Visual Design

```tsx
// Good: Sufficient contrast (4.5:1 for normal text, 3:1 for large text)
export function GoodContrast() {
  return (
    <div className="bg-white">
      <h1 className="text-gray-900">High Contrast Heading</h1>
      <p className="text-gray-700">Body text with good contrast</p>
      <button className="bg-blue-600 text-white px-4 py-2">
        Accessible Button
      </button>
    </div>
  )
}

// Bad: Insufficient contrast
export function BadContrast() {
  return (
    <div className="bg-white">
      <h1 className="text-gray-400">Low Contrast Heading</h1>
      <p className="text-gray-300">Body text with poor contrast</p>
      <button className="bg-gray-300 text-gray-400 px-4 py-2">
        Inaccessible Button
      </button>
    </div>
  )
}

// Focus indicators
export function FocusIndicators() {
  return (
    <div className="space-y-4">
      <button className="px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus:ring-4 focus:ring-blue-300">
        Button with visible focus
      </button>

      <a
        href="/page"
        className="text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
      >
        Link with visible focus
      </a>

      <input
        type="text"
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        placeholder="Input with visible focus"
      />
    </div>
  )
}
```

### Automated Accessibility Testing

```typescript
// jest-axe setup
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// Test example
import { render } from '@testing-library/react'

describe('Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<MyComponent />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('form should be accessible', async () => {
    const { container } = render(<AccessibleForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## WCAG 2.1 Quick Reference

### Level A (Must Have)
- Text alternatives for non-text content
- Captions for audio/video
- Keyboard accessible
- Sufficient time to read content
- No seizure-inducing content
- Page titled
- Focus order makes sense
- Link purpose clear
- Language of page identified

### Level AA (Should Have)
- Captions for live audio
- Audio description for video
- Contrast ratio 4.5:1 (normal text)
- Contrast ratio 3:1 (large text)
- Text can be resized 200%
- Multiple ways to find pages
- Headings and labels descriptive
- Focus visible
- Language of parts identified

### Level AAA (Nice to Have)
- Sign language for audio
- Extended audio description
- Contrast ratio 7:1 (normal text)
- Contrast ratio 4.5:1 (large text)
- No images of text
- Section headings

## Accessibility Checklist

- [ ] Semantic HTML elements used
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA attributes used correctly
- [ ] Headings in logical order
- [ ] Skip links provided
- [ ] Error messages clear and accessible
- [ ] Live regions for dynamic content
- [ ] Tables have proper structure
- [ ] Modals trap focus
- [ ] Screen reader tested
- [ ] Automated tests passing

## Testing Tools

- **axe DevTools**: Browser extension for accessibility testing
- **Lighthouse**: Chrome DevTools audit
- **WAVE**: Web accessibility evaluation tool
- **Color Contrast Analyzer**: Check contrast ratios
- **NVDA**: Free screen reader (Windows)
- **VoiceOver**: Built-in screen reader (Mac/iOS)
- **JAWS**: Popular screen reader (Windows)

## Best Practices

1. **Use Semantic HTML**: Proper elements convey meaning
2. **Provide Text Alternatives**: Alt text, captions, transcripts
3. **Ensure Keyboard Access**: All functionality via keyboard
4. **Maintain Focus Order**: Logical tab order
5. **Use ARIA Sparingly**: Only when HTML isn't enough
6. **Test with Real Users**: Include people with disabilities
7. **Automate Testing**: Catch issues early
8. **Document Accessibility**: Share guidelines with team
9. **Train Team**: Accessibility is everyone's responsibility
10. **Continuous Improvement**: Regular audits and updates

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)
