import { z } from "zod";
import { validateTaiwanId } from "./validate-id";

const partySchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  idNumber: z
    .string()
    .min(1, "請輸入身分證字號")
    .refine(validateTaiwanId, "身分證字號格式不正確"),
  address: z.string().min(1, "請輸入住址"),
});

const claimSchema = z.object({
  amount: z
    .number({ error: "請輸入本票面額" })
    .positive("金額必須大於零"),
  interestType: z.enum(["statutory", "agreed"]),
  interestStartPoint: z.enum([
    "maturity_date",
    "presentation_date",
    "invoice_date",
    "custom_date",
  ]),
  customInterestDate: z.string().optional(),
  interestRate: z.number().optional(),
  interestStartDate: z.string().optional(),
});

const factsAndReasonsSchema = z.object({
  acquisitionDate: z.string().min(1, "請輸入取得本票日期"),
  acquisitionReason: z.string().min(1, "請輸入取得本票原因"),
  presentmentDate: z.string().min(1, "請輸入提示付款日期"),
  refusalDescription: z.string().min(1, "請輸入拒絕付款說明"),
});

const promissoryNoteSchema = z.object({
  issueDate: z.string().min(1, "請輸入發票日"),
  noteNumber: z.string().min(1, "請輸入票號"),
  amount: z
    .number({ error: "請輸入金額" })
    .positive("金額必須大於零"),
  dueDate: z.string().optional(),
  paymentPlace: z.string().optional(),
});

export const petitionFormSchema = z.object({
  applicant: partySchema,
  respondent: partySchema,
  claim: claimSchema,
  factsAndReasons: factsAndReasonsSchema,
  notes: z.array(promissoryNoteSchema).min(1, "至少需要一張本票"),
  court: z.string().min(1, "請選擇管轄法院"),
});

export type PetitionFormData = z.infer<typeof petitionFormSchema>;
