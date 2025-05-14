import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const steps = [
    { number: 1, label: "Property Details" },
    { number: 2, label: "Expenses" },
    { number: 3, label: "Results" }
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={`step-${step.number}`} className="flex items-center">
            <div className="flex items-center">
              <span
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full font-bold",
                  step.number <= currentStep
                    ? "bg-primary text-white"
                    : "bg-[#E2E8F0] text-[#4A5568]"
                )}
              >
                {step.number}
              </span>
              <span
                className={cn(
                  "ml-2 font-medium",
                  step.number <= currentStep ? "text-primary" : "text-[#4A5568]"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 bg-[#E2E8F0]"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
