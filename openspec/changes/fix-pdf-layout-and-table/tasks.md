## 1. Reduce PDF margins

- [x] 1.1 Change `MARGIN_TOP_MM` from 20 to 10 in `PdfDownloadButton.tsx`
- [x] 1.2 Change `MARGIN_BOTTOM_MM` from 20 to 10 in `PdfDownloadButton.tsx`

## 2. Fix table rendering in PDF

- [x] 2.1 Add `fixTableBorders` function in `patch-html2canvas.ts` that sets explicit inline border styles on `<table>`, `<th>`, and `<td>` elements in the cloned DOM
- [x] 2.2 Call `fixTableBorders` in the onclone callback

## 3. Verify

- [ ] 3.1 Download PDF with example data and verify single-note petition fits on one page
- [ ] 3.2 Verify table borders in PDF match the preview rendering
