## 1. 依賴替換

- [x] 1.1 安裝 `jspdf` 和 `html2canvas`，移除 `html2pdf.js`
- [x] 1.2 移除 `frontend/src/types/html2pdf.d.ts` 型別宣告檔

## 2. PdfDownloadButton 元件

- [x] 2.1 建立 `frontend/src/components/PdfDownloadButton.tsx`：接收 `previewRef`、`handleSubmit`、`onSubmit` props，包含按鈕 UI（含 loading spinner、成功/錯誤訊息）
- [x] 2.2 實作 PDF 產生邏輯：動態 import `html2canvas` + `jspdf`，canvas 轉 A4 PDF（含分頁），觸發下載，檔案命名格式 `民事聲請狀_姓名_日期.pdf`
- [x] 2.3 設定 html2canvas 選項：`scale: 2`, `useCORS: true`，確保中文字元正確渲染
- [x] 2.4 實作 A4 分頁邏輯：依 canvas 高度與 A4 頁面可用高度比例，逐頁裁切繪入 PDF，設定邊距上下 20mm、左右 15mm

## 3. page.tsx 整合

- [x] 3.1 在 `page.tsx` 中使用 `next/dynamic` 載入 `PdfDownloadButton`，設定 `ssr: false`
- [x] 3.2 移除 `page.tsx` 中舊的 `handleDownloadPdf` 函式及相關 state（`isGenerating`、`downloadError`、`downloadSuccess`）
- [x] 3.3 將舊的按鈕區塊替換為動態載入的 `PdfDownloadButton`

## 4. 驗證

- [x] 4.1 執行 `next build` 確認無編譯錯誤（無 `self is not defined`）
- [x] 4.2 執行 `next dev` 確認本地 PDF 下載正常運作
