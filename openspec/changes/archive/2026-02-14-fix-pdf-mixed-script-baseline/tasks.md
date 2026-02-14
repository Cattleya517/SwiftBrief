## 1. Implement mixed-script baseline fix

- [x] 1.1 In `patch-html2canvas.ts`, add a `fixMixedScriptBaseline(doc: Document)` function that walks all Text nodes in the cloned DOM, detects nodes with both CJK and Latin characters, splits them into segments, and wraps Latin segments in `<span style="vertical-align: top">`
- [x] 1.2 In the `onclone` callback inside `importHtml2Canvas()`, call `fixMixedScriptBaseline(clonedDoc)` after `convertAllColors(clonedDoc)`

## 2. Verify and tune

- [ ] 2.1 Test PDF download with mixed Chinese+English text (e.g., name "dsajo", reason "lend", amount "NT$122,211") — verify Latin characters align with CJK baseline
- [ ] 2.2 If `vertical-align: top` doesn't perfectly align, test alternative values (`text-top`, `1px`, `2px`) and update accordingly
- [ ] 2.3 Test PDF download with pure Chinese text — verify no regression
- [ ] 2.4 Test PDF download with text containing parentheses, commas, dollar signs mixed with Chinese — verify all align correctly
