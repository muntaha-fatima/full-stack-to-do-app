/**
 * Analytics page - View productivity insights and metrics.
 * Professional SaaS UI/UX Design
 */
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getProductivityInsights,
  getUserActivities,
  getProductivityMetrics
} from '@/lib/analytics';
import {
  ProductivityInsightsResponse,
  UserActivityListResponse,
  ProductivityMetricListResponse
} from '@/types/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/protected-route';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Clock,
  Target,
  Award,
  Zap,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
    end: new Date().toISOString().split('T')[0] ?? '',
  });

  // Fetch productivity insights
  const { data: insights, isLoading: insightsLoading, error: insightsError } = useQuery<ProductivityInsightsResponse>({
    queryKey: ['analytics', 'insights', dateRange.start, dateRange.end],
    queryFn: () => getProductivityInsights(dateRange.start, dateRange.end),
  });

  // Fetch user activities
  const { data: activities, isLoading: activitiesLoading } = useQuery<UserActivityListResponse>({
    queryKey: ['analytics', 'activities', dateRange.start, dateRange.end],
    queryFn: () => getUserActivities(1, 10, undefined, undefined, dateRange.start, dateRange.end),
  });

  // Fetch productivity metrics
  const { isLoading: metricsLoading } = useQuery<ProductivityMetricListResponse>({
    queryKey: ['analytics', 'metrics', dateRange.start, dateRange.end],
    queryFn: () => getProductivityMetrics(1, 10, undefined, dateRange.start, dateRange.end),
  });

  const handleReset = () => {
    setDateRange({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
      end: new Date().toISOString().split('T')[0] ?? '',
    });
  };

  const isLoading = insightsLoading || activitiesLoading || metricsLoading;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-cyan-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-cyan-500/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <main className="relative z-10 p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                    <p className="text-gray-600 dark:text-gray-400">Track your productivity insights</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-4 py-2 text-sm border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Data
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Date Range Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-8 border-gray-200 dark:border-gray-700 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-600/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Date Range</CardTitle>
                      <CardDescription>Select the time period for analytics</CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Last 30 Days
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start || ''}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end || ''}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p className="font-medium">Selected Period</p>
                      <p className="text-xs">{dateRange.start || 'N/A'} → {dateRange.end || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-64"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-purple-200 dark:border-purple-800"></div>
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-purple-500 border-r-purple-500 animate-spin"></div>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {insightsError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300">Error loading analytics</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{(insightsError as Error).message}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Key Metrics Grid */}
          {insights && !insightsLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {/* Overall Completion Rate */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <Badge variant="outline" className="text-xs border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                      Primary
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completion Rate</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                      {insights.overall_completion_rate.toFixed(1)}%
                    </p>
                    <div className="flex items-center text-green-500 text-sm">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="font-medium">+2.5%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Tasks completed in period</p>
                </CardContent>
              </Card>

              {/* Average Completion Time */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock className="h-6 w-6 text-blue-500" />
                    </div>
                    <Badge variant="outline" className="text-xs border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                      Efficiency
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Completion Time</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                      {insights.average_completion_time.toFixed(1)}h
                    </p>
                    <div className="flex items-center text-green-500 text-sm">
                      <ArrowDownRight className="h-4 w-4" />
                      <span className="font-medium">-1.2h</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Average time per task</p>
                </CardContent>
              </Card>

              {/* Top Category */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target className="h-6 w-6 text-purple-500" />
                    </div>
                    <Badge variant="outline" className="text-xs border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                      Focus
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Top Category</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {insights.top_categories[0]?.name || 'N/A'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {insights.top_categories[0]?.count || 0} tasks completed
                  </p>
                </CardContent>
              </Card>

              {/* Productivity Score */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="h-6 w-6 text-orange-500" />
                    </div>
                    <Badge variant="outline" className="text-xs border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300">
                      Score
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Productivity Score</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                      {(insights.overall_completion_rate * 10).toFixed(0)}
                    </p>
                    <div className="flex items-center text-green-500 text-sm">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium">Excellent</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Out of 1000 points</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Weekly & Monthly Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weekly Insights */}
            {insights && insights.weekly_insights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-gray-200 dark:border-gray-700 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-600/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-pink-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Weekly Trends</CardTitle>
                        <CardDescription>Completion rate by week</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.weekly_insights.slice(0, 4).map((week, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32">
                            {week.period}
                          </span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${week.completion_rate}%` }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                              />
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white w-16 text-right">
                            {week.completion_rate.toFixed(1)}%
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Monthly Insights */}
            {insights && insights.monthly_insights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-gray-200 dark:border-gray-700 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center">
                        <PieChart className="h-5 w-5 text-cyan-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Monthly Trends</CardTitle>
                        <CardDescription>Completion rate by month</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.monthly_insights.slice(0, 4).map((month, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32">
                            {month.period}
                          </span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${month.completion_rate}%` }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                              />
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white w-16 text-right">
                            {month.completion_rate.toFixed(1)}%
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Recent Activities */}
          {activities && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-gray-200 dark:border-gray-700 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Recent Activities</CardTitle>
                      <CardDescription>Your latest task activities</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {activities.data.length > 0 ? (
                    <div className="space-y-3">
                      {activities.data.slice(0, 5).map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {activity.action} - {activity.entity_type}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(activity.timestamp).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                            #{activity.entity_id}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                        <Activity className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">No activities found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        No activities in the selected period
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
