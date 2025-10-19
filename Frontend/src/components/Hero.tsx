import { Sparkles, Zap, Target } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <div className="text-center px-6 pt-8 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1638328740227-1c4b1627614d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGhlYWx0aHklMjBmb29kJTIwbWVhbHN8ZW58MXx8fHwxNzYwODgxMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Colorful healthy meals"
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-white mb-2 text-4xl md:text-5xl">Hill Calories AI</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              Snap, analyze, conquer your nutrition goals 🎯
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground">AI-Powered</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-3 shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Instant Results</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 shrink-0">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Track Your Goals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
