'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { register } from '@/lib/auth';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword
      });

      // Redirect to login after successful signup
      router.push('/login');
      router.refresh(); // Refresh to update the UI
    } catch (error: unknown) {
      console.error('Signup failed:', error);

      // Check if it's a network error
      if (error instanceof Error && error.message.includes('fetch')) {
        setError('Unable to connect to the server. Please make sure the backend is running on port 8001.');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced smoky background effects with more prominent pink and purple tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-500/25 blur-3xl -z-10"></div>
        <div className="absolute top-3/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500/25 to-pink-400/30 blur-3xl -z-10"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/20 to-purple-400/15 blur-3xl -z-10"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-300/15 blur-3xl -z-10"></div>
        <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/25 blur-3xl -z-10"></div>
        <div className="absolute bottom-1/3 left-1/3 w-60 h-60 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/25 blur-3xl -z-10"></div>
      </div>

      <div className="w-full max-w-md px-4 relative z-20">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">

          <CardHeader className="space-y-1 text-center relative z-10 pt-10">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 tracking-tight">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Join us today to get started
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="relative z-10 px-6">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 text-base font-medium">Full Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium py-6 text-base"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 text-base font-medium">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium py-6 text-base"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 text-base font-medium">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium py-6 text-base"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 text-base font-medium">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium py-6 text-base"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-gray-700 text-base">I agree to the Terms and Conditions</Label>
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                  {error.includes('server') && (
                    <div className="mt-2 text-xs">
                      Tip: Run the backend server with <code className="bg-red-200 px-1 rounded">cd ../backend && uvicorn main:app --reload</code>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 px-0">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-6 text-lg rounded-lg shadow-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              <div className="text-center text-base text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}