"use client";

import { RefObject, useState } from "react";
import { PetitionFormData } from "@/lib/schema";

interface Props {
  previewRef: RefObject<HTMLDivElement | null>;
  handleSubmit: (
    onValid: (data: PetitionFormData) => Promise<void>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
}

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_TOP_MM = 10;
const MARGIN_BOTTOM_MM = 10;
const MARGIN_LEFT_MM = 10;
const MARGIN_RIGHT_MM = 10;

const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_LEFT_MM - MARGIN_RIGHT_MM;
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_TOP_MM - MARGIN_BOTTOM_MM;
const CONTENT_WIDTH_PX = Math.round((CONTENT_WIDTH_MM / 25.4) * 96);
const CONTENT_HEIGHT_PX = Math.round((CONTENT_HEIGHT_MM / 25.4) * 96);

/**
 * Find page break Y-positions (in canvas pixels) that avoid cutting through
 * content sections. Falls back to the naive fixed-height break if a section
 * is taller than one full page.
 */
function findPageBreaks(
  sectionTops: number[],
  totalHeightPx: number,
  pageHeightPx: number,
  scale: number
): number[] {
  const breaks: number[] = [];
  let cursor = 0;
  // Only adjust break if wasted space is < 30% of page height
  const maxWaste = pageHeightPx * 0.3;

  while (cursor + pageHeightPx < totalHeightPx) {
    const idealBreak = cursor + pageHeightPx;

    // Find the last section top that fits within this page
    let bestBreak = idealBreak;
    for (let i = sectionTops.length - 1; i >= 0; i--) {
      const sectionTop = sectionTops[i];
      if (sectionTop > cursor && sectionTop <= idealBreak) {
        // Only use this section boundary if it doesn't waste too much space
        if (idealBreak - sectionTop <= maxWaste) {
          bestBreak = sectionTop;
        }
        break;
      }
    }

    // If bestBreak == cursor (section taller than a page), use idealBreak
    if (bestBreak <= cursor) {
      bestBreak = idealBreak;
    }

    breaks.push(bestBreak * scale);
    cursor = bestBreak;
  }

  return breaks;
}

export default function PdfDownloadButton({ previewRef, handleSubmit }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const generatePdf = async (data: PetitionFormData) => {
    const element = previewRef.current;
    if (!element) return;

    setIsGenerating(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    try {
      const { importHtml2Canvas } = await import("@/lib/patch-html2canvas");
      const html2canvas = await importHtml2Canvas();
      const jsPDF = (await import("jspdf")).default;

      // Temporarily fix element width to match A4 content area so
      // html2canvas captures at the correct layout proportions.
      const origWidth = element.style.width;
      const origMaxWidth = element.style.maxWidth;
      const origPosition = element.style.position;
      element.style.width = `${CONTENT_WIDTH_PX}px`;
      element.style.maxWidth = `${CONTENT_WIDTH_PX}px`;
      element.style.position = "absolute";

      // Measure section positions for smart page breaking
      const elementTop = element.getBoundingClientRect().top;
      const sectionTops = Array.from(element.children).map(
        (child) => child.getBoundingClientRect().top - elementTop
      );

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
      } finally {
        element.style.width = origWidth;
        element.style.maxWidth = origMaxWidth;
        element.style.position = origPosition;
      }

      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const imgWidth = CONTENT_WIDTH_MM;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= CONTENT_HEIGHT_MM) {
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.98),
          "JPEG",
          MARGIN_LEFT_MM,
          MARGIN_TOP_MM,
          imgWidth,
          imgHeight
        );
      } else {
        // Multi-page: slice canvas at section boundaries to avoid cutting elements
        const scale = canvas.width / CONTENT_WIDTH_PX;
        const totalHeightPx = canvas.height / scale;
        const pageBreaks = findPageBreaks(
          sectionTops,
          totalHeightPx,
          CONTENT_HEIGHT_PX,
          scale
        );
        // Add final break at end
        const allBreaks = [0, ...pageBreaks, canvas.height];
        const scaleFactor = canvas.width / imgWidth;

        for (let i = 0; i < allBreaks.length - 1; i++) {
          if (i > 0) pdf.addPage();

          const srcY = allBreaks[i];
          const srcHeight = allBreaks[i + 1] - srcY;
          const destHeight = srcHeight / scaleFactor;

          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = srcHeight;

          const ctx = pageCanvas.getContext("2d");
          if (!ctx) continue;

          ctx.drawImage(
            canvas,
            0,
            srcY,
            canvas.width,
            srcHeight,
            0,
            0,
            canvas.width,
            srcHeight
          );

          pdf.addImage(
            pageCanvas.toDataURL("image/jpeg", 0.98),
            "JPEG",
            MARGIN_LEFT_MM,
            MARGIN_TOP_MM,
            imgWidth,
            destHeight
          );
        }
      }

      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
      const filename = `民事聲請狀_${data.applicant.name}_${dateStr}.pdf`;

      pdf.save(filename);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setDownloadError("PDF 產生失敗，請重試。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleSubmit(generatePdf)}
        disabled={isGenerating}
        className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            產生中…
          </>
        ) : (
          "下載 PDF"
        )}
      </button>

      {downloadError && (
        <p role="alert" className="text-red-600 text-sm text-center">
          {downloadError}
        </p>
      )}
      {downloadSuccess && (
        <p role="status" className="text-green-600 text-sm text-center">
          PDF 下載成功！
        </p>
      )}
    </div>
  );
}
