<artifact id="proposal" change="refactor-note-details-ui" schema="spec-driven">

# Proposal: Refactor Note Details UI & Add Payment Place

## Why
Users have reported that the current flow of the form is not intuitive. The "Promissory Note Details" (本票細節) are the evidence foundation for the "Claim Target" (請求標的), so they should logically precede it.

Additionally, "Place of Payment" (付款地) is a critical legal detail for determining **Court Jurisdiction**:
1.  **Has Payment Place**: Jurisdiction is the court of the Payment Place.
2.  **No Payment Place, Has Issue Place**: Jurisdiction is the court of the Issue Place.
3.  **Neither**: Jurisdiction is the court of the Issuer's Domicile (Respondent's Address).

Currently, the form lacks "Place of Payment", making it harder for users to determine the correct court.

## Capabilities

### New Capabilities
- `payment-place-field`: Adds support for recording "Place of Payment" for each promissory note.

### Modified Capabilities
- `form-layout`: Moves "Promissory Note Details" to be between "Respondent" and "Claim Target".
- `note-schema`: Updates the data model to include `paymentPlace` (optional).
- `petition-preview`: Updates the generated preview to include the Place of Payment in the note details table.

## Impact
- **Frontend**:
    - `PetitionForm.tsx`: Reorder components (`NotesSection` moves up).
    - `schema.ts`: Add `paymentPlace` to `promissoryNoteSchema`.
    - `NotesSection.tsx`: Add input field for Payment Place.
    - `PetitionPreview.tsx`: Add "付款地" column to the table.

## Success Criteria
1.  "Promissory Note Details" section appears immediately after "Respondent" section.
2.  "Claim Target" section appears after "Promissory Note Details".
3.  Users can input "Place of Payment" (optional) for each note.
4.  The "Place of Payment" is correctly displayed in the preview table.
5.  (Stretch) Court selection guidance based on input (not strictly required for this iteration but enabled by data).

<unlocks>
Completing this artifact enables: design, specs
</unlocks>

</artifact>
