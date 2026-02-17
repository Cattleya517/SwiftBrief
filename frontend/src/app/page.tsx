"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { petitionFormSchema, PetitionFormData } from "@/lib/schema";
import PetitionForm from "@/components/PetitionForm";
import PetitionPreview from "@/components/PetitionPreview";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<PetitionFormData>({
    resolver: zodResolver(petitionFormSchema),
    defaultValues: INITIAL_VALUES,
  });

  const formData = watch();

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
            <div className="mb-4">
              <button
                type="button"
                onClick={() => reset(EXAMPLE_DATA)}
                className="px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                填入範例
              </button>
            </div>
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
