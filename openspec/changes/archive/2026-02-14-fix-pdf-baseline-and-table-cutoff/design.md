## Context

html2canvas v1.4.1 的 CSS property descriptor 中不包含 `vertical-align`，因此 `<span style="vertical-align: top">` 包裹方案完全無效。

但 html2canvas **支援 CSS `transform`**（有 `transform.js` descriptor），在渲染時會對 canvas context 套用 `ctx.setTransform()`。因此可用 `transform: translateY()` 來調整 Latin 文字的垂直位置。

多頁分頁方面，目前 `PdfDownloadButton.tsx` 將 canvas 按固定高度等分切割（`CONTENT_HEIGHT_MM * scaleFactor` pixels per page），不考慮內容邊界。

## Goals / Non-Goals

**Goals:**
- 修正 Latin 文字基線偏移（使用 html2canvas 實際支援的 CSS 屬性）
- 改進多頁分頁點，避免切割表格等區塊級元素

**Non-Goals:**
- 不實現完美的分頁演算法（僅需避免切割表格，不需處理所有邊界情況）
- 不更換 html2canvas

## Decisions

### Decision 1: 使用 `transform: translateY()` 修正基線

**選擇**: 修改 `fixMixedScriptBaseline()` 中的 Latin segment 包裹方式：

```typescript
span.style.display = "inline-block";
span.style.transform = "translateY(-1px)";
```

- `display: inline-block`：使 span 成為獨立的渲染容器，html2canvas 會為其建立獨立的繪製上下文
- `transform: translateY(-1px)`：html2canvas 會透過 `ctx.setTransform()` 套用此偏移，將 Latin 文字向上移動

偏移值需實測調整（初始設 `-1px`，可能需要 `-2px` 或 `-1.5px`）。

**替代方案**：Patch html2canvas 的 `canvas-renderer.js` 加入自訂基線調整邏輯。侵入性太高，升級時維護成本大。

### Decision 2: 智慧分頁避免切割

**選擇**: 在 canvas 切割前，測量 previewRef 元素中各 section div 的位置，計算哪些區塊會被頁面邊界切割，將切割點調整到區塊之間的間隙。

做法：
1. 在設定固定寬度後、html2canvas 擷取前，測量各直接子元素的 `offsetTop` 和 `offsetHeight`
2. 計算每頁的 CSS 像素高度（`CONTENT_HEIGHT_MM / 25.4 * 96`）
3. 對於每個理論分頁點，檢查是否切割到某個子元素
4. 如果切割到，將分頁點上移到該元素的 `offsetTop` 位置（即該元素的上方）
5. 將調整後的分頁點轉換為 canvas 像素，用於 canvas 切割

這不需要修改 html2canvas 或 DOM 結構，僅調整 canvas 切割的 Y 座標。

## Risks / Trade-offs

- **transform 值精確度**: `-1px` 可能不是所有字型/字號的最佳值。由於只作用在 cloned DOM，可安全地反覆調整。
- **inline-block 影響換行**: `display: inline-block` 可能改變 Latin 片段的換行行為（不再在片段內部換行）。由於使用者輸入的 Latin 文字通常較短（姓名、數字），影響有限。
- **分頁調整可能留白**: 將分頁點上移可能導致頁面底部多出空白。這比切割表格更可接受。
- **僅處理直接子元素**: 分頁邏輯只看第一層子元素的位置，不遞迴深入。對於目前的聲請狀結構（各區塊以 `<div className="mb-6">` 分隔）已足夠。
