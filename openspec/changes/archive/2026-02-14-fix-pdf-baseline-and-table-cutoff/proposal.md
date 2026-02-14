## Why

前一次修正使用 `vertical-align: top` 修正混合中英文基線，但經調查發現 **html2canvas 完全不支援 `vertical-align`**（其 CSS property descriptor 中無此屬性），因此該修正無效。此外，PDF 多頁下載時本票明細表被頁面邊界切斷。

兩個問題：
1. 數字/英文字元（"115"、"194"、"kpkpqwdk"）在 PDF 中仍呈下標狀偏移
2. 本票明細表在多頁 PDF 中被切斷（表頭可見但資料列被截斷）

## What Changes

- 將 `fixMixedScriptBaseline` 中的 `vertical-align: top` 替換為 `display: inline-block; transform: translateY(-Npx)`（html2canvas 支援 `transform`）
- 改進 `PdfDownloadButton` 中的多頁切割邏輯，在切割前測量內容中各區塊的位置，將分頁點調整到區塊之間而非區塊內部

## Capabilities

### New Capabilities

_None — bug fixes._

### Modified Capabilities

- `petition-pdf`: 修正基線對齊方法（改用 transform）並改進多頁分頁邏輯避免切割表格

## Impact

- **受影響的檔案**：`frontend/src/lib/patch-html2canvas.ts`（修改基線修正方法）、`frontend/src/components/PdfDownloadButton.tsx`（改進分頁邏輯）
- **依賴**：無新增依賴
