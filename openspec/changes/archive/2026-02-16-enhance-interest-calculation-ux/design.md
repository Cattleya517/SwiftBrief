<artifact id="design" change="enhance-interest-calculation-ux" schema="spec-driven">

# Design: Enhance Interest Calculation UX and Logic

## Architecture
- **Frontend-centric Logic**: The improvements will be implemented primarily in the frontend components (`ClaimSection`, `PetitionPreview`) and schema definitions.
- **State Management**: Leveraging `react-hook-form`'s `watch` to create dynamic interactions between the Notes section and Claim section (to infer dates).

## Data Model Changes (`schema.ts`)
- Update `claimSchema` to support structured interest configuration:
    - **Remove** (or deprecate usage of) simple `interestStartDate` as the *only* source of truth.
    - **Add** `interestType`: `enum` ('statutory', 'agreed').
    - **Add** `interestRateType`: `enum` ('statutory' (6%), 'custom').
    - **Add** `interestStartPoint`: `enum` ('maturity_date', 'presentation_date', 'invoice_date', 'custom_date').
    - **Add** `customInterestDate`: `date` (optional, for when specific date is needed).
    - **Keep** `interestRate`: `number` (but controlled by logic).

## Component Updates

### `src/components/ClaimSection.tsx`
- **Goal**: Transform from a simple input list to a scenario-based form.
- **UI Structure**:
    - **Interest Type Selection**: Radio group for "法定利率 (Statutory)" vs "約定利率 (Agreed)".
    - **Rate Input**:
        - If Statutory: Display "年利率 6%" (Start date determined by rule).
        - If Agreed: Input field for custom rate %.
    - **Start Date Selection**:
        - Intelligent options based on Interest Type and presence of Maturity Date in `notes`.
        - If Statutory:
            - Show "到期日 (Maturity Date)" option (available if notes have maturity date).
            - Show "提示日 (Presentation Date)" option (default if no maturity date).
        - If Agreed:
            - Show "發票日 (Invoice Date)" option.
            - Show "約定日 (Agreed Date)" option (with Date Picker).

### `src/components/PetitionPreview.tsx`
- **Goal**: Enhance text generation to reflect the sophisticated logic and new display requirements.
- **Request Target**:
    - **Logic**: Append `(新台幣${amountToChinese}元)` or similar format to the numeric amount.
- **Interest Clause**:
    - **Logic**: Construct string based on the new `interestStartPoint` and `interestType` fields.
    - Handle cases where different notes might have different dates (though initial scope might assume uniformity or take the earliest/latest). *Decision*: For this iteration, we assume a single start calculation date for the batch, or we implement "Detailed in Table" if complex. *Simplified*: The form generates a single start date string based on user selection.

## Risks / Trade-offs
- **Complexity**: Multiple notes with different maturity dates make a single "Maturity Date" start point ambiguous.
    - **Mitigation**: We will default to the *latest* relevant date or require manual confirmation if dates differ, but for V1 we will let the user pick the date and providing a "Quick Fill" helper derived from the first note.
- **Schema Migration**: Existing drafts/data might lack the new fields.
    - **Mitigation**: Provide default values (Statutory, 6%, existing start date) for backward compatibility.

</artifact>
