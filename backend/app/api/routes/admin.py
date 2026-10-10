from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.api.deps import get_current_user
from backend.app.services import admin_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["Campus Administration"])

@router.get("/stats", status_code=status.HTTP_200_OK)
async def get_admin_stats(current_user: Dict[str, Any] = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["admin", "care_admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Role '{role}' is not authorized for this resource.",
        )

    stats = await admin_service.get_admin_stats()
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Executive administrative statistics retrieved",
        data=stats,
    )
