<artifact id="design" change="refactor-note-details-ui" schema="spec-driven">

# Design: Refactor Note Details UI & Add Payment Place

## Context
The current form flow places "Promissory Note Details" at the bottom, which is disjointed from the "Claim Target" that depends on it. Also, "Place of Payment" is missing, which is crucial for determining court jurisdiction.

## Goals
- Relocate "Promissory Note Details" to a more logical position (between Respondent and Claim).
- Enable capturing and displaying "Place of Payment" for each note.

## Architecture
- **Component Reordering**: Simply identifying the component structure in `PetitionForm.tsx` and swapping the order of `<NotesSection />` and `<ClaimSection />`.
- **Schema Update**: Adding `paymentPlace` to the Zod schema.
- **UI Update**: Adding a text input to `NotesSection.tsx`.
- **Preview Update**: Modifying the table in `PetitionPreview.tsx` to include a new column.

## Decisions
- **Field Optionality**: "Place of Payment" will be **optional**, as users might not have it on the note (in which case jurisdiction falls back to issue place or domicile).
- **Preview Table Layout**: We will add a column "付款地" to the existing table. It might squeeze the layout slightly, but it's essential info.

## Risks / Trade-offs
- **Preview Table Width**: Adding a column might cramp the table on smaller screens or PDF.
    - **Mitigation**: We'll ensure the column has appropriate width and text wrapping.
- **User Confusion on Reorder**: Users accustomed to the old order might be momentarily confused.
    - **Mitigation**: The new order is more logical (Evidence -> Claim), so adaptation should be quick.

</artifact>
