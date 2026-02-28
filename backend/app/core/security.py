"""
Security utilities for authentication

JWT token generation and password hashing.

Uses bcrypt directly (not via passlib) to avoid passlib's incompatibility
with bcrypt 4.x which removed the __about__ attribute passlib depends on.
"""

import hashlib
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from app.core.config import settings


def _prepare_password(password: str) -> bytes:
    """
    Pre-hash with SHA-256 before bcrypt.
    Gives a fixed 64-char hex string — always within bcrypt's 72-byte limit.
    Input passwords of any length are handled safely.
    """
    return hashlib.sha256(password.encode()).hexdigest().encode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a stored bcrypt hash."""
    return bcrypt.checkpw(_prepare_password(plain_password), hashed_password.encode("utf-8"))


def get_password_hash(password: str) -> str:
    """Hash a password for storage using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(_prepare_password(password), salt).decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.

    Args:
        data: Dictionary to encode (usually {"sub": user_email})
        expires_delta: Token expiration override (default: 7 days from settings)

    Returns:
        Encoded JWT string
    """
    to_encode = data.copy()
    expire = (
        datetime.utcnow() + expires_delta
        if expires_delta
        else datetime.utcnow() + timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT token.

    Returns:
        Decoded payload dict, or None if invalid/expired.
    """
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
