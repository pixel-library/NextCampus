from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from backend.app.api.deps import get_current_user
from backend.app.schemas.skill import ProjectCreate
from backend.app.services import skill_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["SkillCampus"])

@router.get("/projects", status_code=status.HTTP_200_OK)
async def get_projects(category: Optional[str] = Query(None)):
    filter_params = {}
    if category and category != "All":
        filter_params["category"] = category

    projects = await skill_service.get_projects(filter_params)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="SkillCampus projects retrieved",
        data=projects,
    )

@router.post("/projects", status_code=status.HTTP_201_CREATED)
async def create_project(
    body: ProjectCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    lead = current_user.get("id") or current_user.get("_id") or body.leadStudent
    author_name = current_user.get("name") or body.authorName or "Student Lead"
    payload = {
        **body.model_dump(),
        "leadStudent": lead,
        "authorName": author_name,
    }
    project = await skill_service.create_project(payload)
    return send_response(
        status_code=status.HTTP_201_CREATED,
        success=True,
        message="SkillCampus project created",
        data=project,
    )

@router.post("/projects/{id}/join", status_code=status.HTTP_200_OK)
async def join_project(
    id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user.get("id") or current_user.get("_id")
    user_name = current_user.get("name") or "Student Member"
    if not user_id:
        return send_response(
            status_code=status.HTTP_401_UNAUTHORIZED,
            success=False,
            message="Authentication required to join project",
        )

    try:
        updated = await skill_service.join_project(id, user_id, user_name)
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message="Successfully joined project",
            data=updated,
        )
    except KeyError:
        return send_response(
            status_code=status.HTTP_404_NOT_FOUND,
            success=False,
            message="Project not found",
        )
    except ValueError as e:
        return send_response(
            status_code=status.HTTP_400_BAD_REQUEST,
            success=False,
            message=str(e),
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
