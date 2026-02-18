import io
import numpy as np
from PIL import Image
from paddleocr import PaddleOCR

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/heic"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

_ocr_instance: PaddleOCR | None = None


def _get_ocr() -> PaddleOCR:
    global _ocr_instance
    if _ocr_instance is None:
        _ocr_instance = PaddleOCR(
            text_detection_model_name="PP-OCRv5_mobile_det",
            text_recognition_model_name="PP-OCRv5_mobile_rec",
            use_doc_orientation_classify=False,
            use_doc_unwarping=False,
            use_textline_orientation=False,
        )
    return _ocr_instance


class OCRError(Exception):
    pass


def validate_image(content: bytes, content_type: str | None) -> None:
    if content_type and content_type not in ALLOWED_MIME_TYPES:
        raise OCRError(f"不支援的檔案格式: {content_type}。請上傳 JPG、PNG 或 HEIC。")
    if len(content) > MAX_FILE_SIZE:
        raise OCRError("檔案大小超過 10MB 限制。")


def extract_text(image_bytes: bytes) -> str:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_array = np.array(img)

    ocr = _get_ocr()
    results = list(ocr.predict(img_array))

    if not results:
        raise OCRError("無法從圖片中辨識出任何文字。")

    lines: list[str] = []
    for res in results:
        rec_texts = res.get("rec_texts", []) if isinstance(res, dict) else getattr(res, "rec_texts", [])
        lines.extend(rec_texts)

    text = "\n".join(lines)
    if not text.strip():
        raise OCRError("無法從圖片中辨識出任何文字。")

    return text
