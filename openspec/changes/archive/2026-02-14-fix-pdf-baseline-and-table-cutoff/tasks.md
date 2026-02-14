## 1. Fix baseline approach (replace vertical-align with transform)

- [x] 1.1 In `patch-html2canvas.ts`, update `fixMixedScriptBaseline()`: change the Latin span styling from `vertical-align: top` to `display: inline-block; transform: translateY(-1px)` (html2canvas supports transform but not vertical-align)

## 2. Smart page splitting to avoid cutting tables

- [x] 2.1 In `PdfDownloadButton.tsx`, before the html2canvas call (after setting fixed width), measure the `offsetTop` and `offsetHeight` of each direct child element of the preview ref element, store as an array of section bounds
- [x] 2.2 Add a `findPageBreaks()` helper that takes section bounds and page height in CSS pixels, calculates page break points that fall between sections rather than through them. If a break would cut through a section, move it up to just before that section starts
- [x] 2.3 Refactor the multi-page canvas slicing loop to use the custom break points from `findPageBreaks()` instead of fixed-height equal slices

## 3. Verify

- [ ] 3.1 Test PDF download with mixed Chinese+English text — verify numbers and Latin characters no longer appear subscript
- [ ] 3.2 Test multi-page PDF with a table near the page boundary — verify the table is not cut off
- [ ] 3.3 If baseline offset isn't perfect, tune the translateY value (-1px, -1.5px, -2px)
