import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, Phone, Globe, Instagram, Heart, ExternalLink } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function RestaurantDetail() {
  const [, params] = useRoute("/restaurant/:id");
  const restaurantId = params?.id || "";
  
  const { user } = useAuth();
  const { data: restaurant, isLoading } = trpc.restaurants.getById.useQuery({ id: restaurantId });
  const { data: videos } = trpc.videos.getByRestaurantId.useQuery({ restaurantId });
  const { data: reviews } = trpc.reviews.getByRestaurantId.useQuery({ restaurantId });
  const { data: menuItems } = trpc.menuItems.getByRestaurantId.useQuery({ restaurantId });
  const { data: isBookmarked } = trpc.bookmarks.check.useQuery(
    { restaurantId },
    { enabled: !!user }
  );

  const utils = trpc.useUtils();
  const addBookmark = trpc.bookmarks.add.useMutation({
    onSuccess: () => {
      utils.bookmarks.check.invalidate();
      utils.bookmarks.list.invalidate();
      toast.success("Added to bookmarks!");
    },
  });

  const removeBookmark = trpc.bookmarks.remove.useMutation({
    onSuccess: () => {
      utils.bookmarks.check.invalidate();
      utils.bookmarks.list.invalidate();
      toast.success("Removed from bookmarks");
    },
  });

  const handleBookmarkToggle = () => {
    if (!user) {
      toast.error("Please log in to bookmark restaurants");
      return;
    }
    
    if (isBookmarked) {
      removeBookmark.mutate({ restaurantId });
    } else {
      addBookmark.mutate({ restaurantId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Restaurant not found</h2>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cuisineTypes = JSON.parse(restaurant.cuisineTypes || "[]");
  const features = JSON.parse(restaurant.features || "[]");

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Image */}
      <div className="relative h-64 bg-gradient-to-b from-black/20 to-black/60">
        <img
          src={restaurant.heroImage || `https://picsum.photos/seed/${restaurant.id}/800/400`}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="bg-black/30 backdrop-blur-sm hover:bg-black/50">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
          </Link>
        </div>

        {/* Bookmark Button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 backdrop-blur-sm hover:bg-black/50"
            onClick={handleBookmarkToggle}
          >
            <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6 space-y-6">
        {/* Restaurant Info */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold mb-1">{restaurant.name}</h1>
              {restaurant.nameJa && (
                <p className="text-lg text-muted-foreground">{restaurant.nameJa}</p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
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

          {/* Cuisine Types & Price */}
          <div className="flex gap-2 flex-wrap mb-4">
            {cuisineTypes.map((cuisine: string) => (
              <span key={cuisine} className="px-3 py-1 rounded-md text-sm bg-muted">
                {cuisine}
              </span>
            ))}
            <span className="px-3 py-1 rounded-md text-sm bg-muted font-medium">
              {restaurant.priceRange}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-4">{restaurant.description}</p>
          {restaurant.descriptionJa && (
            <p className="text-sm text-muted-foreground">{restaurant.descriptionJa}</p>
          )}
        </div>

        {/* Features */}
        {features.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Features</h3>
            <div className="flex gap-2 flex-wrap">
              {features.map((feature: string) => (
                <span key={feature} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                  ✓ {feature}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Contact Info */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold mb-3">Information</h3>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm">{restaurant.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
              >
                Open in Google Maps <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {restaurant.hours && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm">{restaurant.hours}</p>
            </div>
          )}

          {restaurant.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <a href={`tel:${restaurant.phone}`} className="text-sm text-primary hover:underline">
                {restaurant.phone}
              </a>
            </div>
          )}

          {restaurant.website && (
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                Visit Website
              </a>
            </div>
          )}

          {restaurant.instagram && (
            <div className="flex items-center gap-3">
              <Instagram className="h-5 w-5 text-muted-foreground" />
              <a href={`https://instagram.com/${restaurant.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                {restaurant.instagram}
              </a>
            </div>
          )}
        </Card>

        {/* Menu */}
        {menuItems && menuItems.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-lg">Menu</h3>
            <div className="space-y-3">
              {menuItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.nameJa && (
                            <p className="text-sm text-muted-foreground">{item.nameJa}</p>
                          )}
                        </div>
                        {item.price && (
                          <span className="font-semibold text-primary">¥{item.price.toLocaleString()}</span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.category && (
                          <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">
                            {item.category}
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-700 dark:text-green-400 rounded text-xs">
                            🌱 Vegan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {videos && videos.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Videos</h3>
            <div className="grid grid-cols-2 gap-3">
              {videos.map((video) => (
                <div key={video.id} className="relative aspect-[9/16] rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnail || `https://picsum.photos/seed/${video.id}/400/600`}
                    alt={video.title || restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Reviews</h3>
            <div className="space-y-3">
              {reviews.map((review) => (
                <Card key={review.review.id} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {review.user?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{review.user?.name || 'Anonymous'}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.review.rating ? 'text-yellow-500' : 'text-muted'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.review.comment && (
                    <p className="text-sm text-muted-foreground">{review.review.comment}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

