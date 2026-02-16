'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Target,
  Shield,
  Zap,
  Users,
  Award,
  TrendingUp,
  Heart,
  Globe,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Star
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { value: "5+", label: "Years of Excellence", icon: Award },
    { value: "2M+", label: "Active Users", icon: Users },
    { value: "150+", label: "Countries", icon: Globe },
    { value: "99.9%", label: "Uptime", icon: TrendingUp }
  ];

  const values = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Purpose-Driven",
      description: "Every feature we build serves a clear purpose in enhancing your productivity.",
      color: "from-pink-500 to-purple-600"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy-First",
      description: "Your data belongs to you. We never sell or misuse your personal information.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Innovation",
      description: "We continuously push boundaries to bring you cutting-edge productivity tools.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "User-Centric",
      description: "Your feedback shapes our roadmap. We build what you need, not what we think.",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-level 256-bit encryption keeps your data safe and secure.",
      bg: "bg-blue-500/10",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Sync",
      description: "Real-time synchronization across all your devices, anywhere in the world.",
      bg: "bg-purple-500/10",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Optimized performance ensures instant access to your tasks.",
      bg: "bg-yellow-500/10",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Seamless collaboration with real-time updates and shared projects.",
      bg: "bg-pink-500/10",
      color: "from-pink-400 to-rose-500"
    }
  ];

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Co-Founder",
      bio: "Former PM at Google. Passionate about productivity and user experience.",
      avatar: "AJ",
      gradient: "from-pink-400 to-purple-500"
    },
    {
      name: "Maria Garcia",
      role: "Chief Design Officer",
      bio: "Award-winning designer with 15+ years at Apple and IDEO.",
      avatar: "MG",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      name: "David Chen",
      role: "CTO & Co-Founder",
      bio: "Ex-Meta engineer. Expert in scalable systems and AI.",
      avatar: "DC",
      gradient: "from-cyan-400 to-blue-500"
    },
    {
      name: "Sarah Williams",
      role: "VP of Engineering",
      bio: "Built teams at Stripe and Airbnb. Open source contributor.",
      avatar: "SW",
      gradient: "from-orange-400 to-amber-500"
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Founded",
      description: "Started with a simple idea: make productivity effortless.",
      icon: Sparkles
    },
    {
      year: "2020",
      title: "Series A",
      description: "Raised $10M to accelerate product development.",
      icon: TrendingUp
    },
    {
      year: "2022",
      title: "2 Million Users",
      description: "Reached 2M active users across 150+ countries.",
      icon: Users
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Launched AI-powered task management features.",
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation Spacer */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900 -z-20" />
        
        {/* Animated orbs */}
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-gray-300 dark:border-gray-700 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
                <Sparkles className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                Our Story
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
                About{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                  Our Mission
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                We empower professionals and teams to transform ambition into achievement. Through intelligent
                task management and seamless collaboration, we provide the clarity needed to navigate complexity,
                prioritize what matters, and turn everyday goals into extraordinary results.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <stat.icon className="h-6 w-6 text-pink-500" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              Core Values
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                What Drives Us
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              These principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        {value.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                Built for Excellence
              </span>
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
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-2xl text-white shadow-lg`}>
                        {feature.icon}
                      </div>
                    </div>
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

      {/* Timeline Section */}
      <section className="py-20 lg:py-32 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              Our Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                Milestones
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Key moments that shaped our company
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 via-purple-300 to-cyan-300" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className="inline-block border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                            <milestone.icon className="h-6 w-6" />
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            {milestone.year}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden md:flex w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border-4 border-white dark:border-gray-950 shadow-lg z-10 flex-shrink-0" />
                  
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              Our Team
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                Meet the Leaders
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Passionate people building the future of productivity
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden group">
                  <CardHeader className="text-center pb-6">
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-xl group-hover:scale-110 transition-transform`}>
                      {member.avatar}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</CardTitle>
                    <CardDescription className="text-purple-600 dark:text-purple-400 font-medium">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-white dark:bg-gray-950">
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
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

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
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
              
              <Button asChild variant="outline" size="xl" className="border-2 border-white/50 text-white hover:bg-white/10 px-12 py-8 text-xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <Link href="/contact">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
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
    </div>
  );
}
