from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.app.api.router import create_api_router
from backend.app.core.config import settings
from backend.app.core.logging import logger, setup_logging
from backend.app.db.connection import connect_db, close_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for startup and shutdown lifecycle events."""
    setup_logging()
    logger.info("[NextCampus Server] Initializing FastAPI application...")
    await connect_db()
    logger.info(f"[NextCampus Server] Running on http://{settings.HOST}:{settings.PORT}")
    logger.info(f"[NextCampus API] Health check at http://{settings.HOST}:{settings.PORT}/api/health")
    logger.info(f"[NextCampus Docs] OpenAPI Swagger available at http://{settings.HOST}:{settings.PORT}/docs")
    yield
    logger.info("[NextCampus Server] Shutting down application...")
    await close_db()

app = FastAPI(
    title="NextCampus API Server",
    version=settings.VERSION,
    description="NextCampus — The Next Generation of Smart Campuses (FastAPI Backend)",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static File Storage for Uploads
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

# Global Exception Handlers for NextCampus REST API Envelope Standards
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    msg = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": msg,
            "data": None,
            "meta": {
                "path": request.url.path,
                "method": request.method,
            },
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    missing_fields = []
    messages = []
    for err in errors:
        loc = err.get("loc", [])
        field_name = str(loc[-1]) if loc else "field"
        err_msg = err.get("msg", "Invalid value")
        missing_fields.append(field_name)
        messages.append(f"{field_name}: {err_msg}")

    detail_msg = f"Validation failed. Missing or invalid fields: {', '.join(missing_fields)}"
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": detail_msg,
            "data": None,
            "meta": {
                "path": request.url.path,
                "method": request.method,
                "errors": messages,
            },
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"[NextCampus Server Error] [{request.method} {request.url.path}]: {str(exc)}")
    is_dev = settings.ENVIRONMENT == "development"
    msg = str(exc) if is_dev else "An unexpected server error occurred. Please contact NextCampus IT Helpdesk."
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": msg,
            "data": None,
            "meta": {
                "path": request.url.path,
                "method": request.method,
            },
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )

# Health Check Endpoints (Dual Mount: /api/health and /api/v1/health)
@app.get("/api/health", status_code=status.HTTP_200_OK, tags=["Health"])
@app.get("/api/v1/health", status_code=status.HTTP_200_OK, tags=["Health"])
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def health_check():
    return {
        "status": "online",
        "service": "NextCampus API Server",
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

# Mount REST API endpoints symmetrically on both /api/v1 and /api
app.include_router(create_api_router(), prefix=settings.API_V1_PREFIX)
app.include_router(create_api_router(), prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
