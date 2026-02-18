## MODIFIED Requirements

### Requirement: API contract unchanged

`POST /api/ocr` 的 request（multipart/form-data, field: `image`）和 response 結構 SHALL 保持不變。前端的 OCR 請求 SHALL 僅在使用者明確確認預覽照片後才發送，不再於檔案選取時自動觸發。

#### Scenario: Response format matches existing contract

- **WHEN** 使用者確認預覽照片後成功辨識本票
- **THEN** 回傳 JSON 包含 `success: true`、`data.note`、`data.respondent`、`rawText`，結構與既有合約完全一致

#### Scenario: OCR request only sent after user confirmation

- **WHEN** 使用者上傳照片但尚未點擊確認按鈕
- **THEN** 系統 SHALL NOT 發送任何 OCR API 請求
