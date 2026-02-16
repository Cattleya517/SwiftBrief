<artifact id="tasks" change="enhance-interest-calculation-ux" schema="spec-driven">

# Tasks: Enhance Interest Calculation UX and Logic

## 1. Schema & Tools
- [ ] 1.1 Update `frontend/src/lib/schema.ts` to include `interestType`, `interestRateType`, `interestStartPoint`, and `customInterestDate` in `claimSchema`.
- [ ] 1.2 Update `frontend/src/lib/amount-to-chinese.ts` (or utility) if needed for new formatting requirements (though existing likely works, just need to change usage in preview).

## 2. Frontend Components
- [ ] 2.1 Update `frontend/src/components/ClaimSection.tsx`:
    - Add "Interest Type" radio group (Generic vs Statutory).
    - Add conditional rendering for "Interest Rate" input (Fixed 6% display vs Editable input).
    - Add "Start Date" selection logic (invoice date, agreed date, maturity date, presentation date).
- [ ] 2.2 Update `frontend/src/components/PetitionPreview.tsx`:
    - Modify "Request Target" section to include amount in Chinese numerals in parentheses.
    - Update "Interest Clause" generation to reflect the selected interest type and start date logic.

## 3. Verification
- [ ] 3.1 Verify "Statutory Interest" flow (defaults to 6%, auto-selects Presentation or Maturity date).
- [ ] 3.2 Verify "Agreed Interest" flow (allows custom rate, invoice/agreed date selection).
- [ ] 3.3 Verify "Request Target" display format in Preview.

</artifact>
