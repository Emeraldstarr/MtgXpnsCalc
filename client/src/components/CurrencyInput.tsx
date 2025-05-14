import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { formatCurrencyInput, parseCurrencyValue } from "@/lib/utils";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const CurrencyInput = ({
  value,
  onChange,
  placeholder = "0.00",
  disabled = false,
  required = false,
  className,
}: CurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState(() => 
    value ? formatCurrencyInput(value.toString()) : "");
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Format the display value when the actual value changes
    if (value === 0 && displayValue === "") {
      // Don't update if user cleared the field
      return;
    }
    
    setDisplayValue(value ? formatCurrencyInput(value.toString()) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formattedInput = formatCurrencyInput(input);
    setDisplayValue(formattedInput);
    
    const numericValue = parseCurrencyValue(formattedInput);
    onChange(numericValue);
  };

  return (
    <div className="currency-input">
      <Input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={className}
      />
    </div>
  );
};

export default CurrencyInput;
