## Why

目前的兩步驟流程（填寫表單 → 點擊預覽）讓使用者無法即時看到聲請狀的最終效果，每次修改都需要來回切換。改為左右分割面板，左側填寫、右側即時預覽，讓使用者邊填邊看結果，大幅提升操作體驗。

## What Changes

- **BREAKING**：移除兩步驟流程（form → preview 頁面切換）與步驟指示器
- 改為左右分割面板佈局：左側表單、右側即時預覽
- 預覽面板隨表單輸入即時更新（不需點擊「預覽」按鈕）
- 「下載 PDF」按鈕移至右側預覽面板上方
- 移除「返回修改」按鈕（不再需要，表單與預覽同時可見）
- 行動裝置上改為上下堆疊排列（表單在上、預覽在下）

## Capabilities

### New Capabilities
<!-- 無新增 capability，皆為既有 capability 的行為變更 -->

### Modified Capabilities
- `petition-preview`: 預覽觸發方式從「點擊預覽按鈕後顯示」改為「即時渲染，隨表單輸入即時更新」；移除返回編輯功能（不再需要）
- `petition-form`: 表單不再有獨立的「預覽」提交按鈕，改為即時同步資料至預覽面板；表單驗證改為在點擊「下載 PDF」時觸發

## Impact

- `frontend/src/app/page.tsx`：重寫頁面佈局，從步驟切換改為左右分割面板
- `frontend/src/components/PetitionForm.tsx`：移除 `onSubmit` 提交邏輯，改用 `watch` 即時同步表單資料
- `frontend/src/components/PetitionPreview.tsx`：移除「返回修改」按鈕，接收即時資料渲染
- 響應式佈局：桌面左右分割、行動裝置上下堆疊
