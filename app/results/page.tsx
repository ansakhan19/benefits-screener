"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EligibilityResult } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<EligibilityResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("screeningResult");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const isEligible = result.status === "eligible";

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="rounded-2xl p-6 sm:p-8">
          {/* Status Banner */}
          <div
            className={`rounded-xl p-6 mb-8 ${
              isEligible
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl" role="img" aria-label={isEligible ? "checkmark" : "cross"}>
                {isEligible ? "\u2705" : "\u274C"}
              </span>
              <div>
                <h1
                  className={`text-2xl font-bold mb-2 ${
                    isEligible ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isEligible
                    ? "You Likely Qualify for Fair Fares NYC!"
                    : "You May Not Be Eligible"}
                </h1>
                <p
                  className={`text-base ${
                    isEligible ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {result.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Eligible: Next Steps */}
          {isEligible && (
            <div className="space-y-6">
              {/* Primary CTA - Enroll Now */}
              <a
                href="https://www1.nyc.gov/account/register.htm?spName=accesshra&target=aHR0cHM6Ly9hMDY5LWFjY2Vzcy5ueWMuZ292L2FjY2Vzc2hyYS9sb2dpbg==&lang=en_US&fromKiosk=true"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
              >
                Enroll Now on ACCESS HRA
              </a>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  How to Enroll
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      1. Have These Documents Ready
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Proof of identity (government-issued photo ID)</li>
                      <li>
                        Proof of NYC residency (utility bill, lease, or bank
                        statement)
                      </li>
                      <li>
                        Proof of income (pay stubs, tax return, or benefits
                        letter)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      2. Create an ACCESS HRA Account
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Click the <strong>&quot;Enroll Now&quot;</strong> button
                      above to create your account on the ACCESS HRA portal.
                      You&apos;ll need to provide your name, date of birth, and
                      create a password.
                    </p>
                    <p className="text-gray-700">
                      Once registered, log in and select{" "}
                      <strong>&quot;Fair Fares NYC&quot;</strong> to begin your
                      application. You&apos;ll upload your documents directly
                      through the portal.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      3. Wait for Approval &amp; Receive Your OMNY Card
                    </h3>
                    <p className="text-gray-700">
                      Applications are typically reviewed within{" "}
                      <strong>30 days</strong>. Once approved, your Fair Fares
                      OMNY card will be mailed to you within{" "}
                      <strong>3 weeks</strong>. You can check your application
                      status anytime by logging back into ACCESS HRA.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Prefer to apply in person?
                    </h3>
                    <p className="text-gray-700">
                      You can also visit a Fair Fares NYC enrollment office with
                      your documents. Find locations at{" "}
                      <a
                        href="https://www.nyc.gov/site/fairfares/index.page"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        nyc.gov/fairfares
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </section>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>With Fair Fares:</strong> You&apos;ll receive a 50%
                  discount on subway and bus fares using your OMNY card, with a
                  weekly cap of just $17.
                </p>
              </div>

              {/* Secondary CTA */}
              <a
                href="https://www1.nyc.gov/account/register.htm?spName=accesshra&target=aHR0cHM6Ly9hMDY5LWFjY2Vzcy5ueWMuZ292L2FjY2Vzc2hyYS9sb2dpbg==&lang=en_US&fromKiosk=true"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
              >
                Enroll Now on ACCESS HRA
              </a>
            </div>
          )}

          {/* Ineligible: Suggestion */}
          {!isEligible && result.suggestion && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800">
                <strong>Tip:</strong> {result.suggestion}
              </p>
            </div>
          )}

          {/* Other Programs You May Qualify For */}
          {result.programs && result.programs.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Other Programs You May Qualify For
              </h2>
              <div className="space-y-3">
                {result.programs.map((program, index) => (
                  <div
                    key={program.programCode || index}
                    className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-purple-900">
                      {program.programName}
                    </h3>
                    {program.description && (
                      <p className="text-purple-700 text-sm mt-1">
                        {program.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Start Over */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                sessionStorage.removeItem("screeningResult");
                router.push("/screening");
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Screen Again
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("screeningResult");
                router.push("/");
              }}
              className="px-6 py-3 text-gray-500 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
