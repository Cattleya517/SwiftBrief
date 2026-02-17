"use client";

import {
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormWatch,
} from "react-hook-form";
import { PetitionFormData } from "@/lib/schema";
import PartySection from "./PartySection";
import ClaimSection from "./ClaimSection";
import FactsSection from "./FactsSection";
import NotesSection from "./NotesSection";
import CourtSelect from "./CourtSelect";

interface Props {
  register: UseFormRegister<PetitionFormData>;
  errors: FieldErrors<PetitionFormData>;
  control: Control<PetitionFormData>;
  watch: UseFormWatch<PetitionFormData>;
}

export default function PetitionForm({
  register,
  errors,
  control,
  watch,
}: Props) {
  return (
    <div className="space-y-6" role="form" aria-label="聲請狀表單">
      <PartySection type="applicant" register={register} errors={errors} />
      <PartySection type="respondent" register={register} errors={errors} />
      <NotesSection register={register} errors={errors} control={control} />
      <ClaimSection register={register} errors={errors} watch={watch} />
      <FactsSection register={register} errors={errors} />
      <CourtSelect register={register} errors={errors} />
    </div>
  );
}
