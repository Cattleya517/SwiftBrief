## MODIFIED Requirements

### Requirement: PDF 純前端產生
PDF SHALL 在瀏覽器端（前端）產生，不需將資料傳送至後端伺服器，以保障使用者個人資料隱私。PDF 產生模組 SHALL 透過 SSR 安全的載入方式（如 `next/dynamic` with `ssr: false`），確保在 Next.js server-side rendering 及 Vercel 部署環境不會觸發 `window` 或 `self` 未定義錯誤。

#### Scenario: 離線狀態仍可產生 PDF
- **WHEN** 使用者在表單填寫完成後網路斷線
- **THEN** 系統 SHALL 仍能從預覽畫面產生 PDF 檔案（因為是前端處理）

#### Scenario: Vercel 部署環境正常運作
- **WHEN** 應用程式部署於 Vercel 平台
- **THEN** 使用者點擊「下載 PDF」後 SHALL 正常產生並下載 PDF 檔案，不得出現 JavaScript 錯誤

#### Scenario: Next.js build 成功
- **WHEN** 執行 `next build` 編譯專案
- **THEN** 編譯過程 SHALL 成功完成，不得出現 `self is not defined` 或 `window is not defined` 錯誤
