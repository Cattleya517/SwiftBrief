"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petitionFormSchema, PetitionFormData } from "@/lib/schema";
import PetitionForm from "@/components/PetitionForm";
import PetitionPreview from "@/components/PetitionPreview";

const INITIAL_VALUES: PetitionFormData = {
  applicant: { name: "", idNumber: "", address: "" },
  respondent: { name: "", idNumber: "", address: "" },
  claim: { amount: 0, interestStartDate: "", interestRate: 6 },
  factsAndReasons: {
    acquisitionDate: "",
    acquisitionReason: "",
    presentmentDate: "",
    refusalDescription: "",
  },
  notes: [{ issueDate: "", noteNumber: "", amount: 0, dueDate: "" }],
  court: "",
};

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<PetitionFormData>({
    resolver: zodResolver(petitionFormSchema),
    defaultValues: INITIAL_VALUES,
  });

  const formData = watch();

  const handleDownloadPdf = async (data: PetitionFormData) => {
    const element = previewRef.current;
    if (!element) return;

    setIsGenerating(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
      const filename = `民事聲請狀_${data.applicant.name}_${dateStr}.pdf`;

      await html2pdf()
        .set({
          margin: [20, 15, 20, 15],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(element)
        .save();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      setDownloadError("PDF 產生失敗，請重試。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500" />
        <div className="max-w-screen-2xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold tracking-tight">SwiftBrief</h1>
          <p className="text-slate-400 text-sm mt-1">
            民事本票裁定聲請狀產生器
          </p>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Left panel: Form */}
          <div>
            <PetitionForm
              register={register}
              errors={errors}
              control={control}
              watch={watch}
            />
          </div>

          {/* Right panel: Preview + Download */}
          <div className="mt-8 lg:mt-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="mb-4 space-y-3">
              <button
                onClick={handleSubmit(handleDownloadPdf)}
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

            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              即時預覽
            </p>
            <PetitionPreview data={formData} previewRef={previewRef} />
          </div>
        </div>
      </main>
    </div>
  );
}
