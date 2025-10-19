import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface ImageUploaderProps {
  onAnalyze: (image: File) => void;
  isAnalyzing: boolean;
}

export function ImageUploader({ onAnalyze, isAnalyzing }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  return (
    <div className="px-6 max-w-3xl mx-auto">
      {preview ? (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={preview} 
              alt="Meal preview" 
              className="w-full h-96 object-cover"
            />
            <button
              onClick={handleClear}
              disabled={isAnalyzing}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-lg disabled:opacity-50 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Analyzing your deliciousness...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-2" />
                Let's Analyze This Deliciousness!
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 mb-4 shadow-lg">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h3 className="mb-2 text-2xl">Ready to eat smart?</h3>
            <p className="text-muted-foreground text-lg">
              Snap a pic of your meal and discover what's really on your plate
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all text-lg py-6"
              size="lg"
            >
              <Camera className="w-6 h-6 mr-3" />
              Take Photo Now
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full border-2 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-lg py-6"
              size="lg"
            >
              <Upload className="w-6 h-6 mr-3" />
              Upload from Gallery
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
