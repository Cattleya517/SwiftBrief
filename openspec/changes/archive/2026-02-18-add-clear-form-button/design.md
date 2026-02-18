## Context

`page.tsx` 中已有「填入範例」按鈕，使用 `reset(EXAMPLE_DATA)` 填入表單。目前按鈕列佈局為：ModeTab 和「填入範例」在同一行，使用 `flex items-center gap-3`，所有元素靠左。

現有 `INITIAL_VALUES` 常數已定義空白表單初始值，可直接用於清除功能。

## Goals / Non-Goals

**Goals:**
- 新增「清除內容」按鈕，一鍵將表單重置為空白初始值
- 將按鈕群組移至左側面板右側，ModeTab 保持靠左

**Non-Goals:**
- 不改變表單驗證邏輯或 schema
- 不新增確認對話框（一鍵直接清除）

## Decisions

### 清除機制：使用 `reset(INITIAL_VALUES)`

沿用現有「填入範例」的 `reset()` 模式，傳入 `INITIAL_VALUES` 即可。無需額外邏輯。

### 佈局：`flex` + `ml-auto`

在現有 flex 容器中，將兩個按鈕包在一個 `div` 裡並加上 `ml-auto`，使其靠右。ModeTab 自然靠左。

```
┌──────────────────────────────────────────────────┐
│  [ModeTab]                 [填入範例] [清除內容]  │
│  ← 靠左                              靠右 →      │
└──────────────────────────────────────────────────┘
```

### 按鈕樣式：與「填入範例」一致

使用相同的 `border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100` 樣式，保持視覺一致性。

## Risks / Trade-offs

- 誤按清除無確認 → 使用者可立即用「填入範例」或 OCR 重新填入，影響低
