import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency, getOriginalAmountText } from "@/lib/utils";

interface PropertyResultsViewProps {
  property: Property;
  onAddAnotherProperty: () => void;
  onGoToSummary: () => void;
}

const PropertyResultsView = ({
  property,
  onAddAnotherProperty,
  onGoToSummary
}: PropertyResultsViewProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { details, expenses, monthlyExpenses } = property;
  
  if (!monthlyExpenses) {
    return <div>Error: Missing monthly expense calculations</div>;
  }
  
  const toggleBreakdown = () => {
    setShowBreakdown(!showBreakdown);
  };

  const addressDisplay = `${details.address.street}, ${details.address.city}, ${details.address.state} ${details.address.zip}`;
  
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-lg font-bold mb-4">Property Expense Results</h2>
          
        {/* Property Summary Card */}
        <div className="border border-[#E2E8F0] rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-base">{addressDisplay}</h3>
            <span className="text-sm bg-[#F8F8F8] px-2 py-1 rounded">
              {details.propertyType}
            </span>
          </div>
            
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Total Monthly Expense</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(monthlyExpenses.total)}
            </div>
          </div>
            
          <div className="mb-4">
            <Button
              type="button"
              variant="ghost"
              onClick={toggleBreakdown}
              className="p-0 h-auto text-sm font-medium text-secondary flex items-center"
            >
              {showBreakdown ? <ChevronUp className="h-5 w-5 mr-1" /> : <ChevronDown className="h-5 w-5 mr-1" />}
              {showBreakdown ? "Hide Expense Breakdown" : "View Expense Breakdown"}
            </Button>
          </div>
            
          {showBreakdown && (
            <div className="expense-breakdown border-t border-[#E2E8F0] pt-3 text-sm">
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
                  <span className="text-xs text-gray-500">
                    {getOriginalAmountText(expenses.propertyTaxes, "Annual")}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>Homeowners Insurance:</div>
                <div className="text-right font-medium">
                  {formatCurrency(monthlyExpenses.homeownersInsurance)}
                  <span className="text-xs text-gray-500">
                    {getOriginalAmountText(expenses.homeownersInsurance, "Annual")}
                  </span>
                </div>
              </div>
              {expenses.hoaDues.amount > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>HOA Dues:</div>
                  <div className="text-right font-medium">
                    {formatCurrency(monthlyExpenses.hoaDues)}
                    <span className="text-xs text-gray-500">
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
                    <span className="text-xs text-gray-500">
                      {getOriginalAmountText(expenses.otherExpenses.amount, expenses.otherExpenses.frequency)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
          
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            onClick={onAddAnotherProperty}
            className="bg-primary text-white h-11"
          >
            Add Another Property
          </Button>
          <Button
            type="button"
            onClick={onGoToSummary}
            variant="outline"
            className="text-primary border-primary h-11"
          >
            Go to Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyResultsView;
