from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.api.deps import get_current_user, get_optional_user
from backend.app.schemas.ai import AiQueryRequest, AiImageDiagnosisRequest
from backend.app.services import ai_service
from backend.app.services import audit_service
from backend.app.utils.helpers import send_response

router = APIRouter(tags=["NextCampus AI"])

@router.post("/query", status_code=status.HTTP_200_OK)
async def query_ai(
    body: AiQueryRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """NextCampus AI Core Chat Endpoint with context awareness and database grounding."""
    if not body.prompt or not body.prompt.strip():
        return send_response(
            status_code=status.HTTP_400_BAD_REQUEST,
            success=False,
            message="Prompt text is required for AI processing",
        )

    try:
        response = await ai_service.process_ai_query(
            prompt=body.prompt,
            user_context=current_user,
            conversation_history=body.conversationHistory,
            context_filters=body.contextFilters,
            language_preference=body.languagePreference,
        )
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

@router.get("/audit-logs", status_code=status.HTTP_200_OK)
async def get_ai_audit_logs(
    limit: int = 50,
    action: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Admin-only: Retrieve administrative changes, timetable updates, and menu publishes."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to inspect audit logs.",
        )

    logs = await audit_service.get_audit_logs(limit=limit, action_filter=action)
    return send_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message=f"Retrieved {len(logs)} administrative audit log records",
        data={"logs": logs, "count": len(logs)},
    )

@router.post("/diagnose-image", status_code=status.HTTP_200_OK)
async def diagnose_image(
    body: AiImageDiagnosisRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """Multimodal vision diagnosis for campus equipment and maintenance defects."""
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
