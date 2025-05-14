import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileDown } from "lucide-react";
import { Property, SortOption } from "@/lib/types";
import PropertyCard from "@/components/PropertyCard";
import { formatCurrency } from "@/lib/utils";
import { calculateTotalMonthlyExpenses, sortProperties } from "@/lib/calculations";
import jsPDF from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

// Define the type to avoid TypeScript errors
type JsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => JsPDFWithAutoTable;
}

interface PropertySummaryProps {
  properties: Property[];
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onAddNewProperty: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
}

const PropertySummary = ({
  properties,
  sortOption,
  onSortChange,
  onAddNewProperty,
  onEditProperty,
  onDeleteProperty
}: PropertySummaryProps) => {
  const [sortedProperties, setSortedProperties] = useState<Property[]>([]);
  
  useEffect(() => {
    setSortedProperties(sortProperties(properties, sortOption));
  }, [properties, sortOption]);
  
  const totalProperties = properties.length;
  const totalMonthlyExpense = calculateTotalMonthlyExpenses(properties);
  
  const handleSortChange = (value: string) => {
    onSortChange(value as SortOption);
  };
  
  const exportToPDF = () => {
    // Create a new document
    const doc = new jsPDF() as JsPDFWithAutoTable;
    
    // Initialize autoTable
    autoTable(doc, {});
    
    // Add title
    doc.setFontSize(18);
    doc.text("Property Expense Summary", 14, 22);
    
    // Add summary info
    doc.setFontSize(12);
    doc.text(`Total Properties: ${totalProperties}`, 14, 32);
    doc.text(`Combined Monthly Expense: ${formatCurrency(totalMonthlyExpense)}`, 14, 40);
    
    // Add property table
    const tableData = sortedProperties.map(property => {
      const { details, monthlyExpenses } = property;
      const address = `${details.address.street}, ${details.address.city}, ${details.address.state} ${details.address.zip}`;
      return [
        address,
        details.propertyType,
        details.propertyStatus,
        formatCurrency(monthlyExpenses?.total || 0)
      ];
    });
    
    // Generate the first summary table
    autoTable(doc, {
      startY: 50,
      head: [['Property Address', 'Type', 'Status', 'Monthly Expense']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 103, 148], textColor: [255, 255, 255] },
      margin: { top: 30 }
    });
    
    // For each property, add detailed expense breakdown
    let yPosition = doc.previousAutoTable.finalY + 20;
    
    sortedProperties.forEach((property, index) => {
      const { details, expenses, monthlyExpenses } = property;
      
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      const address = `${details.address.street}, ${details.address.city}, ${details.address.state} ${details.address.zip}`;
      
      doc.setFont('helvetica', 'bold');
      doc.text(`Property #${index + 1}: ${address}`, 14, yPosition);
      yPosition += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Type: ${details.propertyType} | Status: ${details.propertyStatus}`, 14, yPosition);
      yPosition += 10;
      
      const expenseDetails = [
        ['Expense Type', 'Monthly Amount', 'Original Amount'],
        ['Principal & Interest', formatCurrency(monthlyExpenses?.principalInterest || 0), expenses.principalInterest === 0 ? 'None (Owned Free & Clear)' : 'Monthly'],
        ['Property Taxes', formatCurrency(monthlyExpenses?.propertyTaxes || 0), `${formatCurrency(expenses.propertyTaxes)} Annually`],
        ['Homeowners Insurance', formatCurrency(monthlyExpenses?.homeownersInsurance || 0), `${formatCurrency(expenses.homeownersInsurance)} Annually`],
      ];
      
      if (expenses.hoaDues.amount > 0) {
        expenseDetails.push([
          'HOA Dues', 
          formatCurrency(monthlyExpenses?.hoaDues || 0), 
          `${formatCurrency(expenses.hoaDues.amount)} ${expenses.hoaDues.frequency}`
        ]);
      }
      
      if (expenses.otherExpenses.amount > 0) {
        expenseDetails.push([
          'Other Expenses', 
          formatCurrency(monthlyExpenses?.otherExpenses || 0), 
          `${formatCurrency(expenses.otherExpenses.amount)} ${expenses.otherExpenses.frequency}`
        ]);
      }
      
      expenseDetails.push([
        'Total Monthly Expense', 
        formatCurrency(monthlyExpenses?.total || 0), 
        ''
      ]);
      
      // Generate detail table for each property
      autoTable(doc, {
        startY: yPosition,
        head: [expenseDetails[0]],
        body: expenseDetails.slice(1),
        theme: 'striped',
        margin: { left: 14 },
        tableWidth: 180
      });
      
      yPosition = doc.previousAutoTable.finalY + 20;
    });
    
    // Save the PDF
    doc.save("Property_Expense_Summary.pdf");
  };
  
  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Property Summary</h2>
            <div className="flex items-center">
              <Label htmlFor="sort-properties" className="text-sm mr-2">Sort by:</Label>
              <Select
                value={sortOption}
                onValueChange={handleSortChange}
              >
                <SelectTrigger id="sort-properties" className="text-sm py-1 w-auto">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="address">Address (A-Z)</SelectItem>
                  <SelectItem value="expense-high">Expense (High-Low)</SelectItem>
                  <SelectItem value="expense-low">Expense (Low-High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Total Summary Section */}
          <div className="bg-accent p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Properties</div>
                <div className="text-xl font-bold">{totalProperties}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Combined Monthly Expense</div>
                <div className="text-xl font-bold text-primary">
                  {formatCurrency(totalMonthlyExpense)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Property Cards */}
          {sortedProperties.length > 0 ? (
            sortedProperties.map((property) => (
              <PropertyCard
                key={property.details.id}
                property={property}
                onEdit={() => onEditProperty(property)}
                onDelete={(id) => onDeleteProperty(id)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No properties added yet. Click "Add New Property" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button
          onClick={onAddNewProperty}
          className="bg-primary text-white rounded-md px-6 py-3 font-medium w-full sm:w-auto"
        >
          Add New Property
        </Button>
        <Button
          onClick={exportToPDF}
          disabled={properties.length === 0}
          className="bg-secondary text-white rounded-md px-6 py-3 font-medium w-full sm:w-auto"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export Results (PDF)
        </Button>
      </div>
    </>
  );
};

export default PropertySummary;
