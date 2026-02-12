import os
from typing import List, Optional
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl
from dotenv import load_dotenv
load_dotenv()
# 1. robust path finding
# This navigates from app/core/config.py -> app/core -> app -> backend (root)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Validator for model names
from pydantic import field_validator

@field_validator("REVIEW_MODEL", "TUTOR_MODEL", "SUMMARY_MODEL")
@classmethod
def model_must_not_be_empty(cls, v):
    if not v or not v.strip():
        raise ValueError("Model name cannot be empty")
    return v


class Settings(BaseSettings):
    PROJECT_NAME: str
    API_V1_STR: str = "/api/v1"
    
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
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
    
    # === JWT AUTHENTICATION ===
    SECRET_KEY: str  # Generate with: openssl rand -hex 32
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"), 
        case_sensitive=True, 
        extra="ignore"
    )

settings = Settings()