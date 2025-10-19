import React, { useState } from "react";
import { Hero } from "./components/Hero";
import { ImageUploader } from "./components/ImageUploader";
import { NutritionResults, NutritionData } from "./components/NutritionResults";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

async function analyzeImage(file: File): Promise<NutritionData> {
  const formData = new FormData();
  // Many webhooks expect the field name to be "image"; include both for compatibility
  formData.append("image", file, file.name);
  formData.append("file", file, file.name);

  console.log("Sending request to webhook with file:", file.name, "size:", file.size);

  try {
    const WEBHOOK_URL = (import.meta as any).env?.VITE_WEBHOOK_URL as string | undefined;
    if (!WEBHOOK_URL) {
      throw new Error("Missing VITE_WEBHOOK_URL. Set it in a .env file (not committed).");
    }

    const response = await fetch(
      WEBHOOK_URL,
      {
        method: "POST",
        body: formData,
        // Add mode to help with CORS debugging
        mode: "cors"
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    console.log("Received response:", json);

    // Accept either an array response or a direct object with output
    const root = Array.isArray(json) ? (json[0] ?? {}) : json ?? {};
    const output = root.output ?? root; // support when output is the root
    const foodItems = Array.isArray(output?.food) ? output.food : [];
    let totals = output?.total ?? {} as any;

    // If totals are missing but items exist, derive totals from the items
    if ((!totals || Object.keys(totals).length === 0) && foodItems.length > 0) {
      totals = foodItems.reduce(
        (acc: any, f: any) => {
          acc.calories += Number(f.calories) || 0;
          acc.protein += Number(f.protein) || 0;
          acc.carbs += Number(f.carbs) || 0;
          acc.fat += Number(f.fat) || 0;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
    }

    const mealName = foodItems && foodItems.length > 0
      ? `Meal: ${foodItems.slice(0, 2).map((f: any) => f.name).join(", ")}${foodItems.length > 2 ? ", ..." : ""}`
      : "Meal Analysis";

    const result: NutritionData = {
      mealName,
      calories: Number(totals.calories) || 0,
      protein: Number(totals.protein) || 0,
      carbs: Number(totals.carbs) || 0,
      fat: Number(totals.fat) || 0,
      items: foodItems?.map((f: any) => ({
        name: f.name,
        quantity: f.quantity,
        calories: Number(f.calories) || 0,
        protein: Number(f.protein) || 0,
        carbs: Number(f.carbs) || 0,
        fat: Number(f.fat) || 0
      })) ?? []
    };

    return result;
  } catch (error) {
    console.error("Webhook request failed:", error);
    
    // Check if it's a CORS error
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error("CORS Error: The webhook doesn't allow requests from localhost. Please configure CORS headers on your n8n webhook to allow 'http://localhost:3000'");
    }
    
    throw error;
  }
}

export default function App() {
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(file);
      setNutritionData(result);
      toast.success("🎉 Boom! Your nutrition breakdown is ready!");
    } catch (error) {
      toast.error("Oops! Something went wrong. Try again?");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setNutritionData(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto pb-16">
        <Hero />
        
        <div className="mt-12">
          {nutritionData ? (
            <NutritionResults data={nutritionData} onReset={handleReset} />
          ) : (
            <ImageUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          )}
        </div>

        <footer className="mt-20 text-center px-6">
          <p className="text-muted-foreground">
            Powered by AI magic ✨ • Results are estimates, not medical advice
          </p>
        </footer>
      </div>
      
      <Toaster />
    </div>
  );
}
