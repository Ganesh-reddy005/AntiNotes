"""
Authentication Endpoints

User registration, login, and profile management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.models.user import User
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.dependencies import get_current_user

router = APIRouter()


# Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    logic_elo: int
    is_active: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: Optional[UserResponse] = None


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    """
    Register a new user
    
    Returns JWT token + user info
    """
    # Check if user already exists
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=user_data.email,
        full_name=user_data.full_name or user_data.email.split('@')[0],
        hashed_password=get_password_hash(user_data.password),
        is_active=True,
        email_verified=False
    )
    
    await user.insert()
    
    # Generate token
    access_token = create_access_token(data={"sub": user.email})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            logic_elo=user.logic_elo,
            is_active=user.is_active
        )
    )


@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Login with email and password
    """
    # Find user
    user = await User.find_one(User.email == form_data.username)
    
    # Verify password
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Generate token
    access_token = create_access_token(data={"sub": user.email})
    
    # RETURN BOTH TOKEN AND USER (Fixes the frontend double-fetch issue)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            logic_elo=user.logic_elo,
            is_active=user.is_active
        )
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current logged-in user info
    
    Requires: Authorization header with Bearer token
    """
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        logic_elo=current_user.logic_elo,
        is_active=current_user.is_active
    )
