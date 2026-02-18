## Context

`ImageUpload.tsx` 目前的狀態機為 `idle → selected → loading → success/error`。`handleSelect` 同時呼叫 `handleFile`（建立預覽）和 `handleUpload`（送出 OCR），使用者無法在送出前確認照片。需在 `selected` 和 `loading` 之間插入一個確認步驟。

## Goals / Non-Goals

**Goals:**
- 使用者上傳照片後先看到縮圖預覽，再自行決定是否送出 OCR
- 提供簡潔的確認（勾選）與重新上傳（返回）SVG icon 按鈕
- 保持現有 API 合約與後端邏輯不變

**Non-Goals:**
- 圖片裁剪、旋轉等編輯功能
- 多張圖片批次上傳
- 圖片壓縮或前端預處理

## Decisions

### 1. 狀態機擴展：新增 `previewing` 狀態

在既有狀態之間加入 `previewing`：

```
idle → previewing → loading → success / error
         ↓
       idle（重新上傳）
```

- `idle`：等待上傳
- `previewing`：顯示縮圖 + 確認/重新上傳按鈕
- `loading`：OCR 辨識中
- `success` / `error`：辨識結果

**理由**：現有 `selected` 狀態的語意是「已選取檔案且即將送出」，與新需求的「預覽等待確認」不同。新增明確的 `previewing` 狀態讓流程更清晰，同時移除不再需要的 `selected` 狀態。

### 2. 拆分 handleSelect — 上傳與確認分離

目前 `handleSelect` 同時做預覽和送出。改為：
- **檔案選取/拖曳** → 只呼叫 `handleFile`，進入 `previewing`
- **點擊確認按鈕** → 呼叫 `handleUpload`，進入 `loading`

需在組件內保存當前檔案的 ref (`fileRef`)，以便確認按鈕觸發時取用。

**理由**：最小改動，不改變既有函式簽名，僅改變呼叫時機。

### 3. 按鈕使用 inline SVG icon

使用兩個簡單的 SVG icon：
- **確認（勾選）**：綠色圓形背景 + 白色勾選圖示
- **重新上傳（返回）**：灰色圓形背景 + 白色返回箭頭圖示

直接以 inline SVG 嵌入組件，不引入 icon library。

**理由**：專案目前未使用 icon library（disclaimer-modal 也使用 custom SVG），保持一致性且避免新增依賴。

### 4. 預覽區域佈局

縮圖預覽置中顯示，下方水平排列兩個 icon 按鈕（重新上傳在左、確認在右），按鈕間距適當。整體仍在現有 dashed border 容器內。

**理由**：維持現有視覺風格，最小 UI 變動。

## Risks / Trade-offs

- **[使用者多一步操作]** → 確認步驟增加一次點擊，但可避免誤傳錯誤照片浪費 OCR 資源
- **[檔案暫存在記憶體]** → 使用 `useRef` 保存 File 物件直到確認或重置，單張照片記憶體影響可忽略
