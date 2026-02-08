"""
Core configuration module.
"""

from typing import Any, List
import os
import json
import re

from pydantic import AnyHttpUrl, field_validator
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors_origins(env_value: Any) -> List[str]:
    """
    Custom parser for CORS origins that handles both JSON arrays and comma-separated strings.
    """
    if isinstance(env_value, str):
        env_value = env_value.strip()
        if env_value.startswith("[") and env_value.endswith("]"):
            # Parse as JSON list, but first fix any trailing commas that might cause issues
            try:
                # Remove trailing comma before closing bracket to avoid JSON parsing errors
                env_value_fixed = re.sub(r',\s*\]', ']', env_value)
                return json.loads(env_value_fixed)
            except json.JSONDecodeError:
                raise ValueError(f"Invalid JSON list format for BACKEND_CORS_ORIGINS: {env_value}")
        elif env_value:  # If it's a non-empty string, treat as comma-separated
            return [i.strip() for i in env_value.split(",") if i.strip()]
        else:  # Empty string
            return []
    elif isinstance(env_value, list):
        return env_value
    elif env_value is None:
        return []
    else:
        raise ValueError(f"Invalid format for BACKEND_CORS_ORIGINS: {env_value}")


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Project metadata
    PROJECT_NAME: str = "Todo App API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "A production-ready Todo application API"
    API_V1_STR: str = "/api/v1"

    # Environment
    ENVIRONMENT: str = "development"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS - Define as Any type to bypass automatic parsing
    BACKEND_CORS_ORIGINS: Any = []

    # Trusted hosts (for production)
    ALLOWED_HOSTS: list[str] = ["*"]

    # Database
    DATABASE_URL: str

    # Frontend URL
    FRONTEND_URL: str = "http://localhost:3001"

    # Rate limiting (using in-memory for simplicity)
    RATE_LIMIT_PER_MINUTE: int = 100
    RATE_LIMIT_PER_IP: int = 1000

    # Logging
    LOG_LEVEL: str = "INFO"

    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    # SMTP Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    FROM_EMAIL: str = "noreply@todoapp.com"
    FROM_NAME: str = "Todo App"

    # Celery Configuration (using in-memory broker for development)
    CELERY_BROKER_URL: str = "memory://localhost/"
    CELERY_RESULT_BACKEND: str = "cache+memory://"

    # Email Settings
    EMAIL_VERIFICATION_EXPIRE_HOURS: int = 24
    PASSWORD_RESET_EXPIRE_HOURS: int = 1

    def model_post_init(self, __context: Any) -> None:
        """
        Post-initialization hook to process BACKEND_CORS_ORIGINS after loading from environment.
        """
        if hasattr(self, '_backend_cors_origins_processed'):
            return  # Already processed

        # Process the CORS origins
        self.BACKEND_CORS_ORIGINS = parse_cors_origins(getattr(self, 'BACKEND_CORS_ORIGINS', []))
        setattr(self, '_backend_cors_origins_processed', True)


settings = Settings()
