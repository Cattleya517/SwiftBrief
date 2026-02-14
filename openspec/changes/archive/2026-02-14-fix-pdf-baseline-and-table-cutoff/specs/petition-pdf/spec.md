## MODIFIED Requirements

### Requirement: PDF 內容與預覽一致
產生的 PDF 內容 SHALL 與預覽畫面顯示的聲請狀內容完全一致，包含所有文字、日期格式（民國紀年）、金額（中文大寫）、本票明細表。PDF 中的文字對齊、縮排、欄位位置 SHALL 與預覽畫面的排版一致，不得因響應式佈局寬度差異而產生偏移。混合 CJK 與 Latin 字元的文字中，所有字元的垂直基線 SHALL 一致，不得出現 Latin 字元下沉或上移的現象。基線修正 SHALL 使用 html2canvas 實際支援的 CSS 屬性（如 `transform`），不得使用不被支援的屬性（如 `vertical-align`）。

#### Scenario: PDF 與預覽內容比對
- **WHEN** 使用者在預覽畫面看到聲請狀內容後產生 PDF
- **THEN** PDF 中的所有文字內容、日期格式、金額顯示 SHALL 與預覽畫面完全一致

#### Scenario: 混合中英文基線對齊
- **WHEN** 聲請狀中包含混合中英文文字（如「民國115年2月20日」或「NT$1,212」）
- **THEN** PDF 中數字與英文字元的垂直基線 SHALL 與相鄰中文字元對齊，不得出現下標偏移

### Requirement: PDF 多頁支援
當聲請狀內容超過一頁時，系統 SHALL 自動分頁，確保內容完整呈現不被截斷。分頁點 SHALL 落在內容區塊之間，不得切割表格或段落。

#### Scenario: 內容超過一頁
- **WHEN** 聲請狀包含多張本票且事實與理由文字較長，導致內容超過一頁
- **THEN** PDF SHALL 自動產生多頁，所有內容完整呈現

#### Scenario: 表格不被分頁切割
- **WHEN** 本票明細表位於頁面邊界附近
- **THEN** 系統 SHALL 將分頁點調整到表格之前或之後，不得切割表格
