import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Explore from "./pages/Explore";
import Bookmarks from "./pages/Bookmarks";
import Browse from "./pages/Browse";
import Onboarding from "./components/Onboarding";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/browse"} component={Browse} />
      <Route path={"/explore"} component={Explore} />
      <Route path={"/restaurant/:id"} component={RestaurantDetail} />
      <Route path={"/bookmarks"} component={Bookmarks} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    const savedPreferences = localStorage.getItem('user_preferences');
    
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    } else if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleOnboardingComplete = (preferences: string[]) => {
    setUserPreferences(preferences);
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
    setShowOnboarding(false);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {showOnboarding ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : (
            <Router />
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

