"use client";

import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { PetitionFormData } from "@/lib/schema";
import { amountToChinese } from "@/lib/amount-to-chinese";

interface Props {
  register: UseFormRegister<PetitionFormData>;
  errors: FieldErrors<PetitionFormData>;
  watch: UseFormWatch<PetitionFormData>;
}

export default function ClaimSection({ register, errors, watch }: Props) {
  const amount = watch("claim.amount");
  const chineseAmount = amount && amount > 0 ? amountToChinese(amount) : "";

  return (
    <fieldset className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <legend className="text-base font-semibold text-slate-800 px-2">
        請求標的
      </legend>
      <div className="space-y-5">
        <div>
          <label
            htmlFor="claim-amount"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            本票面額（新台幣） <span className="text-red-500">*</span>
          </label>
          <input
            id="claim-amount"
            type="number"
            min="1"
            placeholder="請輸入金額"
            aria-invalid={!!errors.claim?.amount}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register("claim.amount", { valueAsNumber: true })}
          />
          {chineseAmount && (
            <p className="text-blue-800 text-sm mt-1">
              新台幣{chineseAmount}
            </p>
          )}
          {errors.claim?.amount && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {errors.claim.amount.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="claim-interestStartDate"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            利息起算日
          </label>
          <input
            id="claim-interestStartDate"
            type="date"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register("claim.interestStartDate")}
          />
        </div>

        <div>
          <label
            htmlFor="claim-interestRate"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            年利率（%）
          </label>
          <input
            id="claim-interestRate"
            type="number"
            min="0"
            step="0.01"
            placeholder="預設 6"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            {...register("claim.interestRate", { valueAsNumber: true })}
          />
        </div>
      </div>
    </fieldset>
  );
}
