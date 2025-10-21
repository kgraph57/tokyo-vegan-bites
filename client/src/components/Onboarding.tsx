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

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary/20 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">
                Welcome to
              </h1>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                Tokyo Vegan Bites
              </h2>
            </div>
            
            <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-400 to-primary">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-8xl mb-4">🌱</div>
                  <p className="text-2xl font-bold">Vegan & Delicious</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground">
              Discover the best vegan and vegetarian restaurants in Tokyo
            </p>

            <Button
              size="lg"
              className="w-full text-lg font-semibold"
              onClick={handleNext}
            >
              Get Started
            </Button>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                What are your dietary preferences?
              </h2>
              <p className="text-muted-foreground">
                Select all that apply (you can change this later)
              </p>
            </div>

            <div className="space-y-3">
              {preferences.map((pref) => {
                const isSelected = selectedPreferences.includes(pref.id);
                return (
                  <Card
                    key={pref.id}
                    className={`p-4 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "ring-2 ring-primary shadow-lg scale-105"
                        : "hover:shadow-md hover:scale-102"
                    }`}
                    onClick={() => togglePreference(pref.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {isSelected && <Check className="h-4 w-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{pref.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {pref.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleNext}
                disabled={selectedPreferences.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Ready */}
        {step === 3 && (
          <div className="text-center space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-foreground">
                You're all set!
              </h2>
              <p className="text-muted-foreground">
                We'll show you restaurants that match your preferences
              </p>
            </div>

            <Card className="p-4 bg-primary/5">
              <h3 className="font-semibold mb-2">Your preferences:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPreferences.map((prefId) => {
                  const pref = preferences.find((p) => p.id === prefId);
                  return (
                    <span
                      key={prefId}
                      className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium"
                    >
                      {pref?.title}
                    </span>
                  );
                })}
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full text-lg font-semibold"
                onClick={handleComplete}
              >
                Start Exploring
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(2)}
              >
                Change preferences
              </Button>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? "w-8 bg-primary"
                  : s < step
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

