## 1. 頁面佈局重寫

- [x] 1.1 重寫 `page.tsx`：移除 Step 狀態與步驟指示器，改為左右分割面板佈局（`lg:grid lg:grid-cols-2 lg:gap-8`）
- [x] 1.2 將 `useForm` 從 PetitionForm 提升至 `page.tsx`，使用 `watch()` 即時取得表單資料
- [x] 1.3 左側面板放置表單（自然捲動），右側面板放置預覽（`lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto`）
- [x] 1.4 行動裝置佈局：寬度 < 1024px 時自動回退為上下堆疊（表單在上、預覽在下）

## 2. PetitionForm 改造

- [x] 2.1 修改 PetitionForm 接收外部傳入的 `register`, `errors`, `control`, `watch`（不再內部建立 useForm）
- [x] 2.2 移除「預覽聲請狀」提交按鈕

## 3. PetitionPreview 改造

- [x] 3.1 移除 `onBack` prop 與「返回修改」按鈕
- [x] 3.2 加入未填寫欄位佔位文字處理：空值顯示「＿＿＿」（姓名、住址、票號等文字欄位）、金額為 0 時顯示「＿＿＿」、日期為空時顯示「民國＿年＿月＿日」
- [x] 3.3 將「下載 PDF」按鈕移至預覽面板上方固定位置

## 4. 驗證與 PDF 下載整合

- [x] 4.1 在 `page.tsx` 建立下載 PDF 處理函式：點擊時先用 `handleSubmit` 觸發 Zod 驗證，通過才產生 PDF
- [x] 4.2 驗證失敗時錯誤訊息顯示在左側表單對應欄位

## 5. 驗證

- [x] 5.1 確認桌面版左右分割顯示正確，右側 sticky 固定
- [x] 5.2 確認行動裝置上下堆疊顯示正確
- [x] 5.3 確認即時預覽：修改表單任意欄位後右側預覽立即更新
- [x] 5.4 確認 PDF 下載流程：驗證通過 → 產生 PDF；驗證失敗 → 顯示錯誤
- [x] 5.5 執行 `next build` 確認無編譯錯誤
