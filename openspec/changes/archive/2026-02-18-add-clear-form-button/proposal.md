## Why

使用者填入範例資料或手動輸入後，目前沒有一鍵清空所有表單欄位的方式。需要逐一刪除每個欄位的內容，操作不便。新增「清除內容」按鈕讓使用者能快速重置表單。同時將操作按鈕（填入範例 + 清除內容）移至左側面板右側，與表單操作邏輯更一致。

## What Changes

- 在「填入範例」按鈕右側新增「清除內容」按鈕，點擊後清空所有表單欄位（重置為初始空白值）
- 將「填入範例」和「清除內容」兩個按鈕群組移動到左側面板的右側（使用 `ml-auto` 或 flex justify-end）
- ModeTab 維持在左側，按鈕群組靠右

## Capabilities

### New Capabilities

（無新能力，此為純 UI 調整）

### Modified Capabilities

- `petition-form`: 新增清除表單功能按鈕及按鈕列佈局調整

## Impact

- `frontend/src/app/page.tsx` — 新增清除按鈕、調整按鈕列 flex 佈局
