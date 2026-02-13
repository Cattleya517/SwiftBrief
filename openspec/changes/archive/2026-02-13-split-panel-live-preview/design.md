## Context

目前 `page.tsx` 使用 `useState<Step>` 控制兩步驟流程（form → preview）。`PetitionForm` 透過 `onSubmit` 回傳驗證後的資料，`PetitionPreview` 接收完整資料渲染。需改為左右分割面板，表單與預覽同時可見，預覽即時更新。

主要影響的檔案：
- `frontend/src/app/page.tsx` — 頁面佈局與狀態管理
- `frontend/src/components/PetitionForm.tsx` — 移除提交邏輯，暴露 watch 資料
- `frontend/src/components/PetitionPreview.tsx` — 移除 onBack，處理部分填寫狀態

## Goals / Non-Goals

**Goals:**
- 表單與預覽同時可見，預覽隨輸入即時更新
- 桌面版左右分割、行動裝置上下堆疊
- 右側預覽面板 sticky 固定，左側可捲動
- 驗證時機改為點擊「下載 PDF」時觸發

**Non-Goals:**
- 不改動子表單元件（PartySection, ClaimSection 等）的內部邏輯
- 不改動 PDF 產生邏輯（html2pdf.js 設定不變）
- 不改動 Zod schema 或驗證規則

## Decisions

### Decision 1: 表單狀態提升至 page.tsx

**選擇**: 將 `useForm` 從 `PetitionForm` 提升到 `page.tsx`，讓 page 同時持有表單狀態供預覽使用。

**目前**:
```
page.tsx (useState: step, formData)
  └─ PetitionForm (useForm 在這裡，onSubmit 傳回資料)
  └─ PetitionPreview (接收完整 formData)
```

**改為**:
```
page.tsx (useForm 在這裡，watch() 即時取得資料)
  ├─ PetitionForm (接收 register, errors, control, watch)
  └─ PetitionPreview (接收 watch 的即時資料)
```

**理由**:
- `useForm` 的 `watch()` 可即時取得所有欄位值，傳給 PetitionPreview 即可即時渲染
- 避免在 PetitionForm 內部用 `useEffect` + callback 同步資料的複雜做法
- PetitionForm 變為純 UI 元件，只負責渲染輸入欄位

**替代方案**:
- 在 PetitionForm 內用 `watch` + `onChange` callback 回傳資料：多一層間接，page 需 useState 額外管理
- 用 React context / store：過度設計，useForm 已提供足夠的狀態管理

### Decision 2: 佈局方式 — CSS Grid + sticky

**選擇**: 使用 Tailwind CSS Grid 實現左右分割，右側用 `sticky top-0`

```html
<div class="lg:grid lg:grid-cols-2 lg:gap-8">
  <div><!-- 左：表單（自然捲動）--></div>
  <div class="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
    <!-- 右：預覽（固定位置）-->
  </div>
</div>
```

**理由**:
- CSS Grid 原生支援等寬雙欄
- `lg:` breakpoint (1024px) 以下自動回退為堆疊排列
- `sticky` 讓預覽面板在捲動時保持可見
- 預覽面板自身 `overflow-y-auto` 處理內容超高的情況

**替代方案**:
- Flexbox：同樣可行，但 Grid 的 `grid-cols-2` 更簡潔
- 固定寬度像素：不夠彈性，Grid 的百分比分割更適合響應式

### Decision 3: PetitionPreview 處理未填寫欄位

**選擇**: Preview 元件容忍空值，未填欄位顯示「＿＿＿」佔位文字

**理由**:
- 即時預覽下，資料永遠是部分填寫狀態
- 使用者期待看到文件逐漸成形的過程
- 用空值檢查 `value || "＿＿＿"` 即可，不需額外型別

### Decision 4: 驗證觸發與下載 PDF 按鈕

**選擇**: 「下載 PDF」按鈕放在右側預覽面板上方。點擊時先用 `handleSubmit` 觸發 Zod 驗證，通過才產生 PDF。

**理由**:
- 驗證邏輯不變（仍用 `petitionFormSchema`）
- `handleSubmit` 成功時呼叫 PDF 產生函式
- 驗證失敗時錯誤會自動顯示在左側表單欄位上

## Risks / Trade-offs

- **watch() 效能** → `watch()` 會在每次輸入時觸發 re-render。表單欄位數量有限（~15 個），效能影響可忽略。若未來欄位大幅增加，可改用 `useWatch` 搭配 memo 優化
- **預覽面板高度** → sticky 面板在不同螢幕高度下可能表現不同 → 使用 `h-screen` + `overflow-y-auto` 確保可捲動
- **行動裝置體驗** → 上下堆疊時預覽面板會在表單下方，使用者需捲到底才能看到 → 可接受，行動裝置上即時預覽的重要性較低
