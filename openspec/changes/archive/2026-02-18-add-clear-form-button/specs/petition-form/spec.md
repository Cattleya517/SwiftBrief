## ADDED Requirements

### Requirement: Clear form button resets all fields to initial empty values

系統 SHALL 提供「清除內容」按鈕，點擊後將所有表單欄位重置為空白初始值（`INITIAL_VALUES`）。

#### Scenario: User clears filled form

- **WHEN** 使用者已填入資料（手動或透過 OCR / 範例）並點擊「清除內容」按鈕
- **THEN** 所有表單欄位重置為初始空白值，即時預覽同步更新

#### Scenario: Clear button is always visible

- **WHEN** 頁面載入
- **THEN**「清除內容」按鈕 SHALL 顯示於「填入範例」按鈕右側

## MODIFIED Requirements

### Requirement: Action buttons layout

「填入範例」與「清除內容」按鈕 SHALL 以群組形式顯示在左側面板表單區域的右側（`ml-auto`），ModeTab 維持靠左。

#### Scenario: Button group positioned on the right

- **WHEN** 頁面載入
- **THEN** ModeTab 顯示在按鈕列左側，「填入範例」和「清除內容」按鈕群組顯示在按鈕列右側
