import { useState } from "react";
import { X, MapPin, Utensils, Leaf, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  areas: string[];
  cuisines: string[];
  veganLevels: string[];
  priceRanges: string[];
  openNow: boolean;
}

const AREAS = [
  "Shibuya", "Shinjuku", "Omotesando", "Tokyo Station", 
  "Harajuku", "Roppongi", "Ginza", "Asakusa"
];

const CUISINES = [
  "Ramen", "Burger", "Cafe", "Japanese", 
  "Italian", "American", "Asian", "Dessert"
];

const VEGAN_LEVELS = [
  "100% Vegan",
  "Vegan Options",
  "Contains Fish Broth"
];

const PRICE_RANGES = ["¥", "¥¥", "¥¥¥"];

export default function FilterMenu({ isOpen, onClose, onFilterChange }: FilterMenuProps) {
  const [filters, setFilters] = useState<FilterState>({
    areas: [],
    cuisines: [],
    veganLevels: [],
    priceRanges: [],
    openNow: false,
  });

  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      const currentValues = newFilters[category];
      
      if (Array.isArray(currentValues)) {
        if (currentValues.includes(value)) {
          newFilters[category] = currentValues.filter(v => v !== value) as any;
        } else {
          newFilters[category] = [...currentValues, value] as any;
        }
      }
      
      return newFilters;
    });
  };

  const handleOpenNowChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, openNow: checked }));
  };

  const handleApply = () => {
    onFilterChange(filters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: FilterState = {
      areas: [],
      cuisines: [],
      veganLevels: [],
      priceRanges: [],
      openNow: false,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = filters.areas.length > 0 || filters.cuisines.length > 0 || filters.veganLevels.length > 0 || filters.priceRanges.length > 0 || filters.openNow;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg z-50 animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold">Filters</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Filters */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {/* Area Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Area</h3>
                </div>
                <div className="space-y-2">
                  {AREAS.map(area => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={`area-${area}`}
                        checked={filters.areas.includes(area)}
                        onCheckedChange={() => handleCheckboxChange('areas', area)}
                      />
                      <Label 
                        htmlFor={`area-${area}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cuisine Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Cuisine Type</h3>
                </div>
                <div className="space-y-2">
                  {CUISINES.map(cuisine => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cuisine-${cuisine}`}
                        checked={filters.cuisines.includes(cuisine)}
                        onCheckedChange={() => handleCheckboxChange('cuisines', cuisine)}
                      />
                      <Label 
                        htmlFor={`cuisine-${cuisine}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {cuisine}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vegan Level Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Vegan Level</h3>
                </div>
                <div className="space-y-2">
                  {VEGAN_LEVELS.map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`vegan-${level}`}
                        checked={filters.veganLevels.includes(level)}
                        onCheckedChange={() => handleCheckboxChange('veganLevels', level)}
                      />
                      <Label 
                        htmlFor={`vegan-${level}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Now Filter */}
              <div>
                <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
                  <Checkbox
                    id="open-now"
                    checked={filters.openNow}
                    onCheckedChange={handleOpenNowChange}
                  />
                  <Label 
                    htmlFor="open-now"
                    className="text-sm font-semibold cursor-pointer flex-1"
                  >
                    🕐 Open Now (11:00-22:00)
                  </Label>
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Price Range</h3>
                </div>
                <div className="space-y-2">
                  {PRICE_RANGES.map(price => (
                    <div key={price} className="flex items-center space-x-2">
                      <Checkbox
                        id={`price-${price}`}
                        checked={filters.priceRanges.includes(price)}
                        onCheckedChange={() => handleCheckboxChange('priceRanges', price)}
                      />
                      <Label 
                        htmlFor={`price-${price}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {price}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleClear}
              >
                Clear All
              </Button>
            )}
            <Button 
              className="w-full"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

