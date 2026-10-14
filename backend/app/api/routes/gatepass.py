from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.api.deps import get_current_user
from backend.app.schemas.gatepass import GatePassApply, GatePassReview
from backend.app.services import gatepass_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["Campus Gate Pass & Turnstiles"])

@router.post("/apply", status_code=status.HTTP_201_CREATED)
async def apply_gate_pass(
    pass_data: GatePassApply,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Student submits an appeal for campus out-pass with automated credential population."""
    try:
        new_pass = await gatepass_service.apply_gate_pass(current_user, pass_data)
        return send_response(
            status_code=status.HTTP_201_CREATED,
            success=True,
            message="Gate pass appeal submitted successfully. Awaiting administrative approval.",
            data=new_pass,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unable to submit gate pass request: {str(e)}",
        )

@router.get("/my-passes", status_code=status.HTTP_200_OK)
async def get_my_gate_passes(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve personal gate pass history and active turnstile passes for authenticated student."""
    student_id = str(current_user.get("id") or current_user.get("_id") or "")
    enrollment = current_user.get("enrollmentNumber") or current_user.get("studentId")
    passes = await gatepass_service.get_student_gate_passes(student_id, enrollment)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=f"Retrieved {len(passes)} gate pass records",
        data={"passes": passes, "count": len(passes)},
    )

@router.get("/admin/pending", status_code=status.HTTP_200_OK)
async def get_pending_passes(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin/Warden view: Retrieve all pending out-pass requests awaiting review."""
    role = current_user.get("role")
    if role not in ["admin", "care_admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin or warden clearance required.",
        )
    passes = await gatepass_service.get_pending_gate_passes()
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=f"Retrieved {len(passes)} pending gate pass requests",
        data={"passes": passes, "count": len(passes)},
    )

@router.get("/admin/all", status_code=status.HTTP_200_OK)
async def get_all_passes(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin/Warden view: Retrieve all gate passes across university with optional status filtering."""
    role = current_user.get("role")
    if role not in ["admin", "care_admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin or warden clearance required.",
        )
    passes = await gatepass_service.get_all_gate_passes(status_filter=status_filter)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=f"Retrieved {len(passes)} gate pass records",
        data={"passes": passes, "count": len(passes)},
    )

@router.post("/admin/{pass_id}/action", status_code=status.HTTP_200_OK)
async def review_pass(
    pass_id: str,
    review_data: GatePassReview,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin/Warden approves or rejects a student's gate pass appeal."""
    role = current_user.get("role")
    if role not in ["admin", "care_admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin or warden clearance required.",
        )
    try:
        updated = await gatepass_service.review_gate_pass(pass_id, current_user, review_data)
        verdict = "approved" if review_data.action.upper() == "APPROVE" else "rejected"
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message=f"Gate pass appeal {verdict} successfully.",
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
            detail=f"Failed to process gate pass action: {str(e)}",
        )
