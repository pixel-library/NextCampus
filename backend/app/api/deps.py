from typing import Any, Callable, Dict, Optional
from fastapi import Header, HTTPException, status
from backend.app.core.security import verify_token

async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Dependency that authenticates the Bearer JWT token from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access denied. Authorization token missing or malformed.",
        )

    token = authorization.split(" ")[1]
    try:
        payload = verify_token(token)
        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired or revoked authentication token.",
        )

async def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    """Optional user dependency for endpoints allowing both public and authenticated callers."""
    if not authorization or not authorization.startswith("Bearer "):
        return None

    token = authorization.split(" ")[1]
    try:
        return verify_token(token)
    except Exception:
        return None

def require_roles(*allowed_roles: str) -> Callable:
    """Dependency factory enforcing Role-Based Access Control (RBAC)."""
    async def role_checker(current_user: Dict[str, Any] = Header(None, include_in_schema=False)) -> Dict[str, Any]:
        # Note: current_user will be resolved by FastAPI when combined with Depends(get_current_user)
        user_role = current_user.get("role")
        if not user_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User identity not found or unauthenticated.",
            )

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Role '{user_role}' is not authorized for this resource.",
            )
        return current_user

    return role_checker
