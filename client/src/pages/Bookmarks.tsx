import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

export default function Bookmarks() {
  const { user, loading } = useAuth();
  const { data: bookmarks, isLoading } = trpc.bookmarks.list.useQuery(undefined, {
    enabled: !!user,
  });
  const utils = trpc.useUtils();
  const removeBookmark = trpc.bookmarks.remove.useMutation({
    onSuccess: () => {
      utils.bookmarks.list.invalidate();
      toast.success("Removed from bookmarks");
    },
    onError: () => {
      toast.error("Failed to remove bookmark");
    },
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </Link>
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign in to view bookmarks</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Save your favorite vegan restaurants and access them anytime.
            </p>
            <a href={getLoginUrl()}>
              <Button>Sign In</Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container flex items-center gap-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">My Bookmarks</h1>
            <p className="text-sm text-muted-foreground">
              {bookmarks?.length || 0} saved restaurants
            </p>
          </div>
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="container py-6">
        {!bookmarks || bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start exploring and save your favorite vegan restaurants!
            </p>
            <Link href="/">
              <Button>Discover Restaurants</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookmarks.map((bookmark) => {
              const restaurant = bookmark.restaurant;
              if (!restaurant) return null;

              const cuisineTypes = JSON.parse(restaurant.cuisineTypes || "[]");

              return (
                <Card key={bookmark.bookmark.id} className="p-4 hover:shadow-lg transition-shadow relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeBookmark.mutate({ restaurantId: restaurant.id });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Link href={`/restaurant/${restaurant.id}`} className="block">
                    <div className="flex gap-4">
                      <img
                        src={`https://picsum.photos/seed/${restaurant.id}/120/120`}
                        alt={restaurant.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0 pr-8">
                        <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
                        {restaurant.nameJa && (
                          <p className="text-sm text-muted-foreground mb-2">{restaurant.nameJa}</p>
                        )}
                        
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            restaurant.veganLevel === '100% Vegan' 
                              ? 'badge-vegan' 
                              : restaurant.veganLevel === 'Vegan Options'
                              ? 'badge-vegetarian'
                              : 'badge-warning'
                          }`}>
                            {restaurant.veganLevel === '100% Vegan' && '🌱 '}
                            {restaurant.veganLevel}
                          </span>
                          <span className="text-xs text-muted-foreground">{restaurant.priceRange}</span>
                        </div>

                        <div className="flex gap-2 flex-wrap mb-2">
                          {cuisineTypes.slice(0, 3).map((cuisine: string) => (
                            <span key={cuisine} className="text-xs px-2 py-1 rounded-md bg-muted">
                              {cuisine}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{restaurant.address.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

