## 1. Backend

- [x] 1.1 擴充 `llm_service.py`：新增 `ApplicantResult`、`ClaimResult` model，更新 `OCRResult`、prompt、`_to_traditional`
- [x] 1.2 更新 `routers/ocr.py`：response data 包含 applicant 和 claim（model_dump 自動處理，無需改動）

## 2. Frontend

- [x] 2.1 更新 `api.ts`：新增 `OCRApplicantResult`、`OCRClaimResult` types，更新 `OCRResponse`
- [x] 2.2 更新 `page.tsx`：`handleOCRComplete` 合併 applicant + claim 欄位

## 3. Verification

- [x] 3.1 TypeScript 編譯零錯誤
- [x] 3.2 用本票範例2測試，確認 applicant.name、interestRate、interestStartPoint 正確填入
