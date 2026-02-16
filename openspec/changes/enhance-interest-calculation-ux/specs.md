<artifact id="specs" change="enhance-interest-calculation-ux" schema="spec-driven">

# Specs: Enhance Interest Calculation UX and Logic

## Scenarios

### 1. Request Target Display
- **GIVEN** the user has entered a Claim Amount (e.g., 100,000).
- **WHEN** the `PetitionPreview` is rendered.
- **THEN** the Request Target section displays the amount followed by the Chinese numeral amount in parentheses.
    - Example: `...新台幣100,000元(新台幣壹拾萬元整)...`

### 2. Interest Option: Statutory Interest (No Maturity Date)
- **GIVEN** the user selects "No Agreed Interest" (Statutory).
- **AND** the Note(s) do **not** have a specific Maturity Date (or user selects "No Maturity Date" logic).
- **THEN**:
    - Interest Rate is fixed at **6%**.
    - Start Date logic defaults to **Presentation Date**.
    - The Start Date input is automatically populated with the `presentationDate` from the "Facts" section (if filled).

### 3. Interest Option: Statutory Interest (With Maturity Date)
- **GIVEN** the user selects "No Agreed Interest".
- **AND** the Note(s) **have** a Maturity Date.
- **THEN**:
    - Interest Rate is fixed at **6%**.
    - Start Date logic defaults to **Maturity Date**.
    - The Start Date input is populated with the `dueDate` from the Note(s).

### 4. Interest Option: Agreed Interest
- **GIVEN** the user selects "Agreed Interest".
- **THEN**:
    - The Interest Rate input becomes **editable** (User enters e.g., 12%).
    - The Start Date options show: "Invoice Date" and "Agreed Date".
- **WHEN** "Invoice Date" is selected:
    - Start Date is populated from the Note's `issueDate`.
- **WHEN** "Agreed Date" is selected:
    - A Date Picker is shown for manual entry.

### 5. Validation
- **GIVEN** "Agreed Interest" is selected.
- **THEN** Interest Rate is **required**.
- **GIVEN** "Agreed Date" or "Custom Date" is active.
- **THEN** The specific date is **required**.

</artifact>
