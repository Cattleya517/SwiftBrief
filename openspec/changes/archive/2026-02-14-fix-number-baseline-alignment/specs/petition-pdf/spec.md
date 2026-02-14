## MODIFIED Requirements

### Requirement: PDF text rendering fidelity

The PDF generation pipeline SHALL visually align Latin/numeric characters with surrounding CJK text by applying a baseline correction in the html2canvas onclone callback. Latin and numeric segments within mixed-script text nodes SHALL be wrapped in positioned spans that shift them upward to match the CJK baseline.

#### Scenario: Numbers align with CJK text in PDF

- **WHEN** the user downloads a PDF containing mixed CJK+Latin text (e.g., "NT$500,000" or "民國113年")
- **THEN** the Latin/numeric characters SHALL appear at the same visual baseline as surrounding CJK characters, without visible subscript offset

#### Scenario: No gaps or flow disruption

- **WHEN** Latin/numeric segments are wrapped for baseline correction in the cloned DOM
- **THEN** the surrounding text flow SHALL remain unchanged with no visible gaps or spacing artifacts between segments

#### Scenario: Original DOM unchanged

- **WHEN** the baseline fix is applied during PDF generation
- **THEN** the live DOM (browser preview) SHALL NOT be modified; corrections only apply to the html2canvas cloned document
