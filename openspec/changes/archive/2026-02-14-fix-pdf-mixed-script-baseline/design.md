## Context

PetitionPreview 使用 `fontFamily: "serif"` 渲染文字。瀏覽器對混合 CJK+Latin 文字會自動進行 font fallback：CJK 字元用系統中文 serif 字型，Latin 字元用 Latin serif 字型（如 Times New Roman）。這兩種字型有不同的 baseline metrics，但瀏覽器原生渲染器會自動調整各 script 的基線位置。

html2canvas 使用 Canvas 2D API 的 `fillText()` 逐段渲染文字，計算每段文字的 Y 座標時只用該段的 font metrics。當同一行文字包含不同字型的字元時，canvas 渲染不像瀏覽器那樣自動對齊不同字型的基線，導致 Latin 字元出現垂直偏移（subscript 效果）。

現有 `patch-html2canvas.ts` 已有 `onclone` callback 機制用於修補 html2canvas 的渲染問題。

## Goals / Non-Goals

**Goals:**
- 修正 PDF 下載中混合 CJK+Latin 文字的基線對齊問題
- 利用現有 `onclone` 機制，最小化修改範圍
- 不影響瀏覽器預覽的外觀

**Non-Goals:**
- 不更換 html2canvas/jsPDF
- 不處理所有可能的字型渲染差異（僅處理基線偏移）

## Decisions

### Decision 1: 在 onclone 中拆分混合文字節點並用 CSS 補償

**選擇**: 在 `onclone` callback 中，遍歷 cloned DOM 中的所有文字節點 (Text nodes)。當一個文字節點同時包含 CJK 與 Latin 字元時，將 Latin 字元片段包裹在 `<span>` 中並套用 `vertical-align: top` 以補償基線差異。

**做法**:
```typescript
function fixMixedScriptBaseline(doc: Document) {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  for (const node of textNodes) {
    const text = node.textContent || "";
    // 檢查是否同時包含 CJK 和 Latin 字元
    const hasCJK = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
    const hasLatin = /[a-zA-Z0-9$.,]/.test(text);
    if (!hasCJK || !hasLatin) continue;

    // 將文字拆分成 CJK 和 non-CJK 片段
    // 對 Latin 片段包裹 span 加上 vertical-align 補償
    const parent = node.parentNode;
    if (!parent) continue;

    const fragment = doc.createDocumentFragment();
    const segments = text.split(/([\u4e00-\u9fff\u3400-\u4dbf]+)/);
    for (const seg of segments) {
      if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(seg)) {
        fragment.appendChild(doc.createTextNode(seg));
      } else if (seg) {
        const span = doc.createElement("span");
        span.style.verticalAlign = "top";
        span.textContent = seg;
        fragment.appendChild(span);
      }
    }
    parent.replaceChild(fragment, node);
  }
}
```

**替代方案考慮**:
- **強制使用統一 CJK 字型**: 在 `onclone` 中將 `fontFamily` 改為 CJK 字型（如 `"Noto Serif CJK TC"`），使所有字元都用同一字型的 metrics。問題是系統不一定有該字型，且 Latin glyphs 在 CJK 字型中的造型可能不理想。
- **Patch html2canvas 的 canvas-renderer**: 直接修改 html2canvas 的文字渲染程式碼，改用 ideographic baseline。但侵入性太大，升級 html2canvas 時會衝突。

**選擇理由**: `onclone` 拆分文字節點的做法與現有 color patch 模式一致，僅操作 cloned DOM（不影響預覽），且不依賴特定字型安裝。`vertical-align` 的精確值可能需要實測微調（`top`、`text-top`、或具體 px 值）。

### Decision 2: 整合到現有 patch-html2canvas.ts

將新的 `fixMixedScriptBaseline()` 函數加入 `patch-html2canvas.ts`，在 `onclone` callback 中於 `convertAllColors()` 之後呼叫。

### Decision 3: 漸進式調整 vertical-align 值

初始值設為 `vertical-align: top`，如果測試後仍有偏差，可改為具體數值（如 `1px` 或 `2px`）。因為只操作 cloned DOM，調整不會影響預覽。

## Risks / Trade-offs

- **vertical-align 精確度**: `top` 可能不是所有字型組合的完美值，不同系統的中文字型 metrics 不同。→ 可透過測試在主流環境（macOS、Windows、Linux）上驗證，必要時改用固定 px 值。
- **效能**: 遍歷所有文字節點並拆分有少量效能開銷，但 cloned DOM 的節點數有限（聲請狀文字量不大），影響可忽略。
- **邊界情況**: 全英文或全中文的文字節點不會被處理（不需要），只有混合節點會被拆分。數字和標點符號（如 `$`、`,`、`(`、`)`）歸類為 Latin 片段一起處理。
