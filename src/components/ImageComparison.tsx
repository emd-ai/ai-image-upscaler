import React, { useState, useRef, useEffect } from 'react';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageComparisonProps {
  originalImage: string;
  upscaledImage: string;
  onClose?: () => void;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalImage,
  upscaledImage,
  onClose
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 1));

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="relative w-full max-w-6xl bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-gray-900 to-transparent">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              disabled={zoom === 1}
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              disabled={zoom === 3}
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <span className="text-gray-400 text-sm">{Math.round(zoom * 100)}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => downloadImage(originalImage, 'original.png')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm ml-1">Original</span>
            </button>
            <button
              onClick={() => downloadImage(upscaledImage, 'upscaled.png')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm ml-1">Upscaled</span>
            </button>
          </div>
        </div>

        {/* Image container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video overflow-hidden cursor-col-resize"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {/* Original image */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${originalImage})`,
              backgroundSize: `${zoom * 100}%`,
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
            }}
          />

          {/* Upscaled image */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${upscaledImage})`,
              backgroundSize: `${zoom * 100}%`,
              clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`
            }}
          />

          {/* Slider */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="w-6 h-px bg-gray-400 transform -rotate-45" />
              <div className="w-6 h-px bg-gray-400 transform rotate-45" />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
            Original
          </div>
          <div className="absolute bottom-4 right-4 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
            Upscaled
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;