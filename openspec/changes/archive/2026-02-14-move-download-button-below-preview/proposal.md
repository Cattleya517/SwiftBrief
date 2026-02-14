## Why

目前「下載 PDF」按鈕位於預覽區上方，使用者必須先捲過按鈕才能看到預覽結果。將按鈕移至預覽下方更符合操作流程：先檢視預覽內容，確認無誤後再下載。

## What Changes

- 將 `PdfDownloadButton` 元件從預覽區上方移至預覽區下方
- 調整 `page.tsx` 中右側面板的 JSX 排列順序

## Capabilities

### New Capabilities

_None — this is a layout adjustment._

### Modified Capabilities

- `petition-preview`: 頁面佈局中下載按鈕的位置從預覽上方改為預覽下方

## Impact

- **受影響的檔案**：`frontend/src/app/page.tsx`（僅調整 JSX 順序）
- **使用者體驗**：下載按鈕移至預覽下方，操作流程更直覺
- **風險**：極低，僅 JSX 順序調整
