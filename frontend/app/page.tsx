'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Zap,
  Shield,
  Users,
  Calendar,
  Flag,
  Clock,
  Sparkles,
  ArrowRight,
  Star,
  Play,
  ChevronRight,
  BarChart3,
  Layers,
  Globe,
  Lock
} from 'lucide-react';

export default function HomePage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you! We'll contact you at ${email}`);
    setEmail('');
  };

  // Features data
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Get things done faster with our intuitive interface and keyboard shortcuts."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and stored securely with industry-leading security."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time updates and shared projects."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Smart Scheduling",
      description: "Intelligent scheduling that adapts to your workflow and priorities."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics & Insights",
      description: "Gain valuable insights into your productivity patterns and habits."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Cross-Platform Sync",
      description: "Access your tasks anywhere, anytime across all your devices."
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Project Organization",
      description: "Organize tasks into projects and sections for better workflow management."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Advanced Privacy",
      description: "Control who sees your tasks with granular privacy settings."
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      quote: "This app transformed how our team manages projects. We're 40% more productive now.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      quote: "Finally, a task manager that doesn't get in the way of creativity. Highly recommended!",
      avatar: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "Startup Founder",
      quote: "The collaboration features saved us countless hours of back-and-forth emails.",
      avatar: "ER"
    }
  ];

  // Stats data
  const stats = [
    { value: "2M+", label: "Active Users" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "50M+", label: "Tasks Completed" },
    { value: "150+", label: "Countries" }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals getting started",
      features: [
        "Up to 5 projects",
        "Basic task management",
        "Sync across 2 devices",
        "1GB storage"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$8",
      period: "per month",
      description: "For professionals and small teams",
      features: [
        "Unlimited projects",
        "Advanced task management",
        "Priority support",
        "Team collaboration",
        "10GB storage"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Business",
      price: "$12",
      period: "per user/month",
      description: "For growing teams and businesses",
      features: [
        "Everything in Professional",
        "Admin controls",
        "Advanced security",
        "Custom integrations",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Enhanced smoky background effects with more prominent pink and purple tones on both sides */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-500/25 blur-3xl -z-10"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/25 to-pink-400/30 blur-3xl -z-10"></div>
        <div className="absolute top-3/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500/25 to-pink-400/30 blur-3xl -z-10"></div>
        <div className="absolute top-3/4 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-500/25 blur-3xl -z-10"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/20 to-purple-400/15 blur-3xl -z-10"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/15 to-pink-300/20 blur-3xl -z-10"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-300/15 blur-3xl -z-10"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/20 to-purple-400/20 blur-3xl -z-10"></div>
        <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/25 blur-3xl -z-10"></div>
        <div className="absolute top-1/3 left-1/4 w-56 h-56 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-3xl -z-10"></div>
        <div className="absolute bottom-1/3 left-1/3 w-60 h-60 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/25 blur-3xl -z-10"></div>
        <div className="absolute bottom-1/3 right-1/3 w-60 h-60 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/25 blur-3xl -z-10"></div>
      </div>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-2 text-sm bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-full">
                <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                Productivity Reimagined
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                <span className="block font-serif">Organize Your Life,</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 font-mono">Amplify Your Productivity</span>
              </h1>

              <p className=" text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                The ultimate task management platform that helps you achieve more with less effort.
                Join millions who trust our platform to stay organized and focused.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center group">
                  <Link href="/register" className="flex items-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 duration-300" />
                  </Link>
                </Button>

                <Button variant="outline" size="lg" className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-8 py-6 text-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center group">
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            <div className="mt-16">
              <motion.div
                className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl p-6 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Try our dashboard in action</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Experience the power of our task management system with a quick demo of our most popular features.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 rounded-full px-3 py-1 text-sm">
                        Smart Prioritization
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 rounded-full px-3 py-1 text-sm">
                        Team Collaboration
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800 rounded-full px-3 py-1 text-sm">
                        Project Tracking
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">Complete project proposal</span>
                        <Badge variant="outline" className="text-xs ml-auto border-gray-300 dark:border-gray-600 rounded-full px-2 py-0.5">High</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span className="text-gray-700 dark:text-gray-300">Team meeting with design</span>
                        <Badge variant="outline" className="text-xs ml-auto border-gray-300 dark:border-gray-600 rounded-full px-2 py-0.5">Today</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Flag className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">Review quarterly reports</span>
                        <Badge variant="outline" className="text-xs ml-auto border-gray-300 dark:border-gray-600 rounded-full px-2 py-0.5">Tomorrow</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Enhanced smoky effects for stats section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/10 to-purple-400/10 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-300/10 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/15 to-pink-300/15 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/15 to-purple-400/15 blur-3xl -z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                Trusted by Millions
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto">
                Join our community of users who have transformed their productivity
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg h-full flex flex-col items-center justify-center text-center p-6 transition-all duration-300 hover:shadow-2xl group">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-600/10 flex items-center justify-center mb-4 group-hover:from-pink-500/20 group-hover:to-purple-600/20 transition-all duration-300">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Enhanced smoky effects for features section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/10 to-purple-400/10 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-300/10 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/15 to-pink-300/15 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/15 to-purple-400/15 blur-3xl -z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-gray-900 dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              Powerful Features, Simple Interface
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light">
              Everything you need to organize your work and life in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <Card className="h-full bg-white/40 backdrop-blur-sm dark:bg-gray-800/40 border border-gray-200/15 dark:border-gray-700/15 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-xl overflow-hidden">
                  <div className="p-1 bg-gradient-to-r from-pink-200/20 to-purple-300/20">
                    <Card className="h-full bg-white/0 dark:bg-gray-900/0 border-0 rounded-xl">
                      <CardHeader className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-50/30 to-purple-50/30 flex items-center justify-center text-pink-500 dark:text-pink-400 mx-auto mb-6 group-hover:from-pink-100/40 group-hover:to-purple-100/40 transition-colors">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center pb-8 px-4">
                        <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Enhanced smoky effects for how-it-works section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/10 to-purple-400/10 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-300/10 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/15 to-pink-300/15 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/15 to-purple-400/15 blur-3xl -z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light">
              Get started in seconds and boost your productivity immediately
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                description: "Sign up in less than a minute and start organizing your tasks"
              },
              {
                step: "02",
                title: "Add Your Tasks",
                description: "Quickly add tasks with due dates, priorities, and labels"
              },
              {
                step: "03",
                title: "Collaborate & Achieve",
                description: "Share projects with your team and accomplish more together"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden h-full flex flex-col group">
                  <div className="p-1 bg-gradient-to-r from-pink-200/30 to-purple-300/30">
                    <Card className="bg-white/0 dark:bg-gray-900/0 border-0 rounded-xl overflow-hidden h-full flex flex-col">
                      <div className="bg-gradient-to-r from-pink-50/20 to-purple-50/20 p-6 text-center">
                        <div className="text-5xl font-bold text-pink-400 dark:text-pink-400 mb-2 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-300">{item.step}</div>
                      </div>
                      <CardHeader className="text-center pt-6 pb-4">
                        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center flex-grow pb-6">
                        <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Enhanced smoky effects for testimonials section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/10 to-purple-400/10 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-300/10 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/15 to-pink-300/15 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/15 to-purple-400/15 blur-3xl -z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              Trusted by Productive People
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light">
              Join millions of users who have transformed their productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <Card className="h-full bg-white/40 backdrop-blur-sm dark:bg-gray-800/40 border border-gray-200/10 dark:border-gray-700/10 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden group">
                  <div className="p-1 bg-gradient-to-r from-pink-200/20 to-purple-300/20">
                    <Card className="h-full bg-white/0 dark:bg-gray-900/0 border-0 rounded-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-pink-50/15 to-purple-50/15 p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{testimonial.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                      <CardContent className="pt-6 flex-grow pb-6">
                        <p className="text-gray-700 dark:text-gray-300 italic text-center">"{testimonial.quote}"</p>
                        <div className="flex justify-center mt-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Enhanced smoky effects for pricing section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/10 to-purple-400/10 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-300/10 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/15 to-pink-300/15 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/15 to-purple-400/15 blur-3xl -z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light">
              Choose the plan that works best for you and your team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <Card className={`h-full bg-white/40 backdrop-blur-sm dark:bg-gray-800/40 border border-gray-200/10 dark:border-gray-700/10 shadow-lg rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${plan.popular ? 'relative' : ''} group`}>
                  <div className={`p-1 ${plan.popular ? 'bg-gradient-to-r from-pink-300/30 to-purple-400/30' : 'bg-gradient-to-r from-gray-300/20 to-gray-400/20'}`}>
                    <Card className="h-full bg-white/0 dark:bg-gray-900/0 border-0 rounded-xl overflow-hidden">
                      {plan.popular && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-400/80 to-purple-500/80 text-white text-xs font-bold px-6 py-2 rounded-full shadow-md">
                          Most Popular
                        </div>
                      )}
                      <CardHeader className="pt-8 pb-6">
                        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{plan.name}</CardTitle>
                        <div className="flex items-baseline mt-2">
                          <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                          <span className="text-gray-600 dark:text-gray-400 ml-2 text-lg">/{plan.period}</span>
                        </div>
                        <CardDescription className="text-gray-600 dark:text-gray-300 mt-3 text-center">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4 mb-8">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full py-6 text-lg font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${plan.popular ? 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white'} group-hover:shadow-md`}
                        >
                          {plan.cta}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Enhanced smoky effects for CTA section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/10 to-purple-400/10 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-300/10 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/15 to-pink-300/15 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/15 to-purple-400/15 blur-3xl -z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="p-1 bg-gradient-to-r from-pink-300/30 to-purple-400/30 rounded-2xl">
              <Card className="bg-white/40 backdrop-blur-sm dark:bg-gray-800/40 border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="py-16">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-500/30 mb-6">
                      <Sparkles className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4 tracking-tight">Ready to Transform Your Productivity?</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                      Join thousands of satisfied users who have revolutionized the way they work.
                      Start your free trial today with no credit card required.
                    </p>

                    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg bg-white/30 dark:bg-gray-800/30 border border-gray-300/30 dark:border-gray-600/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 focus:border-transparent font-medium"
                        required
                      />
                      <Button type="submit" className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center group">
                        Get Started
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
                      </Button>
                    </form>

                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 font-light">
                      Free 14-day trial · No credit card required
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-16 bg-gradient-to-t from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
        {/* Modern smoky effects for footer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-400/10 to-purple-500/5 blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/5 to-pink-400/10 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500/5 to-pink-400/10 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-pink-400/10 to-purple-500/5 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/5 to-purple-400/5 blur-3xl -z-10"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/5 to-pink-300/5 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/8 to-pink-300/8 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/8 to-purple-400/8 blur-3xl -z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="font-bold text-white text-xl">TD</span>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-xl blur opacity-75 -z-10"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 tracking-tight">
                    Todo App
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mt-1 font-medium">Your productivity partner</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-slate-300 max-w-md mb-6 text-base leading-relaxed font-light">
                The ultimate task management platform for individuals and teams. Simplify your workflow and boost productivity with our intuitive tools.
              </p>
              <div className="flex space-x-3">
                <Link href="#" className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5 text-gray-700 dark:text-slate-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5 text-gray-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5 text-gray-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 dark:text-white font-bold tracking-tight mb-6 text-xl flex items-center">
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 w-2 h-6 rounded-full mr-3"></span>
                Product
              </h4>
              <ul className="space-y-3.5">
                <li><Link href="#" className="text-gray-600 hover:text-[hsl(var(--brand-purple))] transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-medium flex items-center group text-base"><span className="w-1 h-1 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>Features</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-[hsl(var(--brand-purple))] transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-medium flex items-center group text-base"><span className="w-1 h-1 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>Pricing</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-[hsl(var(--brand-purple))] transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-medium flex items-center group text-base"><span className="w-1 h-1 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>Integrations</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-[hsl(var(--brand-purple))] transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-medium flex items-center group text-base"><span className="w-1 h-1 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 dark:text-white font-bold tracking-tight mb-6 text-xl flex items-center">
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 w-2 h-6 rounded-full mr-3"></span>
                Company
              </h4>
              <ul className="space-y-3.5">
                <li><Link href="#" className="text-gray-600 hover:text-[hsl(var(--brand-purple))] transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-medium flex items-center group text-base"><span className="w-1 h-1 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>About Us</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-[hsl(var(--brand-purple))] transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-medium flex items-center group text-base"><span className="w-1 h-1 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>Careers</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-[hsl(var(--brand-purple))] transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-medium flex items-center group text-base"><span className="w-1 h-1 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>Contact</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-[hsl(var(--brand-purple))] transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-medium flex items-center group text-base"><span className="w-1 h-1 bg-gray-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>Partners</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-6 border border-white/40 dark:border-gray-700/40 dark:bg-gray-800/30 w-full shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
                  © {new Date().getFullYear()} Todo App. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center space-x-6 mt-4 md:mt-0">
                  <Link href="#" className="text-gray-600 hover:text-[#6200EE] text-sm transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-light relative group">
                    <span className="relative z-10">Terms</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-[#6200EE] text-sm transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-light relative group">
                    <span className="relative z-10">Privacy</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-[#6200EE] text-sm transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-light relative group">
                    <span className="relative z-10">Cookies</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-[#6200EE] text-sm transition-colors dark:text-gray-300 dark:hover:text-purple-400 font-light relative group">
                    <span className="relative z-10">Licenses</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}