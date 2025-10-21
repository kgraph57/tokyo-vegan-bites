import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Sparkles, MapPin } from "lucide-react";
import { Link } from "wouter";
import BottomNav from "@/components/BottomNav";

export default function Explore() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string, restaurants?: any[] }>>([]);
  
  const searchMutation = trpc.ai.search.useMutation({
    onSuccess: (data) => {
      setChatHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
          restaurants: data.restaurants,
        }
      ]);
    },
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: query }]);
    searchMutation.mutate({ query });
    setQuery("");
  };

  const quickSearches = [
    "I want vegan ramen in Shibuya",
    "Show me 100% vegan restaurants",
    "Where can I find gluten-free options?",
    "Best vegan burger in Tokyo",
  ];

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
            <h1 className="text-xl font-bold">AI Search</h1>
            <p className="text-sm text-muted-foreground">Ask me anything about vegan food in Tokyo</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="container py-6 space-y-4 pb-32">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">AI-Powered Search</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Ask me anything about vegan and vegetarian restaurants in Tokyo. I'll help you find the perfect place!
            </p>
            
            {/* Quick Search Buttons */}
            <div className="space-y-2 w-full max-w-md">
              <p className="text-sm font-medium text-left mb-2">Try asking:</p>
              {quickSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setQuery(search);
                    setChatHistory([{ role: 'user', content: search }]);
                    searchMutation.mutate({ query: search });
                  }}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-2xl px-4 py-3`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Restaurant Cards */}
                  {message.restaurants && message.restaurants.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {message.restaurants.map((restaurant: any) => (
                        <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-start gap-3">
                              <img
                                src={`https://picsum.photos/seed/${restaurant.id}/80/80`}
                                alt={restaurant.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm mb-1">{restaurant.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    restaurant.veganLevel === '100% Vegan' 
                                      ? 'badge-vegan' 
                                      : 'badge-vegetarian'
                                  }`}>
                                    {restaurant.veganLevel}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{restaurant.priceRange}</span>
                                </div>
                                {restaurant.reason && (
                                  <p className="text-xs text-muted-foreground">{restaurant.reason}</p>
                                )}
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{restaurant.address.split(',')[0]}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {searchMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t p-4">
        <div className="container flex gap-2">
          <Input
            placeholder="Ask about vegan restaurants..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={!query.trim() || searchMutation.isPending}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

