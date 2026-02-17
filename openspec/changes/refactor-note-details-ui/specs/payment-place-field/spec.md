<artifact id="specs-payment-place-field" change="refactor-note-details-ui" schema="spec-driven">

# Spec: Payment Place Field

## ADDED Requirements

### Requirement: Payment Place Field
#### Scenario: Input Field Existence
- **WHEN** the User views the Note Details section.
- **THEN** an input field for "付款地" (Place of Payment) is visible for each note.
- **AND** the field is optional.

#### Scenario: Preview Display
- **GIVEN** the User has entered a "Place of Payment" (e.g., "台北市").
- **WHEN** the `PetitionPreview` renders.
- **THEN** the "本票明細表" (Note Details Table) includes a column "付款地".
- **AND** the entered value is displayed in that column for the corresponding note.

#### Scenario: Preview Display (Empty)
- **GIVEN** the User has left "Place of Payment" empty.
- **WHEN** the `PetitionPreview` renders.
- **THEN** the "付款地" column still exists.
- **AND** the cell for that note is empty or shows a placeholder (e.g., "＿＿＿").

</artifact>
