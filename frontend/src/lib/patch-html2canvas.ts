/**
 * Monkey-patch html2canvas to handle modern CSS color functions (lab, oklch, oklab, lch)
 * that Tailwind CSS v4 uses. html2canvas only supports rgb/rgba/hsl/hsla and throws
 * on unknown color functions. This patch converts unsupported colors to sRGB via
 * the Canvas 2D API before html2canvas tries to parse them.
 */

type Html2CanvasModule = {
  default: (
    element: HTMLElement,
    options?: Record<string, unknown>
  ) => Promise<HTMLCanvasElement>;
};

const MODERN_COLOR_RE = /\b(?:lab|oklch|oklab|lch|color)\(/;

const COLOR_PROPERTIES = [
  "color",
  "backgroundColor",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
  "boxShadow",
] as const;

/**
 * Convert a modern CSS color to hex using the Canvas 2D API,
 * which normalizes all colors to sRGB.
 */
function colorToHex(color: string): string {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return color;
  ctx.fillStyle = "#000000";
  ctx.fillStyle = color;
  return ctx.fillStyle;
}

/**
 * Walk all elements in the document and convert modern CSS colors
 * to sRGB hex values via inline styles.
 */
function convertAllColors(doc: Document) {
  const elements = doc.querySelectorAll("*");
  const allElements = [doc.documentElement, ...elements];

  for (const el of allElements) {
    if (!(el instanceof HTMLElement)) continue;
    const computed = doc.defaultView?.getComputedStyle(el);
    if (!computed) continue;

    for (const prop of COLOR_PROPERTIES) {
      const value = computed[prop as keyof CSSStyleDeclaration] as string;
      if (value && MODERN_COLOR_RE.test(value)) {
        if (prop === "boxShadow") {
          // box-shadow contains colors embedded in a complex value;
          // replace each color function occurrence
          el.style[prop] = value.replace(
            /(?:lab|oklch|oklab|lch|color)\([^)]+\)/g,
            (match) => colorToHex(match)
          );
        } else {
          el.style[prop as "color"] = colorToHex(value);
        }
      }
    }
  }
}

// Matches runs of Latin letters, digits, punctuation, and common symbols (including $, %, .)
const LATIN_RUN_RE = /[A-Za-z0-9$%.,/#:;\-+()\[\]{}'"!?&@*=<>~`^|\\_ ]+/g;

// Matches CJK Unified Ideographs and common CJK punctuation
const HAS_CJK_RE =
  /[\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f\uff00-\uffef]/;

// Matches purely Latin/numeric content (no CJK)
const IS_LATIN_ONLY_RE = /^[A-Za-z0-9$%.,/#:;\-+()\[\]{}'"!?&@*=<>~`^|\\_ ]+$/;

/**
 * Check if a text node's parent element contains CJK text among its siblings.
 */
function parentHasCJK(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent) return false;
  const parentText = parent.textContent ?? "";
  return HAS_CJK_RE.test(parentText);
}

/**
 * Walk text nodes inside the target element. For any text node containing
 * Latin/numeric characters alongside CJK text (either in the same node or
 * in sibling nodes), wrap Latin/numeric runs in a <span> with
 * `position: relative; top: -0.2em` so html2canvas renders them at a
 * baseline closer to the CJK glyphs.
 */
function fixLatinBaseline(doc: Document) {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    textNodes.push(node);
  }

  for (const textNode of textNodes) {
    const text = textNode.nodeValue ?? "";
    if (!text.trim()) continue;

    const hasCJK = HAS_CJK_RE.test(text);
    const hasLatin = /[A-Za-z0-9$%]/.test(text);

    // Case 1: Mixed CJK+Latin in the same text node — split and wrap Latin runs
    if (hasCJK && hasLatin) {
      const parent = textNode.parentNode;
      if (!parent) continue;

      const frag = doc.createDocumentFragment();
      let lastIndex = 0;

      LATIN_RUN_RE.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = LATIN_RUN_RE.exec(text)) !== null) {
        if (match.index > lastIndex) {
          frag.appendChild(doc.createTextNode(text.slice(lastIndex, match.index)));
        }
        const span = doc.createElement("span");
        span.style.position = "relative";
        span.style.top = "-0.2em";
        span.textContent = match[0];
        frag.appendChild(span);
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        frag.appendChild(doc.createTextNode(text.slice(lastIndex)));
      }

      if (lastIndex > 0) {
        parent.replaceChild(frag, textNode);
      }
      continue;
    }

    // Case 2: Purely Latin/numeric text node whose parent contains CJK
    // (e.g., React rendered "NT$500,000" as a separate text node)
    if (hasLatin && !hasCJK && IS_LATIN_ONLY_RE.test(text) && parentHasCJK(textNode)) {
      const parent = textNode.parentNode;
      if (!parent) continue;

      const span = doc.createElement("span");
      span.style.position = "relative";
      span.style.top = "-0.2em";
      span.textContent = text;
      parent.replaceChild(span, textNode);
    }
  }
}

/**
 * Ensure table borders are rendered correctly by html2canvas.
 * html2canvas can miss border-collapse table borders from CSS classes,
 * so we bake them as inline styles on the cloned DOM.
 */
function fixTableBorders(doc: Document) {
  const tables = doc.querySelectorAll("table");
  for (const table of tables) {
    if (!(table instanceof HTMLElement)) continue;
    const computed = doc.defaultView?.getComputedStyle(table);
    if (!computed) continue;

    // Force border-collapse and table border
    table.style.borderCollapse = "collapse";
    if (computed.borderTopStyle !== "none") {
      table.style.border = `${computed.borderTopWidth} ${computed.borderTopStyle} ${computed.borderTopColor}`;
    }

    // Fix all th and td cells
    const cells = table.querySelectorAll("th, td");
    for (const cell of cells) {
      if (!(cell instanceof HTMLElement)) continue;
      const cellComputed = doc.defaultView?.getComputedStyle(cell);
      if (!cellComputed) continue;

      if (cellComputed.borderTopStyle !== "none") {
        cell.style.borderTop = `${cellComputed.borderTopWidth} ${cellComputed.borderTopStyle} ${cellComputed.borderTopColor}`;
        cell.style.borderRight = `${cellComputed.borderRightWidth} ${cellComputed.borderRightStyle} ${cellComputed.borderRightColor}`;
        cell.style.borderBottom = `${cellComputed.borderBottomWidth} ${cellComputed.borderBottomStyle} ${cellComputed.borderBottomColor}`;
        cell.style.borderLeft = `${cellComputed.borderLeftWidth} ${cellComputed.borderLeftStyle} ${cellComputed.borderLeftColor}`;
      }

      // Also bake background color for header rows
      if (cellComputed.backgroundColor && cellComputed.backgroundColor !== "rgba(0, 0, 0, 0)") {
        cell.style.backgroundColor = cellComputed.backgroundColor;
      }
    }
  }
}

/**
 * Import html2canvas with automatic color patching via onclone.
 * Usage: const html2canvas = await importHtml2Canvas();
 */
export async function importHtml2Canvas() {
  const mod = (await import("html2canvas")) as unknown as Html2CanvasModule;
  const originalHtml2Canvas = mod.default;

  const patched = (
    element: HTMLElement,
    options?: Record<string, unknown>
  ): Promise<HTMLCanvasElement> => {
    const userOnclone = options?.onclone as
      | ((doc: Document, el: HTMLElement) => void)
      | undefined;

    return originalHtml2Canvas(element, {
      ...options,
      onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
        convertAllColors(clonedDoc);
        fixLatinBaseline(clonedDoc);
        fixTableBorders(clonedDoc);
        userOnclone?.(clonedDoc, clonedEl);
      },
    });
  };

  return patched;
}
