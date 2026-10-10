from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory for the NextCampus project
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "NextCampus API Server"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    HOST: str = "0.0.0.0"
    PORT: int = 5000
    
    # MongoDB Database URI
    MONGODB_URI: str = "mongodb://localhost:27017/nextcampus"
    DB_NAME: str = "nextcampus"
    
    # Authentication & JWT
    JWT_SECRET: str = "nextcampus_dev_secret_key_2026"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_IN: str = "7d"  # Parsed in security module to timedelta
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",
    ]
    
    # File Storage: Keep using existing server/uploads directory to preserve uploads
    UPLOAD_DIR: Path = ROOT_DIR / "server" / "uploads"
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10MB
    MAX_ATTACHMENTS: int = 3
    ALLOWED_MIME_TYPES: List[str] = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
    ]
    
    # External AI Services (Optional)
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=[
            str(ROOT_DIR / ".env"),
            str(BACKEND_DIR / ".env"),
        ],
        env_file_encoding="utf-8",
        extra="ignore",
    )

settings = Settings()

# Ensure uploads directory exists
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
