import { Home, Map, MessageCircle, Bookmark } from "lucide-react";
import { useLocation, Link } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Map, label: "Browse", path: "/browse" },
    { icon: MessageCircle, label: "AI Chat", path: "/explore" },
    { icon: Bookmark, label: "Saved", path: "/bookmarks" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-sm mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location === tab.path;
          
          return (
            <Link key={tab.path} href={tab.path}>
              <button
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-6 w-6 mb-1 ${isActive ? "fill-current" : ""}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

