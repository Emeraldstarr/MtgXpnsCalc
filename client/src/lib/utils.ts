import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | undefined): string {
  if (value === undefined || isNaN(value)) return "$0.00";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCurrencyInput(value: string): string {
  // Remove any non-numeric characters except for the decimal point
  let cleaned = value.replace(/[^\d.]/g, "");
  
  // Only allow one decimal point
  const decimalPoints = (cleaned.match(/\./g) || []).length;
  if (decimalPoints > 1) {
    const parts = cleaned.split(".");
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }
  
  // Limit to 2 decimal places
  if (cleaned.includes(".")) {
    const parts = cleaned.split(".");
    cleaned = parts[0] + "." + parts[1].slice(0, 2);
  }
  
  return cleaned;
}

export function parseCurrencyValue(value: string): number {
  // Remove any non-numeric characters except for the decimal point
  const cleaned = value.replace(/[^\d.]/g, "");
  return parseFloat(cleaned) || 0;
}

export function getOriginalAmountText(amount: number, frequency: string): string {
  if (frequency === "Monthly") return "";
  
  return ` (${formatCurrency(amount)} ${frequency.toLowerCase()})`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
