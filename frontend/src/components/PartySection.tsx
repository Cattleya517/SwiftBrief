"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PetitionFormData } from "@/lib/schema";

interface Props {
  type: "applicant" | "respondent";
  register: UseFormRegister<PetitionFormData>;
  errors: FieldErrors<PetitionFormData>;
}

const LABELS = {
  applicant: { title: "聲請人（債權人）", prefix: "applicant" as const },
  respondent: { title: "相對人（債務人）", prefix: "respondent" as const },
};

export default function PartySection({ type, register, errors }: Props) {
  const { title, prefix } = LABELS[type];
  const fieldErrors = errors[prefix];

  return (
    <fieldset className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <legend className="text-base font-semibold text-slate-800 px-2">
        {title}
      </legend>
      <div className="space-y-5">
        <div>
          <label
            htmlFor={`${prefix}-name`}
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            id={`${prefix}-name`}
            type="text"
            placeholder="請輸入姓名"
            aria-invalid={!!fieldErrors?.name}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register(`${prefix}.name`)}
          />
          {fieldErrors?.name && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {fieldErrors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${prefix}-idNumber`}
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            身分證字號 <span className="text-red-500">*</span>
          </label>
          <input
            id={`${prefix}-idNumber`}
            type="text"
            placeholder="例：A123456789"
            aria-invalid={!!fieldErrors?.idNumber}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register(`${prefix}.idNumber`)}
          />
          {fieldErrors?.idNumber && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {fieldErrors.idNumber.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${prefix}-address`}
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            住址 <span className="text-red-500">*</span>
          </label>
          <input
            id={`${prefix}-address`}
            type="text"
            placeholder="請輸入住址"
            aria-invalid={!!fieldErrors?.address}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register(`${prefix}.address`)}
          />
          {fieldErrors?.address && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {fieldErrors.address.message}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
