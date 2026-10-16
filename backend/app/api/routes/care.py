import os
import random
import string
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile, status

from backend.app.api.deps import get_current_user
from backend.app.core.config import settings
from backend.app.schemas.care import (
    AssignStaffRequest,
    ComplaintCreate,
    ComplaintReviewRequest,
    ComplaintUpdate,
    InternalNoteRequest,
    PublicUpdateRequest,
)
from backend.app.services import care_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["NextCampus Care"])

def check_admin_or_staff(user: Dict[str, Any]):
    role = user.get("role")
    if role not in ["admin", "care_admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Role '{role}' is not authorized for this resource.",
        )

# Complaints list queries
@router.get("/complaints", status_code=status.HTTP_200_OK)
@router.get("/my-complaints", status_code=status.HTTP_200_OK)
@router.get("/admin/complaints", status_code=status.HTTP_200_OK)
async def get_complaints(
    category: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    role = current_user.get("role")
    is_admin = role in ["admin", "staff", "care_admin"]
    filter_params: Dict[str, Any] = {}

    if not is_admin:
        filter_params["studentId"] = current_user.get("id") or current_user.get("_id")
    if category and category != "all":
        filter_params["category"] = category
    if status_filter and status_filter != "all":
        filter_params["status"] = status_filter
    if priority and priority != "all":
        filter_params["priority"] = priority

    complaints = await care_service.get_complaints(filter_params, is_admin=is_admin)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Complaints retrieved successfully",
        data=complaints,
    )

@router.get("/complaints/{id}", status_code=status.HTTP_200_OK)
async def get_complaint_by_id(
    id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    role = current_user.get("role")
    is_admin = role in ["admin", "staff", "care_admin"]
    complaint = await care_service.get_complaint_by_id(id, is_admin=is_admin)

    if not complaint:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="Complaint ticket not found",
        )

    if not is_admin:
        student_owner_id = str(
            complaint.get("studentId")
            or (complaint.get("student", {}) if isinstance(complaint.get("student"), dict) else {}).get("_id")
            or (complaint.get("student", {}) if isinstance(complaint.get("student"), dict) else {}).get("id")
            or ""
        )
        current_uid = str(current_user.get("id") or current_user.get("_id") or "")
        if student_owner_id and current_uid and student_owner_id != current_uid:
            return send_response(
                status_code=status.HTTP_403_FORBIDDEN,
                success=False,
                message="Unauthorized to view this complaint ticket",
            )

    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Complaint ticket retrieved",
        data=complaint,
    )

@router.post("/complaints", status_code=status.HTTP_201_CREATED)
async def create_complaint(
    request: Request,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    content_type = request.headers.get("content-type", "")
    attachments: List[str] = []
    body_data: Dict[str, Any] = {}

    if "multipart/form-data" in content_type:
        form = await request.form()
        for key in form:
            if key != "attachments":
                body_data[key] = form[key]

        upload_files = form.getlist("attachments")
        safe_exts = [".jpg", ".jpeg", ".png", ".webp", ".pdf"]

        for uf in upload_files[:settings.MAX_ATTACHMENTS]:
            if isinstance(uf, UploadFile) and uf.filename:
                ext = Path(uf.filename).suffix.lower()
                safe_ext = ext if ext in safe_exts else ".bin"
                rand_num = random.randint(100000000, 999999999)
                unique_name = f"nc-doc-{int(datetime.now().timestamp() * 1000)}-{rand_num}{safe_ext}"
                file_path = settings.UPLOAD_DIR / unique_name

                contents = await uf.read()
                with open(file_path, "wb") as f:
                    f.write(contents)
                attachments.append(f"/uploads/{unique_name}")
    else:
        body_data = await request.json()
        if body_data.get("attachments"):
            raw_att = body_data["attachments"]
            attachments = raw_att if isinstance(raw_att, list) else [raw_att]

    student_id = current_user.get("id") or current_user.get("_id")
    author_name = current_user.get("name") or body_data.get("authorName") or "Student"

    payload = {
        **body_data,
        "studentId": student_id,
        "authorName": author_name,
        "attachments": attachments,
    }

    try:
        new_complaint = await care_service.create_complaint(payload)
        return send_response(
            status_code=status.HTTP_201_CREATED,
            success=True,
            message="Complaint ticket submitted",
            data=new_complaint,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.patch("/complaints/{id}", status_code=status.HTTP_200_OK)
@router.put("/complaints/{id}", status_code=status.HTTP_200_OK)
@router.post("/complaints/{id}/status", status_code=status.HTTP_200_OK)
@router.patch("/complaints/{id}/status", status_code=status.HTTP_200_OK)
@router.post("/admin/complaints/{id}/status", status_code=status.HTTP_200_OK)
@router.patch("/admin/complaints/{id}/status", status_code=status.HTTP_200_OK)
async def update_complaint(
    id: str,
    body: ComplaintUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    check_admin_or_staff(current_user)
    updated_by = current_user.get("name") or "Admin"
    updated = await care_service.update_complaint_status(
        id,
        status=body.status,
        update_message=body.message,
        updated_by=updated_by,
        priority=body.priority,
    )
    if not updated:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="Complaint ticket not found",
        )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Complaint status updated",
        data=updated,
    )

@router.post("/complaints/{id}/assign", status_code=status.HTTP_200_OK)
@router.patch("/complaints/{id}/assign", status_code=status.HTTP_200_OK)
@router.post("/admin/complaints/{id}/assign", status_code=status.HTTP_200_OK)
@router.patch("/admin/complaints/{id}/assign", status_code=status.HTTP_200_OK)
async def assign_staff(
    id: str,
    body: AssignStaffRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    check_admin_or_staff(current_user)
    if not body.assignedToName:
        return send_response(
            status_code=status.HTTP_400_BAD_REQUEST,
            success=False,
            message="Staff or technician name is required for assignment",
        )

    updated_by = current_user.get("name") or "Admin"
    updated = await care_service.assign_staff(
        id,
        assigned_to_id=body.assignedTo,
        assigned_to_name=body.assignedToName,
        updated_by=updated_by,
    )
    if not updated:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="Complaint ticket not found",
        )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Staff assigned successfully",
        data=updated,
    )

@router.post("/complaints/{id}/student-update", status_code=status.HTTP_200_OK)
@router.post("/complaints/{id}/public-updates", status_code=status.HTTP_200_OK)
@router.post("/admin/complaints/{id}/student-update", status_code=status.HTTP_200_OK)
@router.post("/admin/complaints/{id}/public-updates", status_code=status.HTTP_200_OK)
async def add_public_update(
    id: str,
    body: PublicUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    check_admin_or_staff(current_user)
    if not body.message or not body.message.strip():
        return send_response(
            status_code=status.HTTP_400_BAD_REQUEST,
            success=False,
            message="Update message content is required",
        )

    updated_by = current_user.get("name") or "Operations Admin"
    updated = await care_service.add_public_update(id, body.message.strip(), updated_by=updated_by)
    if not updated:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="Complaint ticket not found",
        )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Public student update published",
        data=updated,
    )

@router.post("/complaints/{id}/internal-notes", status_code=status.HTTP_200_OK)
@router.post("/admin/complaints/{id}/internal-notes", status_code=status.HTTP_200_OK)
async def add_internal_note(
    id: str,
    body: InternalNoteRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    check_admin_or_staff(current_user)
    if not body.note or not body.note.strip():
        return send_response(
            status_code=status.HTTP_400_BAD_REQUEST,
            success=False,
            message="Internal note text is required",
        )

    author_id = current_user.get("id") or current_user.get("_id")
    author_name = current_user.get("name") or "Admin"
    updated = await care_service.add_internal_note(id, body.note.strip(), author_id=author_id, author_name=author_name)
    if not updated:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="Complaint ticket not found",
        )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Internal administrative note recorded",
        data=updated,
    )

@router.get("/staff", status_code=status.HTTP_200_OK)
async def get_staff_list(current_user: Dict[str, Any] = Depends(get_current_user)):
    check_admin_or_staff(current_user)
    staff = await care_service.get_available_staff()
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Available technicians and staff retrieved",
        data=staff,
    )

@router.post("/complaints/{id}/review", status_code=status.HTTP_200_OK)
async def review_complaint(
    id: str,
    body: ComplaintReviewRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    student_id = current_user.get("id") or current_user.get("_id")
    reviewed_by = current_user.get("name") or "Student"
    updated = await care_service.add_complaint_review(
        id,
        rating=body.rating,
        comment=body.comment or "",
        tags=body.tags or [],
        reviewed_by=reviewed_by,
        student_id=str(student_id) if student_id else None,
    )
    if not updated:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="Complaint ticket not found",
        )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Complaint review recorded successfully",
        data=updated,
    )

