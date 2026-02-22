"use client";

const STEP_LABELS = ["Age", "Residency", "Benefits", "Assistance", "Income"];

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {STEP_LABELS.slice(0, totalSteps).map((label, i) => (
          <div
            key={label}
            className={`text-xs font-medium ${
              i <= currentStep ? "text-blue-700" : "text-gray-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
}
