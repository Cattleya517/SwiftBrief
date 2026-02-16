<artifact id="tasks" change="refactor-note-details-ui" schema="spec-driven">

# Tasks: Refactor Note Details UI & Add Payment Place

## 1. Schema Updates
- [x] 1.1 Update `frontend/src/lib/schema.ts` to add optional `paymentPlace` field to `promissoryNoteSchema`.

## 2. Frontend Implementation
- [x] 2.1 Update `frontend/src/components/PetitionForm.tsx` to move `NotesSection` between `PartySection` (Respondent) and `ClaimSection`.
- [x] 2.2 Update `frontend/src/components/NotesSection.tsx` to add an input field for `paymentPlace`.
- [x] 2.3 Update `frontend/src/components/PetitionPreview.tsx` to add "付款地" column to the "本票明細表".

## 3. Verification
- [x] 3.1 Verify that the "Promissory Note Details" section appears after "Respondent" and before "Claim Target".
- [x] 3.2 Verify that users can input "Place of Payment" for each note.
- [x] 3.3 Verify that the "Place of Payment" is correctly displayed in the preview table.
- [x] 3.4 Verify that leaving "Place of Payment" empty results in an empty cell or placeholder in the preview.

</artifact>
