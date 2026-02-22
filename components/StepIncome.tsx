"use client";

import { getIncomeLimit } from "@/lib/eligibility";

interface StepIncomeProps {
  householdSize: number | null;
  annualIncome: number | null;
  onChangeSize: (size: number | null) => void;
  onChangeIncome: (income: number | null) => void;
}

export default function StepIncome({
  householdSize,
  annualIncome,
  onChangeSize,
  onChangeIncome,
}: StepIncomeProps) {
  const limit = householdSize ? getIncomeLimit(householdSize) : null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Household Size &amp; Income
      </h2>
      <p className="text-gray-600 mb-6">
        We need to check if your household income falls within the eligibility
        guidelines.
      </p>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="householdSize"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            How many people live in your household (including yourself)?
          </label>
          <select
            id="householdSize"
            value={householdSize ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              onChangeSize(val === "" ? null : parseInt(val, 10));
            }}
            className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Select household size</option>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 8 ? "or more" : n === 1 ? "person" : "people"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="income"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            What is your total annual household income?
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
              $
            </span>
            <input
              id="income"
              type="number"
              min={0}
              value={annualIncome ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                onChangeIncome(val === "" ? null : parseInt(val, 10));
              }}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        {limit !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              For a household of{" "}
              <span className="font-semibold">{householdSize}</span>, the income
              limit is{" "}
              <span className="font-semibold">
                ${limit.toLocaleString()}
              </span>{" "}
              per year (145% of the Federal Poverty Level).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
