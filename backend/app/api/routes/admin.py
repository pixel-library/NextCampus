from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from backend.app.api.deps import get_current_user
from backend.app.services import admin_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["Campus Administration"])

def _verify_admin_role(current_user: Dict[str, Any]):
    role = current_user.get("role")
    if role not in ["admin", "care_admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Role '{role}' is not authorized for campus administration.",
        )

@router.get("/stats", status_code=status.HTTP_200_OK)
async def get_admin_stats(current_user: Dict[str, Any] = Depends(get_current_user)):
    _verify_admin_role(current_user)
    stats = await admin_service.get_admin_stats()
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Executive administrative statistics retrieved",
        data=stats,
    )

@router.get("/students", status_code=status.HTTP_200_OK)
async def get_all_students(
    search: Optional[str] = Query(None, description="Search by name, MUR, email, or department"),
    department: Optional[str] = Query(None, description="Filter by department"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter: all, registered, unclaimed, blocked, active"),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve full student database registry with claimed and blocked statuses."""
    _verify_admin_role(current_user)
    data = await admin_service.get_admin_students(
        search=search,
        department=department,
        status_filter=status_filter,
    )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=f"Retrieved {data['count']} students from database",
        data=data,
    )

@router.patch("/students/{student_id}/toggle-block", status_code=status.HTTP_200_OK)
async def toggle_student_block(
    student_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin toggles block/suspend status for a student account."""
    _verify_admin_role(current_user)
    try:
        updated = await admin_service.toggle_student_block_status(student_id)
        action_str = "blocked" if updated["isBlocked"] else "unblocked / restored"
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message=f"Student {updated['name']} ({updated['enrollmentNumber']}) has been {action_str}.",
            data=updated,
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(val_err),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update student access: {str(e)}",
        )
