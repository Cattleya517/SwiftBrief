## MODIFIED Requirements

### Requirement: 表單整體驗證
系統 SHALL 在使用者點擊「下載 PDF」時驗證所有必填欄位已填寫且格式正確，若有錯誤 SHALL 阻止 PDF 產生並標示所有錯誤欄位。表單不再有獨立的「預覽」提交按鈕。

#### Scenario: 所有必填欄位填寫完成
- **WHEN** 使用者填寫所有必填欄位且格式皆正確後點擊「下載 PDF」
- **THEN** 系統 SHALL 通過驗證並產生 PDF 檔案

#### Scenario: 多個欄位未填寫
- **WHEN** 使用者未填寫聲請人姓名與本票票號就點擊「下載 PDF」
- **THEN** 系統 SHALL 同時顯示所有未填寫欄位的錯誤訊息，且不產生 PDF
