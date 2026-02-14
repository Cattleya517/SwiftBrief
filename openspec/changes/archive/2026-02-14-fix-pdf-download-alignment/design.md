## Context

PetitionPreview 元件在 `page.tsx` 中以響應式佈局渲染（`lg:grid-cols-2`），其寬度隨視窗大小變化。PdfDownloadButton 使用 html2canvas 擷取該元件的 DOM，再用 jsPDF 將 canvas 縮放至 A4 content width（180mm）。

問題在於：預覽元件的實際渲染寬度（例如 ~600px）與 A4 content width 對應的像素寬度（180mm ≈ 680px @96dpi）不一致。html2canvas 擷取的是當前渲染結果，而 Tailwind 的固定像素 class（`indent-8`=32px、`ml-20`=80px、`w-20`=80px）在不同寬度下的視覺比例不同。當 canvas 被縮放至 A4 寬度時，這些固定值的比例就會偏移。

相關程式碼：
- `PdfDownloadButton.tsx:42-46` — html2canvas 擷取，無寬度控制
- `PetitionPreview.tsx:33-35` — `previewRef` 元素，使用 `p-12` 和固定像素 class
- `page.tsx:60` — 響應式 grid 佈局

## Goals / Non-Goals

**Goals:**
- PDF 下載的文字對齊與預覽畫面一致
- 修改範圍最小化，僅調整 PDF 生成流程
- 不影響即時預覽的響應式體驗

**Non-Goals:**
- 不重寫 PetitionPreview 為百分比佈局（影響範圍太大且非必要）
- 不更換 html2canvas/jsPDF 技術方案
- 不處理字型渲染差異（非此問題）

## Decisions

### Decision 1: 擷取前暫時固定元素寬度

**選擇**: 在呼叫 html2canvas 前，暫時將 `previewRef` 元素的寬度設為與 A4 content area 對應的固定像素值，擷取完成後恢復。

**計算**: A4 content width = 180mm。在 96dpi 下 180mm ≈ 680px。但由於 html2canvas 使用 `scale: 2`，實際上元素本身應以 680px 寬度渲染（scale 只影響 canvas 解析度，不影響 CSS layout）。

**做法**:
```typescript
// 擷取前
const originalWidth = element.style.width;
const originalMaxWidth = element.style.maxWidth;
const originalPosition = element.style.position;

element.style.width = "680px";
element.style.maxWidth = "680px";
element.style.position = "absolute"; // 脫離 grid flow，避免影響佈局

const canvas = await html2canvas(element, { scale: 2, ... });

// 擷取後還原
element.style.width = originalWidth;
element.style.maxWidth = originalMaxWidth;
element.style.position = originalPosition;
```

**替代方案考慮**:
- **Clone 元素再擷取**: 建立一個隱藏的 clone，設為固定寬度後擷取。優點是零視覺閃爍，缺點是需要 deep clone DOM（包含 computed styles），複雜度高且可能遺失動態樣式。
- **使用 CSS `@media print`**: 加入列印媒體查詢固定寬度。但 html2canvas 不支援 media query 切換，無法解決問題。
- **將 PetitionPreview 改為百分比佈局**: 從根本避免固定像素問題，但改動範圍大，可能影響現有預覽的視覺效果。

**選擇理由**: 暫時固定寬度是最小侵入的方案，只修改 `PdfDownloadButton.tsx`，且邏輯清晰。使用 `position: absolute` 可避免寬度變化影響 grid 佈局（不會造成其他元素跳動）。

### Decision 2: 使用 try/finally 確保還原

無論 html2canvas 成功或失敗，都必須還原元素的原始樣式。使用 `try/finally` 包裹。

### Decision 3: 固定寬度值以常數定義

將 680px（A4 content area 對應像素寬度）定義為常數 `CONTENT_WIDTH_PX`，與現有的 `CONTENT_WIDTH_MM` 對應，方便維護。

計算公式: `CONTENT_WIDTH_PX = CONTENT_WIDTH_MM / 25.4 * 96`（即 mm → inch → px @96dpi）

## Risks / Trade-offs

- **視覺閃爍**: PDF 生成期間（~1-2 秒），預覽區寬度會暫時改變。由於使用 `position: absolute` 脫離文件流，其他元素不會跳動，但預覽本身會短暫消失/重排。此為可接受的 trade-off，因為生成期間按鈕已顯示 loading 狀態。→ 若未來需要零閃爍，可改用 clone 方案。
- **96dpi 假設**: 不同裝置的 DPI 可能不同，但 html2canvas 的 `scale` 參數只影響 canvas 解析度，CSS layout 仍以 96dpi 為基準（瀏覽器標準行為）。此假設在所有主流瀏覽器中成立。
- **padding 包含在寬度內**: `previewRef` 元素有 `p-12`（48px），Tailwind 預設 `box-sizing: border-box`，所以 680px 寬度已包含 padding。這與 PDF margin 計算獨立（PDF margin 由 jsPDF 的 `MARGIN_LEFT_MM` 控制），不會衝突。
