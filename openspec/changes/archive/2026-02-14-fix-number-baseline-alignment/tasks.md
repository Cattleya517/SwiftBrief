## 1. Implement baseline fix

- [x] 1.1 Add `fixLatinBaseline` function to `patch-html2canvas.ts` that walks text nodes in the cloned DOM, identifies mixed CJK+Latin segments, splits text nodes, and wraps Latin/numeric runs in `<span style="position: relative; top: -0.1em">`
- [x] 1.2 Call `fixLatinBaseline(clonedDoc)` in the `onclone` callback alongside existing `convertAllColors`

## 2. Verify

- [ ] 2.1 Download PDF and verify numbers in "NT$500,000", dates like "113年6月1日", and "百分之6" align with surrounding CJK text
- [ ] 2.2 Verify no gaps or spacing artifacts appear between text segments
