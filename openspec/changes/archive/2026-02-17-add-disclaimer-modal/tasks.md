## 1. 建立 DisclaimerModal 元件

- [x] 1.1 建立 `frontend/src/components/DisclaimerModal.tsx` 檔案，加上 `"use client"` 指令
- [x] 1.2 實作 useState + useEffect 邏輯：mount 時檢查 localStorage `disclaimer_accepted`，若不存在則顯示 Modal
- [x] 1.3 實作接受按鈕 onClick：設定 localStorage `disclaimer_accepted` 為 `true` 並關閉 Modal

## 2. Modal UI 與樣式

- [x] 2.1 實作全螢幕遮罩（fixed inset-0 z-50 bg-black/50）與置中白色卡片（rounded-xl, max-w-lg）
- [x] 2.2 加入標題「免責聲明」與分隔線樣式
- [x] 2.3 建立三個免責條目區塊，每個包含小標題與說明文字（免責條款、隱私聲明、專業建議）
- [x] 2.4 為每個條目加入對應的 inline SVG icon（Shield、Lock、Scale），統一 24x24、stroke `#1E3A8A`、stroke-width 1.5、fill none
- [x] 2.5 實作「我已閱讀並同意」按鈕，使用 amber 主色調（bg-amber-700 hover:bg-amber-800 text-white）

## 3. 整合至 Layout

- [x] 3.1 在 `frontend/src/app/layout.tsx` 中引入 DisclaimerModal 元件，放置於 `{children}` 旁邊
- [x] 3.2 由於 layout.tsx 是 Server Component，需將 DisclaimerModal 作為 Client Component 獨立 import

## 4. 驗證

- [x] 4.1 驗證首次造訪時 Modal 正常顯示，且無法透過 ESC、點擊背景關閉
- [x] 4.2 驗證點擊同意後 Modal 關閉且 localStorage 寫入正確
- [x] 4.3 驗證重新整理頁面後 Modal 不再顯示
- [x] 4.4 驗證清除 localStorage 後 Modal 再次顯示
