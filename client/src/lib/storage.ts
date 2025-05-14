import { Property } from "./types";

const STORAGE_KEY = "property_expense_calculator_data";

export const saveProperties = (properties: Property[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  } catch (error) {
    console.error("Failed to save properties to localStorage:", error);
  }
};

export const loadProperties = (): Property[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Property[];
  } catch (error) {
    console.error("Failed to load properties from localStorage:", error);
    return [];
  }
};

export const saveProperty = (property: Property): void => {
  const properties = loadProperties();
  const existingIndex = properties.findIndex(p => p.details.id === property.details.id);
  
  if (existingIndex !== -1) {
    properties[existingIndex] = property;
  } else {
    properties.push(property);
  }
  
  saveProperties(properties);
};

export const deleteProperty = (id: string): void => {
  const properties = loadProperties();
  const updatedProperties = properties.filter(p => p.details.id !== id);
  saveProperties(updatedProperties);
};

export const clearAllProperties = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
