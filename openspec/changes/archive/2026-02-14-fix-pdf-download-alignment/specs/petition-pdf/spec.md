## MODIFIED Requirements

### Requirement: PDF 內容與預覽一致
產生的 PDF 內容 SHALL 與預覽畫面顯示的聲請狀內容完全一致，包含所有文字、日期格式（民國紀年）、金額（中文大寫）、本票明細表。PDF 中的文字對齊、縮排、欄位位置 SHALL 與預覽畫面的排版一致，不得因響應式佈局寬度差異而產生偏移。

#### Scenario: PDF 與預覽內容比對
- **WHEN** 使用者在預覽畫面看到聲請狀內容後產生 PDF
- **THEN** PDF 中的所有文字內容、日期格式、金額顯示 SHALL 與預覽畫面完全一致

#### Scenario: PDF 文字對齊與預覽一致
- **WHEN** 預覽畫面中聲請人資訊（姓名、身分證字號、住址）以固定縮排排列
- **THEN** PDF 中相同欄位的縮排與對齊 SHALL 與預覽畫面視覺上一致，不因視窗寬度不同而偏移

#### Scenario: PDF 表格對齊正確
- **WHEN** 預覽畫面中本票明細表以表格形式呈現
- **THEN** PDF 中表格的欄位寬度與文字位置 SHALL 與預覽畫面一致

### Requirement: PDF 頁面格式
產生的 PDF SHALL 使用 A4 紙張大小（210mm × 297mm），設定合理邊距，適合直接列印送交法院。系統在擷取預覽畫面時 SHALL 以固定寬度渲染（對應 A4 content area），確保佈局比例與最終 PDF 輸出一致。

#### Scenario: PDF 紙張大小為 A4
- **WHEN** PDF 檔案產生
- **THEN** PDF 頁面尺寸 SHALL 為 A4（210mm × 297mm）

#### Scenario: PDF 邊距適合列印
- **WHEN** PDF 檔案產生
- **THEN** PDF SHALL 具備上下左右合理邊距（上方至少 20mm，左右至少 15mm），不會裁切內容

#### Scenario: 擷取時使用固定寬度渲染
- **WHEN** 系統準備擷取預覽畫面以產生 PDF
- **THEN** 系統 SHALL 將預覽元素設為與 A4 content area 對應的固定像素寬度進行渲染，擷取完成後 SHALL 恢復原始響應式寬度
