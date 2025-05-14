import { 
  Property, 
  PropertyExpenses, 
  PropertyMonthlyExpenses, 
  PaymentFrequency 
} from "./types";

// Convert expenses to monthly equivalent based on frequency
export function convertToMonthly(amount: number, frequency: PaymentFrequency): number {
  switch (frequency) {
    case "Monthly":
      return amount;
    case "Quarterly":
      return amount / 3;
    case "Semi-Annual":
      return amount / 6;
    case "Annual":
      return amount / 12;
    default:
      return amount;
  }
}

// Calculate total monthly expenses for a property
export function calculateMonthlyExpenses(expenses: PropertyExpenses): PropertyMonthlyExpenses {
  const principalInterest = expenses.principalInterest;
  const propertyTaxes = expenses.propertyTaxes / 12;
  const homeownersInsurance = expenses.homeownersInsurance / 12;
  const hoaDues = convertToMonthly(expenses.hoaDues.amount, expenses.hoaDues.frequency);
  const otherExpenses = convertToMonthly(expenses.otherExpenses.amount, expenses.otherExpenses.frequency);
  
  const total = principalInterest + propertyTaxes + homeownersInsurance + hoaDues + otherExpenses;
  
  return {
    principalInterest,
    propertyTaxes,
    homeownersInsurance,
    hoaDues,
    otherExpenses,
    total
  };
}

// Update property with calculated monthly expenses
export function calculatePropertyMonthlyExpenses(property: Property): Property {
  return {
    ...property,
    monthlyExpenses: calculateMonthlyExpenses(property.expenses)
  };
}

// Calculate total monthly expenses across all properties
export function calculateTotalMonthlyExpenses(properties: Property[]): number {
  return properties.reduce((total, property) => {
    // Ensure monthlyExpenses is calculated
    const calculated = property.monthlyExpenses || 
      calculateMonthlyExpenses(property.expenses);
    
    return total + calculated.total;
  }, 0);
}

// Sort properties by criteria
export function sortProperties(properties: Property[], sortBy: string): Property[] {
  return [...properties].sort((a, b) => {
    // Ensure monthlyExpenses is calculated
    const aExpenses = a.monthlyExpenses || calculateMonthlyExpenses(a.expenses);
    const bExpenses = b.monthlyExpenses || calculateMonthlyExpenses(b.expenses);
    
    switch (sortBy) {
      case "address":
        return `${a.details.address.street}, ${a.details.address.city}`.localeCompare(
          `${b.details.address.street}, ${b.details.address.city}`
        );
      case "expense-high":
        return bExpenses.total - aExpenses.total;
      case "expense-low":
        return aExpenses.total - bExpenses.total;
      default:
        return 0;
    }
  });
}
