"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScreeningData, INITIAL_SCREENING_DATA } from "@/lib/types";
import { determineEligibility } from "@/lib/eligibility";
import ProgressBar from "@/components/ProgressBar";
import StepAge from "@/components/StepAge";
import StepResidency from "@/components/StepResidency";
import StepTransitBenefits from "@/components/StepTransitBenefits";
import StepSnapCash from "@/components/StepSnapCash";
import StepIncome from "@/components/StepIncome";

export default function ScreeningPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ScreeningData>(INITIAL_SCREENING_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user receives SNAP/Cash, skip income step (4 steps instead of 5)
  const steps = data.receivesSnapOrCash
    ? ["age", "residency", "transit", "snap"]
    : ["age", "residency", "transit", "snap", "income"];

  const totalSteps = steps.length;
  const currentStepName = steps[step];

  function canAdvance(): boolean {
    switch (currentStepName) {
      case "age":
        return data.age !== null && data.age > 0;
      case "residency":
        return data.borough !== null;
      case "transit":
        return data.hasExistingBenefit !== null;
      case "snap":
        return data.receivesSnapOrCash !== null;
      case "income":
        return data.householdSize !== null && data.annualIncome !== null;
      default:
        return false;
    }
  }

  async function handleNext() {
    if (!canAdvance()) return;

    // Check for early disqualification after certain steps
    if (currentStepName === "age" && data.age !== null) {
      if (data.age < 18 || data.age > 64) {
        const result = determineEligibility(data);
        sessionStorage.setItem("screeningResult", JSON.stringify(result));
        router.push("/results");
        return;
      }
    }

    if (currentStepName === "residency" && (data.borough === null || data.borough === "")) {
      const result = determineEligibility(data);
      sessionStorage.setItem("screeningResult", JSON.stringify(result));
      router.push("/results");
      return;
    }

    if (currentStepName === "transit" && data.hasExistingBenefit) {
      const result = determineEligibility(data);
      sessionStorage.setItem("screeningResult", JSON.stringify(result));
      router.push("/results");
      return;
    }

    // If on last step, call the screening API then fall back to local logic
    if (step === totalSteps - 1) {
      const localResult = determineEligibility(data);

      setIsSubmitting(true);
      try {
        const res = await fetch("/api/screen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const apiData = await res.json();
          const result = {
            ...localResult,
            programs: apiData.eligiblePrograms ?? [],
          };
          sessionStorage.setItem("screeningResult", JSON.stringify(result));
        } else {
          sessionStorage.setItem("screeningResult", JSON.stringify(localResult));
        }
      } catch {
        // API failed — fall back to local eligibility logic
        sessionStorage.setItem("screeningResult", JSON.stringify(localResult));
      } finally {
        setIsSubmitting(false);
      }

      router.push("/results");
      return;
    }

    setStep((s) => s + 1);
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <ProgressBar currentStep={step} totalSteps={totalSteps} />

          <div className="min-h-[280px]">
            {currentStepName === "age" && (
              <StepAge
                age={data.age}
                onChange={(age) => setData((d) => ({ ...d, age }))}
              />
            )}
            {currentStepName === "residency" && (
              <StepResidency
                borough={data.borough}
                onChange={(borough) => setData((d) => ({ ...d, borough }))}
              />
            )}
            {currentStepName === "transit" && (
              <StepTransitBenefits
                hasExistingBenefit={data.hasExistingBenefit}
                onChange={(hasExistingBenefit) =>
                  setData((d) => ({ ...d, hasExistingBenefit }))
                }
              />
            )}
            {currentStepName === "snap" && (
              <StepSnapCash
                receivesSnapOrCash={data.receivesSnapOrCash}
                onChange={(receivesSnapOrCash) =>
                  setData((d) => ({ ...d, receivesSnapOrCash }))
                }
              />
            )}
            {currentStepName === "income" && (
              <StepIncome
                householdSize={data.householdSize}
                annualIncome={data.annualIncome}
                onChangeSize={(householdSize) =>
                  setData((d) => ({ ...d, householdSize }))
                }
                onChangeIncome={(annualIncome) =>
                  setData((d) => ({ ...d, annualIncome }))
                }
              />
            )}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-0 disabled:cursor-default"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canAdvance() || isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Checking programs..."
                : step === totalSteps - 1
                  ? "See Results"
                  : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
