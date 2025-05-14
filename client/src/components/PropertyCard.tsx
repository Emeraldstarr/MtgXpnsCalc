import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency, getOriginalAmountText } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (id: string) => void;
}

const PropertyCard = ({ property, onEdit, onDelete }: PropertyCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const { details, expenses, monthlyExpenses } = property;
  
  if (!monthlyExpenses) {
    return null;
  }
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const addressDisplay = `${details.address.street}, ${details.address.city}, ${details.address.state} ${details.address.zip}`;
  const propertyTypeAndStatus = `${details.propertyType} | ${details.propertyStatus}`;
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(property);
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(details.id);
    }
  };
  
  return (
    <div className="border border-border rounded-lg p-4 mb-4 bg-card">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold">{addressDisplay}</h3>
          <div className="text-sm text-muted-foreground">{propertyTypeAndStatus}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Monthly Expense</div>
          <div className="text-lg font-bold text-primary">
            {formatCurrency(monthlyExpenses.total)}
          </div>
        </div>
      </div>
      
      <Button
        type="button"
        variant="ghost"
        onClick={toggleExpanded}
        className="mt-3 p-0 h-auto text-sm font-medium text-secondary flex items-center"
      >
        {expanded ? <ChevronUp className="h-5 w-5 mr-1" /> : <ChevronDown className="h-5 w-5 mr-1" />}
        {expanded ? "Hide Details" : "View Details"}
      </Button>
      
      {expanded && (
        <>
          <div className="mt-4 pt-3 border-t border-border text-sm">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>Principal & Interest:</div>
              <div className="text-right font-medium">
                {formatCurrency(monthlyExpenses.principalInterest)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>Property Taxes:</div>
              <div className="text-right font-medium">
                {formatCurrency(monthlyExpenses.propertyTaxes)}
                <span className="text-xs text-muted-foreground">
                  {getOriginalAmountText(expenses.propertyTaxes, "Annual")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>Homeowners Insurance:</div>
              <div className="text-right font-medium">
                {formatCurrency(monthlyExpenses.homeownersInsurance)}
                <span className="text-xs text-muted-foreground">
                  {getOriginalAmountText(expenses.homeownersInsurance, "Annual")}
                </span>
              </div>
            </div>
            {expenses.hoaDues.amount > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>HOA Dues:</div>
                <div className="text-right font-medium">
                  {formatCurrency(monthlyExpenses.hoaDues)}
                  <span className="text-xs text-muted-foreground">
                    {getOriginalAmountText(expenses.hoaDues.amount, expenses.hoaDues.frequency)}
                  </span>
                </div>
              </div>
            )}
            {expenses.otherExpenses.amount > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <div>Other Expenses:</div>
                <div className="text-right font-medium">
                  {formatCurrency(monthlyExpenses.otherExpenses)}
                  <span className="text-xs text-muted-foreground">
                    {getOriginalAmountText(expenses.otherExpenses.amount, expenses.otherExpenses.frequency)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {(onEdit || onDelete) && (
            <div className="flex justify-end gap-2 mt-4">
              {onEdit && (
                <Button 
                  type="button" 
                  onClick={handleEdit}
                  variant="secondary"
                  className="text-foreground rounded-md px-3 py-1 text-sm h-auto"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button 
                  type="button" 
                  onClick={handleDelete}
                  variant="outline"
                  className="text-destructive border-destructive rounded-md px-3 py-1 text-sm h-auto"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyCard;
