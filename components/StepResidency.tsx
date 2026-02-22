"use client";

import { BOROUGHS } from "@/lib/types";

interface StepResidencyProps {
  borough: string | null;
  onChange: (borough: string | null) => void;
}

export default function StepResidency({ borough, onChange }: StepResidencyProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Do you live in New York City?
      </h2>
      <p className="text-gray-600 mb-6">
        Select the borough where you currently reside.
      </p>
      <fieldset>
        <legend className="sr-only">Select your borough</legend>
        <div className="space-y-3">
          {BOROUGHS.map((b) => (
            <label
              key={b}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                borough === b
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="borough"
                value={b}
                checked={borough === b}
                onChange={() => onChange(b)}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-900 font-medium">{b}</span>
            </label>
          ))}
          <label
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              borough === ""
                ? "border-red-400 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="borough"
              value=""
              checked={borough === ""}
              onChange={() => onChange("")}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900 font-medium">
              I don&apos;t live in NYC
            </span>
          </label>
        </div>
      </fieldset>
    </div>
  );
}
