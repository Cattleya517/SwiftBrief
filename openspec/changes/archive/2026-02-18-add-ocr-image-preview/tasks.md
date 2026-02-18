## 1. 狀態機重構

- [x] 1.1 將 `ImageUpload.tsx` 的 `Status` type 改為 `"idle" | "previewing" | "loading" | "success" | "error"`，移除 `selected`
- [x] 1.2 新增 `fileRef = useRef<File | null>(null)` 用於暫存使用者選取的檔案

## 2. 上傳與確認流程分離

- [x] 2.1 修改 `handleSelect` / `handleFile`：檔案選取後只建立預覽並進入 `previewing` 狀態，不呼叫 `handleUpload`
- [x] 2.2 新增 `handleConfirm` 函式：從 `fileRef` 取得檔案，呼叫 `handleUpload` 進入 `loading`
- [x] 2.3 修改 `reset` 函式：額外清除 `fileRef.current`

## 3. 預覽 UI 與按鈕

- [x] 3.1 在 `previewing` 狀態下顯示縮圖預覽（置中，max-h 限制）
- [x] 3.2 新增確認按鈕：綠色圓形背景 + 白色勾選 inline SVG icon，點擊觸發 `handleConfirm`
- [x] 3.3 新增重新上傳按鈕：灰色圓形背景 + 白色返回箭頭 inline SVG icon，點擊觸發 `reset`
- [x] 3.4 兩個按鈕水平排列於縮圖下方（重新上傳在左、確認在右），僅在 `previewing` 狀態顯示

## 4. 事件處理修正

- [x] 4.1 確認/重新上傳按鈕加上 `e.stopPropagation()` 避免觸發外層容器的 click 事件
- [x] 4.2 `previewing` 狀態下禁止外層容器的 click 開啟檔案選取器
