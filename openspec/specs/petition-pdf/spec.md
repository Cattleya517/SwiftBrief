## ADDED Requirements

### Requirement: PDF 檔案產生
系統 SHALL 提供從預覽畫面產生 PDF 檔案的功能，產生的 PDF 內容 SHALL 與預覽畫面一致。

#### Scenario: 從預覽產生 PDF
- **WHEN** 使用者在預覽畫面點擊「下載 PDF」按鈕
- **THEN** 系統 SHALL 產生 PDF 檔案並觸發瀏覽器下載

### Requirement: PDF 繁體中文字型支援
產生的 PDF SHALL 正確顯示所有繁體中文字元，不得出現亂碼或缺字。

#### Scenario: PDF 包含繁體中文
- **WHEN** 聲請狀包含繁體中文內容（如「聲請人」「相對人」「民事聲請狀」）
- **THEN** PDF 中所有中文字元 SHALL 正確顯示，無亂碼

#### Scenario: PDF 包含中文大寫數字
- **WHEN** 聲請狀包含中文大寫金額「壹佰萬元整」
- **THEN** PDF 中 SHALL 正確顯示該中文大寫金額

### Requirement: PDF 頁面格式
產生的 PDF SHALL 使用 A4 紙張大小（210mm × 297mm），設定合理邊距，適合直接列印送交法院。

#### Scenario: PDF 紙張大小為 A4
- **WHEN** PDF 檔案產生
- **THEN** PDF 頁面尺寸 SHALL 為 A4（210mm × 297mm）

#### Scenario: PDF 邊距適合列印
- **WHEN** PDF 檔案產生
- **THEN** PDF SHALL 具備上下左右合理邊距（上方至少 20mm，左右至少 15mm），不會裁切內容

### Requirement: PDF 檔案命名
系統 SHALL 以有意義的名稱命名 PDF 檔案，格式為「民事聲請狀_聲請人姓名_日期.pdf」。

#### Scenario: PDF 檔案名稱正確
- **WHEN** 聲請人姓名為「王大明」，產生日期為 2025-01-20
- **THEN** 下載的 PDF 檔案名稱 SHALL 為「民事聲請狀_王大明_20250120.pdf」

### Requirement: PDF 多頁支援
當聲請狀內容超過一頁時，系統 SHALL 自動分頁，確保內容完整呈現不被截斷。

#### Scenario: 內容超過一頁
- **WHEN** 聲請狀包含多張本票且事實與理由文字較長，導致內容超過一頁
- **THEN** PDF SHALL 自動產生多頁，所有內容完整呈現

### Requirement: PDF 純前端產生
PDF SHALL 在瀏覽器端（前端）產生，不需將資料傳送至後端伺服器，以保障使用者個人資料隱私。

#### Scenario: 離線狀態仍可產生 PDF
- **WHEN** 使用者在表單填寫完成後網路斷線
- **THEN** 系統 SHALL 仍能從預覽畫面產生 PDF 檔案（因為是前端處理）

### Requirement: PDF 內容與預覽一致
產生的 PDF 內容 SHALL 與預覽畫面顯示的聲請狀內容完全一致，包含所有文字、日期格式（民國紀年）、金額（中文大寫）、本票明細表。

#### Scenario: PDF 與預覽內容比對
- **WHEN** 使用者在預覽畫面看到聲請狀內容後產生 PDF
- **THEN** PDF 中的所有文字內容、日期格式、金額顯示 SHALL 與預覽畫面完全一致
