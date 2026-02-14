## ADDED Requirements

### Requirement: 填入範例資料按鈕
系統 SHALL 在表單區域上方提供「填入範例」按鈕，點擊後 SHALL 將所有必填欄位填入一組完整且通過驗證的範例資料。

#### Scenario: 點擊填入範例
- **WHEN** 使用者點擊「填入範例」按鈕
- **THEN** 所有必填欄位 SHALL 被填入有效的範例資料，包含聲請人/相對人姓名、有效身分證字號、地址、本票資訊、法院等

#### Scenario: 範例資料通過驗證
- **WHEN** 使用者點擊「填入範例」後直接點擊「下載 PDF」
- **THEN** 表單驗證 SHALL 通過，系統 SHALL 成功產生 PDF

#### Scenario: 預覽即時更新
- **WHEN** 使用者點擊「填入範例」
- **THEN** 右側預覽面板 SHALL 立即顯示範例資料的聲請狀內容
