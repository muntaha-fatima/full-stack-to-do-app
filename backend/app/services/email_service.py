"""
Email service for sending various types of emails
"""
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.core.config import settings


class EmailService:
    """
    Service class for sending emails via SMTP
    """

    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str, text_content: Optional[str] = None):
        """
        Send an email using SMTP
        """
        # Check if SMTP credentials are properly configured
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            logging.warning("SMTP credentials not configured. Skipping email delivery.")
            return

        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = settings.FROM_EMAIL
        msg['To'] = to_email

        # Create text and HTML parts
        if text_content:
            text_part = MIMEText(text_content, 'plain')
            msg.attach(text_part)

        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)

        try:
            # Connect to SMTP server and send email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()  # Enable encryption
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
        except smtplib.SMTPAuthenticationError as e:
            logging.error(f"SMTP Authentication Error: {e}")
            # Don't raise the error - just log it and continue
        except smtplib.SMTPException as e:
            logging.error(f"SMTP Error: {e}")
            # Don't raise the error - just log it and continue
        except Exception as e:
            logging.error(f"Unexpected error sending email: {e}")
            # Don't raise the error - just log it and continue
    
    @staticmethod
    def send_verification_email(to_email: str, verification_link: str):
        """
        Send email with verification link
        """
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
        
        EmailService.send_email(to_email, subject, html_content, text_content)
    
    @staticmethod
    def send_password_reset_email(to_email: str, reset_link: str):
        """
        Send email with password reset link
        """
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
        
        EmailService.send_email(to_email, subject, html_content, text_content)