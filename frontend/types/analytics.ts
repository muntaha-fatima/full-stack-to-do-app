/**
 * Analytics type definitions.
 */

export interface TaskCompletionInsight {
  completed_count: number;
  total_count: number;
  completion_rate: number;
  period: string;
}

export interface ProductivityInsightsResponse {
  user_id: number;
  overall_completion_rate: number;
  weekly_insights: TaskCompletionInsight[];
  monthly_insights: TaskCompletionInsight[];
  top_categories: Array<{ name: string; count: number }>;
  average_completion_time: number; // in hours
}

export interface UserActivity {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  metadata_json: Record<string, unknown>;
  timestamp: string;
}

export interface UserActivityCreate {
  action: string;
  entity_type: string;
  entity_id: number;
  metadata?: Record<string, unknown>;
}

export interface UserActivityListResponse {
  data: UserActivity[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ProductivityMetric {
  id: number;
  user_id: number;
  metric_type: string;
  value: number;
  period_start: string;
  period_end: string;
  calculated_at: string;
}

export interface ProductivityMetricCreate {
  metric_type: string;
  value: number;
  period_start: string;
  period_end: string;
}

export interface ProductivityMetricListResponse {
  data: ProductivityMetric[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}