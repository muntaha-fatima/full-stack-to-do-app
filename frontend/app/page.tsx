'use client';

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
  BarChart3,
  Layers,
  Globe,
  Lock,
  Target,
  Award,
  TrendingUp,
  ChevronDown,
  Trophy
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Get things done faster with our intuitive interface and keyboard shortcuts.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and stored securely with industry-leading security.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time updates and shared projects.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Smart Scheduling",
      description: "Intelligent scheduling that adapts to your workflow and priorities.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics & Insights",
      description: "Gain valuable insights into your productivity patterns and habits.",
      color: "from-pink-400 to-rose-500"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Cross-Platform Sync",
      description: "Access your tasks anywhere, anytime across all your devices.",
      color: "from-indigo-400 to-blue-500"
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Project Organization",
      description: "Organize tasks into projects and sections for better workflow management.",
      color: "from-orange-400 to-amber-500"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Advanced Privacy",
      description: "Control who sees your tasks with granular privacy settings.",
      color: "from-cyan-400 to-teal-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      quote: "This app transformed how our team manages projects. We're 40% more productive now.",
      avatar: "SJ",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      quote: "Finally, a task manager that doesn't get in the way of creativity. Highly recommended!",
      avatar: "MC",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Startup Founder",
      quote: "The collaboration features saved us countless hours of back-and-forth emails.",
      avatar: "ER",
      rating: 5
    }
  ];

  const stats = [
    { value: "2M+", label: "Active Users", icon: Users, change: "+15% this month" },
    { value: "98%", label: "Satisfaction Rate", icon: Award, change: "Industry leading" },
    { value: "50M+", label: "Tasks Completed", icon: CheckCircle2, change: "And counting" },
    { value: "150+", label: "Countries", icon: Globe, change: "Worldwide" }
  ];

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
        "1GB storage",
        "Email support"
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
        "10GB storage",
        "Custom integrations",
        "Analytics dashboard"
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
        "Dedicated support",
        "SSO & SAML",
        "Audit logs"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const whyChooseUs = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Laser Focus",
      description: "Built for deep work with minimal distractions and smart notifications.",
      stat: "3x",
      statLabel: "more focused"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Proven Results",
      description: "Users report 40% increase in productivity within the first month.",
      stat: "40%",
      statLabel: "productivity boost"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Award Winning",
      description: "Recognized by leading tech publications for innovation and design.",
      stat: "15+",
      statLabel: "awards won"
    }
  ];

  const integrations = [
    { name: "Slack", icon: "💬" },
    { name: "Google Drive", icon: "📁" },
    { name: "Notion", icon: "📝" },
    { name: "GitHub", icon: "🐙" },
    { name: "Figma", icon: "🎨" },
    { name: "Zoom", icon: "📹" },
    { name: "Microsoft Teams", icon: "👥" },
    { name: "Zapier", icon: "⚡" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900 -z-20" />
        
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-500/30 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-cyan-500/30 rounded-full blur-3xl -z-10"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-gray-300 dark:border-gray-700 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
                <Sparkles className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent font-semibold">
                  #1 Productivity App of 2024
                </span>
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
                <span className="block">Organize Your Life,</span>
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                  Amplify Your Productivity
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                The ultimate task management platform that helps you achieve more with less effort.
                Join <span className="font-semibold text-purple-600 dark:text-purple-400">millions</span> who trust our platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white px-10 py-7 text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1 group w-full sm:w-auto">
                  <Link href="/register" className="flex items-center justify-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </Link>
                </Button>

                <Button variant="outline" size="lg" className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 px-10 py-7 text-lg w-full sm:w-auto group backdrop-blur-sm">
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-16">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="relative mx-auto max-w-6xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl blur-3xl opacity-20 transform rotate-1 scale-105" />
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm" />
                  </div>
                  <div className="text-white/80 text-sm font-medium">TodoApp Dashboard</div>
                  <div className="w-16" />
                </div>
                
                <div className="p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { icon: CheckCircle2, color: 'from-pink-400 to-purple-500', title: 'Complete project', progress: '75%' },
                      { icon: Clock, color: 'from-purple-400 to-pink-500', title: 'Team meeting', progress: 'Today' },
                      { icon: Flag, color: 'from-cyan-400 to-blue-500', title: 'Review reports', progress: 'Tomorrow' },
                      { icon: Target, color: 'from-green-400 to-emerald-500', title: 'Set goals', progress: 'This week' }
                    ].map((task, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${task.color} flex items-center justify-center shadow-lg`}>
                            <task.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{task.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{task.progress}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </motion.div>
      </section>

      {/* Logos Section */}
      <section className="py-16 border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            Trusted by teams at world-class companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix'].map((company) => (
              <motion.div
                key={company}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-gray-400 dark:text-gray-600"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <stat.icon className="h-10 w-10 text-pink-500" />
                </motion.div>
                <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-3">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium mb-2">{stat.label}</div>
                <div className="text-sm text-green-500 font-medium">{stat.change}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl p-10 backdrop-blur-sm border border-purple-200/30">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-400/40 to-purple-500/40 rounded-2xl blur-2xl" />
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-purple-400/40 to-cyan-500/40 rounded-2xl blur-2xl" />
                
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 px-6 py-4 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="p-8 space-y-5">
                    {[
                      { icon: CheckCircle2, color: 'from-pink-400 to-purple-500', text: 'Complete project proposal' },
                      { icon: Clock, color: 'from-purple-400 to-pink-500', text: 'Team sync meeting' },
                      { icon: Flag, color: 'from-cyan-400 to-blue-500', text: 'Review quarterly reports' }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                viewport={{ once: true }}
                className="absolute -top-8 -right-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">2M+</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
                viewport={{ once: true }}
                className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <Star className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">4.9★</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">User Rating</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 mr-1 fill-current text-purple-500" />
                  Our Mission
                </Badge>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                    Empowering Productivity
                  </span>{' '}
                  Worldwide
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  We believe everyone deserves to work smarter, not harder. Our platform combines 
                  cutting-edge technology with intuitive design to help you achieve your goals.
                </p>
              </div>

              <div className="space-y-6">
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    viewport={{ once: true }}
                  >
                    <Card className="border-gray-200 dark:border-gray-700 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-5">
                          <motion.div 
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"
                            whileHover={{ rotate: 5 }}
                          >
                            <div className="text-white">{item.icon}</div>
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">{item.description}</p>
                            <div className="flex items-center gap-2">
                              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{item.stat}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{item.statLabel}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white px-10 py-7 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <Link href="/register" className="flex items-center justify-center">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> No credit card required</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> 14-day free trial</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                Powerful Features
              </span>{' '}
              for Modern Teams
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Everything you need to organize your work and life in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-6">
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full">
              Integrations
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                Works With
              </span>{' '}
              Your Favorite Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Seamlessly integrate with the apps you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <Card className="border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-3">{integration.icon}</div>
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {integration.name}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                Get Started
              </span>{' '}
              in Seconds
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Boost your productivity immediately with our simple three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                description: "Sign up in less than a minute and start organizing your tasks",
                icon: Users
              },
              {
                step: "02",
                title: "Add Your Tasks",
                description: "Quickly add tasks with due dates, priorities, and labels",
                icon: Zap
              },
              {
                step: "03",
                title: "Collaborate & Achieve",
                description: "Share projects with your team and accomplish more together",
                icon: Trophy
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="relative z-10 border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 h-full group">
                  <CardContent className="p-10 text-center">
                    <motion.div 
                      className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                      whileHover={{ rotate: 6 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                Loved by
              </span>{' '}
              Thousands
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              See what our users have to say about their experience
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
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic mb-8 text-lg leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                Simple, Transparent
              </span>{' '}
              Pricing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Choose the plan that works best for you and your team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white border-0 px-5 py-2 shadow-lg">
                      <Star className="h-3 w-3 mr-1 fill-white" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full border-2 ${plan.popular ? 'border-purple-500 shadow-2xl shadow-purple-500/20' : 'border-gray-200 dark:border-gray-700'} hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                  <CardHeader className="text-center pb-6 pt-10">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-2 mb-4">
                      <span className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-lg">/{plan.period}</span>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-8 pb-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full mt-8 py-6 text-lg ${plan.popular ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white shadow-xl' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500" />
        
        {/* Animated orbs */}
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm bg-white/20 backdrop-blur-sm border-white/30 text-white rounded-full">
              <Sparkles className="h-3 w-3 mr-1 fill-white" />
              Start Your Journey Today
            </Badge>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Ready to Transform{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white to-pink-200">
                Your Productivity?
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join <span className="font-bold text-white">millions of users</span> who have already discovered a better way to get things done.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-white/80">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">Cancel anytime</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="xl" className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-8 text-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group">
                <Link href="/register" className="flex items-center justify-center">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started Free
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </div>

            {/* User count */}
            <motion.div 
              className="mt-12 flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-white/80 to-white/40 border-2 border-white/50 flex items-center justify-center text-xs font-bold text-purple-600"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-white/80 text-sm">
                <span className="font-bold text-white">2M+</span> professionals already on board
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <span className="font-bold text-white text-lg">TD</span>
                </div>
                <span className="font-bold text-2xl text-white">TodoApp</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
                The ultimate task management platform for modern teams. Organize, collaborate, and achieve more together.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 TodoApp. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
