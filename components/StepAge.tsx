"use client";

interface StepAgeProps {
  age: number | null;
  onChange: (age: number | null) => void;
}

export default function StepAge({ age, onChange }: StepAgeProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">How old are you?</h2>
      <p className="text-gray-600 mb-6">
        Fair Fares NYC is available to adults aged 18 to 64.
      </p>
      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
        Your age
      </label>
      <input
        id="age"
        type="number"
        min={1}
        max={120}
        value={age ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? null : parseInt(val, 10));
        }}
        className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your age"
        autoFocus
      />
    </div>
  );
}
