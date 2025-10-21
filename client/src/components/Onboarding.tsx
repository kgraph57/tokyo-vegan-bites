import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface OnboardingProps {
  onComplete: (preferences: string[]) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const preferences = [
    {
      id: "vegan",
      title: "🌱 Vegan",
      description: "100% plant-based, no animal products",
      color: "bg-green-500",
    },
    {
      id: "vegetarian",
      title: "🥚 Vegetarian",
      description: "Eggs and dairy are OK",
      color: "bg-blue-500",
    },
    {
      id: "gluten-free",
      title: "🌾 Gluten-free",
      description: "No wheat, barley, or rye",
      color: "bg-amber-500",
    },
  ];

  const togglePreference = (id: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleComplete = () => {
    onComplete(selectedPreferences);
  };

  // Step 1: Cinematic Welcome with Tokyo Tower
  if (step === 1) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Background Image with Cinematic Effects */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-out"
          style={{
            backgroundImage: 'url(/images/tokyo-night.jpg)',
            backgroundPosition: 'center center',
            transform: 'scale(1.1)',
            animation: 'slowZoom 20s ease-out forwards'
          }}
        />
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-3xl space-y-8">
            {/* Animated Title */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-2 tracking-tight leading-tight">
                Welcome to
              </h1>
              <h2 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-tight bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Tokyo Vegan Bites
              </h2>
            </div>
            
            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-white/95 font-light leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              Discover the best vegan and vegetarian restaurants
              <br className="hidden md:block" />
              <span className="block mt-2">in the heart of Tokyo</span>
            </p>
            
            {/* CTA Button */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
              <Button 
                onClick={handleNext} 
                size="lg" 
                className="mt-12 px-16 py-8 text-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-2xl shadow-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-green-500/70"
              >
                Get Started
              </Button>
            </div>
            
            {/* Progress Indicators */}
            <div className="flex justify-center gap-3 mt-12 animate-in fade-in duration-1000 delay-1000">
              <div className="h-2 w-12 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
              <div className="h-2 w-12 rounded-full bg-white/30"></div>
              <div className="h-2 w-12 rounded-full bg-white/30"></div>
            </div>
          </div>
        </div>
        
        {/* Vignette Effect */}
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: 'inset 0 0 200px rgba(0,0,0,0.8)'
        }} />
      </div>
    );
  }

  // Step 2: Food Preferences
  if (step === 2) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary/20 via-background to-primary/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 space-y-6 animate-in fade-in duration-500">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              What are your dietary preferences?
            </h2>
            <p className="text-muted-foreground">
              Select all that apply (you can choose multiple)
            </p>
          </div>

          <div className="space-y-3">
            {preferences.map((pref) => (
              <Card
                key={pref.id}
                className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                  selectedPreferences.includes(pref.id)
                    ? "ring-2 ring-primary bg-primary/10"
                    : "hover:bg-accent"
                }`}
                onClick={() => togglePreference(pref.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPreferences.includes(pref.id)
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedPreferences.includes(pref.id) && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{pref.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleNext}
            size="lg"
            className="w-full"
            disabled={selectedPreferences.length === 0}
          >
            Continue
          </Button>

          <div className="flex justify-center gap-2">
            <div className="h-2 w-8 rounded-full bg-muted"></div>
            <div className="h-2 w-8 rounded-full bg-primary"></div>
            <div className="h-2 w-8 rounded-full bg-muted"></div>
          </div>
        </Card>
      </div>
    );
  }

  // Step 3: All Set
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary/20 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6 animate-in fade-in duration-500">
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-3xl font-bold text-foreground">You're all set!</h2>
        <p className="text-muted-foreground text-lg">
          We'll show you restaurants that match your preferences:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedPreferences.map((pref) => {
            const preference = preferences.find((p) => p.id === pref);
            return (
              <span
                key={pref}
                className="px-4 py-2 bg-primary/20 text-primary rounded-full font-medium"
              >
                {preference?.title}
              </span>
            );
          })}
        </div>
        <Button onClick={handleComplete} size="lg" className="w-full">
          Start Exploring
        </Button>
        <div className="flex justify-center gap-2">
          <div className="h-2 w-8 rounded-full bg-muted"></div>
          <div className="h-2 w-8 rounded-full bg-muted"></div>
          <div className="h-2 w-8 rounded-full bg-primary"></div>
        </div>
      </Card>
    </div>
  );
}

