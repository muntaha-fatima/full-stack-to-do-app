/**
 * Analytics page - View productivity insights and metrics.
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/protected-route';
import { CalendarIcon, TrendingUpIcon, ActivityIcon } from 'lucide-react';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '', // 30 days ago
    end: new Date().toISOString().split('T')[0] ?? '', // today
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

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #DCE9F2, #FFFFFF)' }}>
      <main className="lg:pl-64">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">
              Track your productivity and task completion rates
            </p>
          </div>

          {/* Date Range Selector */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start || ''}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end || ''}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setDateRange({
                        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
                        end: new Date().toISOString().split('T')[0] ?? '',
                      });
                    }}
                  >
                    Reset to 30 days
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading and Error States */}
          {(insightsLoading || activitiesLoading || metricsLoading) && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {insightsError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mb-6">
              <p className="text-destructive">Error loading insights: {(insightsError as Error).message}</p>
            </div>
          )}

          {/* Productivity Insights */}
          {insights && !insightsLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Overall Completion Rate */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Completion Rate</CardTitle>
                  <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {insights.overall_completion_rate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tasks completed in selected period
                  </p>
                </CardContent>
              </Card>

              {/* Average Completion Time */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
                  <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {insights.average_completion_time.toFixed(1)}h
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average time to complete tasks
                  </p>
                </CardContent>
              </Card>

              {/* Top Category */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                  <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {insights.top_categories[0]?.name || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {insights.top_categories[0]?.count || 0} tasks
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Weekly Insights */}
          {insights && insights.weekly_insights.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Weekly Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.weekly_insights.map((week, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{week.period}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-muted rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${week.completion_rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12">
                          {week.completion_rate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monthly Insights */}
          {insights && insights.monthly_insights.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Monthly Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.monthly_insights.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{month.period}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-muted rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${month.completion_rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12">
                          {month.completion_rate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activities */}
          {activities && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.data.length > 0 ? (
                  <div className="space-y-4">
                    {activities.data.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">
                            {activity.action} {activity.entity_type} #{activity.entity_id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {activity.metadata_json && Object.keys(activity.metadata_json).length > 0 && (
                            <pre className="text-xs bg-muted p-2 rounded">
                              {JSON.stringify(activity.metadata_json, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No activities found in the selected period
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}