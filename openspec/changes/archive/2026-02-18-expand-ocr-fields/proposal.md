## Why

目前 OCR 辨識結果只提取 `note`（本票資訊）和 `respondent`（發票人），遺漏了本票上可辨識的其他重要欄位：受款人（聲請人）、利率、利息起算方式。使用者仍需大量手動填入，未發揮 OCR 的完整價值。

## What Changes

- **新增** `applicant`（受款人/聲請人）欄位提取：從「支付___」或「受款人」辨識姓名
- **新增** `claim.interestRate`（利率）提取：從「按年利率百分之___」辨識
- **新增** `claim.interestStartPoint`（利息起算方式）提取：從「自發票日起」/「自到期日起」辨識
- **更新** 後端 LLM prompt 與 Pydantic model，涵蓋所有可辨識欄位
- **更新** 前端 API types 與 merge 邏輯，接收並填入新欄位

## Capabilities

### New Capabilities

（無新 capability，屬於現有 OCR 功能的欄位擴充）

### Modified Capabilities

- `paddleocr-integration`: OCR 結果新增 applicant、interestRate、interestStartPoint 欄位提取與填入

## Impact

- **Backend**: `llm_service.py` — 擴充 `OCRResult` model 和 prompt
- **Backend**: `routers/ocr.py` — response 自動包含新欄位（無需改動，`model_dump` 自動處理）
- **Frontend**: `api.ts` — types 新增 `applicant` 和 `claim` 欄位
- **Frontend**: `page.tsx` — `handleOCRComplete` merge 邏輯擴充 applicant + claim
- **API 契約**: response `data` 新增 `applicant` 和 `claim` 物件（向後相容，新增欄位皆 optional）
