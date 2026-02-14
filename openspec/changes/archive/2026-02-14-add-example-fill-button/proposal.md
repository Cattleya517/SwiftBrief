## Why

使用者初次使用時不確定表單應填入什麼內容，需要逐欄摸索。開發者測試時也需要反覆手動填入有效資料。加入「填入範例」按鈕可同時解決兩個需求：幫助使用者理解表單用途，並加速開發測試流程。

## What Changes

- 在表單區域上方新增「填入範例」按鈕
- 點擊後使用 react-hook-form 的 `reset()` 填入一組完整且通過驗證的範例資料（包含有效的台灣身分證字號）
- 預覽面板會立即反映範例資料

## Capabilities

### New Capabilities

- `example-fill`: 提供一鍵填入範例資料的功能

### Modified Capabilities

_None._

## Impact

- **受影響的檔案**：`frontend/src/app/page.tsx`（新增按鈕和範例資料常數）
- **依賴**：無新增依賴，使用 react-hook-form 現有的 `reset()` 方法
- **風險**：極低，僅新增 UI 元素
