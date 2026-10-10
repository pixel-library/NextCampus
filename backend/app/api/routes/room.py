from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from backend.app.api.deps import get_current_user
from backend.app.schemas.room import RoomCreate, RoomUpdate
from backend.app.services import room_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["SmartRooms"])

def check_admin_or_staff(user: Dict[str, Any]):
    role = user.get("role")
    if role not in ["admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Role '{role}' is not authorized for this resource.",
        )

# Support root and /rooms subpaths
@router.get("", status_code=status.HTTP_200_OK)
@router.get("/rooms", status_code=status.HTTP_200_OK)
async def get_all_rooms(
    building: Optional[str] = Query(None),
    floor: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
):
    filter_params = {}
    if building:
        filter_params["building"] = building
    if floor:
        filter_params["floor"] = floor
    if status_filter:
        filter_params["status"] = status_filter

    rooms = await room_service.get_rooms(filter_params)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="SmartRooms retrieved successfully",
        data=rooms,
    )

@router.get("/{id}", status_code=status.HTTP_200_OK)
@router.get("/rooms/{id}", status_code=status.HTTP_200_OK)
async def get_room_by_id(id: str):
    room = await room_service.get_room_by_id(id)
    if not room:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="Room not found",
        )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="SmartRoom retrieved",
        data=room,
    )

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/rooms", status_code=status.HTTP_201_CREATED)
async def create_room(
    body: RoomCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    check_admin_or_staff(current_user)
    try:
        new_room = await room_service.create_room(body.model_dump())
        return send_response(
            status_code=status.HTTP_201_CREATED,
            success=True,
            message="SmartRoom registered successfully",
            data=new_room,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.patch("/{id}", status_code=status.HTTP_200_OK)
@router.patch("/rooms/{id}", status_code=status.HTTP_200_OK)
@router.put("/{id}", status_code=status.HTTP_200_OK)
@router.put("/rooms/{id}", status_code=status.HTTP_200_OK)
async def update_room(
    id: str,
    body: RoomUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    check_admin_or_staff(current_user)
    updated = await room_service.update_room_status(id, body.model_dump(exclude_unset=True))
    if not updated:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="SmartRoom not found",
        )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="SmartRoom status and equipment updated",
        data=updated,
    )

@router.delete("/{id}", status_code=status.HTTP_200_OK)
@router.delete("/rooms/{id}", status_code=status.HTTP_200_OK)
async def delete_room(
    id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    check_admin_or_staff(current_user)
    result = await room_service.delete_room(id)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=result.get("message", "Room deleted successfully"),
        data=result,
    )
