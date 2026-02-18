from fastapi import APIRouter, UploadFile, File, HTTPException

from ..services.ocr_service import extract_text, validate_image, OCRError
from ..services.llm_service import parse_ocr_text, LLMError

router = APIRouter(prefix="/api")


@router.post("/ocr")
async def ocr_endpoint(image: UploadFile = File(...)):
    content = await image.read()

    try:
        validate_image(content, image.content_type)
    except OCRError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        raw_text = extract_text(content)
    except OCRError as e:
        raise HTTPException(status_code=422, detail=str(e))

    try:
        result = parse_ocr_text(raw_text)
    except LLMError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"服務異常: {e}")

    data = result.model_dump(exclude_none=True)

    return {
        "success": True,
        "data": data,
        "rawText": raw_text,
    }
