import React, { useState, useEffect } from 'react';
import { Send, Download, AlertCircle, Loader2, Share2, History, Sparkles, Palette, Wand2, Brain, Image as ImageIcon, Stars } from 'lucide-react';
import { useAuth } from '../contexts/LocalAuthContext';

interface ImageGenerationChatProps {
  onImageGenerated: (imageUrl: string) => void;
}

interface GenerationOptions {
  style: string;
  quality: string;
  outputCount: number;
}

const EXAMPLE_PROMPTS = [
  "A mystical forest at twilight with glowing mushrooms and fireflies",
  "A futuristic cityscape with flying cars and neon billboards",
  "A cozy coffee shop interior with warm lighting and vintage decorations",
  "An underwater scene with colorful coral reefs and tropical fish"
];

const STYLE_OPTIONS = [
  { id: 'realistic', label: 'Realistic' },
  { id: 'artistic', label: 'Artistic' },
  { id: 'anime', label: 'Anime' },
  { id: 'digital-art', label: 'Digital Art' }
];

const QUALITY_OPTIONS = [
  { id: 'standard', label: 'Standard' },
  { id: 'high', label: 'High Quality' }
];

const COST_PER_IMAGE = {
  standard: 0.02,  // $0.02 per standard quality image
  high: 0.04      // $0.04 per high quality image
};

const GENERATION_TIME = {
  standard: 15,    // 15 seconds for standard quality
  high: 25        // 25 seconds for high quality
};

const GENERATION_STAGES = [
  { icon: Brain, text: "Processing prompt...", duration: 2000 },
  { icon: Wand2, text: "Crafting composition...", duration: 4000 },
  { icon: Stars, text: "Adding details...", duration: 6000 },
  { icon: ImageIcon, text: "Finalizing image...", duration: 3000 },
];

const ImageGenerationChat: React.FC<ImageGenerationChatProps> = ({ onImageGenerated }) => {
  const { isAuthenticated, userTier, updateGenerationCount, addToHistory } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [options, setOptions] = useState<GenerationOptions>({
    style: 'realistic',
    quality: 'standard',
    outputCount: 2
  });
  const [currentStage, setCurrentStage] = useState(0);

  // Load prompt history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptHistory');
    if (savedHistory) {
      setPromptHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save prompt history to localStorage
  const saveToHistory = (newPrompt: string) => {
    const updatedHistory = [newPrompt, ...promptHistory.slice(0, 9)];
    setPromptHistory(updatedHistory);
    localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));
  };

  const startLoadingProgress = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 1000);
    return interval;
  };

  useEffect(() => {
    if (isLoading) {
      let stageIndex = 0;
      const progressStages = () => {
        if (stageIndex < GENERATION_STAGES.length - 1) {
          stageIndex++;
          setCurrentStage(stageIndex);
        }
      };

      setCurrentStage(0);
      GENERATION_STAGES.forEach((stage, index) => {
        setTimeout(progressStages, stage.duration);
      });
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please sign in to generate images');
      return;
    }

    if (!userTier || userTier.dailyGenerationsLeft <= 0) {
      setError(`You've reached your daily generation limit. Upgrade to premium for more!`);
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a description for the image you want to generate');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      setLoadingProgress(0);

      const response = await fetch('/api/generate-image-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `${options.style} style: ${prompt}`,
          num_outputs: options.outputCount,
          quality: options.quality
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate images. Please try again.');
      }

      const data = await response.json();
      setGeneratedImages(data.images);
      onImageGenerated(data.images[0]);
      updateGenerationCount();
      addToHistory(prompt, data.images, options.quality);
      
      // Save to prompt history
      const newHistory = [prompt, ...promptHistory.slice(0, 9)];
      setPromptHistory(newHistory);
      localStorage.setItem('promptHistory', JSON.stringify(newHistory));
    } catch (err) {
      setError('An error occurred while generating the image');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingProgress(100);
    }
  };

  const handleShare = async (imageUrl: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AI Generated Image',
          text: 'Check out this AI-generated image!',
          url: imageUrl
        });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        alert('Image URL copied to clipboard!');
      }
    } catch (error) {
      setError('Failed to share image. Please try again.');
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download image. Please try again.');
    }
  };

  const calculateCost = () => {
    const baseCost = COST_PER_IMAGE[options.quality] * options.outputCount;
    return baseCost.toFixed(2);
  };

  const calculateTime = () => {
    const baseTime = GENERATION_TIME[options.quality];
    const totalTime = baseTime * options.outputCount;
    
    if (totalTime < 60) {
      return `${totalTime} seconds`;
    } else {
      const minutes = Math.floor(totalTime / 60);
      const seconds = totalTime % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')} minutes`;
    }
  };

  const placeholderImage = 'https://images.unsplash.com/photo-1558487661-9d4f01e2ad64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=528&h=422&q=80';

  const renderImagePlaceholders = () => {
    return Array(options.outputCount).fill(null).map((_, index) => (
      <div 
        key={`loading-${index}`} 
        className="relative w-full aspect-square rounded-lg overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-gradient">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-4 text-center">
                {React.createElement(GENERATION_STAGES[currentStage].icon, {
                  className: "w-8 h-8 mx-auto text-yellow-400 animate-bounce"
                })}
                <div className="space-y-2">
                  <p className="text-sm text-yellow-400 font-medium">
                    {GENERATION_STAGES[currentStage].text}
                  </p>
                  <div className="h-1 w-32 bg-gray-700 rounded-full overflow-hidden mx-auto">
                    <div 
                      className="h-full bg-yellow-400 transition-all duration-500 ease-in-out"
                      style={{
                        width: `${((currentStage + 1) / GENERATION_STAGES.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        </div>
      </div>
    ));
  };

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">AI Image Generation</h2>
        {isAuthenticated && userTier && (
          <div className="text-sm text-gray-400">
            <span>{userTier.dailyGenerationsLeft} generations left today</span>
            {userTier.tier === 'free' && (
              <button
                onClick={() => window.location.href = '/profile'}
                className="ml-4 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <p className="text-gray-300 text-sm">
            Enter a detailed description of the image you want to generate. Be specific about style, mood, and content.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-sm text-gray-200"
          >
            <Sparkles size={16} />
            <span>Example Prompts</span>
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-sm text-gray-200"
          >
            <History size={16} />
            <span>Prompt History</span>
          </button>
        </div>

        {showExamples && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
              <button
                key={index}
                onClick={() => {
                  setPrompt(examplePrompt);
                  setShowExamples(false);
                }}
                className="text-left p-2 rounded-md bg-gray-700/50 hover:bg-gray-600 text-sm text-gray-300"
              >
                {examplePrompt}
              </button>
            ))}
          </div>
        )}

        {showHistory && promptHistory.length > 0 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {promptHistory.map((historyPrompt, index) => (
              <button
                key={index}
                onClick={() => {
                  setPrompt(historyPrompt);
                  setShowHistory(false);
                }}
                className="text-left p-2 rounded-md bg-gray-700/50 hover:bg-gray-600 text-sm text-gray-300"
              >
                {historyPrompt}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Palette size={16} className="inline mr-2" />
              Style
            </label>
            <select
              value={options.style}
              onChange={(e) => setOptions(prev => ({ ...prev, style: e.target.value }))}
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STYLE_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quality
            </label>
            <select
              value={options.quality}
              onChange={(e) => setOptions(prev => ({ ...prev, quality: e.target.value }))}
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {QUALITY_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Images
            </label>
            <select
              value={options.outputCount}
              onChange={(e) => setOptions(prev => ({ ...prev, outputCount: parseInt(e.target.value) }))}
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              <div className="text-sm text-gray-300">
                <span className="font-medium">Estimated Cost:</span>
                <span className="ml-2">${calculateCost()}</span>
              </div>
              <div className="text-sm text-gray-300">
                <span className="font-medium">Est. Time:</span>
                <span className="ml-2">{calculateTime()}</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {options.quality === 'high' ? '$0.04' : '$0.02'} per image
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Details:
            <ul className="mt-1 space-y-1">
              <li>• {options.outputCount} {options.outputCount === 1 ? 'image' : 'images'} × ${COST_PER_IMAGE[options.quality]} each</li>
              <li>• Generation time: {GENERATION_TIME[options.quality]} seconds per image</li>
              {options.quality === 'high' ? (
                <>
                  <li>• High quality includes enhanced resolution and details</li>
                  <li>• Longer generation time for better results</li>
                </>
              ) : (
                <li>• Standard quality offers faster generation</li>
              )}
            </ul>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError(null);
            }}
            placeholder="E.g., 'A serene mountain landscape at sunset with snow-capped peaks and a crystal clear lake reflecting the orange sky'"
            className="w-full p-4 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-2 text-gray-400 text-sm">
            {prompt.length}/500
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-md">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-300 ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Generating... {loadingProgress}%</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Generate Images</span>
              </>
            )}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="mt-6">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-400">
              Creating your masterpiece... This might take {calculateTime()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {options.quality === 'high' 
                ? 'High quality generation takes longer but produces better results'
                : 'Standard quality generation is faster'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className={`grid gap-6 ${options.outputCount === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
          {isLoading ? (
            renderImagePlaceholders()
          ) : (
            Array.from({ length: options.outputCount }).map((_, index) => (
              <div key={index} className="relative group">
                <div className="relative rounded-lg overflow-hidden aspect-[5/4]">
                  <img 
                    src={generatedImages[index] || placeholderImage} 
                    alt={generatedImages[index] ? `Generated ${index + 1}` : "Placeholder"} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {!generatedImages[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <span className="text-white text-xl font-medium">Image {index + 1}</span>
                    </div>
                  )}
                </div>
                {generatedImages[index] && (
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handleDownload(generatedImages[index])}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                    >
                      <Download size={20} className="mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => handleShare(generatedImages[index])}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors duration-300 flex items-center justify-center"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageGenerationChat;

<style jsx>{`
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }

  .animate-pulse {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`}</style>