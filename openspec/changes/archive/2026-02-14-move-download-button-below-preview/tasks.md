## 1. Move download button below preview

- [x] 1.1 In `page.tsx`, move the `PdfDownloadButton` wrapper `<div>` (currently lines 73-78) to after the `PetitionPreview` component (currently line 83)
- [x] 1.2 Change the wrapper's `className` from `mb-4` to `mt-4` to maintain visual spacing above the button instead of below

## 2. Verify

- [ ] 2.1 Verify on desktop (lg+ breakpoint) that the download button appears below the preview and the sticky scrollable panel still works correctly
- [ ] 2.2 Verify on mobile (< lg breakpoint) that the stacked layout shows form → preview → download button in correct order
