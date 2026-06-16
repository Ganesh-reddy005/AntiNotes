from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.api.v1.api import api_router

# 1. Lifespan Context Manager
# This runs before the app starts and cleans up after it stops
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB
    print("🚀 Initializing Database Connection...")
    await init_db()
    print("✅ Database Connected.")
    
    yield
    
    # Shutdown: Clean up resources (if needed later)
    print("🛑 Shutting down...")

# 2. Initialize App
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# 3. CORS Middleware
# Critical: This allows your Next.js frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Health Check Endpoint
@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "database": settings.DB_NAME
    }

app.include_router(api_router, prefix=settings.API_V1_STR)

# 5. API Router Placeholder
# We will add this in the next step once we create the routes
# from app.api.v1.api import api_router
# app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
