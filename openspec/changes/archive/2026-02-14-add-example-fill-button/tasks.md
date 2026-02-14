## 1. Add example data and button

- [x] 1.1 In `page.tsx`, destructure `reset` from the `useForm` hook alongside existing `register`, `handleSubmit`, etc.
- [x] 1.2 Define an `EXAMPLE_DATA` constant of type `PetitionFormData` with valid dummy data (valid Taiwan IDs: A123456789, B234567894; realistic names, addresses, dates, court, note details)
- [x] 1.3 Add a "填入範例" button above the `<PetitionForm>` component in the left panel. Use a secondary/outline style (e.g., `border border-slate-300 text-slate-600 hover:bg-slate-100`). On click, call `reset(EXAMPLE_DATA)`.

## 2. Verify

- [ ] 2.1 Click the button — verify all form fields are populated with example data and preview updates immediately
- [ ] 2.2 Click "下載 PDF" after filling example — verify form validation passes and PDF is generated successfully
