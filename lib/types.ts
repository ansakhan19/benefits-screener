export interface ScreeningData {
  age: number | null;
  borough: string | null;
  hasExistingBenefit: boolean | null;
  receivesSnapOrCash: boolean | null;
  householdSize: number | null;
  annualIncome: number | null;
}

export const INITIAL_SCREENING_DATA: ScreeningData = {
  age: null,
  borough: null,
  hasExistingBenefit: null,
  receivesSnapOrCash: null,
  householdSize: null,
  annualIncome: null,
};

export type EligibilityStatus = "eligible" | "ineligible";

export interface ProgramResult {
  programName: string;
  programCode: string;
  eligible: boolean;
  description?: string;
}

export interface ScreeningApiResponse {
  eligiblePrograms: ProgramResult[];
  errorMessage?: string;
}

export interface EligibilityResult {
  status: EligibilityStatus;
  reason: string;
  suggestion?: string;
  programs?: ProgramResult[];
}

export const BOROUGHS = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "Bronx",
  "Staten Island",
] as const;
