'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, LogIn, Plus, Home, LayoutDashboard, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout, getUser } from '@/lib/auth';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

// Define the User type to match your auth system
interface User {
  id: string;
  name?: string;
  email: string;
  // Add other properties as needed
}

const ClientHeader = () => {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUser();
        if (user) {
          setSession({ user });
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        // If there's an error getting the user (e.g., 401), treat as unauthenticated
        setSession(null);
        setStatus('unauthenticated');
        
        // Use the error variable to satisfy linter
        if (error) {
          // Intentionally empty - just to use the variable
        }
      }
    };

    checkAuth();
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Navigation links
  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/todoist-dashboard', icon: LayoutDashboard },
    { name: 'About', href: '/about', icon: Info },
  ];

  // Loading state - render nothing during loading to prevent hydration mismatch
  if (status === 'loading') {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/30 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-white text-lg">TD</span>
              </div>
              <span className="self-center text-xl font-semibold tracking-wide text-gray-900">Todo App</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.name} className="h-8 w-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/30 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-white text-lg">TD</span>
            </div>
            <span className="self-center text-xl font-semibold tracking-wide text-gray-900">Todo App</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                pathname === link.href
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-purple-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100/50 hover:text-purple-600'
              }`}
            >
              <link.icon className="h-4 w-4" />
              <span className="text-sm">{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Side - Auth Controls */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <div className="relative md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl ring-1 ring-border z-50 border border-gray-200">
                <div className="flex flex-col space-y-1 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-colors ${
                        pathname === link.href
                          ? 'bg-gradient-to-r from-pink-500/10 to-purple-600/10 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100/50 hover:text-purple-600'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <link.icon className="h-4 w-4" />
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  ))}

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    {status === 'authenticated' && session?.user ? (
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                            {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <span className="text-gray-700 text-sm truncate max-w-[120px]">{session.user.name || session.user.email}</span>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                          onClick={async () => {
                            await logout();
                            setSession(null);
                            setStatus('unauthenticated');
                            window.location.reload(); // Force a reload to update the UI
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-3">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                          >
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                          </Button>
                        </Link>
                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md">
                            <Plus className="mr-2 h-4 w-4" />
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center space-x-2">
            {status === 'authenticated' && session?.user ? (
              // User is logged in
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-700 text-sm hidden md:inline truncate max-w-[100px]">{session.user.name || session.user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={async () => {
                    await logout();
                    setSession(null);
                    setStatus('unauthenticated');
                    window.location.reload(); // Force a reload to update the UI
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline text-sm">Logout</span>
                  <span className="md:hidden text-sm">Log out</span>
                </Button>
              </div>
            ) : (
              // User is not logged in
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <Plus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;