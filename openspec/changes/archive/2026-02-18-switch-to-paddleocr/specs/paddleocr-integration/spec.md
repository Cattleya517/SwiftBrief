## ADDED Requirements

### Requirement: OCR engine uses PaddleOCR in-process

系統 SHALL 使用 PaddleOCR PP-OCRv5 作為 OCR 引擎，在後端進程內直接執行文字辨識，不依賴外部 OCR 服務。

#### Scenario: Successfully extract text from promissory note image

- **WHEN** 使用者上傳有效的本票照片（JPG/PNG/HEIC，≤ 10MB）
- **THEN** 系統使用 PaddleOCR 辨識圖片中的文字，回傳 raw text 字串

#### Scenario: Image contains no recognizable text

- **WHEN** 上傳的圖片中沒有可辨識的文字
- **THEN** 系統拋出 `OCRError`，訊息為「無法從圖片中辨識出任何文字。」

### Requirement: PaddleOCR instance is initialized once

系統 SHALL 以全域單例模式初始化 PaddleOCR，模型僅在首次呼叫時載入，後續請求重複使用同一實例。

#### Scenario: Multiple OCR requests reuse the same model

- **WHEN** 連續發送兩個 OCR 請求
- **THEN** 兩次請求使用同一個 PaddleOCR 實例，不重複載入模型

### Requirement: File validation remains unchanged

系統 SHALL 維持現有檔案驗證邏輯：MIME type 限制為 `image/jpeg`、`image/png`、`image/heic`，檔案大小上限 10MB。

#### Scenario: Invalid file type rejected

- **WHEN** 上傳 PDF 檔案
- **THEN** 系統回傳 HTTP 400，detail 包含「不支援的檔案格式」

#### Scenario: Oversized file rejected

- **WHEN** 上傳 15MB 的 JPG 圖片
- **THEN** 系統回傳 HTTP 400，detail 包含「檔案大小超過 10MB 限制」

### Requirement: API contract unchanged

`POST /api/ocr` 的 request（multipart/form-data, field: `image`）和 response 結構 SHALL 保持不變。前端無需任何修改。

#### Scenario: Response format matches existing contract

- **WHEN** 成功辨識本票照片
- **THEN** 回傳 JSON 包含 `success: true`、`data.note`、`data.respondent`、`rawText`，結構與切換前完全一致
