## Why

使用者上傳影像後立即觸發 OCR 辨識，無法在送出前確認照片是否正確（例如拍糊、選錯檔案）。加入預覽確認步驟可避免不必要的 OCR 處理，並提升操作體驗。

## What Changes

- 上傳照片後不再立即進行 OCR，改為先顯示縮圖預覽
- 新增兩個 SVG icon 按鈕：勾選（確認送出）與重新上傳（清除重來）
- 使用者點擊「勾選」後才觸發 OCR 辨識及後續流程
- 使用者點擊「重新上傳」後清空預覽，回到等待上傳狀態

## Capabilities

### New Capabilities

- `ocr-image-preview`: 影像上傳後的縮圖預覽與確認/重新上傳互動流程

### Modified Capabilities

- `paddleocr-integration`: OCR 觸發時機從「上傳即辨識」改為「使用者確認後才辨識」

## Impact

- **Frontend**: `ImageUpload.tsx` 組件需重構狀態機，新增 `previewing` 狀態與確認/重新上傳按鈕
- **Backend**: 無變動，API 合約不變
- **Dependencies**: 無新增依賴
