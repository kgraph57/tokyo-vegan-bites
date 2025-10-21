import { useState } from "react";
import { Link } from "wouter";
import { useSwipeable } from "react-swipeable";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Share2, MapPin, ChevronUp, ChevronDown } from "lucide-react";
import { APP_TITLE } from "@/const";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: videos, isLoading } = trpc.videos.list.useQuery();
  const bookmarkMutation = trpc.bookmarks.add.useMutation();

  const handleScroll = (direction: "up" | "down") => {
    if (!videos) return;
    
    if (direction === "down" && currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "up" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => handleScroll("down"),
    onSwipedDown: () => handleScroll("up"),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleBookmark = (restaurantId: string) => {
    bookmarkMutation.mutate({ restaurantId });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">No videos available</p>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];
  const restaurant = currentVideo.restaurant;
  
  if (!restaurant) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Restaurant data not available</p>
      </div>
    );
  }

  return (
    <div {...swipeHandlers} className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video/Image Background */}
      <div className="absolute inset-0">
        <img
          src={currentVideo.thumbnail || `https://picsum.photos/seed/${currentVideo.id}/400/800`}
          alt={currentVideo.title || restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">{APP_TITLE}</h1>
        <div className="flex gap-2">
          <Link href="/explore">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Side Actions (TikTok-style) */}
      <div className="absolute right-4 bottom-32 z-30 flex flex-col gap-6">
        {/* Like Button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            <Heart className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1 font-medium">
            {currentVideo.viewCount ? Math.floor(currentVideo.viewCount / 100) : 0}
          </span>
        </div>

        {/* Bookmark Button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            onClick={() => handleBookmark(restaurant.id)}
          >
            <Bookmark className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1 font-medium">Save</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            onClick={() => {
              const url = `${window.location.origin}/restaurant/${restaurant.id}`;
              const text = `Check out ${restaurant.name} on Tokyo Vegan Bites!`;
              if (navigator.share) {
                navigator.share({ title: restaurant.name, text, url });
              } else {
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
              }
            }}
          >
            <Share2 className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1 font-medium">Share</span>
        </div>
      </div>

      {/* Bottom Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-24">
        <div className="space-y-3">
          {/* Restaurant Name */}
          <div>
            <h2 className="text-white font-bold text-2xl mb-1">{restaurant.name}</h2>
            {restaurant.nameJa && (
              <p className="text-white/80 text-sm">{restaurant.nameJa}</p>
            )}
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              restaurant.veganLevel === '100% Vegan' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-white/20 backdrop-blur-sm text-white'
            }`}>
              {restaurant.veganLevel === '100% Vegan' && '🌱 '}
              {restaurant.veganLevel}
            </span>
            {JSON.parse(restaurant.cuisineTypes || "[]").slice(0, 2).map((cuisine: string) => (
              <span key={cuisine} className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white">
                {cuisine}
              </span>
            ))}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white">
              {restaurant.priceRange}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{restaurant.address.split(',')[0]}</span>
          </div>

          {/* Video Title */}
          {currentVideo.title && (
            <p className="text-white/90 text-sm line-clamp-2">{currentVideo.title}</p>
          )}

          {/* View Details Button */}
          <Link href={`/restaurant/${restaurant.id}`}>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              View Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Hints */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4">
        {currentIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
            onClick={() => handleScroll("up")}
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        )}
        {currentIndex < videos.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
            onClick={() => handleScroll("down")}
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-20 right-4 z-20 text-white/60 text-xs font-medium">
        {currentIndex + 1} / {videos.length}
      </div>

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-around py-3 px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white hover:text-primary">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          
          <Link href="/browse">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white/60 hover:text-primary">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-xs">Browse</span>
            </Button>
          </Link>

          <Link href="/explore">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white/60 hover:text-primary">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-xs">AI Chat</span>
            </Button>
          </Link>

          <Link href="/bookmarks">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white/60 hover:text-primary">
              <Bookmark className="h-6 w-6" />
              <span className="text-xs">Saved</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Swipe Hint (shown on first load) */}
      {currentIndex === 0 && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="text-white/60 text-sm font-medium flex items-center gap-2">
            <ChevronUp className="h-4 w-4" />
            Swipe up to discover more
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
}

