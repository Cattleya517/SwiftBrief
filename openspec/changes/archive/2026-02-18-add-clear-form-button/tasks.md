## 1. UI 修改

- [x] 1.1 在 `page.tsx` 的按鈕列中，將「填入範例」按鈕包進一個 `div` 群組並加上 `ml-auto` 使其靠右
- [x] 1.2 在「填入範例」按鈕右側新增「清除內容」按鈕，點擊時呼叫 `reset(INITIAL_VALUES)` 清空表單
- [x] 1.3 「清除內容」按鈕使用與「填入範例」相同的樣式（`border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100`）

## 2. 驗證

- [x] 2.1 確認 TypeScript 編譯無錯誤（`npx tsc --noEmit`）
- [x] 2.2 確認頁面佈局：ModeTab 靠左，按鈕群組靠右，清除按鈕可正常清空表單
