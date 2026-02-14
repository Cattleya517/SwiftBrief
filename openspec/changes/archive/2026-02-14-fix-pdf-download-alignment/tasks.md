## 1. Add fixed-width constant

- [x] 1.1 In `PdfDownloadButton.tsx`, add `CONTENT_WIDTH_PX` constant calculated from `CONTENT_WIDTH_MM` (formula: `Math.round(CONTENT_WIDTH_MM / 25.4 * 96)`) alongside existing mm constants

## 2. Fix element width before capture

- [x] 2.1 In `generatePdf`, before the `html2canvas` call, save the element's current `style.width`, `style.maxWidth`, and `style.position` values
- [x] 2.2 Set `element.style.width` and `element.style.maxWidth` to `${CONTENT_WIDTH_PX}px`, and `element.style.position` to `"absolute"` to remove it from grid flow
- [x] 2.3 Wrap the html2canvas call and style restoration in a `try/finally` block to ensure styles are always restored, even on error
- [x] 2.4 In the `finally` block, restore `element.style.width`, `element.style.maxWidth`, and `element.style.position` to their original saved values

## 3. Verify

- [ ] 3.1 Test PDF download on a large viewport (lg+ breakpoint, two-column layout) — verify party info alignment (聲請人/相對人 fields) matches preview
- [ ] 3.2 Test PDF download on a small viewport (single-column layout) — verify same alignment consistency
- [ ] 3.3 Test multi-page PDF (multiple notes) — verify table alignment and page breaks still work correctly
