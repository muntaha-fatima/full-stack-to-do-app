# Monitoring & Observability Skill

## Description
Expert in implementing comprehensive monitoring, logging, metrics, tracing, and alerting for production applications to ensure reliability and performance.

## Capabilities

### Application Monitoring
- **APM Tools**: Application Performance Monitoring
- **Error Tracking**: Sentry, Rollbar, Bugsnag
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Synthetic Monitoring**: Automated testing
- **Real User Monitoring (RUM)**: User experience tracking
- **Performance Metrics**: Response times, throughput

### Metrics & Instrumentation
- **Prometheus**: Metrics collection and storage
- **Grafana**: Metrics visualization
- **StatsD**: Metrics aggregation
- **Custom Metrics**: Business and technical metrics
- **Time Series Data**: Historical metric tracking
- **Alerting**: Threshold-based alerts

### Distributed Tracing
- **OpenTelemetry**: Unified observability framework
- **Jaeger**: Distributed tracing system
- **Zipkin**: Distributed tracing
- **Trace Context**: Request correlation
- **Span Tracking**: Operation timing
- **Service Dependencies**: Service map visualization

### Log Management
- **Centralized Logging**: ELK Stack, Loki
- **Log Aggregation**: Collecting logs from multiple sources
- **Log Analysis**: Searching and analyzing logs
- **Log Retention**: Storage and archival policies
- **Structured Logging**: JSON-formatted logs
- **Log Correlation**: Linking logs with traces

### Health Checks
- **Liveness Probes**: Service availability
- **Readiness Probes**: Service ready to accept traffic
- **Startup Probes**: Service initialization
- **Dependency Checks**: External service health
- **Database Health**: Connection pool status
- **Custom Health Checks**: Business logic validation

## Usage Examples

### Prometheus Metrics - FastAPI

```python
# app/monitoring/metrics.py
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from prometheus_client import CONTENT_TYPE_LATEST
from fastapi import Response
import time
from functools import wraps

# Define metrics
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

active_requests = Gauge(
    'active_requests',
    'Number of active requests'
)

database_connections = Gauge(
    'database_connections',
    'Number of active database connections'
)

task_processing_time = Histogram(
    'task_processing_time_seconds',
    'Task processing time in seconds',
    ['task_type']
)

# Middleware for automatic metrics
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

class PrometheusMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Increment active requests
        active_requests.inc()

        # Start timer
        start_time = time.time()

        try:
            # Process request
            response = await call_next(request)

            # Record metrics
            duration = time.time() - start_time
            http_request_duration_seconds.labels(
                method=request.method,
                endpoint=request.url.path
            ).observe(duration)

            http_requests_total.labels(
                method=request.method,
                endpoint=request.url.path,
                status=response.status_code
            ).inc()

            return response

        finally:
            # Decrement active requests
            active_requests.dec()

# Metrics endpoint
from fastapi import APIRouter

router = APIRouter()

@router.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

# Custom metric decorator
def track_time(metric_name: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start_time
                task_processing_time.labels(
                    task_type=metric_name
                ).observe(duration)
        return wrapper
    return decorator

# Usage
@track_time("process_payment")
async def process_payment(order_id: int):
    # Payment processing logic
    pass

# Database connection monitoring
from sqlalchemy import event
from sqlalchemy.pool import Pool

@event.listens_for(Pool, "connect")
def receive_connect(dbapi_conn, connection_record):
    database_connections.inc()

@event.listens_for(Pool, "close")
def receive_close(dbapi_conn, connection_record):
    database_connections.dec()
```

### OpenTelemetry Tracing

```python
# app/monitoring/tracing.py
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor

def setup_tracing(app, service_name: str):
    """Setup OpenTelemetry tracing"""

    # Create resource
    resource = Resource.create({
        "service.name": service_name,
        "service.version": "1.0.0",
        "deployment.environment": "production"
    })

    # Create tracer provider
    tracer_provider = TracerProvider(resource=resource)

    # Configure Jaeger exporter
    jaeger_exporter = JaegerExporter(
        agent_host_name="localhost",
        agent_port=6831,
    )

    # Add span processor
    tracer_provider.add_span_processor(
        BatchSpanProcessor(jaeger_exporter)
    )

    # Set global tracer provider
    trace.set_tracer_provider(tracer_provider)

    # Instrument FastAPI
    FastAPIInstrumentor.instrument_app(app)

    # Instrument SQLAlchemy
    SQLAlchemyInstrumentor().instrument()

    # Instrument requests library
    RequestsInstrumentor().instrument()

# Manual tracing
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

async def process_order(order_id: int):
    """Process order with tracing"""

    with tracer.start_as_current_span("process_order") as span:
        # Add attributes
        span.set_attribute("order.id", order_id)
        span.set_attribute("order.status", "processing")

        # Validate order
        with tracer.start_as_current_span("validate_order"):
            is_valid = await validate_order(order_id)
            span.set_attribute("order.valid", is_valid)

        if not is_valid:
            span.set_attribute("order.status", "invalid")
            span.add_event("Order validation failed")
            raise ValueError("Invalid order")

        # Process payment
        with tracer.start_as_current_span("process_payment"):
            payment_result = await process_payment(order_id)
            span.set_attribute("payment.status", payment_result.status)

        # Update inventory
        with tracer.start_as_current_span("update_inventory"):
            await update_inventory(order_id)

        span.set_attribute("order.status", "completed")
        span.add_event("Order processed successfully")

        return {"status": "success", "order_id": order_id}
```

### Sentry Error Tracking

```python
# app/monitoring/sentry_config.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
from app.config import settings

def init_sentry():
    """Initialize Sentry error tracking"""

    if not settings.SENTRY_DSN:
        return

    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        release=f"{settings.PROJECT_NAME}@{settings.VERSION}",

        # Performance monitoring
        traces_sample_rate=0.1,  # 10% of transactions
        profiles_sample_rate=0.1,  # 10% of transactions

        # Integrations
        integrations=[
            FastApiIntegration(),
            SqlalchemyIntegration(),
            LoggingIntegration(
                level=logging.INFO,
                event_level=logging.ERROR
            ),
        ],

        # Before send hook
        before_send=before_send_handler,

        # Ignore specific errors
        ignore_errors=[
            KeyboardInterrupt,
            SystemExit,
        ],
    )

def before_send_handler(event, hint):
    """Filter and modify events before sending"""

    # Don't send validation errors
    if 'exc_info' in hint:
        exc_type, exc_value, tb = hint['exc_info']
        if isinstance(exc_value, ValidationError):
            return None

    # Add custom context
    event.setdefault('tags', {})
    event['tags']['environment'] = settings.ENVIRONMENT
    event['tags']['server'] = socket.gethostname()

    # Add user context if available
    if hasattr(g, 'user'):
        event['user'] = {
            'id': g.user.id,
            'email': g.user.email,
            'username': g.user.username,
        }

    return event

# Capture custom errors
from sentry_sdk import capture_exception, capture_message

try:
    risky_operation()
except Exception as e:
    capture_exception(e)
    raise

# Capture custom messages
capture_message("Important event occurred", level="info")

# Add breadcrumbs
from sentry_sdk import add_breadcrumb

add_breadcrumb(
    category='auth',
    message='User logged in',
    level='info',
    data={'user_id': user.id}
)

# Set user context
from sentry_sdk import set_user

set_user({
    'id': user.id,
    'email': user.email,
    'username': user.username,
})

# Set custom tags
from sentry_sdk import set_tag

set_tag('payment_method', 'credit_card')
set_tag('subscription_tier', 'premium')
```

### Health Check Endpoints

```python
# app/routers/health.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db
from app.config import settings
import time
import psutil

router = APIRouter(tags=["health"])

@router.get("/health")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION,
    }

@router.get("/health/detailed")
async def detailed_health_check(db: AsyncSession = Depends(get_db)):
    """Detailed health check with dependencies"""

    start_time = time.time()
    checks = {}

    # Database check
    try:
        await db.execute(text("SELECT 1"))
        checks["database"] = {
            "status": "healthy",
            "response_time_ms": round((time.time() - start_time) * 1000, 2)
        }
    except Exception as e:
        checks["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }

    # Redis check (if using Redis)
    try:
        redis_start = time.time()
        await redis_client.ping()
        checks["redis"] = {
            "status": "healthy",
            "response_time_ms": round((time.time() - redis_start) * 1000, 2)
        }
    except Exception as e:
        checks["redis"] = {
            "status": "unhealthy",
            "error": str(e)
        }

    # System resources
    checks["system"] = {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage('/').percent,
    }

    # Overall status
    overall_status = "healthy" if all(
        check.get("status") == "healthy"
        for check in checks.values()
        if "status" in check
    ) else "unhealthy"

    return {
        "status": overall_status,
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION,
        "checks": checks,
        "total_response_time_ms": round((time.time() - start_time) * 1000, 2)
    }

@router.get("/health/liveness")
async def liveness_probe():
    """Kubernetes liveness probe"""
    return {"status": "alive"}

@router.get("/health/readiness")
async def readiness_probe(db: AsyncSession = Depends(get_db)):
    """Kubernetes readiness probe"""
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception:
        return Response(
            content=json.dumps({"status": "not ready"}),
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        )
```

### Grafana Dashboard Configuration

```yaml
# grafana/dashboards/api-dashboard.json
{
  "dashboard": {
    "title": "API Monitoring Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "{{endpoint}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "{{endpoint}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Active Requests",
        "targets": [
          {
            "expr": "active_requests",
            "legendFormat": "Active"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Database Connections",
        "targets": [
          {
            "expr": "database_connections",
            "legendFormat": "Connections"
          }
        ],
        "type": "graph"
      }
    ]
  }
}
```

### Alerting Rules

```yaml
# prometheus/alerts.yml
groups:
  - name: api_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} requests/sec"

      # Slow response time
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow response time detected"
          description: "P95 response time is {{ $value }}s"

      # High CPU usage
      - alert: HighCPUUsage
        expr: process_cpu_seconds_total > 0.8
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value }}%"

      # Database connection pool exhausted
      - alert: DatabaseConnectionPoolExhausted
        expr: database_connections > 18
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "{{ $value }} connections active (max 20)"

      # Service down
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "{{ $labels.instance }} is down"
```

### Frontend Monitoring - Next.js

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

export function initMonitoring() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
      ],

      beforeSend(event, hint) {
        // Filter out certain errors
        if (event.exception) {
          const error = hint.originalException
          if (error instanceof TypeError && error.message.includes('NetworkError')) {
            return null
          }
        }
        return event
      },
    })
  }
}

// Track custom events
export function trackEvent(name: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, properties)
  }

  // Also send to Sentry as breadcrumb
  Sentry.addBreadcrumb({
    category: 'custom',
    message: name,
    data: properties,
    level: 'info',
  })
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    })
  }
}

// Track performance
export function trackPerformance(metric: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }
}
```

## Best Practices

1. **Monitor Everything**: Application, infrastructure, business metrics
2. **Set Baselines**: Understand normal behavior
3. **Alert on Symptoms**: Alert on user-facing issues, not causes
4. **Reduce Noise**: Tune alerts to avoid alert fatigue
5. **Correlate Data**: Link logs, metrics, and traces
6. **Automate Response**: Auto-remediation where possible
7. **Document Runbooks**: Clear incident response procedures
8. **Regular Reviews**: Review and update monitoring
9. **Cost Management**: Balance coverage with cost
10. **Privacy Compliance**: Respect user privacy in monitoring

## Monitoring Checklist

- [ ] Error tracking configured (Sentry)
- [ ] Metrics collection (Prometheus)
- [ ] Distributed tracing (OpenTelemetry)
- [ ] Centralized logging
- [ ] Health check endpoints
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Alerting rules defined
- [ ] Dashboards created
- [ ] Runbooks documented
- [ ] On-call rotation established
- [ ] Incident response process
- [ ] Post-mortem template
- [ ] SLO/SLA defined

## Key Metrics to Track

### Application Metrics
- Request rate (requests/second)
- Error rate (errors/second)
- Response time (p50, p95, p99)
- Active requests
- Queue depth

### Infrastructure Metrics
- CPU usage
- Memory usage
- Disk usage
- Network I/O
- Database connections

### Business Metrics
- User signups
- Active users
- Revenue
- Conversion rate
- Feature usage

## Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Google SRE Book](https://sre.google/books/)
