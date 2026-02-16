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
  const interestType = watch("claim.interestType");
  const interestStartPoint = watch("claim.interestStartPoint");

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
          <label className="block text-sm font-medium text-slate-600 mb-1">
            利息計算方式 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="statutory"
                className="w-4 h-4 text-blue-800 focus:ring-blue-800"
                {...register("claim.interestType")}
              />
              <span className="text-slate-700">沒有約定利息 (法定 6%)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="agreed"
                className="w-4 h-4 text-blue-800 focus:ring-blue-800"
                {...register("claim.interestType")}
              />
              <span className="text-slate-700">有約定利息</span>
            </label>
          </div>
        </div>

        {interestType === "agreed" && (
          <div>
            <label
              htmlFor="claim-interestRate"
              className="block text-sm font-medium text-slate-600 mb-1"
            >
              約定年利率（%） <span className="text-red-500">*</span>
            </label>
            <input
              id="claim-interestRate"
              type="number"
              min="0"
              step="0.01"
              placeholder="請輸入年利率"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
              {...register("claim.interestRate", { valueAsNumber: true })}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            利息起算日 <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2 mt-2">
            {interestType === "statutory" ? (
              <>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="maturity_date"
                    className="w-4 h-4 text-blue-800 focus:ring-blue-800"
                    {...register("claim.interestStartPoint")}
                  />
                  <span className="text-slate-700">到期日 (若本票上有填寫)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="presentation_date"
                    className="w-4 h-4 text-blue-800 focus:ring-blue-800"
                    {...register("claim.interestStartPoint")}
                  />
                  <span className="text-slate-700">提示日 (若本票上沒有填寫到期日)</span>
                </label>
              </>
            ) : (
              // agreed
              <>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="invoice_date"
                    className="w-4 h-4 text-blue-800 focus:ring-blue-800"
                    {...register("claim.interestStartPoint")}
                  />
                  <span className="text-slate-700">發票日</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="custom_date"
                    className="w-4 h-4 text-blue-800 focus:ring-blue-800"
                    {...register("claim.interestStartPoint")}
                  />
                  <span className="text-slate-700">約定起算日</span>
                </label>
              </>
            )}
          </div>
        </div>

        {interestStartPoint === "custom_date" && interestType === "agreed" && (
          <div>
            <label
              htmlFor="claim-customInterestDate"
              className="block text-sm font-medium text-slate-600 mb-1"
            >
              輸入約定起算日 <span className="text-red-500">*</span>
            </label>
            <input
              id="claim-customInterestDate"
              type="date"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
              {...register("claim.customInterestDate")}
            />
          </div>
        )}
      </div>
    </fieldset>
  );
}
