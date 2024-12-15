import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const HeroWithComparison: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageUrl = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=100';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isHovering) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(x, 0), 100));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseLeave = () => setIsHovering(false);
    const handleMouseEnter = () => setIsHovering(true);

    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-[40%] mb-8 md:mb-0 md:pr-8">
          <h1 className="text-5xl font-extrabold mb-6 gradient-fade">
            Transform Your Images into Stunning 4K Quality with AI Upscaling
          </h1>
          <p className="text-lg text-purple-100 mb-6">
            Transform your low-resolution images into stunning, high-definition visuals instantly with our advanced AI technology—bringing clarity, detail, and professional quality to every shot.
          </p>
          <a
            href="#upload"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Scaling Today!
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </a>
        </div>
        <div 
          ref={containerRef}
          className="md:w-[60%] relative mt-8 md:mt-0 cursor-ew-resize"
          onMouseMove={handleMouseMove}
        >
          <div className="relative w-full pb-[80%] overflow-hidden rounded-lg shadow-lg">
            <img
              src={imageUrl}
              alt="Original (Slightly Blurred)"
              className="absolute top-0 left-0 w-full h-full object-cover filter blur-[2px]"
            />
            <div
              className="absolute top-0 left-0 w-full h-full overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src={imageUrl}
                alt="Upscaled (Clear)"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white"
              style={{ left: `${sliderPosition}%` }}
            />
          </div>
          <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 rounded">Original</div>
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded">Upscaled</div>
        </div>
      </div>
    </section>
  );
};

export default HeroWithComparison;