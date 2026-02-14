## Why

The downloaded PDF has three issues:
1. Top margin (20mm) is too large, wasting vertical space
2. Content that could fit on one page spills to a second page due to excessive margins
3. The note details table in the PDF doesn't match the rendered preview — html2canvas may not correctly render Tailwind's `border-collapse` + `border border-black` table styles

## What Changes

- Reduce `MARGIN_TOP_MM` from 20mm to 10mm in PdfDownloadButton.tsx to reclaim vertical space
- Reduce `MARGIN_BOTTOM_MM` from 20mm to 10mm to further maximize content area
- This increases `CONTENT_HEIGHT_MM` from 257mm to 277mm, making single-page output more likely
- Fix table rendering in the html2canvas onclone callback by explicitly setting inline border styles on table elements

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `petition-pdf`: Reduced margins and fixed table border rendering in PDF output

## Impact

- `frontend/src/components/PdfDownloadButton.tsx` — margin constants
- `frontend/src/lib/patch-html2canvas.ts` — add table border fix in onclone callback
