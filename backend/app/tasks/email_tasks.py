"""
Celery tasks for sending emails asynchronously.
"""
from celery import current_task
from app.celery_app import celery_app
from app.services.email_service import EmailService
import logging


logger = logging.getLogger(__name__)


@celery_app.task(bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 3}, retry_backoff=True)
def send_verification_email(self, to_email: str, verification_link: str):
    """
    Celery task to send verification email asynchronously.
    
    Args:
        to_email (str): Recipient's email address
        verification_link (str): Link for email verification
    """
    try:
        logger.info(f"Sending verification email to {to_email}")
        
        # Render email content
        subject = "Verify Your Email Address"
        html_content = f"""
        <html>
            <body>
                <h2>Email Verification</h2>
                <p>Please click the link below to verify your email address:</p>
                <p><a href="{verification_link}">Verify Email</a></p>
                <p>If you didn't create an account, you can safely ignore this email.</p>
            </body>
        </html>
        """
        text_content = f"""
        Email Verification
        
        Please click the link below to verify your email address:
        {verification_link}
        
        If you didn't create an account, you can safely ignore this email.
        """
        
        # Send email
        EmailService.send_email(to_email, subject, html_content, text_content)
        
        logger.info(f"Verification email sent successfully to {to_email}")
        return {"status": "success", "email": to_email}
    
    except Exception as exc:
        logger.error(f"Failed to send verification email to {to_email}: {exc}")
        # This will trigger a retry due to autoretry_for configuration
        raise self.retry(exc=exc, countdown=60)  # Retry after 60 seconds


@celery_app.task(bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 3}, retry_backoff=True)
def send_password_reset_email(self, to_email: str, reset_link: str):
    """
    Celery task to send password reset email asynchronously.
    
    Args:
        to_email (str): Recipient's email address
        reset_link (str): Link for password reset
    """
    try:
        logger.info(f"Sending password reset email to {to_email}")
        
        # Render email content
        subject = "Password Reset Request"
        html_content = f"""
        <html>
            <body>
                <h2>Password Reset</h2>
                <p>You have requested to reset your password. Click the link below to proceed:</p>
                <p><a href="{reset_link}">Reset Password</a></p>
                <p>If you didn't request this, you can safely ignore this email.</p>
            </body>
        </html>
        """
        text_content = f"""
        Password Reset
        
        You have requested to reset your password. Click the link below to proceed:
        {reset_link}
        
        If you didn't request this, you can safely ignore this email.
        """
        
        # Send email
        EmailService.send_email(to_email, subject, html_content, text_content)
        
        logger.info(f"Password reset email sent successfully to {to_email}")
        return {"status": "success", "email": to_email}
    
    except Exception as exc:
        logger.error(f"Failed to send password reset email to {to_email}: {exc}")
        # This will trigger a retry due to autoretry_for configuration
        raise self.retry(exc=exc, countdown=60)  # Retry after 60 seconds