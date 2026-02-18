## Context

SwiftBrief 是一個單頁式 Next.js 16 應用，使用 Tailwind CSS 4 手刻 UI，無外部元件庫。目前沒有任何 Modal/Dialog 元件。Root layout (`layout.tsx`) 結構簡潔，僅設定字型與 metadata。需要新增一個免責聲明 Modal，在使用者首次進入時強制顯示。

## Goals / Non-Goals

**Goals:**
- 使用者首次造訪時顯示免責聲明 Modal，必須同意才能使用網站
- 使用 localStorage 記住同意狀態，避免重複顯示
- 視覺風格與現有 app 一致（slate/blue 色系、amber 主色調按鈕、圓角卡片）
- 每個免責條目搭配簡約 inline SVG icon

**Non-Goals:**
- 不需要後端 API 記錄使用者同意狀態
- 不需要版本化免責聲明（未來如需更新條款再處理）
- 不需要支援多語言

## Decisions

### 1. 元件放置位置：layout.tsx 層級

**選擇**：在 `layout.tsx` 中引入 `DisclaimerModal`，包裹在 `{children}` 旁邊。

**理由**：layout.tsx 是所有頁面的共用外殼，確保無論路由如何變化，Modal 都會出現。由於目前是單頁應用，效果等同於放在 page.tsx，但 layout 層級更具前瞻性。

**替代方案**：放在 `page.tsx` — 但如果未來新增頁面會遺漏。

### 2. 狀態管理：useState + useEffect + localStorage

**選擇**：使用 React useState 管理 Modal 顯示狀態，useEffect 在 mount 時檢查 localStorage。

**理由**：邏輯簡單，不需要引入全域狀態管理。localStorage 是純客戶端操作，需要 `"use client"` 指令。

**替代方案**：Context API — 過度工程，單一 Modal 不需要。

### 3. 避免 Hydration Mismatch：預設不顯示

**選擇**：Modal 預設狀態為「不顯示」（`showModal = false`），在 useEffect 中檢查 localStorage 後才決定是否顯示。

**理由**：Server render 時不存取 localStorage，client mount 後才讀取，避免 hydration mismatch。使用者會在頁面載入後短暫延遲才看到 Modal，但幾乎不可察覺。

### 4. SVG Icon：Inline SVG

**選擇**：直接在元件中使用 inline SVG，不引入 icon 套件。

**理由**：僅需 3 個 icon（Shield、Lock、Scale），不值得為此引入整個 icon 套件（如 heroicons 或 lucide）。Inline SVG 零依賴、完全可控。

### 5. Modal 封鎖機制

**選擇**：使用固定定位全螢幕遮罩（`fixed inset-0 z-50`），不綁定 ESC 鍵事件，onClick 遮罩不關閉。

**理由**：需求明確要求使用者必須點擊同意按鈕才能關閉，任何其他關閉途徑都不應存在。

## Risks / Trade-offs

- **localStorage 可被清除** → 使用者清除瀏覽器資料後會再次看到免責聲明。這是可接受的行為，甚至是期望的。
- **JavaScript 停用時 Modal 不會出現** → 整個 app 是 React SPA，JavaScript 停用時本身就無法使用，風險不存在。
- **首次載入的短暫閃爍** → 由於 hydration 策略（預設不顯示），使用者可能在極短時間內看到頁面內容再出現 Modal。可透過在 Modal 未決定前隱藏 body 內容來緩解，但目前不需要過度優化。
