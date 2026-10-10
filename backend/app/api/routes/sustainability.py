from fastapi import APIRouter, status
from backend.app.services import sustainability_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["Sustainability"])

@router.get("/metrics", status_code=status.HTTP_200_OK)
async def get_metrics():
    metrics = await sustainability_service.get_metrics()
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="EcoCampus metrics retrieved",
        data=metrics,
    )
