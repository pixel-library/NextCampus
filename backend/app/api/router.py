from fastapi import APIRouter
from backend.app.api.routes.auth import router as auth_router
from backend.app.api.routes.campus import router as campus_router
from backend.app.api.routes.room import router as room_router
from backend.app.api.routes.care import router as care_router
from backend.app.api.routes.skill import router as skill_router
from backend.app.api.routes.sustainability import router as sustainability_router
from backend.app.api.routes.ai import router as ai_router
from backend.app.api.routes.admin import router as admin_router

def create_api_router() -> APIRouter:
    """Create unified router grouping all functional sub-routers."""
    api_router = APIRouter()
    api_router.include_router(auth_router, prefix="/auth")
    api_router.include_router(campus_router, prefix="/campus")
    # Mount SmartRooms on both /smartrooms and /rooms aliases for complete compatibility
    api_router.include_router(room_router, prefix="/smartrooms")
    api_router.include_router(room_router, prefix="/rooms")
    api_router.include_router(care_router, prefix="/care")
    api_router.include_router(skill_router, prefix="/skillcampus")
    api_router.include_router(sustainability_router, prefix="/sustainability")
    api_router.include_router(ai_router, prefix="/ai")
    api_router.include_router(admin_router, prefix="/admin")
    return api_router
