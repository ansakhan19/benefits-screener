import { ScreeningData, EligibilityResult } from "./types";

// 145% Federal Poverty Level thresholds (2024)
const INCOME_LIMITS: Record<number, number> = {
  1: 23475,
  2: 31725,
  3: 39975,
  4: 48225,
  5: 56475,
  6: 64725,
  7: 72975,
  8: 81225,
};

const ADDITIONAL_PERSON_INCREMENT = 8250;

export function getIncomeLimit(householdSize: number): number {
  if (householdSize <= 8) {
    return INCOME_LIMITS[householdSize];
  }
  return INCOME_LIMITS[8] + (householdSize - 8) * ADDITIONAL_PERSON_INCREMENT;
}

export function determineEligibility(data: ScreeningData): EligibilityResult {
  // Age check
  if (data.age !== null) {
    if (data.age < 18) {
      return {
        status: "ineligible",
        reason: "Fair Fares NYC is available to adults aged 18-64.",
        suggestion:
          "Students in grades K-12 may be eligible for a free student MetroCard through their school.",
      };
    }
    if (data.age > 64) {
      return {
        status: "ineligible",
        reason: "Fair Fares NYC is available to adults aged 18-64.",
        suggestion:
          "Seniors aged 65+ may qualify for a Reduced-Fare MetroCard. Visit the MTA website or call 511 for more information.",
      };
    }
  }

  // NYC residency check
  if (data.borough === null || data.borough === "") {
    return {
      status: "ineligible",
      reason: "Fair Fares NYC is only available to New York City residents.",
      suggestion:
        "Check with your local transit authority for any reduced-fare programs in your area.",
    };
  }

  // Existing transit benefit check
  if (data.hasExistingBenefit) {
    return {
      status: "ineligible",
      reason:
        "You are not eligible because you already receive a full-fare MetroCard or other discounted transit benefit.",
      suggestion:
        "If your current benefit ends, you may reapply for Fair Fares NYC at that time.",
    };
  }

  // SNAP/Cash Assistance auto-qualifies
  if (data.receivesSnapOrCash) {
    return {
      status: "eligible",
      reason:
        "You likely qualify for Fair Fares NYC because you receive SNAP or Cash Assistance benefits.",
    };
  }

  // Income check
  if (data.householdSize !== null && data.annualIncome !== null) {
    const limit = getIncomeLimit(data.householdSize);
    if (data.annualIncome <= limit) {
      return {
        status: "eligible",
        reason: `Your household income is within the eligibility limit of $${limit.toLocaleString()} for a household of ${data.householdSize}.`,
      };
    } else {
      return {
        status: "ineligible",
        reason: `Your household income exceeds the limit of $${limit.toLocaleString()} for a household of ${data.householdSize}.`,
        suggestion:
          "If your income changes, you can rescreen at any time. You may also qualify for other NYC benefit programs.",
      };
    }
  }

  return {
    status: "ineligible",
    reason: "We could not determine your eligibility. Please complete all screening questions.",
  };
}
