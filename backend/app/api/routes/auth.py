from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.api.deps import get_current_user
from backend.app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UpdateProfileRequest,
    ChangePasswordRequest,
)
from backend.app.services import auth_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest):
    try:
        result = await auth_service.register_user(body.model_dump())
        return send_response(
            status_code=status.HTTP_201_CREATED,
            success=True,
            message="User registered successfully",
            data=result,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/login", status_code=status.HTTP_200_OK)
async def login(body: LoginRequest):
    try:
        lookup = body.email or body.identifier or ""
        result = await auth_service.login_user(lookup, body.password)
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message="User logged in successfully",
            data=result,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/me", status_code=status.HTTP_200_OK)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    try:
        user_id = current_user.get("id") or current_user.get("_id")
        result = await auth_service.get_current_user(user_id)
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message="Current authenticated user retrieved",
            data=result,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/profile", status_code=status.HTTP_200_OK)
async def update_profile(
    body: UpdateProfileRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    try:
        user_role = current_user.get("role")
        user_id = current_user.get("id") or current_user.get("_id")
        # Only administrators can edit someone else's profile; regular users only edit their own
        target_user_id = body.userId if (user_role == "admin" and body.userId) else user_id
        result = await auth_service.update_profile(target_user_id, body.model_dump(exclude_unset=True), user_role)
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message="Profile updated successfully",
            data=result,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    body: ChangePasswordRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    try:
        user_id = current_user.get("id") or current_user.get("_id")
        result = await auth_service.change_password(user_id, body.currentPassword, body.newPassword)
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message="Password changed successfully",
            data=result,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
