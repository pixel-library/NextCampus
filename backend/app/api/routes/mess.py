import base64
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from backend.app.api.deps import get_current_user, get_optional_user
from backend.app.schemas.mess import (
    MessPublishRequest,
    MessRollbackRequest,
    MessUploadPreviewRequest,
)
from backend.app.services import mess_service
from backend.app.services.intent_service import get_current_university_time
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["Mess Menu Management"])

@router.get("/today", status_code=status.HTTP_200_OK)
async def get_today_menu(
    facility: Optional[str] = "Central Mess / Aravalli & Meera Bai Dining Hall",
    meal: Optional[str] = None,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """Retrieve today's published dining menu for university."""
    now = get_current_university_time()
    today_str = now.strftime("%Y-%m-%d")
    day_str = now.strftime("%A")

    menu = await mess_service.get_mess_menu(
        facility=facility,
        target_date=today_str,
        day_of_week=day_str,
        meal_type=meal,
    )
    if not menu:
        return send_response(
            status_code=status.HTTP_200_OK,
            success=False,
            message=f"No published mess menu available for today ({today_str}).",
            data=None,
        )

    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=f"Today's dining menu retrieved for {day_str}",
        data=menu,
    )

@router.get("/query", status_code=status.HTTP_200_OK)
async def query_menu(
    facility: Optional[str] = "Central Mess / Aravalli & Meera Bai Dining Hall",
    date: Optional[str] = None,
    day: Optional[str] = None,
    meal: Optional[str] = None,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """Query mess menu by date or day of the week."""
    menu = await mess_service.get_mess_menu(
        facility=facility,
        target_date=date,
        day_of_week=day,
        meal_type=meal,
    )
    if not menu:
        return send_response(
            status_code=status.HTTP_200_OK,
            success=False,
            message="No published mess menu matched the query criteria.",
            data=None,
        )

    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Mess menu retrieved successfully",
        data=menu,
    )

@router.get("/weekly", status_code=status.HTTP_200_OK)
async def get_weekly(
    facility: Optional[str] = "Central Mess / Aravalli & Meera Bai Dining Hall",
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """Retrieve full weekly mess cycle."""
    weekly = await mess_service.get_weekly_mess_menu(facility=facility)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=f"Retrieved {len(weekly)} daily menus in weekly dining roster",
        data=weekly,
    )

@router.get("/versions", status_code=status.HTTP_200_OK)
async def get_versions(
    facility: str = "Central Mess / Aravalli & Meera Bai Dining Hall",
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """Retrieve version history for dining facility."""
    versions = await mess_service.get_mess_versions(facility=facility)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Mess menu version history retrieved",
        data=versions,
    )

@router.post("/upload-preview", status_code=status.HTTP_200_OK)
async def preview_upload(
    facility: str = Form("Central Mess / Aravalli & Meera Bai Dining Hall"),
    csvText: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin-only: Parse and preview uploaded mess menu file."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to manage mess menus.",
        )

    file_bytes = None
    filename = None
    if file:
        file_bytes = await file.read()
        filename = file.filename

    result = await mess_service.preview_mess_upload(
        facility=facility,
        file_bytes=file_bytes,
        filename=filename,
        csv_text=csvText,
    )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=result.get("isValid", False),
        message="Mess menu parsed and preview generated" if result.get("isValid") else "Validation failed for mess menu",
        data=result,
    )

@router.post("/publish", status_code=status.HTTP_200_OK)
async def publish(
    body: MessPublishRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin-only: Atomically publish new mess menu version."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to publish mess menus.",
        )

    if not body.confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Explicit administrator confirmation is required before publication.",
        )

    raw_menus = [m.dict() for m in body.menus]
    result = await mess_service.publish_mess_menu(
        facility=body.facility or "Central Mess / Aravalli & Meera Bai Dining Hall",
        menus=raw_menus,
        admin_user=current_user,
        notes=body.changeNotes,
    )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=result.get("message", "Mess menu published successfully"),
        data=result,
    )

@router.post("/rollback", status_code=status.HTTP_200_OK)
async def rollback(
    body: MessRollbackRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin-only: Roll back mess menu to a previous version."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to rollback mess menus.",
        )

    try:
        result = await mess_service.rollback_mess_menu(
            facility=body.facility or "Central Mess / Aravalli & Meera Bai Dining Hall",
            target_version=body.targetVersion,
            admin_user=current_user,
        )
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message=result.get("message", "Mess menu restored successfully"),
            data=result,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/update-day", status_code=status.HTTP_200_OK)
async def update_day(
    body: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin updates the menu for a specific day of the week."""
    if current_user.get("role") not in ["admin", "care_admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to edit mess menu.",
        )
    day = body.get("dayOfWeek") or body.get("day") or "Monday"
    meals = body.get("meals") or {}
    facility = body.get("facility")
    updated = await mess_service.update_day_menu(
        day_of_week=day,
        meals=meals,
        facility=facility,
        admin_user=current_user,
    )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=f"Mess menu for {day} updated successfully",
        data=updated,
    )

