## ADDED Requirements

### Requirement: Image preview before OCR submission

使用者上傳照片後，系統 SHALL 顯示該照片的縮圖預覽，並等待使用者確認後才進行 OCR 辨識。

#### Scenario: Photo uploaded shows thumbnail preview

- **WHEN** 使用者透過點擊或拖曳上傳一張照片
- **THEN** 系統顯示該照片的縮圖預覽，不觸發 OCR 辨識

#### Scenario: Preview displays within upload area

- **WHEN** 照片預覽顯示中
- **THEN** 縮圖 SHALL 在上傳區域內置中顯示，最大高度受限以避免版面過長

### Requirement: Confirm button triggers OCR

系統 SHALL 提供一個勾選（confirm）SVG icon 按鈕，使用者點擊後才觸發 OCR 辨識流程。

#### Scenario: User confirms photo and OCR starts

- **WHEN** 使用者在預覽狀態下點擊勾選按鈕
- **THEN** 系統送出照片進行 OCR 辨識，顯示載入狀態

#### Scenario: Confirm button only visible during preview

- **WHEN** 系統處於預覽狀態
- **THEN** 勾選按鈕 SHALL 可見且可點擊
- **WHEN** 系統處於非預覽狀態（idle / loading / success / error）
- **THEN** 勾選按鈕 SHALL 不顯示

### Requirement: Re-upload button clears preview

系統 SHALL 提供一個重新上傳（re-upload）SVG icon 按鈕，使用者點擊後清除預覽並回到初始上傳狀態。

#### Scenario: User clicks re-upload to clear preview

- **WHEN** 使用者在預覽狀態下點擊重新上傳按鈕
- **THEN** 系統清除縮圖預覽與暫存檔案，回到等待上傳的初始狀態

#### Scenario: Re-upload button only visible during preview

- **WHEN** 系統處於預覽狀態
- **THEN** 重新上傳按鈕 SHALL 可見且可點擊

### Requirement: Action buttons use inline SVG icons

確認與重新上傳按鈕 SHALL 使用 inline SVG icon，不依賴外部 icon library。

#### Scenario: Confirm button renders checkmark icon

- **WHEN** 預覽狀態下渲染確認按鈕
- **THEN** 按鈕顯示為綠色圓形背景加白色勾選圖示

#### Scenario: Re-upload button renders return icon

- **WHEN** 預覽狀態下渲染重新上傳按鈕
- **THEN** 按鈕顯示為灰色圓形背景加白色返回箭頭圖示
