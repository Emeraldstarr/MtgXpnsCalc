import { useState, useEffect } from "react";
import StepIndicator from "@/components/StepIndicator";
import PropertyDetailsForm from "@/components/PropertyDetailsForm";
import PropertyExpensesForm from "@/components/PropertyExpensesForm";
import PropertyResultsView from "@/components/PropertyResultsView";
import { Property, PropertyDetails, PropertyExpenses } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { calculateMonthlyExpenses } from "@/lib/calculations";

interface PropertyWizardProps {
  onPropertyAdded: (property: Property) => void;
  onShowSummary: () => void;
  propertyToEdit: Property | null;
  isEditing: boolean;
}

const PropertyWizard = ({ 
  onPropertyAdded, 
  onShowSummary, 
  propertyToEdit,
  isEditing
}: PropertyWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [propertyExpenses, setPropertyExpenses] = useState<PropertyExpenses | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  // Load property data if editing
  useEffect(() => {
    if (propertyToEdit && isEditing) {
      setPropertyDetails(propertyToEdit.details);
      setPropertyExpenses(propertyToEdit.expenses);
      // Keep the current step at 1 when starting an edit
    }
  }, [propertyToEdit, isEditing]);

  const handlePropertyDetailsSubmit = (details: PropertyDetails) => {
    // If not editing, generate a new ID
    if (!isEditing) {
      details.id = generateId();
    }
    
    setPropertyDetails(details);
    setCurrentStep(2);
  };

  const handlePropertyExpensesSubmit = (expenses: PropertyExpenses) => {
    setPropertyExpenses(expenses);
    
    // Combine details and expenses
    if (propertyDetails) {
      const newProperty: Property = {
        details: propertyDetails,
        expenses: expenses,
        monthlyExpenses: calculateMonthlyExpenses(expenses)
      };
      
      setProperty(newProperty);
      setCurrentStep(3);
    }
  };

  const handleAddAnotherProperty = () => {
    if (property) {
      onPropertyAdded(property);
    }
    
    // Reset for a new property
    setPropertyDetails(null);
    setPropertyExpenses(null);
    setProperty(null);
    setCurrentStep(1);
  };

  const handleGoToSummary = () => {
    if (property) {
      onPropertyAdded(property);
    }
    
    onShowSummary();
  };

  const handleBackToDetails = () => {
    setCurrentStep(1);
  };
  
  const getActiveStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PropertyDetailsForm 
            onSubmit={handlePropertyDetailsSubmit} 
            initialData={propertyDetails}
            isEditing={isEditing}
          />
        );
      case 2:
        return (
          <PropertyExpensesForm 
            onSubmit={handlePropertyExpensesSubmit}
            onBack={handleBackToDetails}
            initialData={propertyExpenses}
          />
        );
      case 3:
        return (
          <PropertyResultsView 
            property={property!}
            onAddAnotherProperty={handleAddAnotherProperty}
            onGoToSummary={handleGoToSummary}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <StepIndicator currentStep={currentStep} totalSteps={3} />
      {getActiveStep()}
    </div>
  );
};

export default PropertyWizard;
