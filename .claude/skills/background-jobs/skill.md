# Background Jobs & Task Queues Skill

## Description
Expert in implementing background job processing, task queues, and asynchronous task execution using Celery, Redis Queue (RQ), and other task queue systems.

## Capabilities

### Task Queue Systems
- **Celery**: Distributed task queue for Python
- **Redis Queue (RQ)**: Simple Python task queue
- **Dramatiq**: Fast and reliable task processing
- **APScheduler**: Advanced Python scheduler
- **Cron Jobs**: Scheduled task execution
- **FastAPI Background Tasks**: Simple async tasks

### Task Patterns
- **Fire and Forget**: Non-blocking task execution
- **Delayed Execution**: Schedule tasks for later
- **Periodic Tasks**: Recurring scheduled tasks
- **Task Chains**: Sequential task execution
- **Task Groups**: Parallel task execution
- **Task Retries**: Automatic retry on failure

### Use Cases
- **Email Sending**: Async email delivery
- **Image Processing**: Thumbnail generation, resizing
- **Report Generation**: PDF/CSV generation
- **Data Import/Export**: Large file processing
- **Notifications**: Push notifications, SMS
- **Cleanup Tasks**: Database maintenance, log rotation

## Usage Examples

### Celery Setup with FastAPI

```python
# app/celery_app.py
from celery import Celery
from app.config import settings

celery_app = Celery(
    "tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks"]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Periodic tasks configuration
from celery.schedules import crontab

celery_app.conf.beat_schedule = {
    "cleanup-old-sessions": {
        "task": "app.tasks.cleanup_old_sessions",
        "schedule": crontab(hour=2, minute=0),  # Daily at 2 AM
    },
    "send-daily-digest": {
        "task": "app.tasks.send_daily_digest",
        "schedule": crontab(hour=8, minute=0),  # Daily at 8 AM
    },
    "update-statistics": {
        "task": "app.tasks.update_statistics",
        "schedule": 300.0,  # Every 5 minutes
    },
}

# app/tasks.py
from app.celery_app import celery_app
from celery import Task
from celery.utils.log import get_task_logger
from typing import Any
import time

logger = get_task_logger(__name__)

class CallbackTask(Task):
    """Base task with callbacks"""

    def on_success(self, retval, task_id, args, kwargs):
        """Success callback"""
        logger.info(f"Task {task_id} succeeded with result: {retval}")

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """Failure callback"""
        logger.error(f"Task {task_id} failed: {exc}")

    def on_retry(self, exc, task_id, args, kwargs, einfo):
        """Retry callback"""
        logger.warning(f"Task {task_id} retrying: {exc}")

@celery_app.task(
    base=CallbackTask,
    bind=True,
    max_retries=3,
    default_retry_delay=60
)
def send_email(self, to: str, subject: str, body: str):
    """Send email asynchronously"""
    try:
        logger.info(f"Sending email to {to}")

        # Email sending logic
        from app.email import send_email_smtp
        send_email_smtp(to, subject, body)

        logger.info(f"Email sent successfully to {to}")
        return {"status": "sent", "to": to}

    except Exception as exc:
        logger.error(f"Failed to send email: {exc}")
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)

@celery_app.task(bind=True, max_retries=3)
def process_image(self, image_path: str, operations: list):
    """Process image with various operations"""
    try:
        from PIL import Image
        import os

        logger.info(f"Processing image: {image_path}")

        img = Image.open(image_path)

        for operation in operations:
            if operation["type"] == "resize":
                img = img.resize(operation["size"])
            elif operation["type"] == "thumbnail":
                img.thumbnail(operation["size"])
            elif operation["type"] == "rotate":
                img = img.rotate(operation["angle"])

        # Save processed image
        output_path = f"{os.path.splitext(image_path)[0]}_processed.jpg"
        img.save(output_path)

        logger.info(f"Image processed: {output_path}")
        return {"status": "processed", "output": output_path}

    except Exception as exc:
        logger.error(f"Image processing failed: {exc}")
        raise self.retry(exc=exc)

@celery_app.task
def generate_report(user_id: int, report_type: str):
    """Generate report asynchronously"""
    logger.info(f"Generating {report_type} report for user {user_id}")

    # Report generation logic
    from app.reports import ReportGenerator

    generator = ReportGenerator()
    report_path = generator.generate(user_id, report_type)

    logger.info(f"Report generated: {report_path}")
    return {"status": "generated", "path": report_path}

@celery_app.task
def cleanup_old_sessions():
    """Periodic task to cleanup old sessions"""
    from datetime import datetime, timedelta
    from app.database import SessionLocal
    from app.models import Session

    logger.info("Cleaning up old sessions")

    db = SessionLocal()
    try:
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        deleted = db.query(Session).filter(
            Session.last_activity < cutoff_date
        ).delete()

        db.commit()
        logger.info(f"Deleted {deleted} old sessions")
        return {"deleted": deleted}

    finally:
        db.close()

@celery_app.task
def send_daily_digest():
    """Send daily digest emails"""
    logger.info("Sending daily digest emails")

    from app.database import SessionLocal
    from app.models import User

    db = SessionLocal()
    try:
        users = db.query(User).filter(User.email_notifications == True).all()

        for user in users:
            send_email.delay(
                to=user.email,
                subject="Daily Digest",
                body=f"Hello {user.username}, here's your daily digest..."
            )

        logger.info(f"Queued {len(users)} digest emails")
        return {"queued": len(users)}

    finally:
        db.close()

# Task chains and groups
from celery import chain, group, chord

@celery_app.task
def process_data(data):
    """Process data"""
    return data * 2

@celery_app.task
def aggregate_results(results):
    """Aggregate results"""
    return sum(results)

# Chain: Execute tasks sequentially
result = chain(
    process_data.s(5),
    process_data.s(),
    process_data.s()
).apply_async()

# Group: Execute tasks in parallel
result = group(
    process_data.s(1),
    process_data.s(2),
    process_data.s(3)
).apply_async()

# Chord: Execute tasks in parallel, then aggregate
result = chord(
    group(process_data.s(i) for i in range(10))
)(aggregate_results.s()).get()
```

### FastAPI Integration

```python
# app/routers/tasks.py
from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.tasks import send_email, process_image, generate_report
from app.schemas.task import TaskResponse

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.post("/send-email", response_model=TaskResponse)
async def queue_email(
    to: str,
    subject: str,
    body: str
):
    """Queue email for sending"""
    task = send_email.delay(to, subject, body)

    return {
        "task_id": task.id,
        "status": "queued",
        "message": "Email queued for sending"
    }

@router.post("/process-image", response_model=TaskResponse)
async def queue_image_processing(
    image_path: str,
    operations: list
):
    """Queue image processing"""
    task = process_image.delay(image_path, operations)

    return {
        "task_id": task.id,
        "status": "queued",
        "message": "Image processing queued"
    }

@router.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Get task status"""
    from celery.result import AsyncResult

    task = AsyncResult(task_id, app=celery_app)

    if task.state == "PENDING":
        response = {
            "task_id": task_id,
            "status": "pending",
            "progress": 0
        }
    elif task.state == "STARTED":
        response = {
            "task_id": task_id,
            "status": "started",
            "progress": 50
        }
    elif task.state == "SUCCESS":
        response = {
            "task_id": task_id,
            "status": "success",
            "progress": 100,
            "result": task.result
        }
    elif task.state == "FAILURE":
        response = {
            "task_id": task_id,
            "status": "failed",
            "error": str(task.info)
        }
    else:
        response = {
            "task_id": task_id,
            "status": task.state,
            "progress": 0
        }

    return response

@router.post("/tasks/{task_id}/cancel")
async def cancel_task(task_id: str):
    """Cancel a task"""
    from celery.result import AsyncResult

    task = AsyncResult(task_id, app=celery_app)
    task.revoke(terminate=True)

    return {"message": "Task cancelled", "task_id": task_id}

# Simple background tasks (without Celery)
from fastapi import BackgroundTasks

def write_log(message: str):
    """Simple background task"""
    with open("log.txt", "a") as f:
        f.write(f"{message}\n")

@router.post("/simple-task")
async def create_simple_task(
    message: str,
    background_tasks: BackgroundTasks
):
    """Create simple background task"""
    background_tasks.add_task(write_log, message)
    return {"message": "Task queued"}
```

### Redis Queue (RQ) Alternative

```python
# app/rq_tasks.py
from redis import Redis
from rq import Queue
from rq.job import Job
from app.config import settings

# Create Redis connection
redis_conn = Redis.from_url(settings.REDIS_URL)

# Create queues
default_queue = Queue("default", connection=redis_conn)
high_priority_queue = Queue("high", connection=redis_conn)
low_priority_queue = Queue("low", connection=redis_conn)

# Task functions
def send_email_rq(to: str, subject: str, body: str):
    """Send email using RQ"""
    import time
    print(f"Sending email to {to}")
    time.sleep(2)  # Simulate email sending
    return {"status": "sent", "to": to}

def process_image_rq(image_path: str):
    """Process image using RQ"""
    from PIL import Image

    img = Image.open(image_path)
    img.thumbnail((200, 200))
    output_path = f"{image_path}_thumb.jpg"
    img.save(output_path)

    return {"status": "processed", "output": output_path}

# Enqueue tasks
job = default_queue.enqueue(
    send_email_rq,
    "user@example.com",
    "Hello",
    "Test email",
    job_timeout="5m",
    result_ttl=3600,
    failure_ttl=86400
)

# Schedule task for later
from datetime import datetime, timedelta

job = default_queue.enqueue_at(
    datetime.utcnow() + timedelta(hours=1),
    send_email_rq,
    "user@example.com",
    "Scheduled",
    "This email was scheduled"
)

# Get job status
job = Job.fetch(job_id, connection=redis_conn)
print(f"Status: {job.get_status()}")
print(f"Result: {job.result}")

# FastAPI integration
from fastapi import APIRouter

router = APIRouter()

@router.post("/rq/send-email")
async def queue_email_rq(to: str, subject: str, body: str):
    """Queue email with RQ"""
    job = default_queue.enqueue(
        send_email_rq,
        to,
        subject,
        body
    )

    return {
        "job_id": job.id,
        "status": "queued"
    }

@router.get("/rq/jobs/{job_id}")
async def get_job_status(job_id: str):
    """Get RQ job status"""
    try:
        job = Job.fetch(job_id, connection=redis_conn)

        return {
            "job_id": job_id,
            "status": job.get_status(),
            "result": job.result,
            "created_at": job.created_at.isoformat() if job.created_at else None,
            "started_at": job.started_at.isoformat() if job.started_at else None,
            "ended_at": job.ended_at.isoformat() if job.ended_at else None,
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="Job not found")
```

### Task Progress Tracking

```python
# app/tasks.py
from celery import Task

class ProgressTask(Task):
    """Task with progress tracking"""

    def update_progress(self, current, total, message=""):
        """Update task progress"""
        self.update_state(
            state="PROGRESS",
            meta={
                "current": current,
                "total": total,
                "percent": int((current / total) * 100),
                "message": message
            }
        )

@celery_app.task(base=ProgressTask, bind=True)
def process_large_file(self, file_path: str):
    """Process large file with progress tracking"""
    import time

    total_lines = 1000  # Example

    for i in range(total_lines):
        # Process line
        time.sleep(0.01)

        # Update progress every 10 lines
        if i % 10 == 0:
            self.update_progress(
                current=i,
                total=total_lines,
                message=f"Processing line {i}/{total_lines}"
            )

    return {"status": "completed", "lines_processed": total_lines}

# Frontend polling for progress
@router.get("/tasks/{task_id}/progress")
async def get_task_progress(task_id: str):
    """Get task progress"""
    from celery.result import AsyncResult

    task = AsyncResult(task_id, app=celery_app)

    if task.state == "PROGRESS":
        return {
            "task_id": task_id,
            "status": "in_progress",
            **task.info
        }
    elif task.state == "SUCCESS":
        return {
            "task_id": task_id,
            "status": "completed",
            "result": task.result
        }
    elif task.state == "FAILURE":
        return {
            "task_id": task_id,
            "status": "failed",
            "error": str(task.info)
        }
    else:
        return {
            "task_id": task_id,
            "status": task.state.lower()
        }
```

### Monitoring and Management

```python
# app/celery_monitoring.py
from celery import Celery
from celery.events import EventReceiver
from kombu import Connection

def monitor_celery_events(app: Celery):
    """Monitor Celery events"""

    def on_task_sent(event):
        print(f"Task sent: {event['uuid']}")

    def on_task_received(event):
        print(f"Task received: {event['uuid']}")

    def on_task_started(event):
        print(f"Task started: {event['uuid']}")

    def on_task_succeeded(event):
        print(f"Task succeeded: {event['uuid']}")

    def on_task_failed(event):
        print(f"Task failed: {event['uuid']}")

    def on_task_retried(event):
        print(f"Task retried: {event['uuid']}")

    with Connection(app.broker_url) as connection:
        recv = EventReceiver(
            connection,
            handlers={
                "task-sent": on_task_sent,
                "task-received": on_task_received,
                "task-started": on_task_started,
                "task-succeeded": on_task_succeeded,
                "task-failed": on_task_failed,
                "task-retried": on_task_retried,
            }
        )
        recv.capture(limit=None, timeout=None, wakeup=True)

# Celery management commands
from celery import current_app

# Get active tasks
active_tasks = current_app.control.inspect().active()

# Get scheduled tasks
scheduled_tasks = current_app.control.inspect().scheduled()

# Get registered tasks
registered_tasks = current_app.control.inspect().registered()

# Revoke task
current_app.control.revoke(task_id, terminate=True)

# Purge queue
current_app.control.purge()

# Get worker stats
stats = current_app.control.inspect().stats()
```

### Docker Compose for Celery

```yaml
# docker-compose.yml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - redis
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/0

  celery_worker:
    build: ./backend
    command: celery -A app.celery_app worker --loglevel=info
    volumes:
      - ./backend:/app
    depends_on:
      - redis
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/0

  celery_beat:
    build: ./backend
    command: celery -A app.celery_app beat --loglevel=info
    volumes:
      - ./backend:/app
    depends_on:
      - redis
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/0

  flower:
    build: ./backend
    command: celery -A app.celery_app flower --port=5555
    ports:
      - "5555:5555"
    depends_on:
      - redis
      - celery_worker
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/0
```

## Best Practices

1. **Idempotent Tasks**: Tasks should be safe to retry
2. **Task Timeouts**: Set appropriate time limits
3. **Error Handling**: Implement proper retry logic
4. **Task Monitoring**: Track task execution and failures
5. **Queue Separation**: Use different queues for priorities
6. **Result Expiration**: Set TTL for task results
7. **Graceful Shutdown**: Handle worker shutdown properly
8. **Resource Limits**: Limit concurrent tasks
9. **Task Serialization**: Use JSON for portability
10. **Logging**: Comprehensive task logging

## Task Queue Checklist

- [ ] Task queue system installed (Celery/RQ)
- [ ] Message broker configured (Redis/RabbitMQ)
- [ ] Result backend configured
- [ ] Task retry logic implemented
- [ ] Task timeouts set
- [ ] Periodic tasks configured
- [ ] Task monitoring setup (Flower)
- [ ] Error handling and logging
- [ ] Worker scaling strategy
- [ ] Task result cleanup

## Common Patterns

### Email Queue
- Async email sending
- Retry on SMTP failures
- Email templates
- Batch email sending

### Image Processing
- Thumbnail generation
- Image resizing
- Format conversion
- Watermarking

### Report Generation
- PDF generation
- CSV exports
- Data aggregation
- Scheduled reports

### Data Processing
- ETL pipelines
- Data imports
- Batch processing
- Data validation

## Resources

- [Celery Documentation](https://docs.celeryq.dev/)
- [Redis Queue Documentation](https://python-rq.org/)
- [Flower Documentation](https://flower.readthedocs.io/)
- [Task Queue Patterns](https://www.cloudamqp.com/blog/part1-rabbitmq-best-practice.html)
