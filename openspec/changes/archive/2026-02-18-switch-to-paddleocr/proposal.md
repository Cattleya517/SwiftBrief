## Why

目前 OCR 依賴外部獨立服務 Umi-OCR（需另開應用程式、監聽 port 1224），增加部署複雜度。PaddleOCR (PP-OCRv5) 是 Python library，可直接嵌入後端進程，少一個外部服務依賴，架構更簡單。PP-OCRv5 相比 PP-OCRv4 在各場景準確率提升 13 個百分點，且原生支援繁體中文。

## What Changes

- **移除** Umi-OCR HTTP 呼叫（`httpx` POST to `127.0.0.1:1224`）
- **新增** PaddleOCR 作為 Python 依賴，直接在後端進程內執行 OCR
- **移除** `httpx` 依賴（不再需要呼叫外部 OCR 服務）
- **移除** `UMI_OCR_URL` 環境變數
- **更新** README 啟動說明（不再需要啟動 Umi-OCR）

## Capabilities

### New Capabilities

- `paddleocr-integration`: 以 PaddleOCR PP-OCRv5 取代 Umi-OCR，作為內建 OCR 引擎

### Modified Capabilities

（無既有 spec 層級的行為變更，LLM 語意解析流程不變）

## Impact

- **Backend 依賴**: 移除 `httpx`，新增 `paddleocr`、`paddlepaddle`
- **Backend 程式碼**: 僅 `backend/app/services/ocr_service.py` 需改寫
- **部署**: 少一個外部服務（Umi-OCR），但後端首次啟動會自動下載 PP-OCRv5 模型（約數百 MB）
- **API 契約**: `POST /api/ocr` 的 request/response 不變，前端零改動
- **README**: 移除 Umi-OCR 啟動步驟，新增 PaddleOCR 說明
