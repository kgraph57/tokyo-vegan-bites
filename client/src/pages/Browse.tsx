import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, SlidersHorizontal } from "lucide-react";
import FilterMenu, { FilterState } from "@/components/FilterMenu";

export default function Browse() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    areas: [],
    cuisines: [],
    veganLevels: [],
    priceRanges: [],
  });

  const { data: restaurants, isLoading } = trpc.restaurants.list.useQuery();

  const filteredRestaurants = restaurants?.filter(restaurant => {
    // Area filter
    if (filters.areas.length > 0) {
      const matchesArea = filters.areas.some(area => 
        restaurant.address.includes(area)
      );
      if (!matchesArea) return false;
    }

    // Cuisine filter
    if (filters.cuisines.length > 0) {
      const cuisineTypes = JSON.parse(restaurant.cuisineTypes || "[]");
      const matchesCuisine = filters.cuisines.some(cuisine =>
        cuisineTypes.includes(cuisine)
      );
      if (!matchesCuisine) return false;
    }

    // Vegan level filter
    if (filters.veganLevels.length > 0) {
      if (restaurant.veganLevel && !filters.veganLevels.includes(restaurant.veganLevel)) return false;
    }

    // Price range filter
    if (filters.priceRanges.length > 0) {
      if (restaurant.priceRange && !filters.priceRanges.includes(restaurant.priceRange)) return false;
    }

    return true;
  });

  const activeFilterCount = Object.values(filters).reduce(
    (count, arr) => count + arr.length,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Browse Restaurants</h1>
              <p className="text-sm text-muted-foreground">
                {filteredRestaurants?.length || 0} restaurants found
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="relative"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="container py-6">
        {filteredRestaurants && filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map(restaurant => {
              const cuisineTypes = JSON.parse(restaurant.cuisineTypes || "[]");
              
              return (
                <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="relative h-48">
                      <img
                        src={`https://picsum.photos/seed/${restaurant.id}/400/300`}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          restaurant.veganLevel === '100% Vegan' 
                            ? 'badge-vegan' 
                            : restaurant.veganLevel === 'Vegan Options'
                            ? 'badge-vegetarian'
                            : 'badge-warning'
                        }`}>
                          {restaurant.veganLevel === '100% Vegan' && '🌱 '}
                          {restaurant.veganLevel}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
                      {restaurant.nameJa && (
                        <p className="text-sm text-muted-foreground mb-2">{restaurant.nameJa}</p>
                      )}
                      
                      <div className="flex gap-2 flex-wrap mb-3">
                        {cuisineTypes.slice(0, 2).map((cuisine: string) => (
                          <span key={cuisine} className="text-xs px-2 py-1 rounded-md bg-muted">
                            {cuisine}
                          </span>
                        ))}
                        <span className="text-xs px-2 py-1 rounded-md bg-muted font-medium">
                          {restaurant.priceRange}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{restaurant.address.split(',')[0]}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No restaurants found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Try adjusting your filters to see more results
            </p>
            <Button onClick={() => setFilters({
              areas: [],
              cuisines: [],
              veganLevels: [],
              priceRanges: [],
            })}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Filter Menu */}
      <FilterMenu
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={setFilters}
      />
    </div>
  );
}

