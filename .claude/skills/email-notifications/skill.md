# Email & Notifications Skill

## Description
Expert in implementing email delivery, notification systems, and communication features using SMTP, SendGrid, AWS SES, and push notifications.

## Capabilities

### Email Delivery
- **SMTP**: Direct email sending
- **SendGrid**: Email API service
- **AWS SES**: Amazon Simple Email Service
- **Mailgun**: Email API platform
- **Email Templates**: HTML email templates
- **Transactional Emails**: Order confirmations, receipts
- **Marketing Emails**: Newsletters, campaigns

### Email Features
- **HTML Templates**: Responsive email design
- **Attachments**: File attachments
- **Inline Images**: Embedded images
- **Plain Text Alternative**: Fallback for HTML
- **Email Tracking**: Open and click tracking
- **Unsubscribe Links**: Opt-out management
- **Email Validation**: Address verification

### Notification Systems
- **Push Notifications**: Web and mobile push
- **In-App Notifications**: Real-time notifications
- **SMS Notifications**: Text message alerts
- **Slack/Discord**: Team notifications
- **Webhook Notifications**: HTTP callbacks
- **Email Digests**: Batched notifications

### Queue Management
- **Async Sending**: Background email processing
- **Retry Logic**: Failed email retry
- **Rate Limiting**: Sending limits
- **Priority Queues**: Urgent vs normal emails
- **Batch Sending**: Bulk email campaigns
- **Scheduling**: Delayed email delivery

## Usage Examples

### SMTP Email Sending

```python
# app/email/smtp.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Optional
import logging
from app.config import settings

logger = logging.getLogger(__name__)

class SMTPEmailService:
    """SMTP email service"""

    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.FROM_EMAIL
        self.from_name = settings.FROM_NAME

    def send_email(
        self,
        to: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        attachments: Optional[List[str]] = None
    ) -> bool:
        """Send email via SMTP"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to

            # Add plain text version
            if text_content:
                part1 = MIMEText(text_content, 'plain')
                msg.attach(part1)

            # Add HTML version
            part2 = MIMEText(html_content, 'html')
            msg.attach(part2)

            # Add attachments
            if attachments:
                for file_path in attachments:
                    with open(file_path, 'rb') as f:
                        part = MIMEBase('application', 'octet-stream')
                        part.set_payload(f.read())
                        encoders.encode_base64(part)
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename={os.path.basename(file_path)}'
                        )
                        msg.attach(part)

            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)

            logger.info(f"Email sent to {to}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False

    def send_bulk_email(
        self,
        recipients: List[str],
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> dict:
        """Send email to multiple recipients"""
        results = {
            'sent': 0,
            'failed': 0,
            'errors': []
        }

        for recipient in recipients:
            success = self.send_email(
                recipient,
                subject,
                html_content,
                text_content
            )

            if success:
                results['sent'] += 1
            else:
                results['failed'] += 1
                results['errors'].append(recipient)

        return results

# Create global email service
email_service = SMTPEmailService()
```

### Email Templates with Jinja2

```python
# app/email/templates.py
from jinja2 import Environment, FileSystemLoader, select_autoescape
from pathlib import Path
from typing import Dict, Any

class EmailTemplateService:
    """Email template rendering service"""

    def __init__(self, template_dir: str = "app/email/templates"):
        self.env = Environment(
            loader=FileSystemLoader(template_dir),
            autoescape=select_autoescape(['html', 'xml'])
        )

    def render_template(
        self,
        template_name: str,
        context: Dict[str, Any]
    ) -> str:
        """Render email template"""
        template = self.env.get_template(template_name)
        return template.render(**context)

    def render_welcome_email(self, user_name: str, verification_link: str) -> str:
        """Render welcome email"""
        return self.render_template('welcome.html', {
            'user_name': user_name,
            'verification_link': verification_link,
            'year': datetime.now().year
        })

    def render_password_reset_email(
        self,
        user_name: str,
        reset_link: str,
        expiry_hours: int = 24
    ) -> str:
        """Render password reset email"""
        return self.render_template('password_reset.html', {
            'user_name': user_name,
            'reset_link': reset_link,
            'expiry_hours': expiry_hours,
            'year': datetime.now().year
        })

    def render_order_confirmation_email(
        self,
        user_name: str,
        order_number: str,
        order_items: List[dict],
        total_amount: float
    ) -> str:
        """Render order confirmation email"""
        return self.render_template('order_confirmation.html', {
            'user_name': user_name,
            'order_number': order_number,
            'order_items': order_items,
            'total_amount': total_amount,
            'year': datetime.now().year
        })

template_service = EmailTemplateService()

# app/email/templates/welcome.html
"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Platform</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to Our Platform!</h1>
    </div>
    <div class="content">
        <p>Hi {{ user_name }},</p>

        <p>Thank you for signing up! We're excited to have you on board.</p>

        <p>To get started, please verify your email address by clicking the button below:</p>

        <a href="{{ verification_link }}" class="button">Verify Email Address</a>

        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4F46E5;">{{ verification_link }}</p>

        <p>If you didn't create an account, you can safely ignore this email.</p>

        <p>Best regards,<br>The Team</p>
    </div>
    <div class="footer">
        <p>&copy; {{ year }} Your Company. All rights reserved.</p>
        <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
    </div>
</body>
</html>
"""
```

### SendGrid Integration

```python
# app/email/sendgrid_service.py
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, Attachment, FileContent, FileName, FileType, Disposition
from typing import List, Optional
import base64
import logging
from app.config import settings

logger = logging.getLogger(__name__)

class SendGridEmailService:
    """SendGrid email service"""

    def __init__(self):
        self.client = SendGridAPIClient(settings.SENDGRID_API_KEY)
        self.from_email = settings.FROM_EMAIL
        self.from_name = settings.FROM_NAME

    def send_email(
        self,
        to: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        attachments: Optional[List[dict]] = None,
        categories: Optional[List[str]] = None
    ) -> bool:
        """Send email via SendGrid"""
        try:
            message = Mail(
                from_email=Email(self.from_email, self.from_name),
                to_emails=To(to),
                subject=subject,
                html_content=Content("text/html", html_content)
            )

            # Add plain text content
            if text_content:
                message.add_content(Content("text/plain", text_content))

            # Add attachments
            if attachments:
                for attachment in attachments:
                    with open(attachment['path'], 'rb') as f:
                        data = f.read()
                        encoded = base64.b64encode(data).decode()

                    attached_file = Attachment(
                        FileContent(encoded),
                        FileName(attachment['filename']),
                        FileType(attachment.get('type', 'application/octet-stream')),
                        Disposition('attachment')
                    )
                    message.add_attachment(attached_file)

            # Add categories for tracking
            if categories:
                for category in categories:
                    message.add_category(category)

            # Send email
            response = self.client.send(message)

            logger.info(f"Email sent to {to}, status: {response.status_code}")
            return response.status_code == 202

        except Exception as e:
            logger.error(f"SendGrid error: {e}")
            return False

    def send_template_email(
        self,
        to: str,
        template_id: str,
        dynamic_data: dict
    ) -> bool:
        """Send email using SendGrid template"""
        try:
            message = Mail(
                from_email=Email(self.from_email, self.from_name),
                to_emails=To(to)
            )

            message.template_id = template_id
            message.dynamic_template_data = dynamic_data

            response = self.client.send(message)
            return response.status_code == 202

        except Exception as e:
            logger.error(f"SendGrid template error: {e}")
            return False

sendgrid_service = SendGridEmailService()
```

### Celery Email Tasks

```python
# app/tasks/email_tasks.py
from app.celery_app import celery_app
from app.email.smtp import email_service
from app.email.templates import template_service
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

@celery_app.task(bind=True, max_retries=3)
def send_welcome_email(self, user_email: str, user_name: str, verification_token: str):
    """Send welcome email asynchronously"""
    try:
        verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"

        html_content = template_service.render_welcome_email(
            user_name=user_name,
            verification_link=verification_link
        )

        success = email_service.send_email(
            to=user_email,
            subject="Welcome! Please verify your email",
            html_content=html_content
        )

        if not success:
            raise Exception("Failed to send email")

        logger.info(f"Welcome email sent to {user_email}")
        return {"status": "sent", "to": user_email}

    except Exception as exc:
        logger.error(f"Failed to send welcome email: {exc}")
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))

@celery_app.task(bind=True, max_retries=3)
def send_password_reset_email(
    self,
    user_email: str,
    user_name: str,
    reset_token: str
):
    """Send password reset email"""
    try:
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"

        html_content = template_service.render_password_reset_email(
            user_name=user_name,
            reset_link=reset_link
        )

        success = email_service.send_email(
            to=user_email,
            subject="Password Reset Request",
            html_content=html_content
        )

        if not success:
            raise Exception("Failed to send email")

        logger.info(f"Password reset email sent to {user_email}")
        return {"status": "sent", "to": user_email}

    except Exception as exc:
        logger.error(f"Failed to send password reset email: {exc}")
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))

@celery_app.task
def send_daily_digest_emails():
    """Send daily digest emails to all subscribed users"""
    from app.database import SessionLocal
    from app.models import User

    db = SessionLocal()
    try:
        users = db.query(User).filter(
            User.email_notifications == True,
            User.is_active == True
        ).all()

        for user in users:
            send_digest_email.delay(user.email, user.username)

        logger.info(f"Queued {len(users)} digest emails")
        return {"queued": len(users)}

    finally:
        db.close()

@celery_app.task(bind=True, max_retries=2)
def send_digest_email(self, user_email: str, user_name: str):
    """Send individual digest email"""
    try:
        # Get user's digest data
        digest_data = get_user_digest_data(user_email)

        html_content = template_service.render_template('digest.html', {
            'user_name': user_name,
            'digest_data': digest_data
        })

        success = email_service.send_email(
            to=user_email,
            subject="Your Daily Digest",
            html_content=html_content
        )

        if not success:
            raise Exception("Failed to send email")

        return {"status": "sent"}

    except Exception as exc:
        logger.error(f"Failed to send digest email: {exc}")
        raise self.retry(exc=exc)
```

### In-App Notifications

```python
# app/models/notification.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # info, success, warning, error
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(500), nullable=True)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

# app/services/notification_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification
from app.websocket.manager import manager

class NotificationService:
    """In-app notification service"""

    async def create_notification(
        self,
        db: AsyncSession,
        user_id: int,
        type: str,
        title: str,
        message: str,
        link: str = None
    ) -> Notification:
        """Create and send notification"""

        # Create notification in database
        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            link=link
        )
        db.add(notification)
        await db.commit()
        await db.refresh(notification)

        # Send real-time notification via WebSocket
        await manager.send_personal_message(
            {
                "type": "notification",
                "data": {
                    "id": notification.id,
                    "type": notification.type,
                    "title": notification.title,
                    "message": notification.message,
                    "link": notification.link,
                    "created_at": notification.created_at.isoformat()
                }
            },
            user_id
        )

        return notification

    async def get_user_notifications(
        self,
        db: AsyncSession,
        user_id: int,
        unread_only: bool = False,
        limit: int = 50
    ) -> List[Notification]:
        """Get user notifications"""
        query = select(Notification).where(Notification.user_id == user_id)

        if unread_only:
            query = query.where(Notification.read == False)

        query = query.order_by(Notification.created_at.desc()).limit(limit)

        result = await db.execute(query)
        return result.scalars().all()

    async def mark_as_read(
        self,
        db: AsyncSession,
        notification_id: int,
        user_id: int
    ) -> bool:
        """Mark notification as read"""
        result = await db.execute(
            select(Notification).where(
                Notification.id == notification_id,
                Notification.user_id == user_id
            )
        )
        notification = result.scalar_one_or_none()

        if notification:
            notification.read = True
            await db.commit()
            return True

        return False

    async def mark_all_as_read(
        self,
        db: AsyncSession,
        user_id: int
    ) -> int:
        """Mark all notifications as read"""
        result = await db.execute(
            update(Notification)
            .where(
                Notification.user_id == user_id,
                Notification.read == False
            )
            .values(read=True)
        )
        await db.commit()
        return result.rowcount

notification_service = NotificationService()

# Usage in routes
@router.get("/notifications")
async def get_notifications(
    unread_only: bool = False,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user notifications"""
    notifications = await notification_service.get_user_notifications(
        db,
        current_user.id,
        unread_only=unread_only
    )

    return {
        "notifications": notifications,
        "unread_count": len([n for n in notifications if not n.read])
    }

@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark notification as read"""
    success = await notification_service.mark_as_read(
        db,
        notification_id,
        current_user.id
    )

    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")

    return {"message": "Notification marked as read"}
```

### Push Notifications

```python
# app/services/push_notification_service.py
from pywebpush import webpush, WebPushException
import json
from app.config import settings

class PushNotificationService:
    """Web push notification service"""

    def __init__(self):
        self.vapid_private_key = settings.VAPID_PRIVATE_KEY
        self.vapid_public_key = settings.VAPID_PUBLIC_KEY
        self.vapid_claims = {
            "sub": f"mailto:{settings.CONTACT_EMAIL}"
        }

    def send_push_notification(
        self,
        subscription_info: dict,
        title: str,
        body: str,
        icon: str = None,
        url: str = None
    ) -> bool:
        """Send web push notification"""
        try:
            payload = json.dumps({
                "title": title,
                "body": body,
                "icon": icon or "/icon.png",
                "url": url or "/"
            })

            webpush(
                subscription_info=subscription_info,
                data=payload,
                vapid_private_key=self.vapid_private_key,
                vapid_claims=self.vapid_claims
            )

            return True

        except WebPushException as e:
            logger.error(f"Push notification error: {e}")
            return False

push_service = PushNotificationService()
```

## Best Practices

1. **Use Templates**: Consistent, maintainable email design
2. **Async Sending**: Don't block requests waiting for email
3. **Retry Logic**: Handle temporary failures
4. **Unsubscribe Links**: Always provide opt-out
5. **Plain Text Alternative**: Fallback for HTML emails
6. **Test Emails**: Test in multiple email clients
7. **Track Deliverability**: Monitor bounce and spam rates
8. **Rate Limiting**: Respect sending limits
9. **Personalization**: Use recipient's name and data
10. **Mobile Responsive**: Design for mobile devices

## Email Checklist

- [ ] Email service configured (SMTP/SendGrid/SES)
- [ ] Email templates created
- [ ] Async email sending (Celery)
- [ ] Retry logic implemented
- [ ] Unsubscribe functionality
- [ ] Email validation
- [ ] Plain text alternatives
- [ ] Mobile responsive design
- [ ] Tracking (opens, clicks)
- [ ] Error handling and logging

## Common Email Types

### Transactional Emails
- Welcome emails
- Email verification
- Password reset
- Order confirmations
- Shipping notifications
- Account updates

### Marketing Emails
- Newsletters
- Product announcements
- Promotional campaigns
- Re-engagement emails
- Abandoned cart reminders

### Notification Emails
- Activity notifications
- Comment replies
- Mentions
- Daily/weekly digests
- System alerts

## Resources

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [Email Design Best Practices](https://www.campaignmonitor.com/resources/guides/email-design/)
- [MJML Email Framework](https://mjml.io/)
- [Web Push Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
