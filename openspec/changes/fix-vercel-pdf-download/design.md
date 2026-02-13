## Context

目前 PDF 產生使用 `html2pdf.js`（v0.14.0），它是 `jsPDF` + `html2canvas` 的封裝。此套件為 UMD-only，其 wrapper 使用 `(self, function(...))` 模式，且 `html2canvas` 在模組初始化時直接呼叫 `CacheStorage.setContext(window)`。

Next.js 16 即使在 `"use client"` 元件中使用 `await import("html2pdf.js")`，bundler 仍會在 build 時靜態分析並解析模組樹，在 server 環境觸發 `self is not defined` 錯誤。

現行程式碼位於 `page.tsx` 的 `handleDownloadPdf` 函式中，直接在頂層頁面元件內動態載入。

## Goals / Non-Goals

**Goals:**

- PDF 下載功能在本地開發、`next build`、Vercel 部署環境皆能正常運作
- 維持現有 PDF 品質與功能（A4、中文、檔案命名、多頁）
- 維持純前端產生，不依賴後端

**Non-Goals:**

- 不改變 PDF 視覺輸出或格式
- 不遷移至完全不同的 PDF 引擎（如 `@react-pdf/renderer`），因為現有 DOM-to-canvas 方式能最佳保留預覽畫面的視覺一致性
- 不處理 PDF 文字可選取問題（維持現有 image-based 方式）

## Decisions

### Decision 1: 直接使用 jsPDF + html2canvas 取代 html2pdf.js

html2pdf.js 只是一層薄封裝，直接使用底層函式庫可以：
- 避免 UMD wrapper 的 `self` 問題
- 更精確控制 canvas 轉 PDF 的流程（分頁邏輯、DPI 設定）
- 減少一層依賴

**替代方案考慮：**
- 保留 html2pdf.js + webpack externals：治標不治本，html2canvas 仍有 `window` 問題
- `@react-pdf/renderer`：需要完全重寫預覽元件為 react-pdf 格式，改動範圍過大

### Decision 2: 使用 next/dynamic + ssr: false 隔離 PDF 元件

將「下載 PDF」按鈕與產生邏輯抽離至獨立元件 `PdfDownloadButton`，透過 `next/dynamic({ ssr: false })` 載入。這確保 `jsPDF` 與 `html2canvas` 完全不進入 server bundle。

按鈕元件接收 `previewRef` 和 form 的 `handleSubmit`，在點擊時：
1. 動態 import `jspdf` 和 `html2canvas`
2. 將 previewRef 元素渲染為 canvas
3. 計算 A4 分頁並逐頁加入 PDF
4. 觸發下載

### Decision 3: 保留現有 previewRef 機制

PDF 產生仍基於 `previewRef` 指向的 DOM 元素（`PetitionPreview` 內的 div），這確保 PDF 內容與預覽畫面完全一致。不需要改動 `PetitionPreview` 元件。

## Risks / Trade-offs

- **html2canvas 本身也引用 window** → 透過 `ssr: false` 完全排除 server-side 載入來規避
- **jsPDF + html2canvas 的分頁邏輯需手動實作** → 使用 canvas 高度與 A4 頁面高度比例計算，逐頁裁切繪入 PDF
- **移除 html2pdf.js 後 pagebreak mode 不再可用** → 手動分頁以 A4 高度為基準切割 canvas，效果等同或更好
