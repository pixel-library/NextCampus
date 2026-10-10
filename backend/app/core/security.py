import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from backend.app.core.config import settings

def hash_password(password: str) -> str:
    """Hash password using standard bcrypt with 10 salt rounds."""
    salt = bcrypt.gensalt(rounds=10)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False

def generate_token(payload: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate JWT authentication token matching Express jsonwebtoken sign."""
    to_encode = payload.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    
    # Standard JWT claims
    to_encode.update({
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp())
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def verify_token(token: str) -> Dict[str, Any]:
    """Verify and decode JWT token matching Express jwt.verify."""
    try:
        decoded = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return decoded
    except jwt.ExpiredSignatureError:
        raise ValueError("Authentication session has expired. Please sign in again.")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid authentication token provided.")
