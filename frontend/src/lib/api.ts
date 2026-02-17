export interface OCRNoteResult {
  noteNumber?: string;
  issueDate?: string;
  dueDate?: string;
  amount?: number;
  paymentPlace?: string;
  issuePlace?: string;
}

export interface OCRRespondentResult {
  name?: string;
  idNumber?: string;
  address?: string;
}

export interface OCRResponse {
  success: boolean;
  data: {
    note: OCRNoteResult;
    respondent: OCRRespondentResult;
  };
  rawText: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function submitOCR(file: File): Promise<OCRResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/api/ocr`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.detail ?? `辨識失敗 (${res.status})`;
    throw new Error(message);
  }

  return res.json();
}
