from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.api.deps import get_optional_user
from backend.app.schemas.ai import AiQueryRequest, AiImageDiagnosisRequest
from backend.app.services import ai_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["NextCampus AI"])

@router.post("/query", status_code=status.HTTP_200_OK)
async def query_ai(
    body: AiQueryRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    if not body.prompt or not body.prompt.strip():
        return send_response(
            status_code=status.HTTP_400_BAD_REQUEST,
            success=False,
            message="Prompt text is required for AI processing",
        )

    try:
        response = await ai_service.process_ai_query(body.prompt, user_context=current_user)
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message="AI query processed successfully",
            data=response,
        )
    except ValueError as e:
        return send_response(
            status_code=status.HTTP_400_BAD_REQUEST,
            success=False,
            message=str(e),
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/diagnose-image", status_code=status.HTTP_200_OK)
async def diagnose_image(
    body: AiImageDiagnosisRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    try:
        result = await ai_service.diagnose_complaint_image(
            image_base64=body.imageBase64,
            image_name=body.imageName,
            prompt=body.prompt,
            mime_type=body.mimeType or "image/jpeg",
        )
        return send_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message="Image analyzed successfully by NextCampus Vision",
            data=result,
        )
    except ValueError as e:
        return send_response(
            status_code=status.HTTP_400_BAD_REQUEST,
            success=False,
            message=str(e),
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
