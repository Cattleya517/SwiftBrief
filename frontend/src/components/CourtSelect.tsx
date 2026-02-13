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
      <div>
        <label
          htmlFor="court-select"
          className="block text-sm font-medium text-slate-600 mb-1"
        >
          請選擇管轄法院（依相對人住所地） <span className="text-red-500">*</span>
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
    </fieldset>
  );
}
