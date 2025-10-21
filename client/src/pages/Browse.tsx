import { useState, useMemo } from "react";
import { Link } from "wouter";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FilterMenu from "@/components/FilterMenu";
import { Home, MessageSquare, Bookmark, Map as MapIcon, Grid3x3 } from "lucide-react";

// Custom marker icon
const veganIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Browse() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const [filters, setFilters] = useState({
    areas: [] as string[],
    cuisines: [] as string[],
    veganLevels: [] as string[],
    priceRanges: [] as string[],
  });

  const { data: restaurants, isLoading } = trpc.restaurants.list.useQuery();

  // Filter restaurants based on selected filters
  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];

    return restaurants.filter((restaurant) => {
      // Area filter
      if (filters.areas.length > 0) {
        const matchesArea = filters.areas.some((area) =>
          restaurant.address.toLowerCase().includes(area.toLowerCase())
        );
        if (!matchesArea) return false;
      }

      // Cuisine filter
      if (filters.cuisines.length > 0) {
        const cuisineTypes = JSON.parse(restaurant.cuisineTypes || "[]");
        const matchesCuisine = filters.cuisines.some((cuisine) =>
          cuisineTypes.includes(cuisine)
        );
        if (!matchesCuisine) return false;
      }

      // Vegan level filter
      if (filters.veganLevels.length > 0 && !filters.veganLevels.includes(restaurant.veganLevel)) {
        return false;
      }

      // Price range filter
      if (filters.priceRanges.length > 0 && restaurant.priceRange && !filters.priceRanges.includes(restaurant.priceRange)) {
        return false;
      }

      return true;
    });
  }, [restaurants, filters]);

  // Calculate map center (Tokyo center)
  const mapCenter: [number, number] = [35.6762, 139.6503];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-foreground">Browse Restaurants</h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <MapIcon className="h-4 w-4 mr-1" />
              Map
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              Filters {(filters.areas.length + filters.cuisines.length + filters.veganLevels.length + filters.priceRanges.length) > 0 && `(${filters.areas.length + filters.cuisines.length + filters.veganLevels.length + filters.priceRanges.length})`}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Menu */}
      <FilterMenu
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onFilterChange={setFilters}
      />

      {/* Main Content */}
      <div className="pt-16 h-full pb-20">
        {viewMode === "map" ? (
          <MapContainer
            center={mapCenter}
            zoom={12}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredRestaurants.map((restaurant) => {
              const lat = parseFloat(restaurant.lat);
              const lng = parseFloat(restaurant.lng);
              
              if (isNaN(lat) || isNaN(lng)) return null;

              return (
                <Marker
                  key={restaurant.id}
                  position={[lat, lng]}
                  icon={veganIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-base mb-1">{restaurant.name}</h3>
                      {restaurant.nameJa && (
                        <p className="text-sm text-muted-foreground mb-2">{restaurant.nameJa}</p>
                      )}
                      <div className="flex gap-1 mb-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          restaurant.veganLevel === '100% Vegan' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {restaurant.veganLevel}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          {restaurant.priceRange}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{restaurant.description}</p>
                      <Link href={`/restaurant/${restaurant.id}`}>
                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRestaurants.map((restaurant) => {
                const cuisineTypes = JSON.parse(restaurant.cuisineTypes || "[]");
                
                return (
                  <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                        {restaurant.nameJa && (
                          <p className="text-sm text-muted-foreground mb-2">{restaurant.nameJa}</p>
                        )}
                        <div className="flex gap-1 mb-3 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            restaurant.veganLevel === '100% Vegan' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}>
                            {restaurant.veganLevel}
                          </span>
                          {cuisineTypes.slice(0, 2).map((cuisine: string) => (
                            <span key={cuisine} className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              {cuisine}
                            </span>
                          ))}
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            {restaurant.priceRange}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {restaurant.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          📍 {restaurant.address.split(',')[0]}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No restaurants match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-border">
        <div className="flex items-center justify-around py-3 px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Home className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          
          <Link href="/browse">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-primary">
              <MapIcon className="h-6 w-6" />
              <span className="text-xs">Browse</span>
            </Button>
          </Link>

          <Link href="/explore">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <MessageSquare className="h-6 w-6" />
              <span className="text-xs">AI Chat</span>
            </Button>
          </Link>

          <Link href="/bookmarks">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Bookmark className="h-6 w-6" />
              <span className="text-xs">Saved</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

