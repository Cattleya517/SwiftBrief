"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PetitionFormData } from "@/lib/schema";

interface Props {
  register: UseFormRegister<PetitionFormData>;
  errors: FieldErrors<PetitionFormData>;
}

export default function FactsSection({ register, errors }: Props) {
  const fe = errors.factsAndReasons;

  return (
    <fieldset className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <legend className="text-base font-semibold text-slate-800 px-2">
        事實與理由
      </legend>
      <div className="space-y-5">
        <div>
          <label
            htmlFor="facts-acquisitionDate"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            取得本票日期 <span className="text-red-500">*</span>
          </label>
          <input
            id="facts-acquisitionDate"
            type="date"
            aria-invalid={!!fe?.acquisitionDate}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register("factsAndReasons.acquisitionDate")}
          />
          {fe?.acquisitionDate && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {fe.acquisitionDate.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="facts-acquisitionReason"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            取得本票原因 <span className="text-red-500">*</span>
          </label>
          <input
            id="facts-acquisitionReason"
            type="text"
            placeholder="例：借款、買賣"
            aria-invalid={!!fe?.acquisitionReason}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register("factsAndReasons.acquisitionReason")}
          />
          {fe?.acquisitionReason && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {fe.acquisitionReason.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="facts-presentmentDate"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            提示付款日期 <span className="text-red-500">*</span>
          </label>
          <input
            id="facts-presentmentDate"
            type="date"
            aria-invalid={!!fe?.presentmentDate}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register("factsAndReasons.presentmentDate")}
          />
          {fe?.presentmentDate && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {fe.presentmentDate.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="facts-refusalDescription"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            拒絕付款說明 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="facts-refusalDescription"
            rows={3}
            placeholder="例：經聲請人持向相對人提示，惟遭拒絕付款"
            aria-invalid={!!fe?.refusalDescription}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register("factsAndReasons.refusalDescription")}
          />
          {fe?.refusalDescription && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {fe.refusalDescription.message}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
