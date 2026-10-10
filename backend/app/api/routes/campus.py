from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
from backend.app.api.deps import get_current_user, require_roles
from backend.app.schemas.campus import LocationCreate, LocationUpdate, LocationDeleteRequest
from backend.app.services import campus_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["Campus Facilities"])

@router.get("/locations", status_code=status.HTTP_200_OK)
async def get_locations(
    category: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
):
    filter_params = {}
    if category:
        filter_params["category"] = category
    if status_filter:
        filter_params["status"] = status_filter

    locations = await campus_service.get_all_locations(filter_params)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Campus locations retrieved successfully",
        data=locations,
    )

@router.get("/locations/{code}", status_code=status.HTTP_200_OK)
async def get_location_details(code: str):
    location = await campus_service.get_location_by_code(code)
    if not location:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="Campus location not found",
        )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Location details retrieved",
        data=location,
    )

@router.post("/locations", status_code=status.HTTP_201_CREATED)
async def add_location(
    body: LocationCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    role = current_user.get("role")
    if role not in ["admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Role '{role}' is not authorized for this resource.",
        )
    try:
        new_loc = await campus_service.create_location(body.model_dump())
        return send_response(
            status_code=status.HTTP_201_CREATED,
            success=True,
            message="New facility registered in spatial repository",
            data=new_loc,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/locations/{id}", status_code=status.HTTP_200_OK)
async def update_location(
    id: str,
    body: LocationUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    role = current_user.get("role")
    if role not in ["admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Role '{role}' is not authorized for this resource.",
        )
    updated = await campus_service.update_location(id, body.model_dump(exclude_unset=True))
    if not updated:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="Campus facility not found",
        )
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Campus facility updated successfully",
        data=updated,
    )

@router.delete("/locations/{id}", status_code=status.HTTP_200_OK)
async def delete_location(
    id: str,
    cascade: Optional[bool] = Query(False),
    body: Optional[LocationDeleteRequest] = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    role = current_user.get("role")
    if role not in ["admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Role '{role}' is not authorized for this resource.",
        )

    is_cascade = bool(cascade or (body and body.cascade))
    try:
        result = await campus_service.delete_location(id, cascade=is_cascade)
        if result.get("conflict"):
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={
                    "success": False,
                    "conflict": True,
                    "dependentCount": result.get("dependentCount"),
                    "buildingName": result.get("buildingName"),
                    "message": result.get("message"),
                },
            )
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message=result.get("message", "Facility removed"),
            data=result,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
