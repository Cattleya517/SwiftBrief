## Why

PDF 下載功能在本地及 Vercel 部署環境皆無法正常運作。根本原因是 `html2pdf.js` 為 UMD-only 套件，其 wrapper 使用 `self` 全域變數，而其依賴 `html2canvas` 在模組初始化時直接引用 `window`（`CacheStorage.setContext(window)`）。Next.js 在 build 時會對 `"use client"` 元件進行 pre-rendering 與靜態分析，即使使用 `await import()` 動態載入，bundler 仍會解析模組依賴樹，導致在 server 環境觸發 `self is not defined` 或 `window is not defined` 錯誤。

## What Changes

- 替換 `html2pdf.js` 為直接使用 `jsPDF` + `html2canvas`，搭配 `next/dynamic`（`ssr: false`）確保僅在瀏覽器端載入
- 將 PDF 產生邏輯抽離至獨立元件，透過 `next/dynamic` 排除 SSR
- 移除 `html2pdf.js` 依賴及其型別宣告檔案
- 維持現有 PDF 功能不變：A4 格式、繁體中文、檔案命名、多頁支援

## Capabilities

### New Capabilities

（無新增功能）

### Modified Capabilities

- `petition-pdf`: PDF 產生實作從 `html2pdf.js` 改為 `jsPDF` + `html2canvas`，並加入 SSR 防護。需求規格不變，僅實作方式改變。

## Impact

- `frontend/src/app/page.tsx`: PDF 下載按鈕及產生邏輯將移至獨立元件
- `frontend/src/types/html2pdf.d.ts`: 移除
- `frontend/package.json`: 移除 `html2pdf.js`，新增 `jspdf` + `html2canvas`
- `frontend/next.config.ts`: 可能需要 webpack externals 設定
