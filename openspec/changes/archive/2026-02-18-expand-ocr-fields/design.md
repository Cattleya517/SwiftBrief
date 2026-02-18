## Context

目前 `OCRResult` 只有 `note` + `respondent`。需要擴充為 `note` + `respondent` + `applicant` + `claim`，對齊 schema.ts 中所有可從本票辨識的欄位。

## Goals / Non-Goals

**Goals:**
- LLM 從 OCR 文字中提取 applicant name、interestRate、interestStartPoint
- 前端自動填入這些新欄位
- API 向後相容（新欄位皆 optional）

**Non-Goals:**
- 不修改 OCR 引擎本身
- 不修改 schema.ts（表單結構不變）

## Decisions

### 1. OCRResult 新增 applicant 和 claim

在 `llm_service.py` 新增 `ApplicantResult` 和 `ClaimResult` Pydantic models，加入 `OCRResult`。

### 2. interestStartPoint 用 enum mapping

本票文字「自發票日起」→ `invoice_date`，「自到期日起」→ `maturity_date`，「自提示日起」→ `presentation_date`。LLM 直接回傳 schema enum 值。

### 3. _to_traditional 自動涵蓋新欄位

改為泛化迭代 OCRResult 所有子 model 的 str 欄位，不需每新增欄位手動加。
