from fastapi import APIRouter
from app.api.v1.endpoints import problems, tutor, review, onboarding, revision, auth, sessions, users

api_router = APIRouter()

# Register the endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(problems.router, prefix="/problems", tags=["problems"])
api_router.include_router(tutor.router, prefix="/tutor", tags=["tutor"])
api_router.include_router(review.router, prefix="/review", tags=["review"])
api_router.include_router(onboarding.router, prefix="/onboarding", tags=["onboarding"])
api_router.include_router(revision.router, prefix="/revision", tags=["revision"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
api_router.include_router(users.router, prefix="/users", tags=["users"])