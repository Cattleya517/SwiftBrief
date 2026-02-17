"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PetitionFormData } from "@/lib/schema";
import { TAIWAN_COURTS } from "@/lib/courts";

interface Props {
  register: UseFormRegister<PetitionFormData>;
  errors: FieldErrors<PetitionFormData>;
}

export default function CourtSelect({ register, errors }: Props) {
  return (
    <fieldset className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <legend className="text-base font-semibold text-slate-800 px-2">
        管轄法院
      </legend>
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
          <p className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            如何選擇管轄法院？
          </p>
          <ul className="text-xs text-amber-800 space-y-1.5 list-decimal pl-4">
            <li><strong>優先：付款地法院</strong> (本票上有填寫付款地)</li>
            <li><strong>次之：發票地法院</strong> (無付款地，但有發票地，通常為發票人名字後方之地址)</li>
            <li><strong>最後：住所地法院</strong> (兩者皆無時，向發票人住所地或營業場所地之法院聲請)</li>
          </ul>
        </div>

        <div>
          <label
            htmlFor="court-select"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            請選擇管轄法院 <span className="text-red-500">*</span>
          </label>
          <select
            id="court-select"
            aria-invalid={!!errors.court}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register("court")}
          >
            <option value="">請選擇法院</option>
            {TAIWAN_COURTS.map((court) => (
              <option key={court} value={court}>
                {court}
              </option>
            ))}
          </select>
          {errors.court && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {errors.court.message}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
