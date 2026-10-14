import base64
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from backend.app.api.deps import get_current_user, get_optional_user
from backend.app.schemas.timetable import (
    TimetablePublishRequest,
    TimetableRollbackRequest,
    TimetableUploadPreviewRequest,
)
from backend.app.services import timetable_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["Timetable Management"])

@router.get("/query", status_code=status.HTTP_200_OK)
async def query_timetable(
    department: Optional[str] = None,
    semester: Optional[int] = None,
    section: Optional[str] = None,
    day: Optional[str] = None,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """Retrieve published timetable entries matching filters."""
    # If user is a student and no dept/semester provided, default to user profile
    if current_user and not department:
        user_dept = current_user.get("department")
        if user_dept:
            department = "Computer Science" if "computer" in user_dept.lower() else user_dept
    if current_user and not semester and current_user.get("semester"):
        sem_str = str(current_user.get("semester"))
        if "1" in sem_str:
            semester = 1
        elif "3" in sem_str:
            semester = 3

    entries = await timetable_service.get_timetables(
        department=department,
        semester=semester,
        section=section,
        day_of_week=day,
    )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=f"Retrieved {len(entries)} timetable entries",
        data={"entries": entries, "count": len(entries)},
    )

@router.get("/versions", status_code=status.HTTP_200_OK)
async def get_versions(
    department: str = "Computer Science & Engineering",
    semester: int = 3,
    section: str = "A",
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """Retrieve version history for a timetable scope."""
    versions = await timetable_service.get_timetable_versions({
        "department": department,
        "semester": semester,
        "section": section,
    })
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Timetable version history retrieved",
        data=versions,
    )

@router.post("/upload-preview", status_code=status.HTTP_200_OK)
async def preview_upload(
    department: str = Form("Computer Science & Engineering"),
    semester: int = Form(3),
    section: str = Form("A"),
    effectiveFrom: Optional[str] = Form("2026-08-01"),
    csvText: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin-only: Parse and preview uploaded timetable file."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to manage timetables.",
        )

    file_bytes = None
    filename = None
    if file:
        file_bytes = await file.read()
        filename = file.filename

    scope = {
        "department": department,
        "semester": semester,
        "section": section,
        "effectiveFrom": effectiveFrom,
    }

    result = await timetable_service.preview_timetable_upload(
        scope=scope,
        file_bytes=file_bytes,
        filename=filename,
        csv_text=csvText,
    )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=result.get("isValid", False),
        message="Timetable upload parsed and validated" if result.get("isValid") else "Validation failed for timetable",
        data=result,
    )

@router.post("/publish", status_code=status.HTTP_200_OK)
async def publish(
    body: TimetablePublishRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin-only: Confirm and atomically publish new timetable version."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to publish timetables.",
        )

    if not body.confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Explicit administrator confirmation is required before publication.",
        )

    scope = {
        "department": body.department,
        "semester": body.semester,
        "section": body.section,
        "effectiveFrom": body.effectiveFrom,
    }

    raw_entries = [e.model_dump() if hasattr(e, "model_dump") else e.dict() for e in body.entries]
    result = await timetable_service.publish_timetable(
        scope=scope,
        entries=raw_entries,
        admin_user=current_user,
        notes=body.changeNotes,
    )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=result.get("message", "Timetable published successfully"),
        data=result,
    )

@router.post("/rollback", status_code=status.HTTP_200_OK)
async def rollback(
    body: TimetableRollbackRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin-only: Roll back timetable to a previous version."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to rollback timetables.",
        )

    scope = {
        "department": body.department,
        "semester": body.semester,
        "section": body.section,
    }

    try:
        result = await timetable_service.rollback_timetable(
            scope=scope,
            target_version=body.targetVersion,
            admin_user=current_user,
        )
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message=result.get("message", "Timetable restored successfully"),
            data=result,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/hierarchy", status_code=status.HTTP_200_OK)
async def get_hierarchy():
    """Retrieve departmental, course, year, semester, and section hierarchy tree."""
    tree = await timetable_service.get_timetable_hierarchy_tree()
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Timetable academic hierarchy tree retrieved",
        data=tree,
    )

@router.post("/slot", status_code=status.HTTP_200_OK)
async def upsert_slot(
    slot_data: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin adds or updates an individual class slot with faculty/teacher assignment."""
    if current_user.get("role") not in ["admin", "care_admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to edit timetable slots.",
        )
    slot = await timetable_service.save_timetable_slot(slot_data, admin_user=current_user)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Class slot saved successfully",
        data=slot,
    )

@router.delete("/slot/{slot_id}", status_code=status.HTTP_200_OK)
async def delete_slot(
    slot_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin deletes a class slot from schedule."""
    if current_user.get("role") not in ["admin", "care_admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to delete timetable slots.",
        )
    await timetable_service.delete_timetable_slot(slot_id)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Class slot removed successfully",
        data={"id": slot_id},
    )

