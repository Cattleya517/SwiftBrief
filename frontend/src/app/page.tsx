"use client";

import { useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { petitionFormSchema, PetitionFormData } from "@/lib/schema";
import { OCRResponse } from "@/lib/api";
import PetitionForm from "@/components/PetitionForm";
import PetitionPreview from "@/components/PetitionPreview";
import ModeTab from "@/components/ModeTab";
import ImageUpload from "@/components/ImageUpload";

const PdfDownloadButton = dynamic(
  () => import("@/components/PdfDownloadButton"),
  { ssr: false }
);

const INITIAL_VALUES: PetitionFormData = {
  court: "",
  applicant: { name: "", idNumber: "", address: "" },
  respondent: { name: "", idNumber: "", address: "" },
  claim: {
    amount: 0,
    interestType: "statutory",
    interestStartPoint: "presentation_date",
    interestRate: 6,
  },
  factsAndReasons: {
    acquisitionDate: "",
    acquisitionReason: "",
    presentmentDate: "",
    refusalDescription: "",
  },
  notes: [{ issueDate: "", noteNumber: "", amount: 0, dueDate: "" }],
};

const EXAMPLE_DATA: PetitionFormData = {
  court: "臺灣臺北地方法院",
  applicant: {
    name: "王大明",
    idNumber: "A123456789",
    address: "臺北市中正區重慶南路一段122號",
  },
  respondent: {
    name: "李小華",
    idNumber: "B234567894",
    address: "新北市板橋區文化路一段266號",
  },
  claim: {
    amount: 500000,
    interestType: "statutory",
    interestStartPoint: "maturity_date",
    interestRate: 6,
  },
  factsAndReasons: {
    acquisitionDate: "2024-06-01",
    acquisitionReason: "借貸",
    presentmentDate: "2025-01-20",
    refusalDescription: "經提示後遭拒絕付款",
  },
  notes: [
    {
      issueDate: "2024-06-01",
      noteNumber: "TH0001234",
      amount: 500000,
      dueDate: "2025-01-15",
    },
  ],
};

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"manual" | "ocr">("manual");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    getValues,
  } = useForm<PetitionFormData>({
    resolver: zodResolver(petitionFormSchema),
    defaultValues: INITIAL_VALUES,
  });

  const formData = watch();

  const handleOCRComplete = useCallback(
    (data: OCRResponse["data"]) => {
      const current = getValues();

      const mergedNote = {
        ...current.notes[0],
        ...(data.note.noteNumber && { noteNumber: data.note.noteNumber }),
        ...(data.note.issueDate && { issueDate: data.note.issueDate }),
        ...(data.note.dueDate && { dueDate: data.note.dueDate }),
        ...(data.note.amount != null && { amount: data.note.amount }),
        ...(data.note.paymentPlace && { paymentPlace: data.note.paymentPlace }),
        ...(data.note.issuePlace && { issuePlace: data.note.issuePlace }),
      };

      const mergedRespondent = {
        ...current.respondent,
        ...(data.respondent.name && { name: data.respondent.name }),
        ...(data.respondent.idNumber && { idNumber: data.respondent.idNumber }),
        ...(data.respondent.address && { address: data.respondent.address }),
      };

      const mergedApplicant = {
        ...current.applicant,
        ...(data.applicant?.name && { name: data.applicant.name }),
      };

      reset({
        ...current,
        applicant: mergedApplicant,
        respondent: mergedRespondent,
        claim: {
          ...current.claim,
          ...(data.note.amount != null && { amount: data.note.amount }),
          ...(data.claim?.interestRate != null && { interestRate: data.claim.interestRate }),
          ...(data.claim?.interestStartPoint && { interestStartPoint: data.claim.interestStartPoint as "maturity_date" | "presentation_date" | "invoice_date" | "custom_date" }),
        },
        notes: [mergedNote, ...current.notes.slice(1)],
      });
    },
    [getValues, reset],
  );

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
            <div className="mb-4 flex items-center gap-3">
              <ModeTab mode={mode} onModeChange={setMode} />
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => reset(EXAMPLE_DATA)}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  填入範例
                </button>
                <button
                  type="button"
                  onClick={() => reset(INITIAL_VALUES)}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  清除內容
                </button>
              </div>
            </div>
            {mode === "ocr" && (
              <ImageUpload onOCRComplete={handleOCRComplete} />
            )}
            <PetitionForm
              register={register}
              errors={errors}
              control={control}
              watch={watch}
            />
          </div>

          {/* Right panel: Preview + Download */}
          <div className="mt-8 lg:mt-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              即時預覽
            </p>
            <PetitionPreview data={formData} previewRef={previewRef} />

            <div className="mt-4">
              <PdfDownloadButton
                previewRef={previewRef}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
