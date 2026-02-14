## Why

PDF 下載後，混合中英文的段落中，英文/拉丁字元（如使用者輸入的姓名 "dsajo"、原因 "lend"、金額 "NT$122,211"）會出現類似下標的垂直偏移，與周圍中文字元的基線不對齊。瀏覽器預覽中顯示正確，僅 PDF 下載有此問題。

根本原因：html2canvas 使用 Canvas 2D API 的 `fillText()` 渲染文字時，對所有文字套用單一的 alphabetic baseline。但 CJK 字元使用 ideographic baseline，與 alphabetic baseline 存在垂直偏移。瀏覽器原生渲染會自動依文字 script 調整基線，html2canvas 不會。

## What Changes

- 在 html2canvas 擷取前，透過 `onclone` callback 對預覽元素中的混合文字節點進行處理，確保 canvas 渲染時中英文基線一致
- 可能的做法包括：統一字型指定（使用 CJK 字型同時涵蓋 Latin glyphs）、或對 Latin 文字片段加上 CSS 微調（如 `vertical-align` 補償）

## Capabilities

### New Capabilities

_None — this is a bug fix._

### Modified Capabilities

- `petition-pdf`: PDF 下載需確保混合 CJK+Latin 文字的基線對齊正確

## Impact

- **受影響的檔案**：`frontend/src/lib/patch-html2canvas.ts`（擴充 onclone 邏輯）、可能調整 `PetitionPreview.tsx` 的字型設定
- **依賴**：無新增依賴，利用現有的 patch-html2canvas 機制
- **風險**：字型變更可能影響排版間距，需驗證預覽與 PDF 的整體佈局
