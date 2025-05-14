import { useState, useEffect } from "react";
import PropertyWizard from "@/components/PropertyWizard";
import PropertySummary from "@/components/PropertySummary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Property, SortOption } from "@/lib/types";
import { loadProperties, saveProperty, deleteProperty } from "@/lib/storage";
import { calculatePropertyMonthlyExpenses } from "@/lib/calculations";

const PropertyCalculator = () => {
  const [showSummary, setShowSummary] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("address");
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load properties from localStorage on initial mount
    const savedProperties = loadProperties();
    const propertiesWithCalculations = savedProperties.map(calculatePropertyMonthlyExpenses);
    setProperties(propertiesWithCalculations);
  }, []);

  const handleAddProperty = (property: Property) => {
    const propertyWithCalculations = calculatePropertyMonthlyExpenses(property);
    
    setProperties(prevProperties => {
      // Check if we're editing an existing property
      if (isEditing && currentProperty) {
        const updatedProperties = prevProperties.map(p => 
          p.details.id === propertyWithCalculations.details.id ? propertyWithCalculations : p
        );
        return updatedProperties;
      }
      
      // Otherwise add a new property
      return [...prevProperties, propertyWithCalculations];
    });
    
    // Save to localStorage
    saveProperty(propertyWithCalculations);
    
    // Reset editing state
    setIsEditing(false);
    setCurrentProperty(null);
  };

  const handleEditProperty = (property: Property) => {
    setCurrentProperty(property);
    setIsEditing(true);
    setShowSummary(false);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(prevProperties => 
      prevProperties.filter(property => property.details.id !== id)
    );
    deleteProperty(id);
  };

  const handleAddNewProperty = () => {
    setCurrentProperty(null);
    setIsEditing(false);
    setShowSummary(false);
  };

  const handleShowSummary = () => {
    setShowSummary(true);
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-4 sm:p-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Property Expense Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Calculate standardized monthly expenses across multiple properties
          </p>
        </div>
        <ThemeToggle />
      </header>

      {showSummary ? (
        <PropertySummary 
          properties={properties}
          sortOption={sortOption}
          onSortChange={setSortOption}
          onAddNewProperty={handleAddNewProperty}
          onEditProperty={handleEditProperty}
          onDeleteProperty={handleDeleteProperty}
        />
      ) : (
        <PropertyWizard 
          onPropertyAdded={handleAddProperty}
          onShowSummary={handleShowSummary}
          propertyToEdit={currentProperty}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default PropertyCalculator;
