export interface PartyInfo {
  name: string;
  idNumber: string;
  address: string;
}

export interface ClaimInfo {
  amount: number;
  interestStartDate?: string;
  interestRate?: number;
}

export interface FactsAndReasons {
  acquisitionDate: string;
  acquisitionReason: string;
  presentmentDate: string;
  refusalDescription: string;
}

export interface PromissoryNote {
  issueDate: string;
  noteNumber: string;
  amount: number;
  dueDate?: string;
}

export interface PetitionFormData {
  applicant: PartyInfo;
  respondent: PartyInfo;
  claim: ClaimInfo;
  factsAndReasons: FactsAndReasons;
  notes: PromissoryNote[];
  court: string;
}
