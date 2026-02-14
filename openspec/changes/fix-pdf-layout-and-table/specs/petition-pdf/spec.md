## MODIFIED Requirements

### Requirement: PDF page margins

The PDF output SHALL use 10mm top margin, 10mm bottom margin, 15mm left margin, and 15mm right margin on A4 paper.

#### Scenario: Content fits on one page

- **WHEN** the petition content with a single note is generated as PDF
- **THEN** all content SHALL fit on a single A4 page with the reduced margins

### Requirement: PDF table rendering fidelity

The note details table in the PDF output SHALL render with visible black borders on all cells matching the preview appearance.

#### Scenario: Table borders visible in PDF

- **WHEN** the user downloads a PDF containing the note details table
- **THEN** all table cell borders SHALL be visible as solid black lines matching the preview rendering

#### Scenario: Table header background visible

- **WHEN** the table includes a header row with gray background
- **THEN** the gray background SHALL be visible in the PDF output
