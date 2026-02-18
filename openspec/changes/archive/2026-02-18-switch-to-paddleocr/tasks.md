## 1. Dependencies

- [x] 1.1 在 `backend/pyproject.toml` 加入 `paddleocr`，移除 `httpx`
- [x] 1.2 執行 `uv sync` 安裝新依賴

## 2. Core Implementation

- [x] 2.1 改寫 `backend/app/services/ocr_service.py`：移除 httpx/Umi-OCR 邏輯，改用 PaddleOCR Python API，全域單例初始化，`extract_text` 改為同步函式
- [x] 2.2 更新 `backend/app/routers/ocr.py`：`extract_text` 呼叫從 `await` 改為同步呼叫

## 3. Documentation

- [x] 3.1 更新 `README.md`：移除 Umi-OCR 啟動步驟，移除 `UMI_OCR_URL` 環境變數說明，更新架構圖

## 4. Verification

- [x] 4.1 啟動後端 `uv run uvicorn app.main:app --reload`，用 `curl -F "image=@note.jpg" http://localhost:8000/api/ocr` 測試 OCR 端點
