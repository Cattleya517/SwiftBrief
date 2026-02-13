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
        userOnclone?.(clonedDoc, clonedEl);
      },
    });
  };

  return patched;
}
