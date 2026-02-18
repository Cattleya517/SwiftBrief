## Why

SwiftBrief 是一個法律文書產生工具，使用者可能誤解工具產出之內容具有法律效力或專業背書。需要在使用者進入網站時顯示免責聲明，明確告知本工具之性質、隱私政策及專業建議，以降低法律風險並建立正確的使用者期待。

## What Changes

- 新增全螢幕免責聲明 Modal，於使用者首次進入網站時顯示
- Modal 為強制性：無 X 按鈕、無 ESC 關閉、點擊背景不關閉，使用者必須點擊「我已閱讀並同意」才能使用網站
- 使用 localStorage 記住使用者的同意狀態，同一瀏覽器下次造訪不再顯示
- 免責聲明包含三大項目，每項搭配簡約 SVG icon：
  - 免責條款（Shield icon）：本工具不構成法律意見，不負法律責任
  - 隱私聲明（Lock icon）：不儲存不記錄使用者資料，使用者自行確認正確性
  - 專業建議（Scale icon）：建議諮詢專業律師

## Capabilities

### New Capabilities
- `disclaimer-modal`: 免責聲明 Modal 元件，包含顯示邏輯、localStorage 記憶、強制確認互動及 SVG icon

### Modified Capabilities

（無既有 capability 的需求變更）

## Impact

- `frontend/src/app/layout.tsx`：需要在 root layout 中引入 DisclaimerModal 元件
- `frontend/src/components/`：新增 DisclaimerModal 元件
- 無 API 或後端變更
- 無依賴套件新增（使用原生 React + Tailwind + inline SVG）
