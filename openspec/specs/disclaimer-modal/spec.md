### Requirement: Display disclaimer modal on first visit
The system SHALL display a full-screen disclaimer modal when a user visits the website for the first time (no prior acceptance recorded in localStorage).

#### Scenario: First-time visitor sees disclaimer
- **WHEN** a user navigates to the website and localStorage does not contain the key `disclaimer_accepted` with value `true`
- **THEN** a full-screen modal overlay SHALL be displayed with a semi-transparent backdrop, centered white card, and the disclaimer content

#### Scenario: Returning visitor who accepted
- **WHEN** a user navigates to the website and localStorage contains the key `disclaimer_accepted` with value `true`
- **THEN** the disclaimer modal SHALL NOT be displayed and the user SHALL have immediate access to the website

### Requirement: Modal is non-dismissible without acceptance
The modal SHALL NOT be dismissible by any means other than clicking the acceptance button. There SHALL be no close (X) button, pressing ESC SHALL NOT close the modal, and clicking the backdrop SHALL NOT close the modal.

#### Scenario: User attempts to close via ESC key
- **WHEN** the disclaimer modal is displayed and the user presses the ESC key
- **THEN** the modal SHALL remain displayed

#### Scenario: User attempts to close via backdrop click
- **WHEN** the disclaimer modal is displayed and the user clicks the semi-transparent backdrop
- **THEN** the modal SHALL remain displayed

### Requirement: Acceptance persists via localStorage
When the user clicks the acceptance button, the system SHALL store the acceptance in localStorage and close the modal.

#### Scenario: User accepts disclaimer
- **WHEN** the user clicks the「我已閱讀並同意」button
- **THEN** the system SHALL set `localStorage.setItem("disclaimer_accepted", "true")` and close the modal immediately

### Requirement: Disclaimer content with three sections
The disclaimer modal SHALL display a title「免責聲明」and three content sections, each with a subtitle, SVG icon, and descriptive text.

#### Scenario: Disclaimer content is complete
- **WHEN** the disclaimer modal is displayed
- **THEN** the modal SHALL contain the following three sections in order:
  1. **免責條款** (Shield SVG icon): 「本工具僅提供文書格式產生之輔助功能，所產生之內容不構成法律意見，本站不負任何法律責任。」
  2. **隱私聲明** (Lock SVG icon): 「本網站不儲存、不記錄任何使用者輸入之資料。使用者應自行確認所產生文件內容之正確性與完整性。」
  3. **專業建議** (Scale SVG icon): 「如涉及具體法律問題，建議諮詢專業律師以獲得適當之法律協助。」

### Requirement: SVG icons are inline and minimal
Each disclaimer section SHALL be preceded by a simple, stroke-based SVG icon (24x24, stroke color matching the app's primary blue `#1E3A8A`, stroke-width 1.5, fill none).

#### Scenario: Icons render correctly
- **WHEN** the disclaimer modal is displayed
- **THEN** each of the three sections SHALL display its corresponding SVG icon (Shield, Lock, Scale) rendered inline with consistent styling

### Requirement: Visual consistency with app design
The modal SHALL follow the existing app design language: slate/blue color scheme, amber accent for the acceptance button, rounded corners (rounded-xl), Plus Jakarta Sans font.

#### Scenario: Modal matches app design
- **WHEN** the disclaimer modal is displayed
- **THEN** the modal card SHALL use white background, rounded-xl corners, and the acceptance button SHALL use the amber accent color (`bg-amber-700 hover:bg-amber-800 text-white`) matching existing app buttons
