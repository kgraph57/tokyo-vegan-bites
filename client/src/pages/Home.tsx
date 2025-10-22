import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Bookmark, MapPin, Star } from "lucide-react";
import { APP_TITLE } from "@/const";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const { data: restaurants, isLoading } = trpc.restaurants.list.useQuery();
  const { data: bookmarks } = trpc.bookmarks.list.useQuery();
  const bookmarkMutation = trpc.bookmarks.add.useMutation();
  const utils = trpc.useUtils();

  const handleBookmark = (restaurantId: string) => {
    const isAlreadyBookmarked = bookmarks?.some(b => b.bookmark.restaurantId === restaurantId);
    if (isAlreadyBookmarked) {
      return;
    }
    
    bookmarkMutation.mutate(
      { restaurantId },
      {
        onSuccess: () => {
          utils.bookmarks.list.invalidate();
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">No restaurants available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-primary">{APP_TITLE}</h1>
          <p className="text-sm text-muted-foreground">Discover vegan & vegetarian restaurants in Tokyo</p>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="container py-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => {
            const cuisineTypes = JSON.parse(restaurant.cuisineTypes || "[]");
            const isBookmarked = bookmarks?.some(b => b.bookmark.restaurantId === restaurant.id);

            return (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/restaurant/${restaurant.id}`}>
                  <div className="relative h-48 bg-muted">
                    <img
                      src={restaurant.heroImage || `https://picsum.photos/seed/${restaurant.id}/400/300`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          handleBookmark(restaurant.id);
                        }}
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        restaurant.veganLevel === '100% Vegan' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {restaurant.veganLevel}
                      </span>
                    </div>
                  </div>
                </Link>
                
                <CardContent className="p-4">
                  <Link href={`/restaurant/${restaurant.id}`}>
                    <h3 className="font-bold text-lg mb-1 hover:text-primary transition-colors">
                      {restaurant.name}
                    </h3>
                  </Link>
                  {restaurant.nameJa && (
                    <p className="text-sm text-muted-foreground mb-2">{restaurant.nameJa}</p>
                  )}
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{restaurant.address.split(',')[0]}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {cuisineTypes.slice(0, 3).map((cuisine: string, index: number) => (
                      <span key={index} className="px-2 py-0.5 bg-muted rounded-full text-xs">
                        {cuisine}
                      </span>
                    ))}
                    {restaurant.priceRange && (
                      <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                        {restaurant.priceRange}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {restaurant.description}
                  </p>

                  <Link href={`/restaurant/${restaurant.id}`}>
                    <Button className="w-full" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

