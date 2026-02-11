/**
 * Analytics API functions.
 */

import {
  ProductivityInsightsResponse,
  UserActivity,
  UserActivityCreate,
  UserActivityListResponse,
  ProductivityMetric,
  ProductivityMetricCreate,
  ProductivityMetricListResponse
} from '@/types/analytics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shazsabir-to-do-backend.hf.space/';

/**
 * Get productivity insights for the current user
 */
export async function getProductivityInsights(
  startDate?: string,
  endDate?: string
): Promise<ProductivityInsightsResponse> {
  let url = `${API_URL}/api/v1/analytics/insights`;

  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to fetch insights: ${response.status}`);
  }

  return response.json();
}

/**
 * Get user activities
 */
export async function getUserActivities(
  page: number = 1,
  limit: number = 20,
  action?: string,
  entity_type?: string,
  start_date?: string,
  end_date?: string
): Promise<UserActivityListResponse> {
  let url = `${API_URL}/api/v1/analytics/activities?page=${page}&limit=${limit}`;

  const params = new URLSearchParams();
  if (action) params.append('action', action);
  if (entity_type) params.append('entity_type', entity_type);
  if (start_date) params.append('start_date', start_date);
  if (end_date) params.append('end_date', end_date);

  if (params.toString()) {
    url += `&${params.toString()}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to fetch activities: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a user activity
 */
export async function createUserActivity(
  activityData: UserActivityCreate
): Promise<UserActivity> {
  const response = await fetch(`${API_URL}/api/v1/analytics/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify(activityData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to create activity: ${response.status}`);
  }

  return response.json();
}

/**
 * Get productivity metrics
 */
export async function getProductivityMetrics(
  page: number = 1,
  limit: number = 20,
  metric_type?: string,
  start_date?: string,
  end_date?: string
): Promise<ProductivityMetricListResponse> {
  let url = `${API_URL}/api/v1/analytics/metrics?page=${page}&limit=${limit}`;

  const params = new URLSearchParams();
  if (metric_type) params.append('metric_type', metric_type);
  if (start_date) params.append('start_date', start_date);
  if (end_date) params.append('end_date', end_date);

  if (params.toString()) {
    url += `&${params.toString()}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to fetch metrics: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a productivity metric
 */
export async function createProductivityMetric(
  metricData: ProductivityMetricCreate
): Promise<ProductivityMetric> {
  const response = await fetch(`${API_URL}/api/v1/analytics/metrics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify(metricData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to create metric: ${response.status}`);
  }

  return response.json();
}