import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyType, PropertyStatus, OccupancyStatus, PropertyDetails, PropertyAddress } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PropertyDetailsFormProps {
  onSubmit: (details: PropertyDetails) => void;
  initialData: PropertyDetails | null;
  isEditing: boolean;
}

const DEFAULT_PROPERTY_DETAILS: PropertyDetails = {
  id: "",
  propertyType: "Detached SFR",
  address: {
    street: "",
    city: "",
    state: "AZ",
    zip: ""
  },
  propertyStatus: "Primary Residence",
  occupancyStatus: "Owner"
};

const PropertyDetailsForm = ({ 
  onSubmit, 
  initialData, 
  isEditing 
}: PropertyDetailsFormProps) => {
  const [details, setDetails] = useState<PropertyDetails>(initialData || DEFAULT_PROPERTY_DETAILS);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setDetails(initialData);
    }
  }, [initialData]);

  const propertyTypes: PropertyType[] = [
    "Detached SFR",
    "PUD-Detached",
    "Condo",
    "Attached PUD",
    "Manufactured",
    "Multi Unit"
  ];

  const handlePropertyTypeSelect = (type: PropertyType) => {
    setDetails(prev => ({
      ...prev,
      propertyType: type
    }));
  };

  const handleAddressChange = (field: keyof PropertyAddress, value: string) => {
    setDetails(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
    
    // Clear error when user types
    if (errors[`address.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`address.${field}`]: ""
      }));
    }
  };

  const handlePropertyStatusChange = (value: PropertyStatus) => {
    setDetails(prev => ({
      ...prev,
      propertyStatus: value
    }));
  };

  const handleOccupancyStatusChange = (value: OccupancyStatus) => {
    setDetails(prev => ({
      ...prev,
      occupancyStatus: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!details.address.street.trim()) {
      newErrors["address.street"] = "Street address is required";
    }
    
    if (!details.address.city.trim()) {
      newErrors["address.city"] = "City is required";
    }
    
    if (!details.address.zip.trim()) {
      newErrors["address.zip"] = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(details.address.zip)) {
      newErrors["address.zip"] = "Please enter a valid ZIP code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(details);
    }
  };

  const handleSaveDraft = () => {
    // Just call onSubmit - the parent component will handle saving
    onSubmit(details);
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-bold mb-4">Property Details</h2>
          
          {/* Property Type Selection */}
          <div className="mb-6">
            <Label className="block text-sm font-medium mb-2">Property Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
              {propertyTypes.map((type) => (
                <Button
                  key={type}
                  type="button"
                  onClick={() => handlePropertyTypeSelect(type)}
                  className={cn(
                    "property-type-button",
                    details.propertyType === type && "active"
                  )}
                  variant="ghost"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Property Address */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3">Property Address</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="street" className="block text-sm font-medium mb-1">
                  Street Address
                </Label>
                <Input
                  id="street"
                  value={details.address.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  placeholder="123 Main St"
                  className={errors["address.street"] ? "border-red-500" : ""}
                />
                {errors["address.street"] && (
                  <p className="text-red-500 text-sm mt-1">{errors["address.street"]}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="city" className="block text-sm font-medium mb-1">
                  City
                </Label>
                <Input
                  id="city"
                  value={details.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="Phoenix"
                  className={errors["address.city"] ? "border-red-500" : ""}
                />
                {errors["address.city"] && (
                  <p className="text-red-500 text-sm mt-1">{errors["address.city"]}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state" className="block text-sm font-medium mb-1">
                    State
                  </Label>
                  <Select
                    value={details.address.state}
                    onValueChange={(value) => handleAddressChange("state", value)}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AZ">Arizona (AZ)</SelectItem>
                      <SelectItem value="CA">California (CA)</SelectItem>
                      <SelectItem value="NV">Nevada (NV)</SelectItem>
                      <SelectItem value="UT">Utah (UT)</SelectItem>
                      <SelectItem value="CO">Colorado (CO)</SelectItem>
                      <SelectItem value="NM">New Mexico (NM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="zip" className="block text-sm font-medium mb-1">
                    ZIP Code
                  </Label>
                  <Input
                    id="zip"
                    value={details.address.zip}
                    onChange={(e) => handleAddressChange("zip", e.target.value)}
                    placeholder="85001"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={errors["address.zip"] ? "border-red-500" : ""}
                  />
                  {errors["address.zip"] && (
                    <p className="text-red-500 text-sm mt-1">{errors["address.zip"]}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Property Status and Occupancy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="block text-sm font-medium mb-2">Property Status</Label>
              <RadioGroup
                value={details.propertyStatus}
                onValueChange={(value) => handlePropertyStatusChange(value as PropertyStatus)}
                className="space-y-2"
              >
                <div className="flex items-center">
                  <RadioGroupItem 
                    id="primary-residence" 
                    value="Primary Residence" 
                    className="h-4 w-4 text-primary" 
                  />
                  <Label htmlFor="primary-residence" className="ml-2 cursor-pointer">
                    Primary Residence
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem 
                    id="second-home" 
                    value="Second Home" 
                    className="h-4 w-4 text-primary" 
                  />
                  <Label htmlFor="second-home" className="ml-2 cursor-pointer">
                    Second Home
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem 
                    id="investment" 
                    value="Investment" 
                    className="h-4 w-4 text-primary" 
                  />
                  <Label htmlFor="investment" className="ml-2 cursor-pointer">
                    Investment
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">Occupancy Status</Label>
              <RadioGroup
                value={details.occupancyStatus}
                onValueChange={(value) => handleOccupancyStatusChange(value as OccupancyStatus)}
                className="space-y-2"
              >
                <div className="flex items-center">
                  <RadioGroupItem 
                    id="vacant" 
                    value="Vacant" 
                    className="h-4 w-4 text-primary" 
                  />
                  <Label htmlFor="vacant" className="ml-2 cursor-pointer">
                    Vacant
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem 
                    id="owner" 
                    value="Owner" 
                    className="h-4 w-4 text-primary" 
                  />
                  <Label htmlFor="owner" className="ml-2 cursor-pointer">
                    Owner
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem 
                    id="tenant" 
                    value="Tenant" 
                    className="h-4 w-4 text-primary" 
                  />
                  <Label htmlFor="tenant" className="ml-2 cursor-pointer">
                    Tenant
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              type="button"
              onClick={handleSaveDraft}
              variant="outline"
              className="text-primary border-primary h-11"
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white h-11"
            >
              Next: Expenses
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyDetailsForm;
