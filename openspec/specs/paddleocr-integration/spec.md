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

### Requirement: OCR result extracts all identifiable fields from promissory note

系統 SHALL 從本票 OCR 文字中提取以下所有可辨識的欄位：

**note**: noteNumber, issueDate, dueDate, amount, paymentPlace, issuePlace
**respondent**: name, idNumber, address
**applicant**: name（從「支付___」或「受款人」提取）
**claim**: interestRate（從「按年利率百分之___」提取）, interestStartPoint（從「自發票日起/自到期日起/自提示日起」映射為 enum）

#### Scenario: Extract applicant name from payee clause

- **WHEN** OCR 文字包含「無條件擔任支付王小明」
- **THEN** 回傳 `applicant.name = "王小明"`

#### Scenario: Extract interest rate

- **WHEN** OCR 文字包含「按年利率百分之六計算利息」
- **THEN** 回傳 `claim.interestRate = 6`

#### Scenario: Extract interest start point from invoice date

- **WHEN** OCR 文字包含「自發票日起」
- **THEN** 回傳 `claim.interestStartPoint = "invoice_date"`

#### Scenario: Fields not found remain absent

- **WHEN** OCR 文字中沒有受款人資訊
- **THEN** response 中不包含 `applicant` 物件

### Requirement: API contract

`POST /api/ocr` 的 request（multipart/form-data, field: `image`）和 response SHALL 回傳 `success`、`data`（含 note、respondent、applicant、claim）、`rawText`。所有欄位皆 optional。前端的 OCR 請求 SHALL 僅在使用者明確確認預覽照片後才發送，不再於檔案選取時自動觸發。

#### Scenario: Response format with all fields

- **WHEN** 使用者確認預覽照片後成功辨識本票
- **THEN** 回傳 JSON 包含 `success: true`、`data.note`、`data.respondent`、`data.applicant`、`data.claim`、`rawText`

#### Scenario: OCR request only sent after user confirmation

- **WHEN** 使用者上傳照片但尚未點擊確認按鈕
- **THEN** 系統 SHALL NOT 發送任何 OCR API 請求
