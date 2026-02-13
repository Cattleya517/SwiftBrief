"use client";

import {
  UseFormRegister,
  FieldErrors,
  useFieldArray,
  Control,
} from "react-hook-form";
import { PetitionFormData } from "@/lib/schema";

interface Props {
  register: UseFormRegister<PetitionFormData>;
  errors: FieldErrors<PetitionFormData>;
  control: Control<PetitionFormData>;
}

export default function NotesSection({ register, errors, control }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "notes",
  });

  return (
    <fieldset className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <legend className="text-base font-semibold text-slate-800 px-2">
        本票細節
      </legend>
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-slate-200 rounded-xl p-5 bg-slate-50/50"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-slate-700">
                本票 {index + 1}
              </span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`刪除本票 ${index + 1}`}
                  className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor={`note-${index}-issueDate`}
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  發票日 <span className="text-red-500">*</span>
                </label>
                <input
                  id={`note-${index}-issueDate`}
                  type="date"
                  aria-invalid={!!errors.notes?.[index]?.issueDate}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
                  {...register(`notes.${index}.issueDate`)}
                />
                {errors.notes?.[index]?.issueDate && (
                  <p role="alert" className="text-red-500 text-sm mt-1">
                    {errors.notes[index].issueDate.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`note-${index}-noteNumber`}
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  票號 <span className="text-red-500">*</span>
                </label>
                <input
                  id={`note-${index}-noteNumber`}
                  type="text"
                  placeholder="請輸入票號"
                  aria-invalid={!!errors.notes?.[index]?.noteNumber}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
                  {...register(`notes.${index}.noteNumber`)}
                />
                {errors.notes?.[index]?.noteNumber && (
                  <p role="alert" className="text-red-500 text-sm mt-1">
                    {errors.notes[index].noteNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`note-${index}-amount`}
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  金額（新台幣） <span className="text-red-500">*</span>
                </label>
                <input
                  id={`note-${index}-amount`}
                  type="number"
                  min="1"
                  placeholder="請輸入金額"
                  aria-invalid={!!errors.notes?.[index]?.amount}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
                  {...register(`notes.${index}.amount`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.notes?.[index]?.amount && (
                  <p role="alert" className="text-red-500 text-sm mt-1">
                    {errors.notes[index].amount.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`note-${index}-dueDate`}
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  到期日（未填則視為見票即付）
                </label>
                <input
                  id={`note-${index}-dueDate`}
                  type="date"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
                  {...register(`notes.${index}.dueDate`)}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({ issueDate: "", noteNumber: "", amount: 0, dueDate: "" })
          }
          className="w-full border-2 border-dashed border-slate-300 rounded-xl py-3 text-slate-500 hover:border-blue-800/40 hover:text-blue-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          新增本票
        </button>
      </div>
    </fieldset>
  );
}
