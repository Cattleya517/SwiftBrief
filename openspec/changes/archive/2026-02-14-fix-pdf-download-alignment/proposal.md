## Why

PDF 預覽時使用者輸入的文字與 template 對齊正確，但下載的 PDF 中使用者資訊與 template 無法對齊。根本原因是預覽元件的寬度是**響應式的**（在 `lg:grid-cols-2` 佈局中約佔視窗 50%），而 PDF 生成時 html2canvas 直接擷取當前渲染寬度，再將其縮放至固定的 A4 content width（180mm），導致固定像素值的縮排（`indent-8`、`ml-20`、`w-20`）在比例上發生偏移。

## What Changes

- 在 PDF 生成前，將預覽元件暫時設為固定寬度（對應 A4 content area），確保 html2canvas 擷取時的佈局與最終 PDF 輸出一致
- 生成完成後恢復原本的響應式寬度，不影響即時預覽體驗
- 調整 `PdfDownloadButton` 中的擷取邏輯，在呼叫 html2canvas 前後正確管理元件尺寸

## Capabilities

### New Capabilities

_None — this is a bug fix, not a new capability._

### Modified Capabilities

- `petition-pdf`: PDF 下載功能需確保擷取時元件寬度與 A4 輸出寬度一致，消除響應式佈局造成的對齊偏差

## Impact

- **受影響的檔案**：`frontend/src/components/PdfDownloadButton.tsx`（主要修改）、可能微調 `PetitionPreview.tsx`
- **使用者體驗**：PDF 生成時預覽區可能短暫閃爍（寬度切換），但生成完成後立即恢復
- **依賴**：無新增依賴，仍使用現有的 html2canvas + jsPDF
