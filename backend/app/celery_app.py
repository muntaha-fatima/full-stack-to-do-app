"""
Celery application configuration for async tasks
"""
from celery import Celery
from app.core.config import settings


# Create Celery instance
celery_app = Celery(__name__)

# Configure Celery
celery_app.conf.update(
    broker_url=settings.CELERY_BROKER_URL,
    result_backend=settings.CELERY_RESULT_BACKEND,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_routes={
        'app.tasks.email_tasks.send_verification_email': {'queue': 'email'},
        'app.tasks.email_tasks.send_password_reset_email': {'queue': 'email'},
    },
    worker_prefetch_multiplier=1,
    task_acks_late=True,
)


# Import tasks after creating the app to avoid circular imports
from app.tasks import email_tasks  # noqa: F401