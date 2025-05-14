export type PropertyType = 
  | "Detached SFR" 
  | "PUD-Detached" 
  | "Condo" 
  | "Attached PUD" 
  | "Manufactured" 
  | "Multi Unit";

export type PropertyStatus = 
  | "Primary Residence" 
  | "Second Home" 
  | "Investment";

export type OccupancyStatus = 
  | "Vacant" 
  | "Owner" 
  | "Tenant";

export type PaymentFrequency = 
  | "Monthly" 
  | "Quarterly" 
  | "Semi-Annual" 
  | "Annual";

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface PropertyDetails {
  id: string;
  propertyType: PropertyType;
  address: PropertyAddress;
  propertyStatus: PropertyStatus;
  occupancyStatus: OccupancyStatus;
}

export interface PropertyExpenses {
  principalInterest: number; // Monthly
  propertyTaxes: number; // Annual
  homeownersInsurance: number; // Annual
  hoaDues: {
    amount: number;
    frequency: PaymentFrequency;
  };
  otherExpenses: {
    amount: number;
    frequency: PaymentFrequency;
  };
}

export interface PropertyMonthlyExpenses {
  principalInterest: number;
  propertyTaxes: number;
  homeownersInsurance: number;
  hoaDues: number;
  otherExpenses: number;
  total: number;
}

export interface Property {
  details: PropertyDetails;
  expenses: PropertyExpenses;
  monthlyExpenses?: PropertyMonthlyExpenses;
}

export type SortOption = "address" | "expense-high" | "expense-low";
