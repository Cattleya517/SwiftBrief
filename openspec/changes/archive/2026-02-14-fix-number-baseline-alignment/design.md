## Context

The PDF generation pipeline uses html2canvas to capture the petition preview DOM as a canvas image, then jsPDF to convert it to PDF. html2canvas renders text via Canvas 2D `fillText()` with `textBaseline = 'alphabetic'`. This causes Latin/numeric characters to sit lower than CJK ideographs because the alphabetic baseline differs between the two scripts.

The browser preview renders correctly because the browser's text shaping engine handles mixed-script baseline alignment. html2canvas bypasses this.

Previous fix attempts:
1. `vertical-align: top` on wrapped Latin spans — html2canvas has no CSS property descriptor for `vertical-align`, completely ignored
2. `display: inline-block; transform: translateY(-1px)` — changes box model from inline to inline-block, breaks normal text flow and creates visible gaps between segments

## Goals / Non-Goals

**Goals:**
- Visually align Latin/numeric characters with surrounding CJK text in PDF output
- No disruption to text flow (no gaps, no layout changes)

**Non-Goals:**
- Pixel-perfect baseline matching (a close approximation is acceptable)
- Fixing html2canvas upstream
- Switching PDF generation approach (e.g., server-side Puppeteer)

## Decisions

### Use `position: relative; top: -0.1em` on Latin segments

**Rationale:** `position: relative` shifts the visual rendering of an element without changing its position in document flow. Unlike `display: inline-block`, surrounding elements are laid out as if the relative-positioned element were in its normal position. html2canvas respects `position` and `top` offset when calculating element bounds for rendering.

**Alternatives considered:**
- `vertical-align` — not supported by html2canvas
- `display: inline-block + transform` — breaks text flow
- Patching html2canvas source via `patch-package` — high maintenance burden, fragile
- Server-side PDF with Puppeteer — major architectural change, overkill for this issue

### Use em-based offset rather than px

**Rationale:** The baseline mismatch scales with font size. Using `-0.1em` ensures the correction is proportional regardless of the text size in the document.

### Reuse existing onclone pipeline in patch-html2canvas.ts

**Rationale:** The `importHtml2Canvas` wrapper already intercepts the `onclone` callback for color conversion. Adding the baseline fix alongside `convertAllColors` keeps all html2canvas patches centralized.

## Risks / Trade-offs

- [Offset value may need tuning] → Start with `-0.1em`, adjust based on visual testing. The value may differ across fonts/sizes.
- [html2canvas may not respect `position: relative; top` on inline spans] → If this approach also fails, the only remaining options are patching html2canvas source or switching to server-side rendering. We'll know quickly from testing.
- [Text node splitting creates more DOM elements in the clone] → Only affects the cloned document used for capture, not the live DOM. Performance impact is negligible.
