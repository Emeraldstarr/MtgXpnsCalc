import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CurrencyInput from "@/components/CurrencyInput";
import { PropertyExpenses, PaymentFrequency } from "@/lib/types";

interface PropertyExpensesFormProps {
  onSubmit: (expenses: PropertyExpenses) => void;
  onBack: () => void;
  initialData: PropertyExpenses | null;
}

const DEFAULT_PROPERTY_EXPENSES: PropertyExpenses = {
  principalInterest: 0,
  propertyTaxes: 0,
  homeownersInsurance: 0,
  hoaDues: {
    amount: 0,
    frequency: "Monthly"
  },
  otherExpenses: {
    amount: 0,
    frequency: "Monthly"
  }
};

const PropertyExpensesForm = ({
  onSubmit,
  onBack,
  initialData
}: PropertyExpensesFormProps) => {
  const [expenses, setExpenses] = useState<PropertyExpenses>(
    initialData || DEFAULT_PROPERTY_EXPENSES
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setExpenses(initialData);
    }
  }, [initialData]);

  const paymentFrequencies: PaymentFrequency[] = [
    "Monthly",
    "Quarterly",
    "Semi-Annual",
    "Annual"
  ];

  const handlePrincipalInterestChange = (value: number) => {
    setExpenses(prev => ({
      ...prev,
      principalInterest: value
    }));
    
    // Clear error on change
    if (errors.principalInterest) {
      setErrors(prev => ({ ...prev, principalInterest: "" }));
    }
  };

  const handlePropertyTaxesChange = (value: number) => {
    setExpenses(prev => ({
      ...prev,
      propertyTaxes: value
    }));
    
    if (errors.propertyTaxes) {
      setErrors(prev => ({ ...prev, propertyTaxes: "" }));
    }
  };

  const handleHomeownersInsuranceChange = (value: number) => {
    setExpenses(prev => ({
      ...prev,
      homeownersInsurance: value
    }));
    
    if (errors.homeownersInsurance) {
      setErrors(prev => ({ ...prev, homeownersInsurance: "" }));
    }
  };

  const handleHoaDuesAmountChange = (value: number) => {
    setExpenses(prev => ({
      ...prev,
      hoaDues: {
        ...prev.hoaDues,
        amount: value
      }
    }));
  };

  const handleHoaFrequencyChange = (value: PaymentFrequency) => {
    setExpenses(prev => ({
      ...prev,
      hoaDues: {
        ...prev.hoaDues,
        frequency: value
      }
    }));
  };

  const handleOtherExpensesAmountChange = (value: number) => {
    setExpenses(prev => ({
      ...prev,
      otherExpenses: {
        ...prev.otherExpenses,
        amount: value
      }
    }));
  };

  const handleOtherFrequencyChange = (value: PaymentFrequency) => {
    setExpenses(prev => ({
      ...prev,
      otherExpenses: {
        ...prev.otherExpenses,
        frequency: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Principal & Interest is now optional
    
    if (expenses.propertyTaxes <= 0) {
      newErrors.propertyTaxes = "Property Taxes is required";
    }
    
    if (expenses.homeownersInsurance <= 0) {
      newErrors.homeownersInsurance = "Homeowners Insurance is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(expenses);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-bold mb-4">Property Expenses</h2>
          
          <div className="space-y-6">
            {/* Monthly Principal & Interest */}
            <div>
              <Label 
                htmlFor="principal-interest" 
                className="block text-sm font-medium mb-1"
              >
                Monthly Principal & Interest
              </Label>
              <CurrencyInput
                value={expenses.principalInterest}
                onChange={handlePrincipalInterestChange}
                placeholder="0.00"
                className={errors.principalInterest ? "border-red-500" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave as 0 if there is no mortgage (property owned free and clear)
              </p>
              {errors.principalInterest && (
                <p className="text-red-500 text-sm mt-1">{errors.principalInterest}</p>
              )}
            </div>
            
            {/* Annual Property Taxes */}
            <div>
              <Label 
                htmlFor="property-taxes" 
                className="block text-sm font-medium mb-1"
              >
                Annual Property Taxes
              </Label>
              <CurrencyInput
                value={expenses.propertyTaxes}
                onChange={handlePropertyTaxesChange}
                placeholder="0.00"
                required
                className={errors.propertyTaxes ? "border-red-500" : ""}
              />
              {errors.propertyTaxes && (
                <p className="text-red-500 text-sm mt-1">{errors.propertyTaxes}</p>
              )}
            </div>
            
            {/* Annual Homeowners Insurance */}
            <div>
              <Label 
                htmlFor="homeowners-insurance" 
                className="block text-sm font-medium mb-1"
              >
                Annual Homeowners Insurance Premium
              </Label>
              <CurrencyInput
                value={expenses.homeownersInsurance}
                onChange={handleHomeownersInsuranceChange}
                placeholder="0.00"
                required
                className={errors.homeownersInsurance ? "border-red-500" : ""}
              />
              {errors.homeownersInsurance && (
                <p className="text-red-500 text-sm mt-1">{errors.homeownersInsurance}</p>
              )}
            </div>
            
            {/* HOA Dues */}
            <div>
              <Label 
                htmlFor="hoa-dues" 
                className="block text-sm font-medium mb-1"
              >
                HOA Dues
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <CurrencyInput
                    value={expenses.hoaDues.amount}
                    onChange={handleHoaDuesAmountChange}
                    placeholder="0.00"
                  />
                </div>
                <Select
                  value={expenses.hoaDues.frequency}
                  onValueChange={(value) => handleHoaFrequencyChange(value as PaymentFrequency)}
                >
                  <SelectTrigger id="hoa-frequency">
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentFrequencies.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Other Expenses */}
            <div>
              <Label 
                htmlFor="other-expenses" 
                className="block text-sm font-medium mb-1"
              >
                Other Expenses
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <CurrencyInput
                    value={expenses.otherExpenses.amount}
                    onChange={handleOtherExpensesAmountChange}
                    placeholder="0.00"
                  />
                </div>
                <Select
                  value={expenses.otherExpenses.frequency}
                  onValueChange={(value) => handleOtherFrequencyChange(value as PaymentFrequency)}
                >
                  <SelectTrigger id="other-frequency">
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentFrequencies.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="text-primary border-primary h-11"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white h-11"
            >
              Calculate
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyExpensesForm;
