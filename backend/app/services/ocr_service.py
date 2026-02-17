import base64
import os

import httpx

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/heic"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

UMI_OCR_URL = os.environ.get("UMI_OCR_URL", "http://127.0.0.1:1224/api/ocr")


class OCRError(Exception):
    pass


def validate_image(content: bytes, content_type: str | None) -> None:
    if content_type and content_type not in ALLOWED_MIME_TYPES:
        raise OCRError(f"不支援的檔案格式: {content_type}。請上傳 JPG、PNG 或 HEIC。")
    if len(content) > MAX_FILE_SIZE:
        raise OCRError("檔案大小超過 10MB 限制。")


async def extract_text(image_bytes: bytes) -> str:
    b64 = base64.b64encode(image_bytes).decode()

    async with httpx.AsyncClient(timeout=60) as client:
        try:
            resp = await client.post(
                UMI_OCR_URL,
                json={"base64": b64, "options": {"data.format": "text"}},
            )
        except httpx.ConnectError:
            raise OCRError("無法連線到 Umi-OCR，請確認 Umi-OCR 已啟動。")

    result = resp.json()

    if result.get("code") != 100:
        msg = result.get("data", "OCR 辨識失敗")
        raise OCRError(f"Umi-OCR 錯誤: {msg}")

    text = result.get("data", "")
    if not text or not text.strip():
        raise OCRError("無法從圖片中辨識出任何文字。")

    return text
