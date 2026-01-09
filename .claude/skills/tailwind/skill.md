# Tailwind CSS Skill

## Description
Expert in Tailwind CSS utility-first framework for rapid UI development with responsive design, custom theming, and modern styling patterns.

## Capabilities

### Core Tailwind Concepts
- **Utility Classes**: Pre-built CSS classes for common styles
- **Responsive Design**: Mobile-first breakpoint system
- **Dark Mode**: Built-in dark mode support
- **Custom Theming**: Extending default theme configuration
- **Component Patterns**: Reusable component styling
- **JIT Mode**: Just-in-Time compilation for optimal performance
- **Plugins**: Official and community plugins

### Layout & Spacing
- **Flexbox**: Flexible box layout utilities
- **Grid**: CSS Grid layout system
- **Spacing**: Margin, padding with consistent scale
- **Sizing**: Width, height, min/max dimensions
- **Container**: Responsive container widths
- **Position**: Absolute, relative, fixed, sticky positioning

### Typography
- **Font Family**: Custom font stacks
- **Font Size**: Responsive text sizing
- **Font Weight**: Weight variations
- **Line Height**: Leading utilities
- **Letter Spacing**: Tracking adjustments
- **Text Color**: Color palette utilities
- **Text Alignment**: Alignment and decoration

### Colors & Effects
- **Color Palette**: Comprehensive color system
- **Opacity**: Transparency utilities
- **Gradients**: Linear and radial gradients
- **Shadows**: Box and drop shadows
- **Blur**: Backdrop and element blur
- **Transitions**: Smooth animations
- **Transforms**: Scale, rotate, translate

### Responsive Design
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Mobile-First**: Default mobile, scale up
- **Hover States**: Interactive hover effects
- **Focus States**: Accessibility focus styles
- **Active States**: Click/press feedback
- **Group Modifiers**: Parent-child interactions

### Advanced Features
- **Custom Variants**: Custom state modifiers
- **Arbitrary Values**: One-off custom values
- **Important Modifier**: Force specificity
- **Peer Modifiers**: Sibling state styling
- **Container Queries**: Component-based responsive design

## Usage Examples

### Basic Styling

```tsx
// Button component with Tailwind
export function Button({ children, variant = 'primary' }: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200'

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  )
}

// Card component
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      {children}
    </div>
  )
}
```

### Responsive Layout

```tsx
// Responsive grid layout
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

// Responsive navigation
export function Navigation() {
  return (
    <nav className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
      <a href="/" className="text-lg font-semibold">Home</a>
      <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
      <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a>
    </nav>
  )
}
```

### Form Styling

```tsx
export function LoginForm() {
  return (
    <form className="max-w-md mx-auto space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Sign In
      </button>
    </form>
  )
}
```

### Dark Mode

```tsx
// Dark mode toggle
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}

// Component with dark mode support
export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My App
        </h1>
      </div>
    </header>
  )
}
```

### Custom Components with clsx

```tsx
import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({ children, variant = 'info', size = 'md' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
          'px-4 py-1.5 text-base': size === 'lg',
        },
        {
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': variant === 'success',
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': variant === 'warning',
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': variant === 'error',
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': variant === 'info',
        }
      )}
    >
      {children}
    </span>
  )
}
```

### Animations & Transitions

```tsx
// Loading spinner
export function Spinner() {
  return (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  )
}

// Fade in animation
export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in opacity-0">
      {children}
    </div>
  )
}

// Slide in from bottom
export function SlideUp({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-slide-up translate-y-4 opacity-0">
      {children}
    </div>
  )
}
```

### Tailwind Config

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

## Best Practices

1. **Use Utility Classes**: Embrace utility-first approach
2. **Extract Components**: Create reusable components for repeated patterns
3. **Consistent Spacing**: Use Tailwind's spacing scale
4. **Responsive First**: Design mobile-first, scale up
5. **Dark Mode**: Support dark mode from the start
6. **Custom Theme**: Extend theme for brand colors
7. **Avoid Arbitrary Values**: Use theme values when possible
8. **Group Related Classes**: Organize classes logically
9. **Use clsx/classnames**: Conditional class management
10. **Purge Unused**: Configure content paths correctly

## Common Patterns

### Container Pattern
```tsx
export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}
```

### Stack Pattern
```tsx
export function Stack({ children, spacing = '4' }: {
  children: React.ReactNode
  spacing?: '2' | '4' | '6' | '8'
}) {
  return (
    <div className={`flex flex-col gap-${spacing}`}>
      {children}
    </div>
  )
}
```

### Center Pattern
```tsx
export function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {children}
    </div>
  )
}
```

## Useful Plugins

- **@tailwindcss/forms**: Better form styling
- **@tailwindcss/typography**: Prose styling for content
- **@tailwindcss/aspect-ratio**: Aspect ratio utilities
- **@tailwindcss/line-clamp**: Text truncation
- **tailwindcss-animate**: Additional animations

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/)
- [Tailwind Play](https://play.tailwindcss.com/)
