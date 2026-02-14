## Why

In the downloaded PDF, Latin characters (numbers, "NT$") appear visually lower (subscript) than surrounding CJK text. This is caused by html2canvas using a single `textBaseline = 'alphabetic'` for all characters, which places Latin glyphs lower than CJK ideographs. The browser preview renders correctly but the PDF does not.

Two previous fixes failed:
1. `vertical-align: top` — html2canvas has no property descriptor for it, completely ignored
2. `display: inline-block; transform: translateY(-1px)` — breaks normal text flow, creates large gaps

## What Changes

- Re-add a baseline fix function in the html2canvas onclone callback using `position: relative; top: -Xem` on wrapped Latin/numeric segments
- This approach differs from previous attempts: `position: relative` shifts visual rendering without changing document flow, and html2canvas respects `position` offsets

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `petition-pdf`: The PDF generation pipeline's onclone callback will include a new baseline-alignment fix for mixed CJK+Latin text

## Impact

- `frontend/src/lib/patch-html2canvas.ts` — add `fixLatinBaseline` function to the onclone pipeline
- No new dependencies
- No breaking changes
