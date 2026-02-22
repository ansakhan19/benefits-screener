"use client";

interface StepTransitBenefitsProps {
  hasExistingBenefit: boolean | null;
  onChange: (val: boolean) => void;
}

export default function StepTransitBenefits({
  hasExistingBenefit,
  onChange,
}: StepTransitBenefitsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Existing Transit Benefits
      </h2>
      <p className="text-gray-600 mb-6">
        Do you currently receive a full-fare MetroCard from DSS/HRA or another
        discounted transit benefit?
      </p>
      <fieldset>
        <legend className="sr-only">Do you receive existing transit benefits?</legend>
        <div className="space-y-3">
          {[
            { value: true, label: "Yes, I currently receive transit benefits" },
            { value: false, label: "No, I do not" },
          ].map((option) => (
            <label
              key={String(option.value)}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                hasExistingBenefit === option.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="existingBenefit"
                checked={hasExistingBenefit === option.value}
                onChange={() => onChange(option.value)}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-900 font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
