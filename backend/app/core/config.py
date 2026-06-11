import os
from typing import List, Optional
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


# config.py -> app/core -> app -> backend -> AntiNotes (root with .env)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
# .env lives one level up from backend/
ENV_FILE = BASE_DIR.parent / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str
    API_V1_STR: str = "/api/v1"
    
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
    ]

    # Database
    MONGODB_URI: str
    DB_NAME: str = "antinotes"
    
    # === MULTI-MODEL STRATEGY ===
    # Different models for different tasks to balance cost/quality
    
    # Review: High-quality reasoning (DeepSeek, OpenAI o1-mini, etc.)
    REVIEW_MODEL: str = "llama-3.3-70b-versatile"  # or "o1-mini" for OpenAI
    REVIEW_API_KEY: str
    REVIEW_BASE_URL: Optional[str] = None  # DeepSeek API URL
    
    # Tutor: Fast, conversational (GPT-4o-mini, etc.)
    TUTOR_MODEL: str
    TUTOR_API_KEY: str
    TUTOR_BASE_URL: Optional[str] = None
    
    # Summary/Background: Cheapest (GPT-4o-mini or similar)
    SUMMARY_MODEL: str
    SUMMARY_API_KEY: str
    SUMMARY_BASE_URL: Optional[str] = None
    
    # Legacy (for backward compatibility)
    LLM_API_KEY: str = ""
    LLM_MODEL: str
    LLM_BASE_URL: Optional[str] = None
    
    # === CODE VALIDATION ===
    # Self-hosted Judge0 CE for syntax/compile checking before LLM review.
    # Dev:        http://localhost:2358   (run judge0/docker-compose.yml)
    # Production: http://server:2358      (Docker internal network)
    JUDGE0_URL: str = "http://localhost:2358"

    # === JWT AUTHENTICATION ===
    SECRET_KEY: str  # Generate with: openssl rand -hex 32
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()