import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Search, Bookmark, Menu } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";

export default function Home() {
  const { data: videos, isLoading } = trpc.videos.list.useQuery();
  const { data: restaurants } = trpc.restaurants.list.useQuery();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Create a map of restaurant data
  const restaurantMap = new Map(restaurants?.map(r => [r.id, r]));

  // Handle scroll snap
  useEffect(() => {
    const handleScroll = () => {
      const videoCards = document.querySelectorAll('.video-card');
      const scrollPosition = window.scrollY;
      
      videoCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          setCurrentVideoIndex(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading delicious vegan food...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-primary">{APP_TITLE}</h1>
          <div className="flex gap-2">
            <Link href="/explore">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/bookmarks">
              <Button variant="ghost" size="icon">
                <Bookmark className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Feed */}
      <div className="video-feed">
        {videos?.map((video, index) => {
          const restaurant = restaurantMap.get(video.restaurantId);
          if (!restaurant) return null;

          return (
            <div key={video.id} className="video-card">
              {/* Video/Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60">
                <img
                  src={video.thumbnail || 'https://picsum.photos/seed/' + video.id + '/400/600'}
                  alt={video.title || restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                {/* Restaurant Info */}
                <div className="space-y-3 animate-fade-in">
                  {/* Vegan Level Badge */}
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      restaurant.veganLevel === '100% Vegan' 
                        ? 'bg-primary text-white' 
                        : restaurant.veganLevel === 'Vegan Options'
                        ? 'bg-secondary text-white'
                        : 'bg-accent text-white'
                    }`}>
                      {restaurant.veganLevel === '100% Vegan' && '🌱 '}
                      {restaurant.veganLevel}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                      {restaurant.priceRange}
                    </span>
                  </div>

                  {/* Restaurant Name */}
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{restaurant.name}</h2>
                    {restaurant.nameJa && (
                      <p className="text-sm text-white/80">{restaurant.nameJa}</p>
                    )}
                  </div>

                  {/* Cuisine Types */}
                  <div className="flex gap-2 flex-wrap">
                    {JSON.parse(restaurant.cuisineTypes || '[]').map((cuisine: string) => (
                      <span key={cuisine} className="px-2 py-1 rounded-md text-xs bg-white/10 backdrop-blur-sm">
                        {cuisine}
                      </span>
                    ))}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{restaurant.address.split(',')[0]}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Link href={`/restaurant/${restaurant.id}`} className="flex-1">
                      <Button className="w-full" variant="default">
                        View Details
                      </Button>
                    </Link>
                    <Button size="icon" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Video indicator */}
              <div className="absolute top-20 right-4 flex flex-col gap-2">
                <div className="text-white text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                  {index + 1} / {videos.length}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom hint for first video */}
      {currentVideoIndex === 0 && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 animate-bounce">
          <div className="text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            Swipe up to discover more ↑
          </div>
        </div>
      )}
    </div>
  );
}

